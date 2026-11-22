# Engineering Rules & AI Boundaries — verelli.lol

---

## 1. Core Engineering Principles

These rules establish strict non-negotiable standards for architecture, aesthetics, code quality, and AI agent boundaries throughout the lifecycle of the **verelli.lol** project.

---

## 2. Mandatory Tech Stack & Libraries

### 2.1 Frontend (`apps/web`)
- **Framework:** Next.js 15 (App Router only; no Pages Router allowed).
- **Type Safety:** TypeScript in strict mode (`"strict": true`, no `any` types; all API responses must type-check against generated schemas).
- **Styling:** Tailwind CSS using **exclusively** the custom design tokens defined in `design.md`.
- **Motion & Transitions:** Framer Motion with realistic spring physics (`type: "spring", stiffness: 350, damping: 25`).
- **Icons:** `lucide-react` (thin strokes: `strokeWidth={1.5}` or `1.75` to preserve editorial luxury).
- **Fonts:** `Instrument Serif` (or `IvyPresto Headline`) for editorial headings; `Plus Jakarta Sans` or `Google Sans` for body, badges, and labels.

### 2.2 Backend (`apps/api`)
- **Framework:** FastAPI with Python 3.11+.
- **Data Validation:** Pydantic v2 models for all request bodies, query parameters, and JSON responses.
- **Async Standards:** All I/O operations (database queries, external API calls, scraping) must be strictly asynchronous (`async`/`await`).
- **Vector Search:** Supabase `pgvector` with parameterized PostgreSQL RPC functions. Never assemble raw vector strings in SQL queries.
- **LLM Synthesis:** OpenAI SDK / Google GenAI SDK using structured JSON schema output modes (function calling or schema response format).

---

## 3. Strict Aesthetic Prohibitions ("What to Avoid")

1. **NO Default Shadcn / Vercel Blue & Purple Themes:**
   - Under no circumstances will indigo, purple, electric blue, or standard Tailwind slate gradients be introduced.
   - Every surface must adhere to Pomelli’s botanical olive-charcoal palette (`#191E0B`, `#11120E`, `#181916`, `#242620`, `#B8C468`).
2. **NO Stark White Canvases:**
   - Pure `#FFFFFF` backgrounds or cards are strictly banned.
   - Text highlights must use warm bone/ivory tones (`#EDEFE6`, `#E3E5DC`), and secondary text must use muted sage-olive (`#9A9D93`, `#80979A`).
3. **NO Generic Inter-Only Typography:**
   - Do NOT use standard sans-serif for hero headlines or section titles.
   - All major display headings (`"verelli.lol"`, `"Welcome to verelli.lol"`, `"Enter your startup idea"`, `"The Verdict"`) MUST be rendered in elegant italic serif (`Instrument Serif` / `IvyPresto` in `400 Regular Italic`).
4. **NO Raw Unstyled Modals or Dropdowns:**
   - All modals must feature an ultra-dark backdrop (`#121210 / 80% backdrop-blur-md`), matte charcoal container (`#252622`), subtle olive borders (`#3A3D34`), and 24px border-radius.

---

## 4. Similarity Thresholds & Zero-Hallucination Fallback Policy

### 4.1 The 0.65 Cosine Similarity Hard Boundary
verelli.lol's core value proposition is **brutal data integrity**. Generic LLM flattery is the enemy.

```
Cosine Similarity = 1 - (embedding <=> query_embedding)
```

- **If Similarity $\ge 0.65$:**
  - Display the matched record with its exact database ID, verified numbers (e.g., exact Stripe MRR, exact capital burned), and literal quotes from the post-mortem.
- **If Similarity $< 0.65$ (No Direct Twins Found):**
  - **DO NOT** allow the LLM to invent a fake dead company or fake revenue figures.
  - The API and UI must trigger the **Graceful Fallback Card**:
    - **UI Badge:** `[✦ Uncharted Niche — Low Semantic Density]`
    - **Explanation:** *"No exact direct twins found in our 1,700+ YC graveyard records or 12,000+ Stripe-verified cohort with similarity > 65%."*
    - **Closest Adjacent Markets:** Display the highest relative matches clearly marked as *“Adjacent Horizon”* (e.g. 52% similarity).
    - **Pioneer Warning:** Advise the founder whether zero graveyard matches indicates an untapped blue ocean or a market where prior attempts were too obscure to raise venture capital.

---

## 5. Coding & Component Architectural Rules

### 5.1 Next.js 15 Client vs Server Boundaries
- Landing pages and marketing wrappers must be Server Components for maximum SEO and sub-100ms first paint.
- Interactive elements (Framer Motion hero floating cards, step-query modals `?step=...`, copy-to-clipboard, filter sliders) must be explicitly marked `'use client'`.
- URL query parameters (`?step=terms`, `?step=welcome`, `?step=input`) must drive the onboarding modal state to enable native back-button navigation and shareable onboarding links.

### 5.2 Clean Separation of Concerns
- Scrapers (`apps/api/app/scrapers/`) must never directly interact with the frontend; they write raw cleaned data to Supabase.
- The web app (`apps/web`) communicates solely through the versioned API endpoints (`/api/v1/validate`, `/api/v1/verdict/{id}`).

---

## 6. Strict AI Agent Boundaries & Operational Protocols

When AI coding assistants or developers work on this repository, the following protocol is mandatory:

1. **Step-by-Step Phase Execution:**
   - Always build exactly **one component or sub-phase at a time** as outlined in `phases.md`.
   - Never skip ahead or attempt to build the backend before Phase 1 frontend tokens and hero canvas are complete and verified.
2. **Immutable Design Tokens & DB Schema:**
   - **Do NOT** alter hex colors in `design.md` or Tailwind config without explicit approval from the user.
   - **Do NOT** alter PostgreSQL schemas, table names, or vector dimensions (`1536`) without explicit approval.
3. **Mandatory Memory Update Rule:**
   - Immediately upon creating, refactoring, or verifying any file, the AI must update `docs/memory.md` before returning the turn.
   - `memory.md` must accurately reflect:
     - Newly completed files
     - Active current component
     - Next upcoming task in `phases.md`
     - Log of architectural decisions made.

