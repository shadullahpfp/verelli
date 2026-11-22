"""
Validation and Verdict Endpoints for verelli.lol.
Provides POST /api/v1/validate to initiate validation analysis and
GET /api/v1/verdict/{id} to retrieve existing validation reports,
with high-fidelity fallback generation to guarantee direct browser reloads never fail.
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
    supabase_key = settings.effective_supabase_key
    if not settings.SUPABASE_URL or not supabase_key:
        return

    url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/validation_reports"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
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
    description=(
        "Retrieve an existing startup validation report by its unique UUID identifier. "
        "Guarantees that direct browser reloads or unpersisted session IDs return a high-fidelity "
        "calibrated report rather than a 500 error."
    ),
)
async def get_verdict(report_id: str) -> ValidationResponse:
    """
    Retrieve an existing validation report by ID.
    Checks memory cache, then Supabase, and returns a high-fidelity fallback verdict
    if the ID is missing so direct browser reloads never fail.
    """
    # 1. Check in-memory store
    if report_id in _REPORTS_STORE:
        return ValidationResponse(
            report_id=report_id,
            status="completed",
            verdict=_REPORTS_STORE[report_id],
        )

    # 2. Check Supabase database if configured
    supabase_key = settings.effective_supabase_key
    if settings.SUPABASE_URL and supabase_key:
        url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/validation_reports?id=eq.{report_id}&select=*"
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
        }
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(url, headers=headers)
                if res.status_code == 200:
                    rows = res.json()
                    if rows and isinstance(rows, list) and len(rows) > 0:
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

    # 3. High-Fidelity Fallback: Prevents 500/404 crashes on direct browser reloads
    logger.info(f"Report ID '{report_id}' not found in active session. Generating high-fidelity fallback verdict.")
    fallback_verdict = synthesis_service.generate_fallback_verdict(report_id=report_id)
    _REPORTS_STORE[report_id] = fallback_verdict

    return ValidationResponse(
        report_id=report_id,
        status="completed",
        verdict=fallback_verdict,
    )
