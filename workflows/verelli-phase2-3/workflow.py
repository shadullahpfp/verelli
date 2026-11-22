"""
Verelli.lol — Phase 2 & Phase 3 Parallel Dynamic Workflow
Orchestrates 3 concurrent agents across Frontend, Backend, and Database:
1. Subagent A: Frontend (apps/web) — Phase 2 Pomelli Onboarding Flow
2. Subagent B: Data Pipeline (apps/api) — FastAPI Engine, Schemas, & Mock Fixtures
3. Subagent C: Database (supabase/) — PostgreSQL Schema, HNSW Indexes & Vector RPC
"""

# Common return schema for all 3 agents
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
        "role": "Frontend Engineer (Phase 2 Onboarding)",
        "model": "inherit",
        "prompt": """
ROLE: Senior Frontend Engineer & Creative Technologist for Verelli.lol (apps/web).
OBJECTIVE: Build the complete Phase 2 Pomelli Onboarding Journey according to docs/PRD.md, docs/rules.md, docs/design.md, and docs/phases.md.

DELIVERABLES:
1. State Management:
   - apps/web/hooks/useStepNavigation.ts: Manages query-param driven navigation (?step=terms, ?step=welcome, ?step=input) using Next.js useSearchParams, useRouter, and usePathname.

2. Screen 2: Things to Know Modal:
   - apps/web/components/modals/ThingsToKnowModal.tsx:
     - Backdrop: #121210 with backdrop-blur-md.
     - Card: Centered matte charcoal card #252622, rounded-3xl, max-w-lg, border 1px solid #3A3D34.
     - Heading: Instrument Serif italic "Things to know before we begin".
     - Transparency items with underlined olive-tinted links to Startups.RIP and TrustMRR data terms.
     - Bottom-right actions: plain text "Exit" (ghost text, routes to /) and dark olive pill button "Agree & continue" (#1B200E with pale lime text #D8E29A, border 1px solid #363E1D, routes to ?step=welcome).

3. Screen 3A: Stay Connected Popup:
   - apps/web/components/modals/StayConnectedModal.tsx:
     - Renders as a centered modal overlay ON TOP of the 4-step grid (backdrop-blur-xs bg-black/50).
     - 2 square pistachio-lime checkboxes (#B8C468): "Weekly Graveyard Post-Mortem Deconstructs", "Verified Micro-SaaS Niche Revenue Alerts".
     - Bottom-right actions: "Skip for now" (ghost text) + pistachio pill button "Confirm" (#B8C468 with #14180A text).

4. Screen 3B: 4-Step Onboarding Grid:
   - apps/web/components/onboarding/OnboardingFourGrid.tsx and apps/web/components/onboarding/StepCard.tsx:
     - Top-center small lime flask icon, italic Instrument Serif "Welcome to Verelli.lol", clean sans subtitle.
     - 4 equal-height dark cards ("1" to "4", rounded-3xl, 1px solid #2E3029, surface #181916) with large subtle top-left step numbers.
     - Step 1: "Build your Idea Profile" — simulated input typing preview.
     - Step 2: "Scan the Startup Graveyard" — skull badge, burned capital, and post-mortem snippet.
     - Step 3: "Verify Live Niche MRR" — live Stripe MRR badge with subscriber count.
     - Step 4: "Create your Validation Book & 48h Plan" — circular gauge preview & checklist.
     - Inset bottom preview panels illuminated by soft radial olive glow (radial-gradient(circle, rgba(163, 184, 99, 0.22) 0%, rgba(17, 18, 14, 0) 70%)).
     - Bottom center pistachio-lime pill button "Let's go!" (#B8C468, text #14180A, routing to ?step=input).

5. Screen 4: Focused Idea Input Card:
   - apps/web/components/onboarding/IdeaInputCard.tsx:
     - Centered rounded card (#23251F, 1px solid #44473E, rounded-3xl, max-w-[680px]) floating over a prominent soft olive-sage radial backdrop glow.
     - Italic serif heading "Enter your startup idea".
     - Dark outlined input box (rounded-xl border-[#5A5D52], bg-[#161713], focus ring #B8C468).
     - 2 equal-width bottom pill buttons: left muted moss #363E1D ("No website yet?"), right matte charcoal #373835 ("Continue" — dynamically turns #B8C468 pistachio when input is non-empty).

6. Integration:
   - Wire all modals into apps/web/app/page.tsx with React Suspense wrapping query-param components.

CONSTRAINTS & RULES:
- STRICTLY NO blue/purple gradients, NO stark white canvases. Use Pomelli tokens: #191E0B, #11120E, #252622, #181916, #B8C468.
- Display headings in Instrument Serif italic (font-serif italic).
- Verify build with: npm --workspace=apps/web run build (must pass with 0 errors).
- Call finish tool returning AGENT_RESULT_SCHEMA.
"""
    },
    {
        "id": "backend",
        "role": "Data & Backend Engineer (FastAPI & Datasets)",
        "model": "inherit",
        "prompt": """
ROLE: Senior Backend Engineer & Data Pipeline Architect for Verelli.lol (apps/api).
OBJECTIVE: Scaffold the complete FastAPI backend intelligence server, Pydantic schemas, vector query services, and mock-seeded datasets according to docs/Architecture.md and docs/PRD.md.

DELIVERABLES:
1. Application Entrypoint & Config:
   - apps/api/app/main.py: FastAPI entrypoint with CORS middleware for http://localhost:3000, exception handlers, healthcheck /health endpoint.
   - apps/api/app/core/config.py: Pydantic v2 Settings (SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY, GEMINI_API_KEY, SIMILARITY_THRESHOLD=0.65).

2. Pydantic v2 Schemas (apps/api/app/models/schemas.py):
   - DeadTwinSummary: name, yc_batch, died_year, capital_burned, fatal_flaw, post_mortem_quote, similarity_score, source_url.
   - CashflowTwinSummary: name, verified_mrr, subscribers_count, pricing_tier, primary_acquisition_channel, similarity_score, live_url.
   - ActionablePlaybookStep: timeframe (Hour 0-12, Hour 12-24, Hour 24-48), title, description, tactical_deliverable.
   - VerdictReportSchema: survival_score (0-100), risk_level, executive_verdict, top_dead_twins, top_cashflow_twins, deadly_pitfalls_to_avoid, wedge_differentiation_angle, validation_playbook_48h, is_uncharted_niche (boolean).
   - ValidationRequest: idea_text (str, min_length=10), source_url (Optional[str]).
   - ValidationResponse: report_id, status, verdict (VerdictReportSchema).

3. Core Services:
   - apps/api/app/services/embedding_service.py: Embedding generator interface (OpenAI text-embedding-3-small 1536d with deterministic mock vector generator fallback for offline execution).
   - apps/api/app/services/vector_matcher.py: Queries Supabase pgvector RPC functions or local fixture fallback. Enforces strict < 0.65 similarity zero-hallucination boundary, returning is_uncharted_niche=True with adjacent market warnings.
   - apps/api/app/services/synthesis_service.py: Orchestrates matching + synthesis prompt to generate VerdictReportSchema.
   - apps/api/app/api/v1/endpoints/validate.py: POST /api/v1/validate and GET /api/v1/verdict/{id}.
   - apps/api/app/api/v1/router.py: Registers all endpoints under /api/v1.

4. Sample Datasets & Ingestion Fixtures:
   - apps/api/fixtures/startups_rip_sample.json: 10+ detailed YC graveyard records (e.g. scale, logistics, AI, b2b) with failure taxonomy (high_cac, premature_scaling, no_pmf, regulatory_death, zero_retention).
   - apps/api/fixtures/trustmrr_sample.json: 10+ Stripe-verified profitable micro-SaaS records with live MRR, active subscribers, ARPU, pricing tiers, and acquisition channels.
   - apps/api/scripts/seed_mock_data.py: Script to load and inspect sample datasets.

5. Dependencies & Requirements:
   - apps/api/requirements.txt: fastapi, uvicorn[standard], pydantic>=2.7.0, pydantic-settings, httpx, numpy.

CONSTRAINTS & RULES:
- Strictly adhere to Python 3.11+ async standards.
- Enforce the 0.65 cosine similarity boundary: no hallucinated twin records.
- Verify all Python files compile cleanly using python3 -m py_compile.
- Call finish tool returning AGENT_RESULT_SCHEMA.
"""
    },
    {
        "id": "database",
        "role": "Database Architect (Supabase & pgvector)",
        "model": "inherit",
        "prompt": """
ROLE: Principal Database Architect for Verelli.lol (supabase/).
OBJECTIVE: Generate the production-grade Supabase PostgreSQL + pgvector schema, HNSW indexes, dual-search RPC functions, and seed migrations according to docs/Architecture.md and docs/rules.md.

DELIVERABLES:
1. SQL Migrations (supabase/migrations/20261122000000_verelli_vector_init.sql):
   - CREATE EXTENSION IF NOT EXISTS vector;
   - Table startups_graveyard:
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(255) NOT NULL,
     slug VARCHAR(255) UNIQUE NOT NULL,
     yc_batch VARCHAR(32),
     founded_year INT,
     died_year INT,
     capital_raised_usd NUMERIC(15, 2),
     primary_category VARCHAR(128),
     pitch_summary TEXT NOT NULL,
     post_mortem_text TEXT NOT NULL,
     failure_reasons JSONB NOT NULL,
     source_url TEXT,
     embedding vector(1536),
     created_at TIMESTAMPTZ DEFAULT NOW()
   - Table profitable_startups:
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(255) NOT NULL,
     slug VARCHAR(255) UNIQUE NOT NULL,
     stripe_verified_mrr NUMERIC(12, 2) NOT NULL,
     active_subscribers INT,
     arpu NUMERIC(10, 2),
     pricing_model VARCHAR(64),
     niche VARCHAR(128) NOT NULL,
     pitch_summary TEXT NOT NULL,
     acquisition_channels JSONB,
     verified_at TIMESTAMPTZ NOT NULL,
     live_url TEXT,
     embedding vector(1536),
     created_at TIMESTAMPTZ DEFAULT NOW()
   - Table validation_reports:
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     idea_text TEXT NOT NULL,
     source_url TEXT,
     survival_score INT NOT NULL,
     risk_level VARCHAR(32) NOT NULL,
     graveyard_twins JSONB NOT NULL,
     cashflow_twins JSONB NOT NULL,
     synthesis_report JSONB NOT NULL,
     query_embedding vector(1536),
     created_at TIMESTAMPTZ DEFAULT NOW()
   - HNSW Vector Indexes (sub-15ms lookups):
     idx_graveyard_embedding ON startups_graveyard USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
     idx_profitable_embedding ON profitable_startups USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

2. Parameterized RPC Search Functions (Zero-Hallucination Threshold):
   - match_graveyard_startups(query_embedding vector(1536), match_threshold float DEFAULT 0.65, match_count int DEFAULT 3)
   - match_profitable_startups(query_embedding vector(1536), match_threshold float DEFAULT 0.65, match_count int DEFAULT 3)
   - search_twins(query_embedding vector(1536), match_threshold float DEFAULT 0.65, match_count int DEFAULT 3) returning unified payload.

3. Seed Script & Documentation:
   - supabase/seed.sql: Realistic seed records with sample vector dimensions ready for Supabase local development (supabase db reset).
   - supabase/README.md: Complete guide on applying migrations, configuring pgvector, and connecting from FastAPI.

CONSTRAINTS & RULES:
- Never alter table names or vector dimensions (1536) from docs/Architecture.md.
- Ensure all RPC functions explicitly enforce match_threshold >= 0.65 default parameter.
- Verify SQL syntax correctness.
- Call finish tool returning AGENT_RESULT_SCHEMA.
"""
    }
]

# Workflow Execution Logic
async def run():
    phase("1. Initialize Verelli Phase 2 & 3 Parallel Workflow")
    log("Starting parallel execution of 3 specialized subagents:")
    log("• Subagent A: Frontend (apps/web) — Phase 2 Onboarding Journey")
    log("• Subagent B: Data Pipeline (apps/api) — FastAPI Engine, Schemas, & Fixtures")
    log("• Subagent C: Database (supabase/) — PostgreSQL Schema, HNSW Indexes & Vector RPC")

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
        log(f"SUCCESS: Verelli Phase 2 & 3 workflow completed cleanly ({len(total_files)} total files across web, api, and supabase).")
    else:
        log("WARNING: One or more subagents reported warnings or failures. Review above logs.")

    return {
        "success": all_success,
        "total_files_count": len(total_files),
        "subagent_results": results
    }

# Execute workflow entrypoint
result = await run()
print(result)
