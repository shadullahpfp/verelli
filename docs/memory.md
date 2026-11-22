# Live Session Context Tracker — verelli.lol

---

## 1. Project Identity & Status

- **Project:** verelli.lol (AI Pre-Build Startup Idea Validator)
- **Status:** **Phase 1, Phase 2, Phase 3 & Phase 4 COMPLETED** (Full-Stack Pre-Build Feasibility Engine: Pomelli Hero Canvas, Onboarding Modals Flow, Supabase pgvector HNSW Indexing, FastAPI Vector Matching & LLM Synthesis Engine, IdeaInputCard Wired to API with Analyzing Ticker, Screen 5 Verdict Bento Workspace at `/verdict/[id]`, Zero Build & Lint Errors)
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
  - `apps/web/components/modals/ThingsToKnowModal.tsx`: Screen 2 compliance modal with `#121210 / 80%` backdrop-blur-md, centered `#252622` charcoal card, `border 1px solid #3A3D34`, rounded-3xl.
  - `apps/web/components/modals/StayConnectedModal.tsx`: Screen 3A overlay on top of 4-step grid with `backdrop-blur-sm bg-black/50`.
  - `apps/web/components/onboarding/StepCard.tsx` & `apps/web/components/onboarding/OnboardingFourGrid.tsx`: Screen 3B 4-step onboarding grid with small lime flask icon badge, italic Instrument Serif heading *"Welcome to Verelli.lol"*, and clean sans subtitle.
  - `apps/web/components/onboarding/OnboardingFlow.tsx`: Orchestrates AnimatePresence step transitions.

- [x] **Phase 3 Database Infrastructure & pgvector Engine (`supabase/`) COMPLETED:**
  - Migrations, HNSW indexes, dual-search RPC enforcing `< 0.65` zero-hallucination boundary, and seed fixtures verified.

- [x] **Phase 3 & 4 FastAPI Backend Intelligence Server (`apps/api`) COMPLETED:**
  - `apps/api/requirements.txt`: Configured with FastAPI, uvicorn, pydantic v2, pydantic-settings, httpx, numpy.
  - `apps/api/app/main.py`: FastAPI entrypoint with CORS middleware for `http://localhost:3000`, `/health`, and error handlers.
  - `apps/api/app/services/embedding_service.py` & `vector_matcher.py` & `synthesis_service.py`: 1536d vector generation, dual vector matcher with 0.65 boundary enforcement, and heuristic/LLM synthesis.
  - `apps/api/app/api/v1/endpoints/validate.py`: Exposes `POST /api/v1/validate` and `GET /api/v1/verdict/{id}`.

- [x] **Phase 4 COMPLETED — Frontend Integration & Screen 5 Verdict Bento Workspace (`apps/web`):**
  - `apps/web/types/verdict.ts`: Strict TypeScript interfaces mirroring Pydantic v2 schemas (`DeadTwinSummary`, `CashflowTwinSummary`, `ActionablePlaybookStep`, `VerdictReportSchema`, `ValidationResponse`, `StoredVerdictData`).
  - `apps/web/lib/sampleVerdict.ts`: Realistic verified benchmark dataset fallback for offline resilience.
  - `apps/web/components/onboarding/IdeaInputCard.tsx`:
    - Wired to `${API_URL}/api/v1/validate` using `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`.
    - Full-screen Analyzing Overlay on `#11120E` canvas with pulsing soft radial olive glow (`radial-gradient(circle, rgba(163, 184, 99, 0.25) 0%, rgba(17, 18, 14, 0) 70%)`).
    - Dynamic ticker cycling through the 4 validation steps every 1.4s with smooth Framer Motion transitions and progress indicators.
    - Stores report in `sessionStorage` (`verelli_verdict_${report_id}`) and routes smoothly to `/verdict/${report_id}`.
    - Gracefully handles network/API errors with an inline error banner, retry button, and offline demo fallback.
  - `apps/web/components/verdict/SurvivalScoreGauge.tsx`:
    - Circular SVG stroke gauge with animated stroke-dashoffset transition.
    - Large italic `Instrument Serif` percentage score (0–100%) and dynamic color indicator (`#4ADE80` for high potential, `#D3B79C` for contested, `#F87171` for critical risk).
    - Explicit SVG `width={148} height={148} style={{ width: 148, height: 148 }}`.
  - `apps/web/components/verdict/VerdictBento.tsx`:
    - Canvas: Deep obsidian olive `#11120E` with top radial olive ambient glow (`rgba(163, 184, 99, 0.16)`).
    - Top Header Bar: Verelli Labs flask logo (linking to `/`), "Validate another idea" muted moss pill (`#363E1D`, text `#C5D37A`, border `#4F5A2C`), and "Copy X Verdict Card" pistachio-lime pill (`#B8C468`, text `#14180A`) with momentary "Copied to clipboard! ✦" floating toast.
    - Row 1 — Executive Verdict Hero Card (`#181916`, rounded-3xl, 1px solid `#2E3029`): Left submitted concept in italic `Instrument Serif` + risk tier badge + brutal executive reality check; Right circular SVG Survival Score gauge; Zero-hallucination banner for `< 0.65` cosine similarity uncharted niches.
    - Row 2 — Split Bento: Left Column Startups.RIP Graveyard Twins with capital burned, terracotta fatal flaw pills (`#F87171`), post-mortem quotes, and vector similarity badges; Right Column TrustMRR Cashflow Twins with Stripe-verified MRR in `#4ADE80`, active subscribers, pricing model pills, and winning acquisition wedges.
    - Row 3 — 48-Hour Zero-Code Validation Playbook: 3-step actionable sprint cards (Fake-Door Wedge, Distribution Channel, Kill/Go Metric), Counter-Intuitive Wedge Strategy banner, Deadly Pitfalls callouts, and "Export Validation Book (PDF)" action.
  - `apps/web/app/verdict/[id]/page.tsx` & `apps/web/app/verdict/[id]/VerdictClientContainer.tsx`:
    - Dynamic route handling Next.js 15 async `params`.
    - Resilient direct-URL loading: reads from `sessionStorage`, fetches from API endpoint `${API_URL}/api/v1/verdict/${id}`, or falls back to benchmark sample if offline.
    - Production build (`npm --workspace=apps/web run build`) and lint (`npm --workspace=apps/web run lint`) verified with **0 errors and 0 warnings**.

---

## 3. [Current Active File]

- `apps/web/app/verdict/[id]/page.tsx`, `apps/web/app/verdict/[id]/VerdictClientContainer.tsx`, & `apps/web/components/verdict/VerdictBento.tsx`

---

## 4. [Next Up]

- End-to-end user acceptance testing across both local dev servers (`apps/web` on port 3000 + `apps/api` on port 8000).
- Production deployment preparation (Vercel Edge for Next.js 15 frontend + Cloud Run / Render for FastAPI backend).

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
| **ADR-016** | **Client-Side Session Caching & Direct-URL Resilience for Verdict Workspace** | Implemented dual-layer persistence for Screen 5 (`/verdict/[id]`): prioritizes in-memory `sessionStorage` (`verelli_verdict_${id}`) to ensure zero-latency client transitions from Stage 1 Idea Input, seamlessly falls back to `GET /api/v1/verdict/{id}` on direct link opens, and provides structured sample fallbacks if the API backend is unreachable. | 2026-11-22 |
| **ADR-017** | **Permanent Build vs Dev Directory Isolation (`distDir`)** | Added `distDir: process.env.NEXT_DIST_DIR || ".next"` in `next.config.ts` and configured `npm run build` to use `NEXT_DIST_DIR=.next_build`. Completely prevents `next build` from overwriting the active dev server's `.next` cache, eliminating stylesheet 404s and chunk hash collisions permanently. | 2026-11-22 |
| **ADR-018** | **Matte Obsidian Palette & Global Film-Grain Scoping (`/verdict/[id]`)** | Removed global `feTurbulence` film-grain overlay from `layout.tsx` and scoped it strictly inside `HeroFloatingCanvas.tsx` to eliminate noise/speckling from onboarding modals and `/verdict/[id]`. Standardized the verdict workspace on the clean `?step=welcome` 2-tier matte obsidian system: `#11120E` canvas with top-center radial olive glow (`rgba(163, 184, 99, 0.10)`), `#181916` primary bento containers with `#2A2C26` borders, and `#11120F` recessed inner sub-cards with `#23251F` borders. Retained soft radial olive glow (`0.14` opacity) specifically behind the Survival Score circular gauge. | 2026-11-22 |

---

## 6. Context Persistence Protocol for AI Agents

> **MANDATORY INSTRUCTION FOR ALL AI CODING SESSIONS:**
> Whenever any file is created, modified, or refactored, the AI agent **MUST FIRST** update this `docs/memory.md` file before finishing its response.
