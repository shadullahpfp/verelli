import { StoredVerdictData } from "@/types/verdict";

export const SAMPLE_VERDICT_DATA: StoredVerdictData = {
  report_id: "demo-chargeback-agent",
  idea_text:
    "An automated Stripe chargeback and payment disputes resolution agent that generates tailored evidence packages for B2B SaaS merchants.",
  created_at: new Date().toISOString(),
  verdict: {
    survival_score: 74,
    risk_level: "High-Potential Wedge",
    executive_verdict:
      "Proven high-retention SaaS market validated by Disputifier at $48.2K/mo. However, venture-scale failures like Fast burned massive capital attempting horizontal checkout rather than solving merchant dispute friction directly.",
    top_dead_twins: [
      {
        name: "Fast",
        yc_batch: null,
        died_year: 2022,
        capital_burned: 124000000,
        fatal_flaw:
          "Aggressive growth spending ahead of merchant distribution parity with Shopify Shop Pay, burning $10M/month on negligible transaction fees.",
        post_mortem_quote:
          "We aggressively scaled marketing and executive headcount ahead of distribution parity with native payment processors.",
        similarity_score: 0.89,
        source_url: "https://startups.rip/startups/fast",
      },
      {
        name: "Omnypay",
        yc_batch: "S16",
        died_year: 2019,
        capital_burned: 24500000,
        fatal_flaw:
          "Entrenched legacy point-of-sale integrations and compliance audits created multi-year pilot stagnation.",
        post_mortem_quote:
          "Enterprise retail pilots dragged on for 18 months without enterprise-wide deployment commitments.",
        similarity_score: 0.84,
        source_url: "https://startups.rip/startups/omnypay",
      },
    ],
    top_cashflow_twins: [
      {
        name: "Disputifier",
        verified_mrr: 48200,
        subscribers_count: 650,
        pricing_tier: "$49/mo + 8% of recovered dispute value",
        primary_acquisition_channel:
          "Shopify App Store listing & targeted merchant cold outreach",
        similarity_score: 0.89,
        live_url: "https://disputifier.com",
      },
      {
        name: "EvidenceHero",
        verified_mrr: 21500,
        subscribers_count: 190,
        pricing_tier: "$99/mo flat per connected Stripe account",
        primary_acquisition_channel:
          "Stripe App Marketplace organic directory search and Twitter SaaS communities",
        similarity_score: 0.82,
        live_url: "https://evidencehero.io",
      },
    ],
    deadly_pitfalls_to_avoid: [
      "The Fast Trap: Scaling marketing headcount and ads before securing direct Stripe marketplace distribution.",
      "The Omnypay Trap: Enterprise retail pilots dragging on for 12+ months instead of self-serve Stripe Connect OAuth.",
      "Manual Operations: Hiring human dispute analysts instead of programmatically assembling customer dispute records.",
    ],
    wedge_differentiation_angle:
      "Contingency-first pricing: 1-click self-serve Stripe App that charges an 8% recovery fee only on won disputes, completely eliminating upfront buyer friction.",
    validation_playbook_48h: [
      {
        timeframe: "Hour 0-12",
        title: "Fake-Door Wedge & Stripe App Landing Page",
        description:
          "Deploy an ultra-minimalist single-page positioning test contrasting the fatal flaws of past category failures against your contingency dispute automation.",
        tactical_deliverable:
          "Next.js fake-door page with waitlist and Stripe Connect permission mock.",
      },
      {
        timeframe: "Hour 12-24",
        title: "Cold Outbound to Competitor Dissatisfied Users",
        description:
          "Locate 30 target buyers currently complaining about category alternatives on Twitter/X or Shopify merchant forums. Pitch immediate dispute defense without monthly retainers.",
        tactical_deliverable:
          "30 personalized outreach messages sent with pain-focused pitch script.",
      },
      {
        timeframe: "Hour 24-48",
        title: "Kill/Go Metric Benchmark",
        description:
          "Secure 5 LOIs or 3 pilot merchants consenting to authorize the test app on their Stripe sandbox within 48 hours.",
        tactical_deliverable:
          "Stripe payment link receipt or signed LOI proving validated commercial intent.",
      },
    ],
    is_uncharted_niche: false,
    adjacent_market_warnings: null,
  },
};
