# Supabase Database Architecture & pgvector Engine — verelli.lol

Production-grade PostgreSQL schema, `pgvector` HNSW index configurations, parameterized vector RPC functions, and seed migrations for **verelli.lol** (AI Pre-Build Startup Idea Validator).

---

## 1. Architectural Overview

```
                      [FastAPI / Next.js]
                               │
               OpenAI text-embedding-3-small
                     (1536-dim vector)
                               │
                               ▼
                    [Supabase PostgreSQL 15+]
                     ├── Extension: vector
                     │
                     ├── RPC: search_twins(vector, threshold, count)
                     │    ├── match_graveyard_startups()
                     │    │    └── Table: startups_graveyard
                     │    │         └── Index: idx_graveyard_embedding (HNSW)
                     │    │
                     │    └── match_profitable_startups()
                     │         └── Table: profitable_startups
                     │              └── Index: idx_profitable_embedding (HNSW)
                     │
                     └── Table: validation_reports (Cached verdicts & playbooks)
```

### Key Technical Specs
- **Vector Dimensions:** `1536` (matching OpenAI `text-embedding-3-small`).
- **Distance Operator:** Cosine Distance (`<=>`), where `Similarity = 1 - (embedding <=> query_embedding)`.
- **Index Type:** Hierarchical Navigable Small World (`HNSW`) with `m = 16, ef_construction = 64` targeting `< 15ms` p95 query latency across 15,000+ vector records.
- **Zero-Hallucination Threshold:** Hard boundary of `match_threshold >= 0.65`. Queries below `0.65` trigger the Uncharted Niche Diagnostic rather than returning hallucinated or irrelevant twins.

---

## 2. Directory Structure

```
supabase/
├── migrations/
│   └── 20261122000000_verelli_vector_init.sql  # Schema, HNSW indexes, RPC functions, RLS
├── seed.sql                                     # 24+ curated seed records with 1536d vectors
├── config.toml                                  # Supabase CLI local runtime configuration
└── README.md                                    # This engineering guide
```

---

## 3. Database Schema

### 3.1 `startups_graveyard`
Curated graveyard post-mortems from `Startups.RIP` (1,700+ YC & venture-backed failures).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique entity identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | Startup commercial name (e.g., "Convoy") |
| `slug` | `VARCHAR(255)` | `UNIQUE NOT NULL` | URL-safe identifier |
| `yc_batch` | `VARCHAR(32)` | `NULLABLE` | YC Batch code (e.g. "W18", "S21") |
| `founded_year` | `INT` | `NULLABLE` | Founding calendar year |
| `died_year` | `INT` | `NULLABLE` | Shutdown calendar year |
| `capital_raised_usd` | `NUMERIC(15, 2)` | `NULLABLE` | Total venture capital burned ($) |
| `primary_category` | `VARCHAR(128)` | `NULLABLE` | High-level industry sector |
| `pitch_summary` | `TEXT` | `NOT NULL` | Original value proposition pitch |
| `post_mortem_text` | `TEXT` | `NOT NULL` | Founder/investor post-mortem analysis |
| `failure_reasons` | `JSONB` | `NOT NULL` | Array of tags: `["high_cac", "no_pmf"]` |
| `source_url` | `TEXT` | `NULLABLE` | Link to canonical post-mortem |
| `embedding` | `vector(1536)` | `NULLABLE` | 1536d OpenAI text embedding |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record creation timestamp |

### 3.2 `profitable_startups`
Stripe-verified profitable SaaS businesses from `TrustMRR` (12,000+ indie & bootstrapped businesses).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique entity identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | Business name (e.g. "Bannerbear") |
| `slug` | `VARCHAR(255)` | `UNIQUE NOT NULL` | URL-safe identifier |
| `stripe_verified_mrr` | `NUMERIC(12, 2)` | `NOT NULL` | Live verified Monthly Recurring Revenue |
| `active_subscribers` | `INT` | `NULLABLE` | Number of active paying customers |
| `arpu` | `NUMERIC(10, 2)` | `NULLABLE` | Average Revenue Per User ($/mo) |
| `pricing_model` | `VARCHAR(64)` | `NULLABLE` | e.g. "usage_tiered", "seat_based" |
| `niche` | `VARCHAR(128)` | `NOT NULL` | Sub-market definition |
| `pitch_summary` | `TEXT` | `NOT NULL` | Value proposition & offering |
| `acquisition_channels` | `JSONB` | `NULLABLE` | Array of channels: `["seo", "twitter"]` |
| `verified_at` | `TIMESTAMPTZ` | `NOT NULL` | Timestamp of Stripe data verification |
| `live_url` | `TEXT` | `NULLABLE` | Live product URL |
| `embedding` | `vector(1536)` | `NULLABLE` | 1536d OpenAI text embedding |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record creation timestamp |

### 3.3 `validation_reports`
Permanent storage and caching for completed idea validation sessions and 48-hour playbooks.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Verdict session ID (`/verdict/:id`) |
| `idea_text` | `TEXT` | `NOT NULL` | Raw user startup idea input |
| `source_url` | `TEXT` | `NULLABLE` | Optional competitor or reference URL |
| `survival_score` | `INT` | `NOT NULL` | Calibrated survival probability (0–100) |
| `risk_level` | `VARCHAR(32)` | `NOT NULL` | "critical", "contested", "high_potential" |
| `graveyard_twins` | `JSONB` | `NOT NULL` | Top matched dead twins with scores |
| `cashflow_twins` | `JSONB` | `NOT NULL` | Top matched profitable twins with scores |
| `synthesis_report` | `JSONB` | `NOT NULL` | Complete LLM synthesis & 48h playbook |
| `query_embedding` | `vector(1536)` | `NULLABLE` | User idea embedding vector |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Submission timestamp |

---

## 4. Vector RPC Search Functions

All RPC search functions enforce the **Zero-Hallucination Hard Boundary** (`match_threshold >= 0.65` by default).

### 4.1 `match_graveyard_startups`
Retrieves top dead twins ranked by cosine similarity.
```sql
SELECT * FROM match_graveyard_startups(
    query_embedding := '[0.012, -0.045, ...]'::vector(1536),
    match_threshold := 0.65,
    match_count := 3
);
```

### 4.2 `match_profitable_startups`
Retrieves top Stripe-verified cashflow winners ranked by cosine similarity.
```sql
SELECT * FROM match_profitable_startups(
    query_embedding := '[0.012, -0.045, ...]'::vector(1536),
    match_threshold := 0.65,
    match_count := 3
);
```

### 4.3 `search_twins` (Unified Dual Match)
Executes dual semantic search across both tables and returns a unified JSON payload with execution metadata.
```sql
SELECT search_twins(
    query_embedding := '[0.012, -0.045, ...]'::vector(1536),
    match_threshold := 0.65,
    match_count := 3
);
```

**Unified JSON Output Contract:**
```json
{
  "graveyard_twins": [
    {
      "id": "00000000-0000-0000-0000-000000000004",
      "name": "Kite",
      "slug": "kite",
      "yc_batch": "W14",
      "died_year": 2022,
      "capital_raised_usd": 17000000.00,
      "primary_category": "Developer Tools & AI",
      "pitch_summary": "AI-powered code completion assistant...",
      "post_mortem_text": "We were 5 years too early...",
      "failure_reasons": ["too_early", "unwillingness_to_pay", "no_moat"],
      "source_url": "https://startups.rip/kite",
      "similarity": 0.7852
    }
  ],
  "cashflow_twins": [
    {
      "id": "00000000-0000-0000-0000-000000000106",
      "name": "ScreenshotOne",
      "slug": "screenshotone",
      "stripe_verified_mrr": 18200.00,
      "active_subscribers": 410,
      "arpu": 44.39,
      "pricing_model": "usage_based",
      "niche": "Developer Tools & Automation",
      "pitch_summary": "Render website screenshots via API...",
      "acquisition_channels": ["seo", "indie_hackers", "developer_blogs"],
      "live_url": "https://screenshotone.com",
      "similarity": 0.8140
    }
  ],
  "meta": {
    "match_threshold": 0.65,
    "match_count": 3,
    "graveyard_count": 1,
    "cashflow_count": 1,
    "is_uncharted_niche": false
  }
}
```

---

## 5. Local Setup & Migration Instructions

### Prerequisites
- Docker Desktop installed and running.
- Supabase CLI installed (`brew install supabase/tap/supabase` or `npm install -g supabase`).

### 5.1 Initialize & Apply Migrations
```bash
# 1. Start local Supabase container cluster (PostgreSQL, PostgREST, Studio)
supabase start

# 2. Reset database and run migrations + seed data
supabase db reset

# 3. Verify local services status
supabase status
```

Local Supabase Endpoints:
- **Studio Dashboard:** `http://localhost:54323`
- **PostgREST API URL:** `http://localhost:54321`
- **PostgreSQL Direct Connection:** `postgresql://postgres:postgres@localhost:54322/postgres`

### 5.2 Deploying to Supabase Cloud
```bash
# Link project to remote Supabase instance
supabase link --project-ref your-project-ref

# Push migrations to production database
supabase db push

# (Optional) Seed remote staging environment
supabase db remote commit
```

---

## 6. Connecting from FastAPI (`apps/api`)

The FastAPI backend uses the official asynchronous Supabase Python client (`supabase` or `httpx` direct to PostgREST).

### 6.1 Environment Configuration (`.env`)
```ini
SUPABASE_URL="http://localhost:54321"
SUPABASE_KEY="your-anon-or-service-role-key"
OPENAI_API_KEY="sk-..."
SIMILARITY_THRESHOLD=0.65
```

### 6.2 Dual Vector Query Service Implementation
```python
# apps/api/app/services/vector_matcher.py
from typing import Dict, Any, List
from supabase import create_client, Client
from app.core.config import settings
from app.models.schemas import DeadTwinSummary, CashflowTwinSummary

class VectorMatcherService:
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )

    async def search_twins(
        self,
        query_embedding: List[float],
        threshold: float = 0.65,
        count: int = 3
    ) -> Dict[str, Any]:
        """
        Executes unified dual vector match in Supabase pgvector.
        Enforces the 0.65 zero-hallucination threshold.
        """
        # Call parameterized PostgreSQL RPC function
        response = self.client.rpc(
            "search_twins",
            {
                "query_embedding": query_embedding,
                "match_threshold": threshold,
                "match_count": count
            }
        ).execute()

        payload = response.data
        graveyard_records = payload.get("graveyard_twins", [])
        cashflow_records = payload.get("cashflow_twins", [])
        meta = payload.get("meta", {})

        # Map to Pydantic models
        dead_twins = [
            DeadTwinSummary(
                name=r["name"],
                yc_batch=r.get("yc_batch"),
                died_year=r["died_year"],
                capital_burned=float(r.get("capital_raised_usd") or 0.0),
                fatal_flaw=r["failure_reasons"][0] if r.get("failure_reasons") else "Market collapse",
                post_mortem_quote=r["post_mortem_text"][:280] + "...",
                similarity_score=float(r["similarity"]),
                source_url=r.get("source_url")
            )
            for r in graveyard_records
        ]

        cashflow_twins = [
            CashflowTwinSummary(
                name=r["name"],
                verified_mrr=float(r["stripe_verified_mrr"]),
                subscribers_count=r.get("active_subscribers") or 0,
                pricing_tier=f"${r.get('arpu') or 0:.2f}/mo ({r.get('pricing_model') or 'Standard'})",
                primary_acquisition_channel=r["acquisition_channels"][0] if r.get("acquisition_channels") else "Direct",
                similarity_score=float(r["similarity"]),
                live_url=r.get("live_url")
            )
            for r in cashflow_records
        ]

        return {
            "dead_twins": dead_twins,
            "cashflow_twins": cashflow_twins,
            "is_uncharted_niche": meta.get("is_uncharted_niche", False)
        }
```

---

## 7. Performance & HNSW Index Tuning

### HNSW vs IVFFlat
We explicitly chose **HNSW** over **IVFFlat**:
- **Zero Training Required:** Unlike IVFFlat, HNSW builds incrementally as new post-mortems and Stripe records are scraped.
- **Low Query Latency:** Sub-15ms lookups at 99%+ recall.
- **Index Parameters:**
  - `m = 16`: Number of bi-directional links per node (balanced between memory and graph connectivity).
  - `ef_construction = 64`: Number of nearest neighbors evaluated during index building (ensures high clustering accuracy for business descriptions).

### Session Tuning in PostgreSQL
To optimize query performance for large batches in production:
```sql
-- Increase search beam width for higher recall if necessary
SET hnsw.ef_search = 40;

-- Optimize maintenance memory for fast index builds
SET maintenance_work_mem = '256MB';
```
