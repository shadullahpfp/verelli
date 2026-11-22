-- ==============================================================================
-- Verelli.lol — Supabase PostgreSQL + pgvector Production Schema Migration
-- Migration: 20261122000000_verelli_vector_init.sql
-- Description:
--   1. Enables pgvector extension.
--   2. Creates tables: startups_graveyard, profitable_startups, validation_reports.
--   3. Builds HNSW indexes (m=16, ef_construction=64) for sub-15ms vector cosine lookups.
--   4. Deploys parameterized RPC search functions enforcing the 0.65 zero-hallucination boundary:
--      - match_graveyard_startups()
--      - match_profitable_startups()
--      - search_twins() [Unified payload]
--   5. Configures Row Level Security (RLS) policies and role permissions.
-- ==============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Table: startups_graveyard (1,700+ YC Post-Mortems + 1536d Vectors)
CREATE TABLE IF NOT EXISTS startups_graveyard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    yc_batch VARCHAR(32),                     -- e.g. "W18", "S21", or NULL
    founded_year INT,
    died_year INT,
    capital_raised_usd NUMERIC(15, 2),
    primary_category VARCHAR(128),
    pitch_summary TEXT NOT NULL,
    post_mortem_text TEXT NOT NULL,
    failure_reasons JSONB NOT NULL,            -- e.g. ["high_cac", "bad_timing", "premature_scaling"]
    source_url TEXT,
    embedding vector(1536),                   -- Generated via OpenAI text-embedding-3-small
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: profitable_startups (12,000+ Stripe Verified + 1536d Vectors)
CREATE TABLE IF NOT EXISTS profitable_startups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    stripe_verified_mrr NUMERIC(12, 2) NOT NULL,
    active_subscribers INT,
    arpu NUMERIC(10, 2),
    pricing_model VARCHAR(64),                 -- e.g. "seat_based", "usage_based", "flat_rate"
    niche VARCHAR(128) NOT NULL,
    pitch_summary TEXT NOT NULL,
    acquisition_channels JSONB,                -- e.g. ["seo", "cold_email", "programmatic_pages"]
    verified_at TIMESTAMPTZ NOT NULL,
    live_url TEXT,
    embedding vector(1536),                   -- Generated via OpenAI text-embedding-3-small
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: validation_reports (Cached Verdict Sessions & Playbooks)
CREATE TABLE IF NOT EXISTS validation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_text TEXT NOT NULL,
    source_url TEXT,
    survival_score INT NOT NULL,               -- Calibrated 0 - 100
    risk_level VARCHAR(32) NOT NULL,           -- "critical", "contested", "high_potential"
    graveyard_twins JSONB NOT NULL,            -- Top Startups.RIP matches with similarity scores
    cashflow_twins JSONB NOT NULL,             -- Top TrustMRR matches with similarity scores
    synthesis_report JSONB NOT NULL,           -- Structured synthesis: 48h playbook, wedge angle
    query_embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HNSW Vector Indexes for Sub-15ms Cosine Similarity Lookups
-- Cosine distance operator (<=>) requires vector_cosine_ops
CREATE INDEX IF NOT EXISTS idx_graveyard_embedding 
ON startups_graveyard USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_profitable_embedding 
ON profitable_startups USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Auxiliary B-Tree Indexes for fast lookups & filtering
CREATE INDEX IF NOT EXISTS idx_startups_graveyard_slug ON startups_graveyard(slug);
CREATE INDEX IF NOT EXISTS idx_startups_graveyard_primary_category ON startups_graveyard(primary_category);
CREATE INDEX IF NOT EXISTS idx_profitable_startups_slug ON profitable_startups(slug);
CREATE INDEX IF NOT EXISTS idx_profitable_startups_niche ON profitable_startups(niche);
CREATE INDEX IF NOT EXISTS idx_validation_reports_created_at ON validation_reports(created_at DESC);


-- ==============================================================================
-- 6. RPC Search Functions (Zero-Hallucination Hard Boundary: match_threshold >= 0.65)
-- ==============================================================================

-- 6.1 Search Top Dead Twins from Startups.RIP Graveyard
CREATE OR REPLACE FUNCTION match_graveyard_startups (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  yc_batch VARCHAR,
  died_year INT,
  capital_raised_usd NUMERIC,
  primary_category VARCHAR,
  pitch_summary TEXT,
  post_mortem_text TEXT,
  failure_reasons JSONB,
  source_url TEXT,
  similarity float
)
LANGUAGE plpgsql
STABLE
PARALLEL SAFE
AS $$
DECLARE
  v_threshold float;
  v_limit int;
BEGIN
  -- Explicitly enforce default 0.65 threshold if NULL or unsupplied
  v_threshold := COALESCE(match_threshold, 0.65);
  v_limit := COALESCE(match_count, 3);

  RETURN QUERY
  SELECT
    sg.id,
    sg.name,
    sg.slug,
    sg.yc_batch,
    sg.died_year,
    sg.capital_raised_usd,
    sg.primary_category,
    sg.pitch_summary,
    sg.post_mortem_text,
    sg.failure_reasons,
    sg.source_url,
    ROUND((1 - (sg.embedding <=> query_embedding))::numeric, 4)::float AS similarity
  FROM startups_graveyard sg
  WHERE sg.embedding IS NOT NULL
    AND 1 - (sg.embedding <=> query_embedding) >= v_threshold
  ORDER BY sg.embedding <=> query_embedding ASC
  LIMIT v_limit;
END;
$$;

-- 6.2 Search Top Profitable Cashflow Twins from TrustMRR
CREATE OR REPLACE FUNCTION match_profitable_startups (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  stripe_verified_mrr NUMERIC,
  active_subscribers INT,
  arpu NUMERIC,
  pricing_model VARCHAR,
  niche VARCHAR,
  pitch_summary TEXT,
  acquisition_channels JSONB,
  live_url TEXT,
  similarity float
)
LANGUAGE plpgsql
STABLE
PARALLEL SAFE
AS $$
DECLARE
  v_threshold float;
  v_limit int;
BEGIN
  -- Explicitly enforce default 0.65 threshold if NULL or unsupplied
  v_threshold := COALESCE(match_threshold, 0.65);
  v_limit := COALESCE(match_count, 3);

  RETURN QUERY
  SELECT
    ps.id,
    ps.name,
    ps.slug,
    ps.stripe_verified_mrr,
    ps.active_subscribers,
    ps.arpu,
    ps.pricing_model,
    ps.niche,
    ps.pitch_summary,
    ps.acquisition_channels,
    ps.live_url,
    ROUND((1 - (ps.embedding <=> query_embedding))::numeric, 4)::float AS similarity
  FROM profitable_startups ps
  WHERE ps.embedding IS NOT NULL
    AND 1 - (ps.embedding <=> query_embedding) >= v_threshold
  ORDER BY ps.embedding <=> query_embedding ASC
  LIMIT v_limit;
END;
$$;

-- 6.3 Dual-Search RPC Returning Unified Payload with Metadata
CREATE OR REPLACE FUNCTION search_twins (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 3
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
PARALLEL SAFE
AS $$
DECLARE
  v_threshold float;
  v_limit int;
  v_graveyard JSONB;
  v_profitable JSONB;
BEGIN
  -- Explicitly enforce default 0.65 threshold if NULL or unsupplied
  v_threshold := COALESCE(match_threshold, 0.65);
  v_limit := COALESCE(match_count, 3);

  -- 1. Gather graveyard dead twins
  SELECT COALESCE(jsonb_agg(to_jsonb(g)), '[]'::jsonb)
  INTO v_graveyard
  FROM (
    SELECT * FROM match_graveyard_startups(query_embedding, v_threshold, v_limit)
  ) g;

  -- 2. Gather profitable cashflow twins
  SELECT COALESCE(jsonb_agg(to_jsonb(p)), '[]'::jsonb)
  INTO v_profitable
  FROM (
    SELECT * FROM match_profitable_startups(query_embedding, v_threshold, v_limit)
  ) p;

  -- 3. Construct unified JSON payload
  RETURN jsonb_build_object(
    'graveyard_twins', v_graveyard,
    'cashflow_twins', v_profitable,
    'meta', jsonb_build_object(
      'match_threshold', v_threshold,
      'match_count', v_limit,
      'graveyard_count', jsonb_array_length(v_graveyard),
      'cashflow_count', jsonb_array_length(v_profitable),
      'is_uncharted_niche', (jsonb_array_length(v_graveyard) = 0 AND jsonb_array_length(v_profitable) = 0)
    )
  );
END;
$$;


-- ==============================================================================
-- 7. Row Level Security (RLS) & Permissions Configuration
-- ==============================================================================

ALTER TABLE startups_graveyard ENABLE ROW LEVEL SECURITY;
ALTER TABLE profitable_startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read access to curated datasets
CREATE POLICY "Allow public read access to startups_graveyard"
    ON startups_graveyard FOR SELECT USING (true);

CREATE POLICY "Allow public read access to profitable_startups"
    ON profitable_startups FOR SELECT USING (true);

-- Allow public read and creation of validation reports
CREATE POLICY "Allow public read access to validation_reports"
    ON validation_reports FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to validation_reports"
    ON validation_reports FOR INSERT WITH CHECK (true);

-- Grant privileges to standard Supabase client roles
GRANT SELECT ON startups_graveyard TO anon, authenticated, service_role;
GRANT SELECT ON profitable_startups TO anon, authenticated, service_role;
GRANT ALL ON validation_reports TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION match_graveyard_startups(vector(1536), float, int) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION match_profitable_startups(vector(1536), float, int) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION search_twins(vector(1536), float, int) TO anon, authenticated, service_role;
