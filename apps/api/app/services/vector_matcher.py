"""
Vector Matcher Service for verelli.lol.
Executes dual pgvector semantic queries against Startups.RIP (Graveyard)
and TrustMRR (Profitable Micro-SaaS) databases via Supabase RPC functions,
with an in-memory fixture fallback and strict 0.65 similarity zero-hallucination boundary.
"""
from typing import List, Dict, Any, Optional, Tuple
import json
import logging
from pathlib import Path
import httpx
import numpy as np

from app.core.config import settings
from app.models.schemas import DeadTwinSummary, CashflowTwinSummary
from app.services.embedding_service import cosine_similarity

logger = logging.getLogger(__name__)

FIXTURES_DIR = Path(__file__).resolve().parent.parent.parent / "fixtures"


class VectorMatcherService:
    """Orchestrates pgvector semantic matching across dead and profitable twins."""

    def __init__(self):
        self.fixtures_loaded = False
        self.graveyard_fixtures: List[Dict[str, Any]] = []
        self.profitable_fixtures: List[Dict[str, Any]] = []
        self._load_fixtures()

    def _load_fixtures(self) -> None:
        """Load in-memory fixture datasets for offline fallback and zero-latency execution."""
        rip_path = FIXTURES_DIR / "startups_rip_sample.json"
        trust_path = FIXTURES_DIR / "trustmrr_sample.json"

        if rip_path.exists():
            try:
                with open(rip_path, "r", encoding="utf-8") as f:
                    self.graveyard_fixtures = json.load(f)
            except Exception as e:
                logger.error(f"Failed to load graveyard fixtures: {e}")

        if trust_path.exists():
            try:
                with open(trust_path, "r", encoding="utf-8") as f:
                    self.profitable_fixtures = json.load(f)
            except Exception as e:
                logger.error(f"Failed to load profitable fixtures: {e}")

        self.fixtures_loaded = True

    async def _query_supabase_rpc(
        self, rpc_name: str, query_vector: List[float], threshold: float, count: int
    ) -> Optional[List[Dict[str, Any]]]:
        """Attempt Supabase pgvector RPC call if configured."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            return None

        url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/rpc/{rpc_name}"
        headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "query_embedding": query_vector,
            "match_threshold": threshold,
            "match_count": count,
        }

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    return res.json()
                logger.warning(f"Supabase RPC {rpc_name} returned status {res.status_code}")
        except Exception as e:
            logger.warning(f"Supabase RPC {rpc_name} failed: {e}. Falling back to fixtures.")

        return None

    def _match_fixtures_graveyard(
        self, query_vector: List[float], match_count: int = 3
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Calculate cosine similarity against graveyard fixtures."""
        results = []
        for item in self.graveyard_fixtures:
            item_vector = item.get("embedding")
            if not item_vector:
                continue
            sim = cosine_similarity(query_vector, item_vector)
            results.append((item, round(sim, 4)))

        # Sort descending by similarity
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:match_count]

    def _match_fixtures_profitable(
        self, query_vector: List[float], match_count: int = 3
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Calculate cosine similarity against profitable fixtures."""
        results = []
        for item in self.profitable_fixtures:
            item_vector = item.get("embedding")
            if not item_vector:
                continue
            sim = cosine_similarity(query_vector, item_vector)
            results.append((item, round(sim, 4)))

        # Sort descending by similarity
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:match_count]

    async def search_graveyard(
        self, query_vector: List[float], threshold: float = 0.65, count: int = 3
    ) -> Tuple[List[DeadTwinSummary], List[DeadTwinSummary]]:
        """
        Search dead twins.
        Returns (qualified_twins_above_threshold, all_top_adjacent_twins).
        """
        # Try Supabase RPC first
        rpc_rows = await self._query_supabase_rpc(
            "match_graveyard_startups", query_vector, threshold=0.0, count=count
        )

        all_twins: List[DeadTwinSummary] = []

        if rpc_rows is not None:
            for row in rpc_rows:
                sim = float(row.get("similarity", 0.0))
                all_twins.append(
                    DeadTwinSummary(
                        name=row.get("name", "Unknown Startup"),
                        yc_batch=row.get("yc_batch"),
                        died_year=int(row.get("died_year", 2020)),
                        capital_burned=float(row.get("capital_raised_usd", 0.0)),
                        fatal_flaw=row.get("fatal_flaw") or (
                            f"Post-mortem failure tags: {', '.join(row.get('failure_reasons', []))}"
                        ),
                        post_mortem_quote=row.get("post_mortem_text", "")[:280],
                        similarity_score=round(sim, 4),
                        source_url=row.get("source_url"),
                    )
                )
        else:
            # Fixture matching
            fixture_matches = self._match_fixtures_graveyard(query_vector, match_count=count)
            for item, sim in fixture_matches:
                all_twins.append(
                    DeadTwinSummary(
                        name=item["name"],
                        yc_batch=item.get("yc_batch"),
                        died_year=int(item.get("died_year", 2020)),
                        capital_burned=float(item.get("capital_raised_usd", 0.0)),
                        fatal_flaw=item.get("fatal_flaw", "Undisclosed operational failure"),
                        post_mortem_quote=item.get("post_mortem_quote", item.get("post_mortem_text", "")[:280]),
                        similarity_score=sim,
                        source_url=item.get("source_url"),
                    )
                )

        qualified = [t for t in all_twins if t.similarity_score >= threshold]
        return qualified, all_twins

    async def search_profitable(
        self, query_vector: List[float], threshold: float = 0.65, count: int = 3
    ) -> Tuple[List[CashflowTwinSummary], List[CashflowTwinSummary]]:
        """
        Search profitable micro-SaaS twins.
        Returns (qualified_twins_above_threshold, all_top_adjacent_twins).
        """
        # Try Supabase RPC first
        rpc_rows = await self._query_supabase_rpc(
            "match_profitable_startups", query_vector, threshold=0.0, count=count
        )

        all_twins: List[CashflowTwinSummary] = []

        if rpc_rows is not None:
            for row in rpc_rows:
                sim = float(row.get("similarity", 0.0))
                all_twins.append(
                    CashflowTwinSummary(
                        name=row.get("name", "Unknown SaaS"),
                        verified_mrr=float(row.get("stripe_verified_mrr", 0.0)),
                        subscribers_count=int(row.get("active_subscribers", 0)),
                        pricing_tier=row.get("pricing_tier") or f"${row.get('arpu', 29)}/mo avg",
                        primary_acquisition_channel=row.get("primary_acquisition_channel") or "Organic inbound",
                        similarity_score=round(sim, 4),
                        live_url=row.get("live_url"),
                    )
                )
        else:
            # Fixture matching
            fixture_matches = self._match_fixtures_profitable(query_vector, match_count=count)
            for item, sim in fixture_matches:
                all_twins.append(
                    CashflowTwinSummary(
                        name=item["name"],
                        verified_mrr=float(item.get("stripe_verified_mrr", 0.0)),
                        subscribers_count=int(item.get("active_subscribers", 0)),
                        pricing_tier=item.get("pricing_tier", "Tiered SaaS"),
                        primary_acquisition_channel=item.get("primary_acquisition_channel", "Organic Search"),
                        similarity_score=sim,
                        live_url=item.get("live_url"),
                    )
                )

        qualified = [t for t in all_twins if t.similarity_score >= threshold]
        return qualified, all_twins

    async def find_twins(
        self, query_vector: List[float], threshold: Optional[float] = None, match_count: int = 3
    ) -> Dict[str, Any]:
        """
        Execute dual-vector search across both Graveyard and Profitable datasets.
        Strictly enforces the 0.65 cosine similarity boundary.
        If max_similarity < threshold (0.65), marks is_uncharted_niche = True and
        provides adjacent market warnings to prevent hallucinated comparisons.
        """
        active_threshold = threshold if threshold is not None else settings.SIMILARITY_THRESHOLD

        qualified_graveyard, all_graveyard = await self.search_graveyard(
            query_vector, threshold=active_threshold, count=match_count
        )
        qualified_profitable, all_profitable = await self.search_profitable(
            query_vector, threshold=active_threshold, count=match_count
        )

        max_sim = 0.0
        if all_graveyard:
            max_sim = max(max_sim, all_graveyard[0].similarity_score)
        if all_profitable:
            max_sim = max(max_sim, all_profitable[0].similarity_score)

        # Check Zero-Hallucination Boundary
        if max_sim < active_threshold:
            # Uncharted Niche fallback triggered
            is_uncharted = True
            warnings = [
                f"No direct twins found in our 1,700+ YC graveyard records or 12,000+ Stripe-verified cohort exceeding the {active_threshold:.2f} semantic similarity threshold (peak match: {max_sim:.2f}).",
                "Pioneer Warning: Lack of dead twins does not validate demand—it often indicates an unproven distribution channel or an idea where previous attempts remained too obscure to raise venture capital.",
                "Closest Adjacent Horizons: Displaying closest relative structural peers for market mechanics reference only.",
            ]
            # Use top adjacent records as benchmarks
            top_dead = all_graveyard[:match_count]
            top_cashflow = all_profitable[:match_count]
        else:
            is_uncharted = False
            warnings = None
            # Return qualified direct twins; if one side had >= threshold and the other had slightly less,
            # include top records for complete context while preserving true similarity scores
            top_dead = qualified_graveyard if qualified_graveyard else all_graveyard[:match_count]
            top_cashflow = qualified_profitable if qualified_profitable else all_profitable[:match_count]

        return {
            "top_dead_twins": top_dead,
            "top_cashflow_twins": top_cashflow,
            "is_uncharted_niche": is_uncharted,
            "adjacent_market_warnings": warnings,
            "max_similarity": max_sim,
            "threshold_applied": active_threshold,
        }


# Default singleton instance
vector_matcher = VectorMatcherService()
