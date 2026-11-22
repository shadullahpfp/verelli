"""
Pydantic v2 Schemas for verelli.lol.
Defines all request, response, and entity contracts for vector intelligence.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class DeadTwinSummary(BaseModel):
    """Summary of a deceased startup twin matched from the Startups.RIP dataset."""

    name: str = Field(description="Name of the deceased startup")
    yc_batch: Optional[str] = Field(default=None, description="YC accelerator batch (e.g. W18, S21)")
    died_year: int = Field(description="Year the company shut down")
    capital_burned: float = Field(description="Total venture capital burned in USD")
    fatal_flaw: str = Field(description="The exact post-mortem reason why they failed")
    post_mortem_quote: str = Field(description="Direct quotation from the founder post-mortem letter")
    similarity_score: float = Field(description="Cosine similarity score (0.0 - 1.0) against user idea")
    source_url: Optional[str] = Field(default=None, description="Startups.RIP or archival source URL")


class CashflowTwinSummary(BaseModel):
    """Summary of a profitable micro-SaaS twin matched from the TrustMRR dataset."""

    name: str = Field(description="Name of the profitable micro-SaaS")
    verified_mrr: float = Field(description="Stripe-verified monthly recurring revenue in USD")
    subscribers_count: int = Field(description="Number of active paying subscribers")
    pricing_tier: str = Field(description="Primary pricing tier or monetization structure")
    primary_acquisition_channel: str = Field(description="Proven customer acquisition channel")
    similarity_score: float = Field(description="Cosine similarity score (0.0 - 1.0) against user idea")
    live_url: Optional[str] = Field(default=None, description="Live production URL")


class ActionablePlaybookStep(BaseModel):
    """A tactical hourly validation step within the 48-Hour Pre-Build Playbook."""

    timeframe: str = Field(description="Timeframe window, e.g. Hour 0-12, Hour 12-24, Hour 24-48")
    title: str = Field(description="Actionable milestone title")
    description: str = Field(description="Concrete procedural instructions for the experiment")
    tactical_deliverable: str = Field(description="Verifiable artifact (e.g. landing page, outbound script, presale link)")


class VerdictReportSchema(BaseModel):
    """Comprehensive intelligence verdict and survival evaluation."""

    survival_score: int = Field(ge=0, le=100, description="Calibrated survival score (0-100)")
    risk_level: str = Field(description="'Critical Risk', 'Contested Waters', or 'High-Potential Wedge'")
    executive_verdict: str = Field(description="Uncompromising 2-sentence brutal truth")
    top_dead_twins: List[DeadTwinSummary] = Field(default_factory=list, description="Top deceased startup matches")
    top_cashflow_twins: List[CashflowTwinSummary] = Field(default_factory=list, description="Top profitable SaaS peers")
    deadly_pitfalls_to_avoid: List[str] = Field(default_factory=list, description="Specific fatal traps to evade")
    wedge_differentiation_angle: str = Field(description="Counter-intuitive positioning wedge against competitors")
    validation_playbook_48h: List[ActionablePlaybookStep] = Field(default_factory=list, description="48-hour pre-build validation plan")
    is_uncharted_niche: bool = Field(default=False, description="True if no direct twins found above 0.65 threshold")
    adjacent_market_warnings: Optional[List[str]] = Field(default=None, description="Warnings when idea is in an uncharted niche")


class ValidationRequest(BaseModel):
    """Request payload for validating a startup idea."""

    idea_text: str = Field(
        min_length=10,
        description="Startup pitch, problem statement, or product concept",
        examples=["An AI agent that monitors Stripe chargebacks and disputes evidence automatically for Shopify merchants."],
    )
    source_url: Optional[str] = Field(
        default=None,
        description="Optional landing page or prototype URL for context extraction",
        examples=["https://myinboundsaas.com"],
    )


class ValidationResponse(BaseModel):
    """Full API response returning the validation report."""

    report_id: str = Field(description="Unique UUID identifier for this validation report")
    status: str = Field(default="completed", description="Status of the validation report generation")
    verdict: VerdictReportSchema = Field(description="Structured verdict report payload")


class HealthResponse(BaseModel):
    """Healthcheck response status."""

    status: str = Field(default="healthy")
    service: str = Field(default="verelli-api")
    version: str = Field(default="1.0.0")
