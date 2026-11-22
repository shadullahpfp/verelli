"""
Verdict Synthesis Service for verelli.lol.
Orchestrates vector matching across Startups.RIP and TrustMRR datasets,
evaluates survival scores and failure taxonomy, and synthesizes
a brutal, data-backed VerdictReportSchema with 1-sentence verdicts
and calibrated 48-hour validation sprints.
"""
from typing import List, Optional, Dict, Any
import json
import logging
import re
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


def _clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Extract and parse structured JSON from LLM response text, stripping markdown fences."""
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return json.loads(text.strip())


def _detect_domain_context(idea_text: str) -> str:
    """Classify idea text into high-granularity domain contexts for tailored sprint synthesis."""
    lower = idea_text.lower()
    if any(k in lower for k in ["stripe", "chargeback", "dispute", "fraud", "checkout", "payment", "merchant", "billing"]):
        return "fintech_payments"
    if any(k in lower for k in ["legal", "contract", "nda", "lawyer", "attorney", "compliance", "clause"]):
        return "legal_ai"
    if any(k in lower for k in ["accounting", "bookkeeping", "cfo", "tax", "ledger", "invoice", "audit", "reconciliation"]):
        return "accounting_b2b"
    if any(k in lower for k in ["postgres", "database", "query", "developer", "api", "sdk", "devtool", "infra", "deploy", "indexer"]):
        return "devtools_infra"
    if any(k in lower for k in ["testimonial", "review", "social proof", "wall of love", "rating"]):
        return "social_proof"
    if any(k in lower for k in ["twitter", "linkedin", "viral", "audience", "tweets", "scheduler", "content"]):
        return "social_growth"
    if any(k in lower for k in ["delivery", "courier", "shipping", "logistics", "freight", "warehouse", "pickup"]):
        return "logistics_delivery"
    if any(k in lower for k in ["hardware", "iot", "sensor", "device", "kitchen", "camera", "robot", "wearable"]):
        return "hardware_iot"
    if any(k in lower for k in ["cleaning", "maid", "local marketplace", "home service"]):
        return "local_services"
    return "general_saas"


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
        a brutal 1-sentence verdict and domain-tailored 48-hour validation sprints.
        """
        domain = _detect_domain_context(idea_text)

        # --- Calibrate Survival Score (0 - 100) & Risk Level ---
        if is_uncharted:
            survival_score = 52
            risk_level = "Contested Waters"
            executive_verdict = (
                "You are entering an uncharted market with zero graveyard casualties but zero verified willingness-to-pay benchmarks, risking months building software for phantom demand."
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

            # 1-Sentence Brutal Calibrated Executive Verdict
            dead_name = top_dead[0].name if top_dead else "historical venture casualties"
            dead_burned = (
                f"${top_dead[0].capital_burned / 1e6:,.1f}M"
                if top_dead and top_dead[0].capital_burned > 0
                else "millions in venture capital"
            )
            dead_flaw = (
                top_dead[0].fatal_flaw.rstrip(".")
                if top_dead
                else "premature scaling and high operational overhead"
            )
            cash_name = top_cashflow[0].name if top_cashflow else "profitable micro-SaaS peers"
            cash_mrr = (
                f"${top_cashflow[0].verified_mrr:,.0f}/mo" if top_cashflow else "verified recurring revenue"
            )
            top_channel = (
                top_cashflow[0].primary_acquisition_channel
                if top_cashflow and top_cashflow[0].primary_acquisition_channel
                else "organic inbound distribution"
            )

            if risk_level == "Critical Risk":
                executive_verdict = (
                    f"{dead_name} burned {dead_burned} on an identical model before shutting down due to {dead_flaw}; without an insurmountable organic distribution wedge, you will repeat their fatal churn."
                )
            elif risk_level == "Contested Waters":
                executive_verdict = (
                    f"While {cash_name} captured {cash_mrr} via {top_channel}, {dead_name}'s collapse proves that generalist horizontal positioning is fatal in this segment without an ultra-narrow wedge."
                )
            else:
                executive_verdict = (
                    f"Proven commercial demand exists ({cash_name} generates {cash_mrr}), but your survival depends on executing {top_channel} and securing 20 paying customers manually before writing backend code."
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
            wedge_angle = (
                f"Position strictly against {dead_name}'s high-friction model ({dead_flaw}). "
                f"Adopt a lightweight self-serve pricing model backed by {top_channel} to capture underserved low-CAC buyers."
            )

        # --- Enhanced Domain-Tailored 48-Hour Validation Sprints ---
        playbook = self._generate_domain_sprints(
            domain=domain,
            idea_text=idea_text,
            top_dead=top_dead,
            top_cashflow=top_cashflow,
            is_uncharted=is_uncharted,
        )

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

    def _generate_domain_sprints(
        self,
        domain: str,
        idea_text: str,
        top_dead: List[DeadTwinSummary],
        top_cashflow: List[CashflowTwinSummary],
        is_uncharted: bool,
    ) -> List[ActionablePlaybookStep]:
        """Constructs domain-tailored, realistic 48-hour validation sprints."""
        dead_name = top_dead[0].name if top_dead else "past venture casualties"
        dead_flaw = (
            top_dead[0].fatal_flaw.rstrip(".")
            if top_dead
            else "premature scaling and high operational overhead"
        )
        cash_name = top_cashflow[0].name if top_cashflow else "profitable peers"
        channel = (
            top_cashflow[0].primary_acquisition_channel
            if top_cashflow and top_cashflow[0].primary_acquisition_channel
            else "direct founder outbound"
        )

        if domain == "fintech_payments":
            return [
                ActionablePlaybookStep(
                    timeframe="Hour 0-12",
                    title="Hour 0-12: Fake-Door Wedge",
                    description=(
                        f"Deploy an unbranded landing wedge contrasting the manual dispute overhead that killed {dead_name} "
                        "against an automated Stripe webhook listener. Include a live Stripe Checkout button charging a $79 refundable charter deposit."
                    ),
                    tactical_deliverable="Live landing page with Stripe $79 pre-order deposit link and comparison table.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 12-24",
                    title="Hour 12-24: Distribution Channel",
                    description=(
                        f"Target 30 B2B SaaS founders and e-commerce operators who actively complained about Stripe dispute fees on Twitter, "
                        f"r/SaaS, and IndieHackers, following {cash_name}'s play of {channel}."
                    ),
                    tactical_deliverable="30 personalized outbound messages sent with dispute recovery case study pitch.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 24-48",
                    title="Hour 24-48: Kill/Go Metric",
                    description=(
                        "Conduct discovery calls with respondents. Demand an upfront $79 deposit or read-only Stripe API access to audit past disputes. "
                        "If fewer than 3 operators pay or provide API keys within 48 hours, immediately kill the idea before writing backend code."
                    ),
                    tactical_deliverable="Minimum 3 Stripe deposit receipts ($237 total) or logged kill decision.",
                ),
            ]

        if domain == "legal_ai":
            return [
                ActionablePlaybookStep(
                    timeframe="Hour 0-12",
                    title="Hour 0-12: Fake-Door Wedge",
                    description=(
                        f"Launch a single-page contract audit wedge contrasting {dead_name}'s high legal billables against an instant "
                        "redline comparison engine. Include an upload dropzone for vendor NDAs requiring a $99 audit fee."
                    ),
                    tactical_deliverable="Live single-page NDA audit demo with $99 Stripe pre-order checkout button.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 12-24",
                    title="Hour 12-24: Distribution Channel",
                    description=(
                        f"Target 30 startup founders and fractional CFOs on LinkedIn and Twitter currently negotiating vendor contracts, "
                        f"emulating {cash_name}'s proven acquisition strategy ({channel})."
                    ),
                    tactical_deliverable="30 direct outreach messages offering free manual teardown of their pending contract.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 24-48",
                    title="Hour 24-48: Kill/Go Metric",
                    description=(
                        "Audit 5 pending contracts manually (wizard-of-oz) and offer automated monthly subscriptions at $99/mo. "
                        "Must secure at least 3 paid commitments or LOIs; otherwise kill the project before engineering."
                    ),
                    tactical_deliverable="3 signed LOIs / paid charter subscriptions or logged kill decision.",
                ),
            ]

        if domain == "accounting_b2b":
            return [
                ActionablePlaybookStep(
                    timeframe="Hour 0-12",
                    title="Hour 0-12: Fake-Door Wedge",
                    description=(
                        f"Deploy a focused landing page directly addressing {dead_name}'s trap of manual offshore bookkeeping errors, "
                        "showcasing a verifiable deterministic bank reconciliation parser with a $149/mo pilot deposit button."
                    ),
                    tactical_deliverable="Live landing page with simulated reconciliation report and $149 pre-order link.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 12-24",
                    title="Hour 12-24: Distribution Channel",
                    description=(
                        f"Directly message 30 Series A founders or agency owners via {channel}, offering to run a free side-by-side reconciliation against their current QuickBooks or Xero books."
                    ),
                    tactical_deliverable="30 targeted outreach messages with side-by-side variance sample report.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 24-48",
                    title="Hour 24-48: Kill/Go Metric",
                    description=(
                        "Run the audit for 3 respondents manually. Require a $149 commitment to continue automated monthly processing. "
                        "If zero founders commit their company ledger within 48 hours, kill the product."
                    ),
                    tactical_deliverable="2+ paid charter deposits or logged kill decision.",
                ),
            ]

        if domain == "devtools_infra":
            return [
                ActionablePlaybookStep(
                    timeframe="Hour 0-12",
                    title="Hour 0-12: Fake-Door Wedge",
                    description=(
                        "Deploy an interactive terminal preview or documentation landing page demonstrating a 1-line CLI installation "
                        "that automates database query indexing. Include a GitHub OAuth waitlist or $29/mo early supporter tier."
                    ),
                    tactical_deliverable="Live documentation landing page with terminal demo GIF and $29 Stripe pre-order link.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 12-24",
                    title="Hour 12-24: Distribution Channel",
                    description=(
                        f"Post technical query performance benchmarks on Hacker News, r/PostgreSQL, and Twitter developer channels, "
                        f"leveraging {cash_name}'s organic technical distribution playbook ({channel})."
                    ),
                    tactical_deliverable="Technical benchmark breakdown posted across 3 targeted developer communities.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 24-48",
                    title="Hour 24-48: Kill/Go Metric",
                    description=(
                        "Evaluate conversion: require minimum 50 verified developer email signups and at least 3 paid early-access deposits ($29). "
                        "If community traction is under 50 signups in 48 hours, kill or open-source the project."
                    ),
                    tactical_deliverable="50+ developer signups with 3 paid deposits or logged kill decision.",
                ),
            ]

        if domain in ("social_proof", "social_growth"):
            return [
                ActionablePlaybookStep(
                    timeframe="Hour 0-12",
                    title="Hour 0-12: Fake-Door Wedge",
                    description=(
                        f"Deploy a live interactive preview showing embeddable social proof widgets, positioned against {dead_name}'s high friction. "
                        "Offer a $49 lifetime early-bird license with immediate widget builder access."
                    ),
                    tactical_deliverable="Interactive live demo widget with embedded Stripe $49 checkout button.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 12-24",
                    title="Hour 12-24: Distribution Channel",
                    description=(
                        f"Engage 30 creators and founders building in public on Twitter/X and IndieHackers who launched on Product Hunt this week, "
                        f"replicating {cash_name}'s core growth engine ({channel})."
                    ),
                    tactical_deliverable="30 tailored video DMs demonstrating their own brand testimonials inside your widget.",
                ),
                ActionablePlaybookStep(
                    timeframe="Hour 24-48",
                    title="Hour 24-48: Kill/Go Metric",
                    description=(
                        "Target at least 5 paid early-bird licenses ($49 each) or 15 active embeds placed on live domains within 48 hours. "
                        "If under 5 sales occur, kill the idea before spending weeks building an administrative backend."
                    ),
                    tactical_deliverable="5 Stripe sale receipts ($245 total) or logged kill decision.",
                ),
            ]

        # General SaaS & Uncharted Fallback
        return [
            ActionablePlaybookStep(
                timeframe="Hour 0-12",
                title="Hour 0-12: Fake-Door Wedge",
                description=(
                    f"Deploy an ultra-lean single-page positioning wedge contrasting {dead_name}'s fatal flaw ({dead_flaw}) "
                    "against a hyper-targeted self-serve utility, featuring a live Stripe pre-order checkout link ($49-$99)."
                ),
                tactical_deliverable="Live single-page positioning wedge with Stripe pre-order payment button and email capture.",
            ),
            ActionablePlaybookStep(
                timeframe="Hour 12-24",
                title="Hour 12-24: Distribution Channel",
                description=(
                    f"Execute direct outbound outreach to 30 target buyers experiencing acute friction, utilizing the proven "
                    f"acquisition playbook of {cash_name} ({channel})."
                ),
                tactical_deliverable=f"30 personalized outreach pitches sent across {channel} with a pain-focused charter offer.",
            ),
            ActionablePlaybookStep(
                timeframe="Hour 24-48",
                title="Hour 24-48: Kill/Go Metric",
                description=(
                    "Demand commitment before writing any code: secure at least 3 non-refundable pre-order deposits ($49-$99) "
                    "or 10 signed Letters of Intent within 48 hours. If below threshold, kill or pivot the concept immediately."
                ),
                tactical_deliverable="3+ Stripe deposit transaction receipts or signed LOIs, or logged kill decision.",
            ),
        ]

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
        Attempts structured output generation via Gemini or OpenAI if API keys are configured.
        Enforces a brutal 1-sentence verdict and custom 3-step 48-hour validation playbook.
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

CRITICAL REQUIREMENTS:
1. "executive_verdict" MUST be exactly ONE brutal, calibrated sentence cutting through founder delusion with historical evidence from dead and profitable peers.
2. "validation_playbook_48h" MUST contain exactly 3 steps for a 48-hour pre-build validation sprint:
   - Step 1: timeframe "Hour 0-12", title "Hour 0-12: Fake-Door Wedge", with concrete setup and deliverable.
   - Step 2: timeframe "Hour 12-24", title "Hour 12-24: Distribution Channel", targeting the specific acquisition channel of the matched profitable twin or domain ICP.
   - Step 3: timeframe "Hour 24-48", title "Hour 24-48: Kill/Go Metric", setting an uncompromising numerical gate (e.g., minimum 3-5 prepaid deposits or kill the idea).

Respond strictly in valid JSON matching this schema:
{{
  "survival_score": int (0-100),
  "risk_level": "Critical Risk" | "Contested Waters" | "High-Potential Wedge",
  "executive_verdict": "Single brutal sentence citing peer metrics",
  "deadly_pitfalls_to_avoid": ["pitfall 1", "pitfall 2", "pitfall 3"],
  "wedge_differentiation_angle": "concrete positioning wedge",
  "validation_playbook_48h": [
    {{
      "timeframe": "Hour 0-12",
      "title": "Hour 0-12: Fake-Door Wedge",
      "description": "Concrete procedural instructions for the experiment",
      "tactical_deliverable": "Verifiable artifact (e.g. landing page with pre-order Stripe deposit button)"
    }},
    {{
      "timeframe": "Hour 12-24",
      "title": "Hour 12-24: Distribution Channel",
      "description": "Concrete outreach instructions targeting specific channel",
      "tactical_deliverable": "Specific outreach artifact"
    }},
    {{
      "timeframe": "Hour 24-48",
      "title": "Hour 24-48: Kill/Go Metric",
      "description": "Explicit numerical threshold before writing code",
      "tactical_deliverable": "Numerical gate artifact (e.g. 3+ deposits or kill decision)"
    }}
  ]
}}
"""
        # Gemini 1.5 Flash / Pro integration
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20:
            for model_name in ["gemini-1.5-flash", "gemini-1.5-pro"]:
                try:
                    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
                    payload = {
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"response_mime_type": "application/json"},
                    }
                    async with httpx.AsyncClient(timeout=8.0) as client:
                        res = await client.post(gemini_url, json=payload)
                        if res.status_code == 200:
                            data = res.json()
                            text_resp = data["candidates"][0]["content"]["parts"][0]["text"]
                            parsed = _clean_json_response(text_resp)
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
                    logger.warning(f"Gemini ({model_name}) synthesis failed: {e}. Trying fallback.")

        # OpenAI GPT-4o integration
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-") and len(settings.OPENAI_API_KEY) > 20:
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
                        parsed = _clean_json_response(content)
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

    def generate_fallback_verdict(self, report_id: str, idea_text: Optional[str] = None) -> VerdictReportSchema:
        """
        Constructs a high-fidelity fallback verdict report for direct browser reloads
        when a session ID is not found in memory or database.
        """
        fallback_idea = (
            idea_text
            or "Automated Stripe dispute evidence compiler and chargeback resolution copilot for B2B SaaS merchants."
        )
        return self._heuristic_synthesis(
            idea_text=fallback_idea,
            source_url=None,
            top_dead=[
                DeadTwinSummary(
                    name="Atrium",
                    yc_batch="W18",
                    died_year=2020,
                    capital_burned=75500000.0,
                    fatal_flaw="Scaling human headcount before software automation achieved defensible gross margins, resulting in crushing operational burn.",
                    post_mortem_quote="We tried to be both a tech company and a law firm at once, scaling headcount before perfecting software efficiencies.",
                    similarity_score=0.7420,
                    source_url="https://startups.rip/startups/atrium",
                ),
                DeadTwinSummary(
                    name="ScaleFactor",
                    yc_batch="Techstars",
                    died_year=2020,
                    capital_burned=104000000.0,
                    fatal_flaw="Faking algorithmic automation with offshore manual labor caused massive variance reconciliation errors and customer churn.",
                    post_mortem_quote="The marketing promised autonomous AI, but the technology wasn't ready to handle complex variance reconciliations.",
                    similarity_score=0.6910,
                    source_url="https://startups.rip/startups/scalefactor",
                ),
            ],
            top_cashflow=[
                CashflowTwinSummary(
                    name="Disputifier",
                    verified_mrr=38200.0,
                    subscribers_count=412,
                    pricing_tier="$49/mo Starter, $149/mo Pro",
                    primary_acquisition_channel="Shopify App Store SEO & Stripe community threads",
                    similarity_score=0.7680,
                    live_url="https://disputifier.com",
                ),
                CashflowTwinSummary(
                    name="Testimonial.to",
                    verified_mrr=68450.0,
                    subscribers_count=1890,
                    pricing_tier="$25/mo Starter, $59/mo Premium, $99/mo Agency",
                    primary_acquisition_channel="Build in public & embed widget backlink attribution",
                    similarity_score=0.6720,
                    live_url="https://testimonial.to",
                ),
            ],
            is_uncharted=False,
            adjacent_warnings=None,
            max_similarity=0.7680,
        )


# Default singleton instance
synthesis_service = SynthesisService()
