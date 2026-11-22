"""
Validation and Verdict Endpoints for verelli.lol.
Provides POST /api/v1/validate to initiate validation analysis and
GET /api/v1/verdict/{id} to retrieve existing validation reports.
"""
from typing import Dict, Optional
import uuid
import logging
from fastapi import APIRouter, HTTPException, status
import httpx

from app.core.config import settings
from app.models.schemas import (
    ValidationRequest,
    ValidationResponse,
    VerdictReportSchema,
)
from app.services.synthesis_service import synthesis_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Validation"])

# In-memory persistence store for validation reports (cached sessions)
_REPORTS_STORE: Dict[str, VerdictReportSchema] = {}


async def _persist_to_supabase(
    report_id: str,
    idea_text: str,
    source_url: Optional[str],
    verdict: VerdictReportSchema,
) -> None:
    """Optionally persist validation report to Supabase validation_reports table."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        return

    url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/validation_reports"
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    payload = {
        "id": report_id,
        "idea_text": idea_text,
        "source_url": source_url,
        "survival_score": verdict.survival_score,
        "risk_level": verdict.risk_level,
        "graveyard_twins": [t.model_dump() for t in verdict.top_dead_twins],
        "cashflow_twins": [t.model_dump() for t in verdict.top_cashflow_twins],
        "synthesis_report": verdict.model_dump(),
    }

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.post(url, headers=headers, json=payload)
            if res.status_code not in (200, 201):
                logger.warning(f"Failed to persist report to Supabase: status {res.status_code}")
    except Exception as e:
        logger.warning(f"Error persisting report to Supabase: {e}")


@router.post(
    "/validate",
    response_model=ValidationResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate Startup Idea",
    description=(
        "Analyzes a startup idea against 1,700+ deceased YC post-mortems and "
        "12,000+ Stripe-verified micro-SaaS companies, returning calibrated survival "
        "scores, fatal pitfalls, and an actionable 48-hour validation playbook."
    ),
)
async def validate_idea(payload: ValidationRequest) -> ValidationResponse:
    """Validate a startup idea against graveyard and cashflow twins."""
    try:
        verdict = await synthesis_service.generate_verdict(
            idea_text=payload.idea_text,
            source_url=payload.source_url,
        )

        report_id = str(uuid.uuid4())
        _REPORTS_STORE[report_id] = verdict

        # Non-blocking attempt to persist to Supabase if configured
        await _persist_to_supabase(
            report_id=report_id,
            idea_text=payload.idea_text,
            source_url=payload.source_url,
            verdict=verdict,
        )

        return ValidationResponse(
            report_id=report_id,
            status="completed",
            verdict=verdict,
        )
    except Exception as e:
        logger.exception(f"Validation analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Intelligence validation analysis encountered an unexpected error: {str(e)}",
        )


@router.get(
    "/verdict/{report_id}",
    response_model=ValidationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Validation Verdict Report",
    description="Retrieve an existing startup validation report by its unique UUID identifier.",
)
async def get_verdict(report_id: str) -> ValidationResponse:
    """Retrieve an existing validation report by ID."""
    # Check in-memory store
    if report_id in _REPORTS_STORE:
        return ValidationResponse(
            report_id=report_id,
            status="completed",
            verdict=_REPORTS_STORE[report_id],
        )

    # If Supabase is configured, check database
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/validation_reports?id=eq.{report_id}&select=*"
        headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        }
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(url, headers=headers)
                if res.status_code == 200:
                    rows = res.json()
                    if rows:
                        synthesis_data = rows[0].get("synthesis_report", {})
                        verdict = VerdictReportSchema(**synthesis_data)
                        _REPORTS_STORE[report_id] = verdict
                        return ValidationResponse(
                            report_id=report_id,
                            status="completed",
                            verdict=verdict,
                        )
        except Exception as e:
            logger.warning(f"Failed to query Supabase for report {report_id}: {e}")

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Validation report with ID '{report_id}' was not found.",
    )
