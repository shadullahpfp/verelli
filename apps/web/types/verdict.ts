/**
 * TypeScript types for verelli.lol verdict intelligence.
 * Strictly mirrors apps/api/app/models/schemas.py.
 */

export interface DeadTwinSummary {
  name: string;
  yc_batch?: string | null;
  died_year: number;
  capital_burned: number;
  fatal_flaw: string;
  post_mortem_quote: string;
  similarity_score: number;
  source_url?: string | null;
}

export interface CashflowTwinSummary {
  name: string;
  verified_mrr: number;
  subscribers_count: number;
  pricing_tier: string;
  primary_acquisition_channel: string;
  similarity_score: number;
  live_url?: string | null;
}

export interface ActionablePlaybookStep {
  timeframe: string;
  title: string;
  description: string;
  tactical_deliverable: string;
}

export interface VerdictReportSchema {
  survival_score: number;
  risk_level: string;
  executive_verdict: string;
  top_dead_twins: DeadTwinSummary[];
  top_cashflow_twins: CashflowTwinSummary[];
  deadly_pitfalls_to_avoid: string[];
  wedge_differentiation_angle: string;
  validation_playbook_48h: ActionablePlaybookStep[];
  is_uncharted_niche: boolean;
  adjacent_market_warnings?: string[] | null;
}

export interface ValidationResponse {
  report_id: string;
  status: string;
  verdict: VerdictReportSchema;
}

export interface StoredVerdictData {
  report_id: string;
  idea_text: string;
  verdict: VerdictReportSchema;
  created_at?: string;
}
