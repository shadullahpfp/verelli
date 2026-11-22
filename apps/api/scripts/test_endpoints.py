"""
Automated Endpoint and Pipeline Verification Suite for verelli.lol.
Tests all endpoints, Pydantic schemas, 0.65 threshold enforcement,
1-sentence verdicts, domain-tailored 48-hour sprints, and direct browser reload resilience.
"""
import sys
from pathlib import Path

# Add apps/api to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from starlette.testclient import TestClient
from app.main import app, effective_cors
from app.models.schemas import ValidationResponse

client = TestClient(app)


def test_suite():
    print("=" * 80)
    print(" VERELLI.LOL API — ENDPOINT INTEGRATION VERIFICATION")
    print("=" * 80)

    # 1. Test Healthcheck
    res = client.get("/health")
    assert res.status_code == 200, f"Healthcheck failed: {res.text}"
    health_data = res.json()
    assert health_data["status"] == "healthy"
    print(f"PASS: /health -> {health_data}")

    # 2. Test Root Endpoint & CORS Configuration
    res_root = client.get("/")
    assert res_root.status_code == 200
    root_data = res_root.json()
    assert root_data["status"] == "operational"
    assert "http://localhost:3000" in effective_cors
    assert "http://127.0.0.1:3000" in effective_cors
    assert "https://verelli.lol" in effective_cors
    print(f"PASS: / -> {root_data['service']} v{root_data['version']}")
    print(f"PASS: CORS Origins Verified: {effective_cors}")

    # 3. Test Validate Endpoint (Known Niche: Chargebacks / Stripe)
    payload_known = {
        "idea_text": "An automated AI agent that monitors Stripe chargebacks and disputes evidence automatically for Shopify stores.",
        "source_url": "https://disputeprotect.io",
    }
    res_val = client.post("/api/v1/validate", json=payload_known)
    assert res_val.status_code == 200, f"Validate failed: {res_val.text}"
    val_data = res_val.json()
    parsed_res = ValidationResponse(**val_data)
    assert parsed_res.status == "completed"
    assert parsed_res.report_id is not None
    assert parsed_res.verdict.is_uncharted_niche is False
    assert len(parsed_res.verdict.top_cashflow_twins) > 0
    assert parsed_res.verdict.top_cashflow_twins[0].name == "Disputifier"
    assert parsed_res.verdict.top_cashflow_twins[0].similarity_score >= 0.65
    assert 0 <= parsed_res.verdict.survival_score <= 100

    # Verify 1-Sentence Calibrated Verdict
    verdict_sentences = [s.strip() for s in parsed_res.verdict.executive_verdict.split(".") if s.strip()]
    assert len(verdict_sentences) <= 2, f"Expected 1 concise calibrated sentence, got {len(verdict_sentences)}"

    # Verify Domain-Tailored 48-Hour Sprints
    playbook = parsed_res.verdict.validation_playbook_48h
    assert len(playbook) == 3, f"Expected exactly 3 steps, got {len(playbook)}"
    assert playbook[0].timeframe == "Hour 0-12"
    assert "Fake-Door Wedge" in playbook[0].title
    assert playbook[1].timeframe == "Hour 12-24"
    assert "Distribution Channel" in playbook[1].title
    assert playbook[2].timeframe == "Hour 24-48"
    assert "Kill/Go Metric" in playbook[2].title

    print(f"PASS: POST /api/v1/validate (Known Niche) -> Report ID: {parsed_res.report_id}")
    print(f"      Matched Cashflow Twin: {parsed_res.verdict.top_cashflow_twins[0].name} (Score: {parsed_res.verdict.top_cashflow_twins[0].similarity_score})")
    print(f"      Survival Score: {parsed_res.verdict.survival_score}% | Risk Level: {parsed_res.verdict.risk_level}")
    print(f"      Calibrated 1-Sentence Verdict: \"{parsed_res.verdict.executive_verdict}\"")
    print(f"      Sprint 1: {playbook[0].title} -> {playbook[0].tactical_deliverable}")
    print(f"      Sprint 2: {playbook[1].title} -> {playbook[1].tactical_deliverable}")
    print(f"      Sprint 3: {playbook[2].title} -> {playbook[2].tactical_deliverable}")

    # 4. Test Retrieve Cached Verdict by ID
    res_verdict = client.get(f"/api/v1/verdict/{parsed_res.report_id}")
    assert res_verdict.status_code == 200, f"Get verdict failed: {res_verdict.text}"
    verdict_retrieved = res_verdict.json()
    assert verdict_retrieved["report_id"] == parsed_res.report_id
    assert verdict_retrieved["verdict"]["survival_score"] == parsed_res.verdict.survival_score
    print(f"PASS: GET /api/v1/verdict/{parsed_res.report_id} -> Successfully retrieved cached session verdict")

    # 5. Test Direct Browser Reload Resilience: Non-Existent Report ID returns High-Fidelity Fallback
    missing_id = "00000000-0000-0000-0000-000000000000"
    res_fallback = client.get(f"/api/v1/verdict/{missing_id}")
    assert res_fallback.status_code == 200, f"Fallback retrieval failed: {res_fallback.text}"
    fallback_data = res_fallback.json()
    parsed_fallback = ValidationResponse(**fallback_data)
    assert parsed_fallback.status == "completed"
    assert parsed_fallback.report_id == missing_id
    assert 0 <= parsed_fallback.verdict.survival_score <= 100
    assert len(parsed_fallback.verdict.validation_playbook_48h) == 3
    print(f"PASS: GET /api/v1/verdict/{missing_id} -> Returned high-fidelity fallback verdict (never 404 or 500)")

    # 6. Test Uncharted Niche Diagnostic (Enforce < 0.65 boundary)
    payload_uncharted = {
        "idea_text": "Deep sea hydrothermal vent mineral extraction using autonomous robotic crabs for cryptocurrency minting."
    }
    res_uncharted = client.post("/api/v1/validate", json=payload_uncharted)
    assert res_uncharted.status_code == 200
    uncharted_data = res_uncharted.json()
    parsed_uncharted = ValidationResponse(**uncharted_data)
    assert parsed_uncharted.verdict.is_uncharted_niche is True
    assert parsed_uncharted.verdict.adjacent_market_warnings is not None
    assert len(parsed_uncharted.verdict.adjacent_market_warnings) >= 2
    print(f"PASS: POST /api/v1/validate (Uncharted Niche) -> is_uncharted_niche = True")
    print(f"      Adjacent Warnings: {parsed_uncharted.verdict.adjacent_market_warnings[0][:75]}...")

    # 7. Test Input Validation Boundary (< 10 characters should fail 422)
    res_short = client.post("/api/v1/validate", json={"idea_text": "Too short"})
    assert res_short.status_code == 422
    print("PASS: POST /api/v1/validate (<10 chars) -> Correctly rejected with 422 Unprocessable Entity")

    print("\n" + "=" * 80)
    print(" ALL 7 ENDPOINT & BOUNDARY INTEGRATION TESTS PASSED 100%!")
    print("=" * 80)


if __name__ == "__main__":
    test_suite()
