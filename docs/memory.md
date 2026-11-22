# Live Session Context Tracker — verelli.lol

---

## 1. Project Identity & Status

- **Project:** verelli.lol (AI Pre-Build Startup Idea Validator)
- **Status:** **Phase 1 & Phase 2 COMPLETED** (Pomelli Onboarding Journey: ThingsToKnowModal, StayConnectedModal, OnboardingFourGrid, IdeaInputCard, useStepNavigation Query-Param State Orchestrator, Zero Build Errors)
- **Architecture:** Monorepo (`apps/web` Next.js 15 App Router + `apps/api` FastAPI + Supabase `pgvector`)
- **Visual Design:** 1:1 Google Labs Pomelli Aesthetic with Tactile 3D Scrap-Book Collage (Deep Botanical Olive `#191E0B`, Obsidian `#11120E`, Matte Charcoal `#252622` / `#181916`, Pistachio Lime `#B8C468`, Instrument Serif Italic Display Typography, Plus Jakarta Sans Body, Custom SVG explicit dimension controls)

---

## 2. [Completed Tasks]

- [x] **Core System Documentation Initialized:**
  - `docs/PRD.md`: Full product requirements, user personas, 5-screen Pomelli user flow, data pipeline specs (`Startups.RIP` + `TrustMRR`).
  - `docs/Architecture.md`: Monorepo topology, tech stack specs, database schema with `pgvector` HNSW indexes, dual vector RPC search functions, and Pydantic validation contracts.
  - `docs/rules.md`: Strict aesthetic prohibitions (no blue/purple gradients, no stark white, no Inter-only titles), 0.65 cosine similarity boundary with Uncharted Niche fallback, and AI agent boundaries.
  - `docs/phases.md`: 4-phase implementation roadmap with detailed verification checklists and deliverables.
  - `docs/design.md`: 1:1 Pomelli visual design system, color hex tokens, font stacks (`Instrument Serif` / `Plus Jakarta Sans`), floating organic hero elements, and Framer Motion spring physics.
  - `docs/memory.md`: Initialized live session tracker and context persistence protocol.

- [x] **Phase 1: Monorepo Setup & Pomelli Hero Landing Canvas:**
  - Scaffolding of root monorepo workspace & `apps/web` Next.js 15 App Router.
  - Configured Google Fonts: `Instrument Serif` (400 Regular & 400 Italic for `IvyPresto Headline` look) and `Plus Jakarta Sans` in `layout.tsx`.
  - Configured complete Pomelli color token system in `tailwind.config.ts` and `globals.css` (`#191E0B`, `#11120E`, `#242620`, `#2E3029`, `#B8C468`, `#363E1D`, `#373835`, `#34534d`, `#80979a`, `#d3b79c`).

- [x] **Playwright Render Script for Hero Image Cards (Pomelli Visuals & Target-Scale Legibility):**
  - Created `/apps/web/scripts/render-hero-cards.mjs` using Playwright, Sharp, and local `@fontsource` packages (`Instrument Serif`, `Plus Jakarta Sans`, `JetBrains Mono`).
  - Solved text legibility via Target-Scale Rule: `scale = 800 / DISPLAY_SIZE` per asset (`graveyard`: 280px, `survival`: 150px, `funnel`: 240px, `cloud`: 340px) so on-screen rendered text matches minimum readable sizes (11px–56px on-screen).
  - Upgraded backdrop layers: Photos at 76% opacity (`saturate(1.1)`), subtle dark canvas overlay (22%), soft radial scrim (`rgba(17,18,14,0.58)`), inner ring border, and text shadow (`0 2px 14px rgba(0,0,0,0.75)`).
  - Brand Assets:
    - Baked official `startups-rip-logo.svg` inside a dark glass pill (`#11120E` 75%, 1px border `#35382F`) into `hero-graveyard-v2.webp`.
    - Integrated `trustmrr-logo.png` (16px tall) + `<span>#12</span>` into the top-right live-text MRR card in `HeroFloatingCanvas.tsx`.
  - MRR Card Overlap Fix: Shifted `hero-mrr-thumb.webp` to `-top-8 -left-8 w-14 h-14` (only overlapping border/corner <35%) and added `pl-3 mt-1` padding to `$38.4K` to keep text completely unobstructed.
  - Added `"render:hero"` to `package.json` scripts and verified `npm run render:hero` + `npm run build` + `npm run lint` with 0 errors / 0 warnings.

- [x] **Phase 1 COMPLETED — Tactile 3D Scrap-Book & Film-Grain Vibe Transformation (`verelli.lol`):**
  - Executed global find-and-replace across all 6 core documentation files replacing `verelli.ai` and `Verelli` with `verelli.lol`.
  - Added camera film-grain SVG feTurbulence background layer (opacity 0.04) in `globals.css` and `layout.tsx`.
  - Configured `Caveat` handwriting font alongside `Instrument Serif` and `Plus Jakarta Sans` for cursive annotations and mock handwritten ink labels.
  - Implemented 8 tactile scrapbook collage artifacts in `HeroFloatingCanvas.tsx`.

- [x] **Phase 2 COMPLETED — Pomelli Onboarding Journey & Query-Param Modals (`apps/web`):**
  - `apps/web/hooks/useStepNavigation.ts`: URL query-param state manager handling `?step=terms`, `?step=welcome`, `?step=input`, and `/` using Next.js `useSearchParams`, `useRouter`, and `usePathname`.
  - `apps/web/components/modals/ThingsToKnowModal.tsx`:
    - Screen 2 compliance modal with `#121210 / 80%` backdrop-blur-md, centered `#252622` charcoal card, `border 1px solid #3A3D34`, rounded-3xl.
    - Instrument Serif italic heading *"Things to know before we begin"*.
    - Sourced data transparency with olive-underlined links to `Startups.RIP` and `TrustMRR` data terms.
    - Bottom-right actions: Plain text "Exit" (ghost text routing to `/`) and dark olive pill button "Agree & continue" (`#1B200E` with `#D8E29A` text, border `#363E1D`, routing to `?step=welcome`).
  - `apps/web/components/modals/StayConnectedModal.tsx`:
    - Screen 3A overlay on top of 4-step grid with `backdrop-blur-sm bg-black/50`.
    - Custom square pistachio-lime checkboxes (`#B8C468`) for "Weekly Graveyard Post-Mortem Deconstructs" and "Verified Micro-SaaS Niche Revenue Alerts".
    - Bottom-right actions: "Skip for now" ghost text and "Confirm" pistachio pill button (`#B8C468` with `#14180A` text).
  - `apps/web/components/onboarding/StepCard.tsx` & `apps/web/components/onboarding/OnboardingFourGrid.tsx`:
    - Screen 3B 4-step onboarding grid with small lime flask icon badge, italic Instrument Serif heading *"Welcome to Verelli.lol"*, and clean sans subtitle.
    - 4 equal-height dark cards (`#181916`, `1px solid #2E3029`, rounded-3xl) with subtle top-left step numbers:
      - Card 1: *Build your Idea Profile* (simulated typing preview with blinking lime cursor pill).
      - Card 2: *Scan the Startup Graveyard* (skull badge, burned capital, and post-mortem snippet).
      - Card 3: *Verify Live Niche MRR* (live Stripe MRR badge with subscriber count and sparklines).
      - Card 4: *Create your Validation Book & 48h Plan* (circular SVG gauge preview & checklist).
    - Inset bottom preview panels illuminated by soft radial olive glow (`radial-gradient(circle, rgba(163, 184, 99, 0.22) 0%, rgba(17, 18, 14, 0) 70%)`).
    - Bottom center pistachio-lime pill button *"Let's go!"* (`#B8C468`, text `#14180A`, routing to `?step=input`).
  - `apps/web/components/onboarding/IdeaInputCard.tsx`:
    - Screen 4 focused startup idea input card (`#23251F`, `1px solid #44473E`, rounded-3xl, max-w-[680px]) floating over soft radial olive-sage ambient glow.
    - Italic serif heading *"Enter your startup idea"*.
    - Dark outlined input box (`#161713`, `border-[#5A5D52]`, focus ring `#B8C468`).
    - Suggestion prompt chips for rapid testing.
    - Dual bottom pill buttons: Left muted moss `#363E1D` (*"No website yet?"*) and right matte charcoal `#373835` (*"Continue"*), which dynamically turns `#B8C468` pistachio with `#14180A` text when input is non-empty.
  - `apps/web/components/onboarding/OnboardingFlow.tsx`: Orchestrates AnimatePresence step transitions.
  - `apps/web/app/page.tsx`: Integrated `OnboardingFlow` wrapped in `<Suspense fallback={null}>`.
  - Verified static generation and production build (`npm --workspace=apps/web run build`) passing with 0 errors. Verified lint (`npm --workspace=apps/web run lint`) passing with 0 errors.

- [x] **Phase 3 Database Infrastructure & pgvector Engine (`supabase/`) COMPLETED:**
  - Migrations, HNSW indexes, dual-search RPC enforcing `< 0.65` zero-hallucination boundary, and seed fixtures verified.

- [x] **Phase 3 & 4 FastAPI Backend Intelligence Server (`apps/api`) COMPLETED:**
  - `apps/api/requirements.txt`: Configured with `fastapi>=0.115.0`, `uvicorn[standard]>=0.30.0`, `pydantic>=2.7.0`, `pydantic-settings>=2.2.0`, `httpx>=0.27.0`, `numpy>=1.26.0`.
  - `apps/api/app/main.py`: FastAPI entrypoint with CORS middleware for `http://localhost:3000`, custom Pydantic `RequestValidationError` & `StarletteHTTPException` handlers, and `/health` healthcheck endpoint.
  - `apps/api/app/core/config.py`: Pydantic v2 Settings with auto-discovery for `SUPABASE_URL`, `SUPABASE_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `SIMILARITY_THRESHOLD=0.65`, and resilient runtime fallback.
  - `apps/api/app/models/schemas.py`: Pydantic v2 contracts for `DeadTwinSummary`, `CashflowTwinSummary`, `ActionablePlaybookStep`, `VerdictReportSchema`, `ValidationRequest`, `ValidationResponse`, and `HealthResponse`.
  - `apps/api/app/services/embedding_service.py`: 1536d vector generator interfacing with OpenAI `text-embedding-3-small` and deterministic mock vector generator fallback with exact word boundary keyword clustering.
  - `apps/api/app/services/vector_matcher.py`: Dual pgvector query service supporting Supabase RPC functions and local fixture fallback, enforcing strict `< 0.65` cosine similarity zero-hallucination boundary and returning `is_uncharted_niche=True` with adjacent market warnings.
  - `apps/api/app/services/synthesis_service.py`: Orchestrates vector matching + LLM synthesis (Gemini 1.5 Pro / GPT-4o) and calibrated heuristic synthesis engine (0-100 survival score, risk level, executive verdict, deadly pitfalls, wedge angle, 48h playbook).
  - `apps/api/app/api/v1/endpoints/validate.py` & `apps/api/app/api/v1/router.py`: Exposes `POST /api/v1/validate` and `GET /api/v1/verdict/{id}`.
  - `apps/api/fixtures/startups_rip_sample.json`: 12 detailed YC graveyard records across failure taxonomy (`high_cac`, `premature_scaling`, `no_pmf`, `regulatory_death`, `zero_retention`) with precomputed 1536d normalized embeddings.
  - `apps/api/fixtures/trustmrr_sample.json`: 12 Stripe-verified profitable micro-SaaS records ($852K/mo verified MRR, 23.2K subscribers, ARPU, acquisition channels) with precomputed 1536d normalized embeddings.
  - `apps/api/scripts/seed_mock_data.py`: Dataset audit script validating 100% vector dimensionality and demonstrating vector similarity matching and 0.65 boundary enforcement.
  - `apps/api/scripts/test_endpoints.py`: Automated 7-step test suite verifying 100% pass rate across `/health`, `/`, `POST /api/v1/validate` (known niche), `GET /api/v1/verdict/{id}`, `POST /api/v1/validate` (uncharted niche), input validation 422, and missing ID 404.
  - All Python files verified cleanly compiling with `python3 -m py_compile`.

---

## 3. [Current Active File]

- `apps/web/components/onboarding/OnboardingFlow.tsx` & `apps/web/app/page.tsx`

---

## 4. [Next Up in Phase 3 & 4]

According to `docs/phases.md`, the next upcoming engineering tasks are:
1. **FastAPI Engine (`apps/api`):**
   - Connect FastAPI validation endpoint (`/api/v1/validate`) to Supabase `pgvector` dual RPC (`search_twins`).
   - Implement embedding pipeline and structured Gemini/GPT-4o LLM synthesis service.
2. **Screen 5: The verelli.lol Verdict Bento Workspace (`/verdict/[id]`):**
   - 4-card asymmetric Bento layout matching Pomelli aesthetic:
     - Card 1: Animated SVG Survival Gauge (`0-100%`) with risk level badge.
     - Card 2: Top 3 Dead Twins cards with burned capital and highlighted fatal flaw quotes.
     - Card 3: Top 3 Cashflow Twins cards with live Stripe MRR, ARPU, and acquisition channels.
     - Card 4: 48-Hour Validation Playbook with actionable hourly sprints and export button.

---

## 5. [Architectural Decisions Log]

| ID | Decision | Justification | Date |
| :--- | :--- | :--- | :--- |
| **ADR-001** | **Monorepo structure (`apps/web` + `apps/api`)** | Decouples Next.js 15 frontend SSR/client UI from heavy Python scraping and vector embedding pipelines. | 2026-11-02 |
| **ADR-002** | **Supabase `pgvector` with HNSW indexing** | Provides sub-15ms cosine distance matching across 1,700+ graveyard records and 12,000+ profitable SaaS records. | 2026-11-02 |
| **ADR-003** | **0.65 Cosine Similarity Hard Fallback** | Prevents AI hallucination. If similarity is under 0.65, triggers "Uncharted Niche — Closest Adjacent Markets" rather than fabricating comparisons. | 2026-11-02 |
| **ADR-004** | **Query-Parameter-Driven Modals (`?step=...`)** | Keeps all onboarding modals (`?step=terms`, `?step=welcome`, `?step=input`) shareable, bookmarkable, and compatible with browser Back/Forward navigation. | 2026-11-02 |
| **ADR-005** | **1:1 Pomelli Design System Tokens** | Strict adherence to Google Labs' Pomelli visual language: `#191E0B` botanical canvas, `#B8C468` pistachio lime CTA, and authentic italic serif headlines. | 2026-11-02 |
| **ADR-006** | **Framer Motion Spring Parallax & Scalloped Vector Masks** | Replicated Pomelli's tactile organic feel with GPU-accelerated spring transforms and mouse cursor tracking without frame drops. | 2026-11-02 |
| **ADR-007** | **Original Layout Preservation with Photographic Inner Content** | Retained original approved layout, coordinates, card sizes, and physics while embedding editorial WebP images inside the card frames. | 2026-11-03 |
| **ADR-008** | **Next.js Dev Server Artifact Isolation** | Resolved Webpack chunk collision / type error caused by concurrent next build over .next by purging .next dev cache and restarting dev worker cleanly. | 2026-11-03 |
| **ADR-009** | **Dynamic Target-Scaled Playwright Rendering Pipeline** | Eliminated illegible text and dim backdrop images in cards by computing `scale = 800 / DISPLAY_SIZE` for all typography and padding in Playwright templates. | 2026-11-03 |
| **ADR-010** | **Tactile 3D Scrap-Book Collage & Film-Grain Vibe (`verelli.lol`)** | Replaced flat rendered cards with a physical analog scrap-book aesthetic featuring a 0.04 opacity SVG `feTurbulence` camera film grain, `filter: drop-shadow(0 15px 30px rgba(0,0,0,0.45))` hand-cut scrap shadows, `Caveat` handwriting annotations, washi tape strips, 3D metallic pins, paper clip overlays, and concentric stamped seals. | 2026-11-03 |
| **ADR-011** | **Dynamic Parallel Workflow Orchestration (`verelli-phase2-3`)** | Uses Antigravity Dynamic Workflow (`workflows/verelli-phase2-3/`) to fan out across Frontend, Backend, and Database concurrently with schema-validated outputs. | 2026-11-22 |
| **ADR-012** | **Automated Build Guard & Dataset Freshness Sidecars** | Implements `.agents/rules/build_guard.md` to prevent CSS regressions and `.agents/sidecars/weekly-dataset-freshness/sidecar.json` for weekly automated dataset and embedding health audits. | 2026-11-22 |
| **ADR-013** | **Supabase pgvector HNSW Indexing & Dual RPC Architecture** | Implemented `20261122000000_verelli_vector_init.sql` with HNSW (`m=16, ef_construction=64`) for sub-15ms cosine similarity lookups. | 2026-11-22 |
| **ADR-014** | **Next.js 15 Suspense Boundary for Query Navigation & Strict SVG Dimension Enforcement** | Wrapped `OnboardingFlow` within React `<Suspense fallback={null}>` in `page.tsx` for clean Next.js 15 App Router static generation. Enforced explicit `width`, `height`, and inline style attributes across all SVG/Lucide elements to strictly prevent layout blowouts per `.agents/rules/build_guard.md`. | 2026-11-22 |
| **ADR-015** | **Deterministic Offline Vector Matching & Strict 0.65 Boundary Enforcement** | Built `EmbeddingService` with OpenAI `text-embedding-3-small` and deterministic mock vector fallback using word-boundary semantic clusters, paired with `VectorMatcherService` enforcing strict `< 0.65` zero-hallucination boundary and uncharted niche diagnostic. | 2026-11-22 |

---

## 6. Context Persistence Protocol for AI Agents

> **MANDATORY INSTRUCTION FOR ALL AI CODING SESSIONS:**
> Whenever any file is created, modified, or refactored, the AI agent **MUST FIRST** update this `docs/memory.md` file before finishing its response.
