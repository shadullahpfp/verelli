# Live Session Context Tracker — verelli.lol

---

## 1. Project Identity & Status

- **Project:** verelli.lol (AI Pre-Build Startup Idea Validator)
- **Status:** **Phase 1 COMPLETED** (Film-Grain "Vibe", 3D Layered Scrap-Book Canvas, 8 Tactile Floating Components, verelli.lol Branding Verified)
- **Architecture:** Monorepo (`apps/web` Next.js 15 App Router + `apps/api` FastAPI + Supabase `pgvector`)
- **Visual Design:** 1:1 Google Labs Pomelli Aesthetic with Tactile 3D Scrap-Book Collage (Deep Botanical Olive `#191E0B`, Fine Camera Film-Grain Noise, `custom-shadow` Drop Shadows, `Instrument Serif` Display Typography, `Caveat` Handwriting Font, Concentric Embossed Stamped Seals, Washi Tape & Metallic Push-Pins)

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
  - Bumped 4 cards ~20% on the page in `HeroFloatingCanvas.tsx`:
    1. `hero-graveyard-v2.webp` (280px display): `startups-rip-logo.svg` pill, "1,740+" (56px serif), "Dead YC Startups" (16px), "#1 Cause: No PMF" pill (12px).
    2. `hero-survival-v2.webp` (150px display): "84%" (44px serif lime), "SURVIVAL" (12px mono caps).
    3. `hero-funnel-v2.webp` (240px display): "FAKE-DOOR TEST" (11px), "14.2%" (50px serif lime), "Waitlist CVR" (15px), "48h Pre-Build" (12px).
    4. `hero-cloud-v2.webp` (340px display): "LIVE SYNTHESIS" (12px), "YOUR IDEA" (12px), "3 Dead Twins" / "5 Live Winners" (24px serif), "Wedge Angle" / "B2B Micro-SaaS" (13px) with 24px vertical gap.
  - Added `"render:hero"` to `package.json` scripts and verified `npm run render:hero` + `npm run build` + `npm run lint` with 0 errors / 0 warnings.
  - Dev server running cleanly on `http://localhost:3000`.
- [x] **Video Poster Scoping & Container Containment Fix:**
  - Audited codebase across all files for references to `video-poster.webp`.
  - Scoped `video-poster.webp` strictly inside the video frame container of `ExperimentShowcase.tsx` (`relative overflow-hidden aspect-video max-w-4xl mx-auto rounded-2xl border border-[#2E3029] bg-[#14170A]`).
  - Set poster image to `fill`, `object-cover`, `opacity-60`, `pointer-events-none`, `z-0`.
  - Re-anchored overlay text and play button with `relative z-10 flex flex-col items-center justify-center h-full px-4 text-center`.
  - Verified no wallpaper or fixed/absolute background image exists in `layout.tsx`, `page.tsx`, `globals.css`, or `HeroFloatingCanvas.tsx`.
  - Verified `scripts/render-hero-cards.mjs` does not touch or move `video-poster.webp`.
- [x] **Phase 1 COMPLETED — Tactile 3D Scrap-Book & Film-Grain Vibe Transformation (`verelli.lol`):**
  - Executed global find-and-replace across all 6 core documentation files (`PRD.md`, `Architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`) replacing all instances of `verelli.ai` and `Verelli` with `verelli.lol`.
  - Added camera film-grain SVG feTurbulence background layer (opacity 0.04) in `globals.css` and `layout.tsx`.
  - Configured `Caveat` handwriting font alongside `Instrument Serif` and `Plus Jakarta Sans` for cursive annotations and mock handwritten ink labels.
  - Implemented hand-cut scrap shadows (`custom-shadow`: `filter: drop-shadow(0 15px 30px rgba(0,0,0,0.45))`), `paper-edge` subtle borders (`0.5px solid rgba(209, 205, 188, 0.15)`), and washi tape textures.
  - Recreated all 8 tactile scrapbook collage artifacts in `HeroFloatingCanvas.tsx` with continuous gentle floating and spring parallax:
    1. **"84% Survival Score" (Far-Left):** Circular vintage-stamped seal with embossed concentric rings, dashed perimeter, circular curved stamped text, and Instrument Serif italic "84%".
    2. **"YC Cemetery 1,740+ Dead Startups" (Top-Left):** Rough torn-edge circular cutout with red-tinted cemetery photography, handwritten "YC Cemetery YC W21 • B2C AI", printed "1,740+ DEAD YC STARTUPS", and physical overlapping orange "#1 Cause: No PMF" washi tape label.
    3. **Risk Diagnostic Swatches (Middle-Left):** Tilted craft-paper swatch card (-rotate-12) with translucent masking tape, dark tactile dots (#34534d, #80979a, #d3b79c), and mock cursive handwritten ink labels (`#mrr_ok`, `#cac_risk`, `#dead_twin`).
    4. **Offline Document Cluster (Bottom-Left):** Layered scrap slips with 3D metallic push-pin, silver wire paper clip, cream "48h Validation" slip, handwritten "Low CAC Wedge", "Stripe Verified", and "Graveyard Checked" tags.
    5. **TrustMRR "$38.4K" Invoice Card (Top-Right):** Heavy textured invoice card with printed italic serif "$38.4K", "Verified Monthly Revenue", and overlapping physical amber/gold tape badge "#12 TRUSTMRR".
    6. **Graph Metric Funnel (Far-Right):** Circular dark grey cutout with hand-drawn etched chalk funnel diagram, "14.2% Waitlist CVR" printed text, and "48h Pre-Build Wedge".
    7. **"YOUR IDEA" 8-Petal Cloud (Bottom-Right):** 8-petal scalloped paper mask, archive filing cabinets texture, bold white "YOUR IDEA", and physical yellow washi tape strip "3 DEAD TWINS • 5 LIVE WINNERS".
    8. **Navigation & Watermarks:** "Verelli Labs" + minimal gold flask icon + "[EXPERIMENT]" chip on top-left, barely-visible paper-textured "verelli.lol" watermark on top-right, and centerpiece "Verelli.lol" italic serif title with tactile pistachio lime CTA "Let's get started ↗".
  - Verified static generation and production build (`npm run build`) passing with 0 errors. Dev server running cleanly on `http://localhost:3000`.

- [x] **Phase 2 & 3 Dynamic Parallel Workflow & Automations Configured:**
  - Designed and authored reusable Antigravity Parallel Dynamic Workflow (`workflows/verelli-phase2-3/workflow.py` and `workflow.json`) orchestrating 3 concurrent subagents:
    - Subagent A (Frontend - `apps/web`): Phase 2 Pomelli Onboarding Flow (`ThingsToKnowModal`, `StayConnectedModal`, `OnboardingFourGrid`, `IdeaInputCard`).
    - Subagent B (Data Pipeline - `apps/api`): FastAPI Engine, Pydantic schemas, and mock-seeded fixtures for immediate vector search.
    - Subagent C (Database - `supabase/`): PostgreSQL schema, HNSW indexes, and dual-search RPC enforcing `< 0.65` zero-hallucination boundary.
  - Authored Always-On Build Guard Rule (`.agents/rules/build_guard.md`) enforcing Next.js TypeScript and Tailwind compilation integrity and SVG dimension attributes across web workspace modifications.
  - Authored Weekly Dataset Freshness Scheduled Sidecar Automation (`.agents/sidecars/weekly-dataset-freshness/sidecar.json`) auditing Startups.RIP and TrustMRR updates every Monday at 09:00 UTC.

---

## 3. [Current Active File]

- `apps/web/components/hero/HeroFloatingCanvas.tsx` & `apps/web/components/showcase/ExperimentShowcase.tsx`

---

## 4. [Next Up in Phase 2]

According to `docs/phases.md`, the next upcoming engineering tasks for **Phase 2: Onboarding Modals & 4-Step Grid Flow** are:
1. **Query-Parameter State Orchestrator (`useStepNavigation.ts`):**
   - Manage modal step states (`?step=terms`, `?step=welcome`, `?step=input`) cleanly through Next.js `useSearchParams` and shallow router transitions.
2. **Screen 2: "Things to Know" Compliance Modal (`ThingsToKnowModal.tsx`):**
   - Semi-translucent obsidian overlay (`#121210 / 80% backdrop-blur-md`).
   - Centered matte charcoal card (`#252622`) with 24px border-radius and `1px solid #3A3D34`.
   - Ingested source transparency (`Startups.RIP` and `TrustMRR`) with olive-underlined interactive links.
   - Action buttons: `"Exit"` text button and `"Agree & continue"` (`#1B200E` pill).
3. **Screen 3A: "Stay Connected" Modal (`StayConnectedModal.tsx`):**
   - Optional pre-grid popup with lime-styled custom checkboxes (`Weekly Graveyard Deconstructs`, `Verified Revenue Alerts`).
   - Pistachio-lime `"Confirm"` button and `"Skip for now"` link.
4. **Screen 3B: "Welcome to verelli.lol" 4-Step Onboarding Grid (`OnboardingGrid.tsx`):**
   - Header with lime flask badge, italic serif heading *"Welcome to verelli.lol"*, and subtitle.
   - 4-column responsive horizontal card grid with inset preview containers and olive radial glow (`rgba(163, 184, 99, 0.22)`):
     - Card 1: *Build your Idea Profile* (mini input preview with typing simulation).
     - Card 2: *Scan the Startup Graveyard* (mini post-mortem card with skull tag and burned capital).
     - Card 3: *Verify Live Niche MRR* (mini Stripe MRR badge with subscriber count).
     - Card 4: *Create your Validation Book & 48h Plan* (mini gauge and checklist preview).
   - Bottom center pistachio-lime pill button `"Let's go!"` navigating to `?step=input`.
5. **Screen 4: Focused Idea Input Card (`IdeaInputCard.tsx`):**
   - Centered rounded card (`#23251F`, `1px border #44473E`) over ambient radial glow.
   - Italic serif heading *"Enter your startup idea"*.
   - Full-width dark input field with subtle focus ring.
   - Dual bottom pill buttons: Left `"No website yet? Type raw idea"` (`#363E1D`), Right `"Continue"` (`#373835`).

---

## 5. [Architectural Decisions Log]

| ID | Decision | Justification | Date |
| :--- | :--- | :--- | :--- |
| **ADR-001** | **Monorepo structure (`apps/web` + `apps/api`)** | Decouples Next.js 15 frontend SSR/client UI from heavy Python scraping (Playwright/BeautifulSoup) and vector embedding pipelines. | 2026-11-02 |
| **ADR-002** | **Supabase `pgvector` with HNSW indexing** | Provides sub-15ms cosine distance matching across 1,700+ graveyard records and 12,000+ profitable SaaS records. | 2026-11-02 |
| **ADR-003** | **0.65 Cosine Similarity Hard Fallback** | Prevents AI hallucination. If similarity is under 0.65, triggers "Uncharted Niche — Closest Adjacent Markets" rather than fabricating comparisons. | 2026-11-02 |
| **ADR-004** | **Query-Parameter-Driven Modals (`?step=...`)** | Keeps all onboarding modals (`?step=terms`, `?step=welcome`, `?step=input`) shareable, bookmarkable, and compatible with browser Back/Forward navigation. | 2026-11-02 |
| **ADR-005** | **1:1 Pomelli Design System Tokens** | Strict adherence to Google Labs' Pomelli visual language: `#191E0B` botanical canvas, `#B8C468` pistachio lime CTA, and authentic italic serif headlines. | 2026-11-02 |
| **ADR-006** | **Framer Motion Spring Parallax & Scalloped Vector Masks** | Replicated Pomelli's tactile organic feel with GPU-accelerated spring transforms and mouse cursor tracking without frame drops. | 2026-11-02 |
| **ADR-007** | **Original Layout Preservation with Photographic Inner Content** | Retained original approved layout, coordinates, card sizes, and physics while embedding editorial WebP images inside the card frames. | 2026-11-03 |
| **ADR-008** | **Next.js Dev Server Artifact Isolation** | Resolved Webpack chunk collision (`denormalizePagePath`) caused by concurrent `next build` over `.next` by purging `.next` dev cache and restarting dev worker cleanly. | 2026-11-03 |
| **ADR-009** | **Dynamic Target-Scaled Playwright Rendering Pipeline** | Eliminated illegible text and dim backdrop images in cards by computing `scale = 800 / DISPLAY_SIZE` for all typography and padding in Playwright templates, ensuring sharp on-screen rendering matching exact design token specifications. | 2026-11-03 |
| **ADR-010** | **Tactile 3D Scrap-Book Collage & Film-Grain Vibe (`verelli.lol`)** | Replaced flat rendered cards with a physical analog scrap-book aesthetic featuring a 0.04 opacity SVG `feTurbulence` camera film grain, `filter: drop-shadow(0 15px 30px rgba(0,0,0,0.45))` hand-cut scrap shadows, `Caveat` handwriting annotations, washi tape strips, 3D metallic pins, paper clip overlays, and concentric stamped seals. | 2026-11-03 |
| **ADR-011** | **Dynamic Parallel Workflow Orchestration (`verelli-phase2-3`)** | Uses Antigravity Dynamic Workflow (`workflows/verelli-phase2-3/`) to fan out across Frontend, Backend, and Database concurrently with schema-validated outputs, preventing context bloat and linear bottlenecks. | 2026-11-22 |
| **ADR-012** | **Automated Build Guard & Dataset Freshness Sidecars** | Implements `.agents/rules/build_guard.md` to prevent CSS regressions and `.agents/sidecars/weekly-dataset-freshness/sidecar.json` for weekly automated dataset and embedding health audits. | 2026-11-22 |

---

## 6. Context Persistence Protocol for AI Agents

> **MANDATORY INSTRUCTION FOR ALL AI CODING SESSIONS:**
> Whenever any file is created, modified, or refactored, the AI agent **MUST FIRST** update this `docs/memory.md` file before finishing its response.
