"""
Supabase Batch Seeder for Verelli.lol Intelligence Datasets.
Reads normalized startup post-mortems and Stripe-verified SaaS metrics,
generates 1536-dimensional embeddings in batches of 20 via embedding_service,
and upserts records into Supabase pgvector tables (startups_graveyard & profitable_startups).

Usage:
    python3 apps/api/scripts/seed_supabase.py --limit 50 --batch-size 20
    python3 apps/api/scripts/seed_supabase.py --dry-run
"""
import argparse
import asyncio
import json
import logging
import os
import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional
import httpx
import numpy as np

# Add apps/api to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings
from app.services.embedding_service import embedding_service
from scrapers.startups_rip import scrape_startups_rip, normalize_graveyard_record
from scrapers.trustmrr import scrape_trustmrr, normalize_profitable_record

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_supabase")

FIXTURES_DIR = Path(__file__).resolve().parent.parent / "fixtures"


def _construct_graveyard_embedding_text(record: Dict[str, Any]) -> str:
    """Combines semantic core fields for maximum pgvector retrieval accuracy."""
    return (
        f"{record['name']}. Category: {record.get('primary_category', 'Tech')}. "
        f"Pitch: {record.get('pitch_summary', '')} "
        f"Fatal flaw: {record.get('fatal_flaw', '')} "
        f"Post-mortem: {record.get('post_mortem_text', '')}"
    )


def _construct_profitable_embedding_text(record: Dict[str, Any]) -> str:
    """Combines business model and acquisition channels for vector matching."""
    return (
        f"{record['name']}. Niche: {record.get('niche', 'Micro-SaaS')}. "
        f"Pitch: {record.get('pitch_summary', '')} "
        f"Pricing: {record.get('pricing_tier', '')}. "
        f"Primary Acquisition Channel: {record.get('primary_acquisition_channel', '')}"
    )


async def vectorize_batch(
    records: List[Dict[str, Any]],
    text_extractor_fn,
    batch_index: int,
    total_batches: int,
) -> List[Dict[str, Any]]:
    """Generates 1536-dimensional normalized embeddings for a batch of records."""
    logger.info(f"Vectorizing batch {batch_index}/{total_batches} ({len(records)} records)...")
    vectorized_records = []

    for item in records:
        record_copy = dict(item)
        existing_vec = record_copy.get("embedding")

        # Reuse existing valid vector if present
        if existing_vec and isinstance(existing_vec, list) and len(existing_vec) == 1536:
            norm = np.linalg.norm(existing_vec)
            if 0.99 <= norm <= 1.01:
                vectorized_records.append(record_copy)
                continue

        embed_text = text_extractor_fn(record_copy)
        vec = await embedding_service.get_embedding(embed_text)
        record_copy["embedding"] = vec
        vectorized_records.append(record_copy)

    return vectorized_records


async def upsert_supabase_table(
    table_name: str,
    records: List[Dict[str, Any]],
    batch_size: int = 20,
) -> bool:
    """Upserts vectorized records into Supabase REST API via on_conflict=slug."""
    supabase_url = settings.SUPABASE_URL
    supabase_key = settings.effective_supabase_key

    if not supabase_url or not supabase_key:
        logger.warning(f"SUPABASE_URL or SUPABASE_KEY not configured. Skipping remote upload to {table_name}.")
        return False

    url = f"{supabase_url.rstrip('/')}/rest/v1/{table_name}?on_conflict=slug"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }

    total_records = len(records)
    num_batches = (total_records + batch_size - 1) // batch_size
    logger.info(f"Upserting {total_records} records to Supabase table '{table_name}' in {num_batches} batches...")

    success = True
    async with httpx.AsyncClient(timeout=30.0) as client:
        for b_idx in range(num_batches):
            batch = records[b_idx * batch_size : (b_idx + 1) * batch_size]
            try:
                res = await client.post(url, headers=headers, json=batch)
                if res.status_code in (200, 201, 204):
                    logger.info(f"  [{table_name}] Batch {b_idx + 1}/{num_batches} successfully upserted.")
                else:
                    logger.error(
                        f"  [{table_name}] Batch {b_idx + 1}/{num_batches} failed with status {res.status_code}: {res.text}"
                    )
                    success = False
            except Exception as e:
                logger.error(f"  [{table_name}] Batch {b_idx + 1}/{num_batches} encountered exception: {e}")
                success = False

    return success


def export_sql_seed(
    graveyard_records: List[Dict[str, Any]],
    profitable_records: List[Dict[str, Any]],
    output_path: Path,
) -> None:
    """Exports vectorized records into clean SQL INSERT ON CONFLICT DO UPDATE statements."""
    lines = [
        "-- ==============================================================================",
        "-- Verelli.lol Vector Seed Data (Auto-Generated via seed_supabase.py)",
        "-- ==============================================================================",
        "",
    ]

    # Startups Graveyard
    for r in graveyard_records:
        emb_str = f"'[{','.join(f'{x:.6f}' for x in r['embedding'])}]'::vector(1536)"
        esc_name = r["name"].replace("'", "''")
        esc_slug = r["slug"].replace("'", "''")
        esc_batch = f"'{r['yc_batch']}'" if r.get("yc_batch") else "NULL"
        esc_founded = str(r["founded_year"]) if r.get("founded_year") else "NULL"
        esc_died = str(r.get("died_year", 2020))
        esc_cap = str(r.get("capital_raised_usd", 0.0))
        esc_cat = r.get("primary_category", "").replace("'", "''")
        esc_pitch = r.get("pitch_summary", "").replace("'", "''")
        esc_pm = r.get("post_mortem_text", "").replace("'", "''")
        esc_reasons = json.dumps(r.get("failure_reasons", [])).replace("'", "''")
        esc_url = f"'{r.get('source_url', '')}'" if r.get("source_url") else "NULL"

        lines.append(
            f"INSERT INTO startups_graveyard (id, name, slug, yc_batch, founded_year, died_year, capital_raised_usd, "
            f"primary_category, pitch_summary, post_mortem_text, failure_reasons, source_url, embedding) "
            f"VALUES ('{r['id']}', '{esc_name}', '{esc_slug}', {esc_batch}, {esc_founded}, {esc_died}, {esc_cap}, "
            f"'{esc_cat}', '{esc_pitch}', '{esc_pm}', '{esc_reasons}'::jsonb, {esc_url}, {emb_str}) "
            f"ON CONFLICT (slug) DO UPDATE SET embedding = EXCLUDED.embedding, capital_raised_usd = EXCLUDED.capital_raised_usd;"
        )

    lines.append("")

    # Profitable Startups
    for r in profitable_records:
        emb_str = f"'[{','.join(f'{x:.6f}' for x in r['embedding'])}]'::vector(1536)"
        esc_name = r["name"].replace("'", "''")
        esc_slug = r["slug"].replace("'", "''")
        esc_mrr = str(r.get("stripe_verified_mrr", 0.0))
        esc_subs = str(r.get("active_subscribers", 0))
        esc_arpu = str(r.get("arpu", 0.0))
        esc_model = r.get("pricing_model", "tiered").replace("'", "''")
        esc_niche = r.get("niche", "").replace("'", "''")
        esc_pitch = r.get("pitch_summary", "").replace("'", "''")
        esc_channels = json.dumps(r.get("acquisition_channels", [])).replace("'", "''")
        esc_ver = r.get("verified_at", "2024-10-01T12:00:00Z")
        esc_url = f"'{r.get('live_url', '')}'" if r.get("live_url") else "NULL"

        lines.append(
            f"INSERT INTO profitable_startups (id, name, slug, stripe_verified_mrr, active_subscribers, arpu, "
            f"pricing_model, niche, pitch_summary, acquisition_channels, verified_at, live_url, embedding) "
            f"VALUES ('{r['id']}', '{esc_name}', '{esc_slug}', {esc_mrr}, {esc_subs}, {esc_arpu}, "
            f"'{esc_model}', '{esc_niche}', '{esc_pitch}', '{esc_channels}'::jsonb, '{esc_ver}', {esc_url}, {emb_str}) "
            f"ON CONFLICT (slug) DO UPDATE SET embedding = EXCLUDED.embedding, stripe_verified_mrr = EXCLUDED.stripe_verified_mrr;"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    logger.info(f"SQL seed statements exported to: {output_path}")


async def run_seeder(
    limit: int = 50,
    batch_size: int = 20,
    graveyard_file: Optional[str] = None,
    profitable_file: Optional[str] = None,
    dry_run: bool = False,
    generate_sql: Optional[str] = None,
) -> bool:
    """Main orchestration pipeline for vectorizing and seeding datasets."""
    print("=" * 80)
    print(" VERELLI.LOL — SUPABASE BATCH VECTOR SEEDER")
    print("=" * 80)

    # 1. Load or Scrape Graveyard Records
    graveyard_records: List[Dict[str, Any]] = []
    if graveyard_file and Path(graveyard_file).exists():
        logger.info(f"Loading graveyard records from custom file: {graveyard_file}")
        with open(graveyard_file, "r", encoding="utf-8") as f:
            raw = json.load(f)
            graveyard_records = [normalize_graveyard_record(r) for r in raw][:limit]
    else:
        logger.info(f"Invoking Startups.RIP scraper pipeline (limit: {limit})...")
        graveyard_records = scrape_startups_rip(limit=limit)

    # Fallback to sample fixture if empty
    if not graveyard_records:
        sample_path = FIXTURES_DIR / "startups_rip_sample.json"
        if sample_path.exists():
            with open(sample_path, "r", encoding="utf-8") as f:
                graveyard_records = json.load(f)[:limit]

    # 2. Load or Scrape Profitable Records
    profitable_records: List[Dict[str, Any]] = []
    if profitable_file and Path(profitable_file).exists():
        logger.info(f"Loading profitable records from custom file: {profitable_file}")
        with open(profitable_file, "r", encoding="utf-8") as f:
            raw = json.load(f)
            profitable_records = [normalize_profitable_record(r) for r in raw][:limit]
    else:
        logger.info(f"Invoking TrustMRR scraper pipeline (limit: {limit})...")
        profitable_records = scrape_trustmrr(limit=limit)

    # Fallback to sample fixture if empty
    if not profitable_records:
        sample_path = FIXTURES_DIR / "trustmrr_sample.json"
        if sample_path.exists():
            with open(sample_path, "r", encoding="utf-8") as f:
                profitable_records = json.load(f)[:limit]

    logger.info(f"Loaded {len(graveyard_records)} graveyard records and {len(profitable_records)} profitable records.")

    # 3. Vectorize Graveyard Records in Batches of 20
    print("\n--- Phase A: Vectorizing Startups.RIP Graveyard (1536d) ---")
    g_batches = (len(graveyard_records) + batch_size - 1) // batch_size
    vectorized_graveyard: List[Dict[str, Any]] = []

    for b in range(g_batches):
        batch = graveyard_records[b * batch_size : (b + 1) * batch_size]
        res = await vectorize_batch(
            batch,
            _construct_graveyard_embedding_text,
            batch_index=b + 1,
            total_batches=g_batches,
        )
        vectorized_graveyard.extend(res)

    # 4. Vectorize Profitable Records in Batches of 20
    print("\n--- Phase B: Vectorizing TrustMRR Micro-SaaS (1536d) ---")
    p_batches = (len(profitable_records) + batch_size - 1) // batch_size
    vectorized_profitable: List[Dict[str, Any]] = []

    for b in range(p_batches):
        batch = profitable_records[b * batch_size : (b + 1) * batch_size]
        res = await vectorize_batch(
            batch,
            _construct_profitable_embedding_text,
            batch_index=b + 1,
            total_batches=p_batches,
        )
        vectorized_profitable.extend(res)

    # 5. Verify Vector Norms and Dimensions
    all_vecs = [r["embedding"] for r in vectorized_graveyard + vectorized_profitable]
    valid_dims = all(len(v) == 1536 for v in all_vecs)
    valid_norms = all(0.99 <= np.linalg.norm(v) <= 1.01 for v in all_vecs)
    logger.info(f"Vector sanity check: Dimensions=1536 ({valid_dims}), Unit Norms Verified ({valid_norms})")

    # 6. Export SQL if requested
    if generate_sql:
        sql_path = Path(generate_sql).resolve()
        export_sql_seed(vectorized_graveyard, vectorized_profitable, sql_path)

    # 7. Upsert to Supabase
    if dry_run:
        print("\n--- Dry Run Completed: Vectors verified, skipping external HTTP requests ---")
        return True

    print("\n--- Phase C: Upserting to Supabase pgvector Database ---")
    if not settings.SUPABASE_URL or not settings.effective_supabase_key:
        logger.warning(
            "SUPABASE_URL and SUPABASE_KEY/SUPABASE_SERVICE_ROLE_KEY are unset. "
            "Local vectorization and dataset validation completed successfully. "
            "To deploy live to Supabase, provide credentials in .env."
        )
        return True

    g_ok = await upsert_supabase_table("startups_graveyard", vectorized_graveyard, batch_size)
    p_ok = await upsert_supabase_table("profitable_startups", vectorized_profitable, batch_size)

    if g_ok and p_ok:
        logger.info("All records successfully seeded to Supabase!")
        return True
    else:
        logger.warning("One or more Supabase batch upserts encountered errors.")
        return False


def main():
    parser = argparse.ArgumentParser(description="Supabase Batch Seeder for Verelli.lol")
    parser.add_argument("--limit", type=int, default=50, help="Maximum records to process per dataset (default: 50)")
    parser.add_argument("--batch-size", type=int, default=20, help="Batch size for vectorization and upsert (default: 20)")
    parser.add_argument("--graveyard-file", type=str, default=None, help="Path to input graveyard JSON file")
    parser.add_argument("--profitable-file", type=str, default=None, help="Path to input profitable JSON file")
    parser.add_argument("--dry-run", action="store_true", help="Validate and vectorize without uploading to Supabase")
    parser.add_argument("--generate-sql", type=str, default=None, help="Export SQL file with batch INSERT statements")

    args = parser.parse_args()

    success = asyncio.run(
        run_seeder(
            limit=args.limit,
            batch_size=args.batch_size,
            graveyard_file=args.graveyard_file,
            profitable_file=args.profitable_file,
            dry_run=args.dry_run,
            generate_sql=args.generate_sql,
        )
    )

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
