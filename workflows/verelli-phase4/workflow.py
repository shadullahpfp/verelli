"""
Verelli.lol — Phase 4 Parallel Dynamic Workflow
Orchestrates 2 concurrent agents across Frontend and Backend/Data:
1. Subagent A: Frontend (apps/web) — Screen 4->5 Live Wiring & Verdict Bento Workspace (/verdict/[id])
2. Subagent B: Backend & Data Pipeline (apps/api) — LLM Synthesis Layer, Production Scrapers, & Supabase Seeder
"""

# Common return schema for both subagents
AGENT_RESULT_SCHEMA = {
    "type": "object",
    "properties": {
        "status": {
            "type": "string",
            "enum": ["success", "failed"],
            "description": "Execution status of the subagent task"
        },
        "role": {
            "type": "string",
            "description": "Role identifier of the subagent"
        },
        "files_created": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of absolute or relative file paths created or edited"
        },
        "summary": {
            "type": "string",
            "description": "Comprehensive summary of deliverables completed and verified"
        },
        "verification_result": {
            "type": "string",
            "description": "Output of automated verification tests (build, type-check, schema validation)"
        }
    },
    "required": ["status", "role", "files_created", "summary", "verification_result"]
}

# Subagent Task Definitions
SUBAGENT_TASKS = [
    {
        "id": "frontend",
        "role": "Frontend Creative Technologist (Screen 4-5 Wiring & Verdict Bento)",
        "model": "inherit",
        "prompt": """
ROLE: Principal Frontend Engineer & Creative Technologist for Verelli.lol (apps/web).
OBJECTIVE: Complete Phase 4 Frontend: Wire IdeaInputCard (?step=input) to FastAPI and build Screen 5 Verdict Bento Workspace (/verdict/[id]), strictly following docs/PRD.md, docs/rules.md, docs/design.md, and docs/phases.md. Keep Phase 1 Hero and Phase 2 Onboarding intact.

DELIVERABLES:
1. Wire apps/web/components/onboarding/IdeaInputCard.tsx:
   - Read API base URL from process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000".
   - When user clicks "Continue" with idea text:
     - Trigger full-screen Analyzing Overlay on #11120E canvas with pulsing soft radial olive glow (radial-gradient(circle, rgba(163, 184, 99, 0.25) 0%, rgba(17, 18, 14, 0) 70%)).
     - Step ticker cycling through:
       * "Embedding your startup thesis..."
       * "Scanning 1,740+ dead YC post-mortems..."
       * "Cross-checking 12,000+ Stripe-verified MRR feeds..."
       * "Synthesizing 48h zero-code validation playbook..."
     - Send POST to `${API_URL}/api/v1/validate` with JSON body { idea_text: ideaText.trim() }.
     - On response: Store report in sessionStorage (`verelli_verdict_${report_id}`), and route smoothly to `/verdict/${report_id}` via Next.js router.push.
     - Gracefully handle API errors / connection failures with an inline error banner and retry option without crashing the UI.

2. Build Screen 5 Verdict Bento Workspace (/verdict/[id]):
   - Create `apps/web/app/verdict/[id]/page.tsx` and `apps/web/components/verdict/VerdictBento.tsx`:
   - Canvas: Deep obsidian olive `#11120E` with top radial olive ambient glow (`rgba(163, 184, 99, 0.16)`).
   - Top Header Bar:
     - Verelli Labs flask logo (links back to `/`).
     - "Validate another idea" muted moss pill (`#363E1D`, text `#C5D37A`, border `#4F5A2C`, routes to `/?step=input`).
     - "Copy X Verdict Card" pistachio-lime pill (`#B8C468`, text `#14180A`, font-semibold) that copies a punchy build-in-public summary to clipboard with a momentary "Copied to clipboard! ✦" toast notification.
       Format:
       "verelli.lol verdict for: <IDEA>
       Survival Score: <SCORE>% | Risk: <TIER>
       Dead Twins: <TWIN1> (Burned <$X>), <TWIN2>
       Live MRR: <CASHFLOW1> (<$MRR>/mo)
       Wedge: <WEDGE>
       Validated on verelli.lol"
   - Row 1 — Executive Verdict Hero Card (`#181916`, rounded-3xl, 1px solid `#2E3029`, p-6 sm:p-8):
     - Left: Submitted idea text in italic `Instrument Serif` (text-2xl sm:text-3xl) + Risk Tier badge (*Contested Waters*, *Proven Goldmine*, *Graveyard Trap*, or *Uncharted Niche*).
     - Right: Large serif Survival Score (`0-100%`) in `Instrument Serif` with animated circular SVG stroke gauge and 1-sentence brutal reality check.
     - Zero-Hallucination State: If `is_uncharted_niche === true`, render a clean highlighted notice explaining that cosine similarity was `< 0.65`, listing adjacent market warnings instead of fabricated matches.
   - Row 2 — Split Bento (2 Equal Columns on Desktop):
     - Left Column — Graveyard Twins (`Startups.RIP`): Dark matte cards (`#242620`, border `#2E3029`, rounded-2xl), displaying: startup name, YC batch, capital burned, terracotta failure cause pill (`#F87171` background tint or border), 1-line post-mortem takeaway, and vector similarity badge (`e.g. 88% match`).
     - Right Column — Cashflow Twins (`TrustMRR`): Dark matte cards (`#242620`, border `#2E3029`, rounded-2xl), displaying: company name, bold serif Stripe-verified MRR (`e.g. $38.4K/mo` in `#4ADE80` / `#C5D37A`), active subscribers, pricing model pill, winning wedge summary, and vector similarity badge.
   - Row 3 — 48-Hour Zero-Code Validation Playbook:
     - Numbered 3-step actionable sprint cards (Step 1: Fake-Door Wedge, Step 2: Distribution Channel, Step 3: Kill/Go Metric) tailored to avoiding the Graveyard Twins' fatal mistakes.
   - Loading & Error States: If opened directly by URL, fetch from `${API_URL}/api/v1/verdict/${id}` with fallback to `sessionStorage` or sample verdict if offline.

3. Safeguards & Rules:
   - Ensure all SVG elements retain explicit width and height attributes (`width={...} height={...} style={{ width: ..., height: ... }}`).
   - Verify build: `npm --workspace=apps/web run build` must compile with 0 errors.
   - Call finish tool returning AGENT_RESULT_SCHEMA.
"""
    },
    {
        "id": "backend",
        "role": "Data & Backend Architect (Synthesis & Scrapers)",
        "model": "inherit",
        "prompt": """
ROLE: Senior Backend Engineer & Data Pipeline Architect for Verelli.lol (apps/api).
OBJECTIVE: Complete Phase 4 Backend: Enhance LLM synthesis with brutal zero-code playbooks, build production scrapers for Startups.RIP & TrustMRR, build Supabase batch seeder, and configure environment templates.

DELIVERABLES:
1. CORS & Verdict Persistence Enhancements (apps/api/app/):
   - Confirm apps/api/app/main.py CORS middleware allows `http://localhost:3000`, `http://127.0.0.1:3000`, `https://verelli.lol`.
   - In apps/api/app/services/synthesis_service.py:
     * Upgrade LLM synthesis: If GEMINI_API_KEY or OPENAI_API_KEY is present, synthesize a brutal, calibrated 1-sentence verdict and custom 3-step 48-hour validation playbook via structured JSON.
     * When offline or without API keys, enhance the calibrated rule-based fallback so it generates realistic, domain-tailored sprints (Hour 0-12 Fake-Door Wedge, Hour 12-24 Distribution Channel, Hour 24-48 Kill/Go Metric).
   - In apps/api/app/api/v1/endpoints/validate.py:
     * Ensure `GET /api/v1/verdict/{id}` retrieves cached verdicts from memory or Supabase, and returns a high-fidelity fallback verdict if the ID is missing, so direct browser reloads never fail with a 500 error.

2. Production Scrapers (apps/api/scrapers/):
   - `apps/api/scrapers/startups_rip.py`:
     * Scrapes YC graveyard post-mortems from Startups.RIP.
     * Extracts name, slug, YC batch, funding burned, failure cause taxonomy, and founder post-mortem quotes.
     * Supports `--limit 50` CLI argument and outputs clean normalized JSON matching the Supabase schema.
   - `apps/api/scrapers/trustmrr.py`:
     * Scrapes/ingests Stripe-verified micro-SaaS metrics from TrustMRR.
     * Extracts name, slug, verified MRR, subscriber count, ARPU, pricing model, niche, acquisition channels, and live URL.
     * Supports `--limit 50` CLI argument and outputs clean normalized JSON.

3. Supabase Batch Seeder (apps/api/scripts/seed_supabase.py):
   - Reads normalized JSON from scrapers or falls back to `apps/api/fixtures/startups_rip_sample.json` and `trustmrr_sample.json`.
   - Vectorizes records using `embedding_service` (batch size 20).
   - Upserts into `startups_graveyard` and `profitable_startups` tables via Supabase REST API or SQL.
   - Includes progress logging and error handling.

4. Environment Documentation:
   - Create `.env.example` at root and in `apps/api/.env.example` documenting:
     * `SUPABASE_URL`
     * `SUPABASE_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
     * `OPENAI_API_KEY`
     * `GEMINI_API_KEY`
     * `NEXT_PUBLIC_API_URL=http://localhost:8000`

5. Verification:
   - Verify all Python scripts compile cleanly with `python3 -m py_compile`.
   - Run scraper CLI tests with `--limit 5`.
   - Call finish tool returning AGENT_RESULT_SCHEMA.
"""
    }
]

# Workflow Execution Logic
phase("1. Initialize Verelli Phase 4 Parallel Workflow")
log("Starting parallel execution of 2 specialized subagents:")
log("• Subagent A: Frontend (apps/web) — Screen 4->5 Live Wiring & Verdict Bento Workspace (/verdict/[id])")
log("• Subagent B: Backend & Data Pipeline (apps/api) — Synthesis Layer, Production Scrapers, & Supabase Seeder")

phase("2. Concurrent Subagent Execution")
results = await parallel(
    SUBAGENT_TASKS,
    lambda task: agent(
        prompt=task["prompt"],
        schema=AGENT_RESULT_SCHEMA,
        role=task["role"],
        workspace="inherit",
        model=task["model"]
    )
)

phase("3. Aggregate & Validate Deliverables")
total_files = []
all_success = True

for res in results:
    role = res.get("role", "Unknown")
    status = res.get("status", "unknown")
    files = res.get("files_created", [])
    summary = res.get("summary", "")
    test_out = res.get("verification_result", "")

    log(f"[{role}] Status: {status.upper()}")
    log(f"[{role}] Files: {len(files)} files created/updated")
    log(f"[{role}] Summary: {summary}")
    log(f"[{role}] Verification: {test_out}")

    total_files.extend(files)
    if status != "success":
        all_success = False

phase("4. Workflow Completion")
if all_success:
    log(f"SUCCESS: Verelli Phase 4 workflow completed cleanly ({len(total_files)} total files across web and api).")
else:
    log("WARNING: One or more subagents reported warnings or failures.")

print({
    "success": all_success,
    "total_files_count": len(total_files),
    "subagent_results": results
})
