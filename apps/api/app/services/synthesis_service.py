"""
Verdict Synthesis Service for verelli.lol.
Orchestrates vector matching across Startups.RIP and TrustMRR datasets,
evaluates survival scores and failure taxonomy, and synthesizes
a brutal, data-backed VerdictReportSchema.
"""
from typing import List, Optional, Dict, Any
import json
import logging
import httpx

from app.core.config import settings
from app.models.schemas import (
    VerdictReportSchema,
    DeadTwinSummary,
    CashflowTwinSummary,
    ActionablePlaybookStep,
)
from app.services.embedding_service import embedding_service
from app.services.vector_matcher import vector_matcher

logger = logging.getLogger(__name__)


class SynthesisService:
    """Orchestrates embedding, twin matching, and LLM/heuristic verdict generation."""

    def __init__(self):
        pass

    async def generate_verdict(
        self, idea_text: str, source_url: Optional[str] = None
    ) -> VerdictReportSchema:
        """
        End-to-end pipeline:
        1. Embed user idea into 1536d vector.
        2. Query dual vector matcher (Graveyard + Profitable SaaS).
        3. Enforce 0.65 similarity boundary (Uncharted Niche diagnostic).
        4. Synthesize calibrated Survival Score & 48h Validation Playbook.
        """
        # Step 1: Generate Embedding
        query_vector = await embedding_service.get_embedding(idea_text)

        # Step 2: Query Dual Vector Matcher
        match_result = await vector_matcher.find_twins(query_vector)

        top_dead: List[DeadTwinSummary] = match_result["top_dead_twins"]
        top_cashflow: List[CashflowTwinSummary] = match_result["top_cashflow_twins"]
        is_uncharted: bool = match_result["is_uncharted_niche"]
        adjacent_warnings: Optional[List[str]] = match_result["adjacent_market_warnings"]
        max_similarity: float = match_result["max_similarity"]

        # Step 3: Try LLM Synthesis if API key is configured
        llm_report = await self._try_llm_synthesis(
            idea_text=idea_text,
            source_url=source_url,
            top_dead=top_dead,
            top_cashflow=top_cashflow,
            is_uncharted=is_uncharted,
            adjacent_warnings=adjacent_warnings,
        )

        if llm_report is not None:
            return llm_report

        # Step 4: Fallback to Calibrated Heuristic Synthesis Engine
        return self._heuristic_synthesis(
            idea_text=idea_text,
            source_url=source_url,
            top_dead=top_dead,
            top_cashflow=top_cashflow,
            is_uncharted=is_uncharted,
            adjacent_warnings=adjacent_warnings,
            max_similarity=max_similarity,
        )

    def _heuristic_synthesis(
        self,
        idea_text: str,
        source_url: Optional[str],
        top_dead: List[DeadTwinSummary],
        top_cashflow: List[CashflowTwinSummary],
        is_uncharted: bool,
        adjacent_warnings: Optional[List[str]],
        max_similarity: float,
    ) -> VerdictReportSchema:
        """
        Deterministic, data-calibrated synthesis engine that produces
        objective survival scores and tactical 48-hour playbooks based
        on historical venture failure taxonomy and Stripe cashflow data.
        """
        # --- Calibrate Survival Score (0 - 100) ---
        if is_uncharted:
            # Low semantic density / uncharted niche
            survival_score = 54
            risk_level = "Contested Waters"
            executive_verdict = (
                "You are entering an uncharted niche with low historical venture activity. "
                "While unburdened by high-profile graveyard bankruptcies, you face an unproven customer "
                "acquisition path and zero verified willingness-to-pay benchmarks."
            )
            pitfalls = [
                "Premature software engineering before confirming genuine willingness-to-pay via upfront deposits.",
                "Assuming low competition signifies high market demand rather than an economically unviable TAM.",
                "Spending capital on broad paid marketing instead of targeted manual founder-led customer discovery.",
            ]
            wedge_angle = (
                "Execute an ultra-focused manual concierge service before writing code. "
                "Price at a premium to test whether early adopters value your solution enough to overcome pioneer friction."
            )
        else:
            # Score calibration based on peer data
            base_score = 65

            # Calculate graveyard drag
            graveyard_penalty = 0
            if top_dead:
                top_d = top_dead[0]
                if top_d.similarity_score >= 0.70:
                    graveyard_penalty += int(top_d.similarity_score * 30)
                if top_d.capital_burned > 20_000_000:
                    graveyard_penalty += 10

            # Calculate cashflow boost
            cashflow_boost = 0
            if top_cashflow:
                top_c = top_cashflow[0]
                if top_c.similarity_score >= 0.70:
                    cashflow_boost += int(top_c.similarity_score * 25)
                if top_c.verified_mrr > 30_000:
                    cashflow_boost += 8

            survival_score = max(15, min(92, base_score - graveyard_penalty + cashflow_boost))

            if survival_score < 40:
                risk_level = "Critical Risk"
            elif survival_score < 70:
                risk_level = "Contested Waters"
            else:
                risk_level = "High-Potential Wedge"

            # Executive Verdict
            dead_name = top_dead[0].name if top_dead else "past venture casualties"
            cash_name = top_cashflow[0].name if top_cashflow else "profitable micro-SaaS peers"
            cash_mrr = (
                f"${top_cashflow[0].verified_mrr:,.0f}/mo" if top_cashflow else "significant MRR"
            )

            if risk_level == "Critical Risk":
                executive_verdict = (
                    f"This market proved lethal for {dead_name}, who burned capital under identical operational assumptions. "
                    f"Without an aggressive distribution advantage over established incumbents, you will likely face the same fatal churn."
                )
            elif risk_level == "Contested Waters":
                executive_verdict = (
                    f"Moderate viability exists, demonstrated by {cash_name} at {cash_mrr}, "
                    f"yet prior attempts like {dead_name} struggled with retention and high customer acquisition costs. "
                    f"Success requires isolating an underserved wedge rather than attempting a generalized horizontal platform."
                )
            else:
                executive_verdict = (
                    f"Exceptional market opportunity with proven commercial demand ({cash_name} generates {cash_mrr}). "
                    f"Avoid {dead_name}'s trap of premature scaling by acquiring your first 20 paying customers organically before automating."
                )

            # Deadly Pitfalls
            pitfalls = []
            for dt in top_dead[:2]:
                pitfalls.append(f"The {dt.name} Trap: {dt.fatal_flaw}")
            if top_cashflow:
                pitfalls.append(
                    f"Ignoring Proven Channels: Failing to emulate {top_cashflow[0].name}'s primary acquisition channel ({top_cashflow[0].primary_acquisition_channel})."
                )
            if not pitfalls:
                pitfalls = [
                    "High customer acquisition cost exceeding customer lifetime value (CAC > LTV).",
                    "Building multi-feature software before securing 3 upfront deposits.",
                    "Failing to establish a repeatable organic distribution channel.",
                ]

            # Wedge Angle
            top_c_channel = (
                top_cashflow[0].primary_acquisition_channel if top_cashflow else "organic inbound SEO"
            )
            top_d_flaw = (
                top_dead[0].fatal_flaw if top_dead else "premature scaling and high operational overhead"
            )
            wedge_angle = (
                f"Position strictly against {dead_name}'s high-friction model ({top_d_flaw}). "
                f"Adopt a lightweight self-serve pricing model backed by {top_c_channel} to capture underserved low-CAC buyers."
            )

        # 48-Hour Validation Playbook
        playbook = [
            ActionablePlaybookStep(
                timeframe="Hour 0-12",
                title="Counter-Positioning Fake-Door Test",
                description=(
                    "Deploy an ultra-minimalist single-page positioning test contrasting the fatal flaws "
                    "of past category failures against your specific automated wedge."
                ),
                tactical_deliverable="Live landing page with pre-order Stripe deposit button or waitlist capture.",
            ),
            ActionablePlaybookStep(
                timeframe="Hour 12-24",
                title="Cold Outbound to Competitor Dissatisfied Users",
                description=(
                    "Locate 30 target buyers currently complaining about category alternatives on social media or review boards. "
                    "Pitch an immediate resolution to their top workflow friction."
                ),
                tactical_deliverable="30 personalized outreach messages sent with pain-focused pitch script.",
            ),
            ActionablePlaybookStep(
                timeframe="Hour 24-48",
                title="Secure Pre-Build Commitment / Deposit Threshold",
                description=(
                    "Conduct 5 discovery conversations offering early charter access in exchange for a $49-$99 "
                    "refundable deposit or signed Letter of Intent before writing a line of backend code."
                ),
                tactical_deliverable="Stripe payment link receipt or signed LOI proving validated commercial intent.",
            ),
        ]

        return VerdictReportSchema(
            survival_score=survival_score,
            risk_level=risk_level,
            executive_verdict=executive_verdict,
            top_dead_twins=top_dead,
            top_cashflow_twins=top_cashflow,
            deadly_pitfalls_to_avoid=pitfalls,
            wedge_differentiation_angle=wedge_angle,
            validation_playbook_48h=playbook,
            is_uncharted_niche=is_uncharted,
            adjacent_market_warnings=adjacent_warnings,
        )

    async def _try_llm_synthesis(
        self,
        idea_text: str,
        source_url: Optional[str],
        top_dead: List[DeadTwinSummary],
        top_cashflow: List[CashflowTwinSummary],
        is_uncharted: bool,
        adjacent_warnings: Optional[List[str]],
    ) -> Optional[VerdictReportSchema]:
        """
        Attempts structured output generation via Gemini or OpenAI if API keys are set.
        Returns None on any error or missing credential to fall back to heuristic synthesis.
        """
        prompt = f"""
You are the Verelli.lol Startup Intelligence Engine.
Analyze this startup idea against historical YC graveyard records and Stripe-verified micro-SaaS companies.
Deliver a brutal, uncompromising, data-backed verdict without AI sycophancy.

USER IDEA:
{idea_text}
SOURCE URL: {source_url or "N/A"}

MATCHED DEAD TWINS (Startups.RIP Graveyard):
{json.dumps([t.model_dump() for t in top_dead], indent=2)}

MATCHED PROFITABLE TWINS (TrustMRR Live Stripe):
{json.dumps([t.model_dump() for t in top_cashflow], indent=2)}

UNCHARTED NICHE: {is_uncharted}
ADJACENT MARKET WARNINGS: {json.dumps(adjacent_warnings)}

Respond strictly in valid JSON matching this schema:
{{
  "survival_score": int (0-100),
  "risk_level": "Critical Risk" | "Contested Waters" | "High-Potential Wedge",
  "executive_verdict": "Uncompromising 2-sentence brutal truth",
  "deadly_pitfalls_to_avoid": ["list", "of", "pitfalls"],
  "wedge_differentiation_angle": "concrete positioning wedge",
  "validation_playbook_48h": [
    {{
      "timeframe": "Hour 0-12",
      "title": "Title",
      "description": "Description",
      "tactical_deliverable": "Deliverable"
    }},
    {{
      "timeframe": "Hour 12-24",
      "title": "Title",
      "description": "Description",
      "tactical_deliverable": "Deliverable"
    }},
    {{
      "timeframe": "Hour 24-48",
      "title": "Title",
      "description": "Description",
      "tactical_deliverable": "Deliverable"
    }}
  ]
}}
"""
        # Gemini 1.5 Pro integration
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20:
            try:
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"response_mime_type": "application/json"},
                }
                async with httpx.AsyncClient(timeout=8.0) as client:
                    res = await client.post(gemini_url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        text_resp = data["candidates"][0]["content"]["parts"][0]["text"]
                        parsed = json.loads(text_resp)
                        return VerdictReportSchema(
                            survival_score=int(parsed["survival_score"]),
                            risk_level=parsed["risk_level"],
                            executive_verdict=parsed["executive_verdict"],
                            top_dead_twins=top_dead,
                            top_cashflow_twins=top_cashflow,
                            deadly_pitfalls_to_avoid=parsed.get("deadly_pitfalls_to_avoid", []),
                            wedge_differentiation_angle=parsed["wedge_differentiation_angle"],
                            validation_playbook_48h=[
                                ActionablePlaybookStep(**step)
                                for step in parsed.get("validation_playbook_48h", [])
                            ],
                            is_uncharted_niche=is_uncharted,
                            adjacent_market_warnings=adjacent_warnings,
                        )
            except Exception as e:
                logger.warning(f"Gemini synthesis failed: {e}. Falling back.")

        # OpenAI GPT-4o integration
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    res = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": "gpt-4o",
                            "response_format": {"type": "json_object"},
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.2,
                        },
                    )
                    if res.status_code == 200:
                        content = res.json()["choices"][0]["message"]["content"]
                        parsed = json.loads(content)
                        return VerdictReportSchema(
                            survival_score=int(parsed["survival_score"]),
                            risk_level=parsed["risk_level"],
                            executive_verdict=parsed["executive_verdict"],
                            top_dead_twins=top_dead,
                            top_cashflow_twins=top_cashflow,
                            deadly_pitfalls_to_avoid=parsed.get("deadly_pitfalls_to_avoid", []),
                            wedge_differentiation_angle=parsed["wedge_differentiation_angle"],
                            validation_playbook_48h=[
                                ActionablePlaybookStep(**step)
                                for step in parsed.get("validation_playbook_48h", [])
                            ],
                            is_uncharted_niche=is_uncharted,
                            adjacent_market_warnings=adjacent_warnings,
                        )
            except Exception as e:
                logger.warning(f"OpenAI synthesis failed: {e}. Falling back.")

        return None


# Default singleton instance
synthesis_service = SynthesisService()
