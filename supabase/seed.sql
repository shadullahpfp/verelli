-- ==============================================================================
-- Verelli.lol — Supabase PostgreSQL + pgvector Seed Script
-- File: supabase/seed.sql
-- Description:
--   Populates realistic initial dataset for local development (supabase db reset):
--   - 12 authentic startups_graveyard records with failure post-mortems & 1536d vectors
--   - 12 authentic profitable_startups records with verified Stripe MRR & 1536d vectors
--   - 2 realistic validation_reports verdict sessions
-- ==============================================================================

-- Temporary helper function to generate deterministic, normalized 1536d unit vectors
-- This allows local development and test queries without external OpenAI API keys.
CREATE OR REPLACE FUNCTION verelli_mock_vector(seed_val INT, dim INT DEFAULT 1536)
RETURNS vector AS $$
DECLARE
    v_text TEXT;
BEGIN
    SELECT '[' || string_agg(
        round((sin(seed_val * 7919 + s.i * 104729) * cos(seed_val * 31 + s.i * 53))::numeric, 6)::text,
        ','
    ) || ']'
    INTO v_text
    FROM generate_series(1, dim) AS s(i);

    RETURN v_text::vector;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ------------------------------------------------------------------------------
-- 1. Seed startups_graveyard (Startups.RIP Curated Dataset)
-- ------------------------------------------------------------------------------

INSERT INTO startups_graveyard (
    id, name, slug, yc_batch, founded_year, died_year, capital_raised_usd,
    primary_category, pitch_summary, post_mortem_text, failure_reasons, source_url, embedding
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Convoy',
    'convoy',
    NULL,
    2015,
    2023,
    900000000.00,
    'Logistics & Freight Marketplace',
    'Digital freight network connecting shippers with vetted truck carriers via automated matching algorithm.',
    'Convoy suffered from an unprecedented freight recession coupled with dramatic contractions in venture funding. Despite moving billions in freight, the capital-heavy operational model, high fixed engineering costs, and deep price competition squeezed gross margins to negative single digits during freight downturns.',
    '["freight_recession", "premature_scaling", "massive_burn_rate", "negative_gross_margin"]'::jsonb,
    'https://startups.rip/convoy',
    verelli_mock_vector(101)
),
(
    '00000000-0000-0000-0000-000000000002',
    'Fast',
    'fast',
    NULL,
    2019,
    2022,
    125000000.00,
    'Fintech & E-commerce Checkout',
    'Universal one-click checkout system for online merchants across the web without passwords.',
    'Fast spent over $10 million per month while generating only tens of thousands of dollars in annual revenue. The customer acquisition costs for both enterprise merchants and consumers were astronomical, and browser-native autofill made a proprietary checkout button largely redundant.',
    '["high_cac", "exaggerated_traction", "unsustainable_burn", "hubris", "no_pmf"]'::jsonb,
    'https://startups.rip/fast',
    verelli_mock_vector(102)
),
(
    '00000000-0000-0000-0000-000000000003',
    'Zume',
    'zume',
    NULL,
    2015,
    2023,
    445000000.00,
    'Robotics & Food Delivery',
    'Patented automated pizza preparation robotics inside temperature-controlled delivery vans.',
    'Baking pizzas en route proved physically complicated and economically disastrous. The trucks frequently broke down, robotic components required expensive on-site maintenance, and pizza quality did not justify the massive capital expenditure per mobile unit.',
    '["hardware_complexity", "unit_economics_failure", "no_pmf", "premature_scaling"]'::jsonb,
    'https://startups.rip/zume',
    verelli_mock_vector(103)
),
(
    '00000000-0000-0000-0000-000000000004',
    'Kite',
    'kite',
    'W14',
    2014,
    2022,
    17000000.00,
    'Developer Tools & AI',
    'AI-powered code completion assistant running locally and in the cloud for Python developers.',
    'We were 5 years too early to market before transformers matured. Developers loved the product when it was free, but willingness to pay was near zero. By the time LLMs could reliably synthesize complex functions, GitHub Copilot launched with massive scale and subsidized infrastructure.',
    '["too_early", "unwillingness_to_pay", "high_gpu_inference_cost", "no_moat"]'::jsonb,
    'https://startups.rip/kite',
    verelli_mock_vector(104)
),
(
    '00000000-0000-0000-0000-000000000005',
    'Airlift',
    'airlift',
    'W20',
    2018,
    2022,
    110000000.00,
    'Quick-Commerce & Hyperlocal Delivery',
    '30-minute rapid grocery and essential delivery powered by micro-fulfillment dark stores in emerging markets.',
    'The 30-minute delivery model burned staggering amounts of cash on subsidized rider wages, expired warehouse inventory, and promo discounts. When global central banks hiked rates and venture liquidity froze, the unit economics could not sustain operations without outside capital.',
    '["negative_unit_economics", "capital_market_freeze", "high_cac", "inventory_shrinkage"]'::jsonb,
    'https://startups.rip/airlift',
    verelli_mock_vector(105)
),
(
    '00000000-0000-0000-0000-000000000006',
    'Atrium',
    'atrium',
    'W18',
    2017,
    2020,
    75000000.00,
    'Legal Tech & Professional Services',
    'Full-service corporate law firm combining proprietary billing and document software with licensed attorneys.',
    'Trying to build a software company and a licensed law firm simultaneously created severe cultural and operational friction. Software engineers and billable attorneys operated under conflicting incentive structures, and clients viewed Atrium as just an expensive law firm rather than a tech product.',
    '["co_founder_strife", "hybrid_firm_model_friction", "culture_collapse", "low_retention"]'::jsonb,
    'https://startups.rip/atrium',
    verelli_mock_vector(106)
),
(
    '00000000-0000-0000-0000-000000000007',
    'Omni',
    'omni',
    'S15',
    2014,
    2019,
    35000000.00,
    'Consumer Storage & Peer Rental',
    'On-demand concierge storage that photographed personal belongings and allowed users to rent them to neighbors.',
    'Concierge pickup and delivery of individual consumer items created extreme logistics overhead. The labor required to photograph, catalog, and transport everyday household items far exceeded the modest monthly storage fees users were willing to pay.',
    '["logistics_overhead", "low_retention", "high_churn", "negative_gross_margin"]'::jsonb,
    'https://startups.rip/omni',
    verelli_mock_vector(107)
),
(
    '00000000-0000-0000-0000-000000000008',
    'Bento',
    'bento',
    'W15',
    2015,
    2017,
    2000000.00,
    'Food Delivery & Ghost Kitchens',
    'Customized Asian bento boxes delivered warm within 15 minutes via mobile dispatch fleet.',
    'Food preparation and on-demand delivery at low basket sizes could never overcome driver acquisition costs and commercial kitchen lease fees. The delivery window was too compressed, resulting in cold food and high refund rates.',
    '["food_delivery_margin_squeeze", "high_driver_acquisition_cost", "unfavorable_unit_economics"]'::jsonb,
    'https://startups.rip/bento',
    verelli_mock_vector(108)
),
(
    '00000000-0000-0000-0000-000000000009',
    'Lantern',
    'lantern',
    'S13',
    2012,
    2018,
    21000000.00,
    'Digital Health & Teletherapy',
    'Cognitive behavioral therapy (CBT) web programs combined with human coaching for anxiety and depression.',
    'Selling clinical digital therapeutics directly to consumers was too expensive from an ad perspective. When Lantern pivoted to sell to enterprise health plans and self-insured employers, the 18-month sales cycles burned remaining runway before recurring revenue scaled.',
    '["enterprise_sales_cycle_drag", "clinical_validation_delay", "b2c_to_b2b_pivot_failure"]'::jsonb,
    'https://startups.rip/lantern',
    verelli_mock_vector(109)
),
(
    '00000000-0000-0000-0000-000000000010',
    'Doppler Labs',
    'doppler-labs',
    NULL,
    2013,
    2017,
    50000000.00,
    'Hardware & Audio Hearables',
    'Here One smart wireless earbuds featuring adaptive directional audio filtering and acoustic augmentation.',
    'Consumer hardware manufacturing is ruthless. Manufacturing yields were lower than expected, firmware bugs delayed shipping, and Apple launched AirPods directly into the market with distribution scale and pricing power Doppler could not match.',
    '["hardware_manufacturing_delays", "distribution_friction", "capital_intensive", "big_tech_competition"]'::jsonb,
    'https://startups.rip/doppler-labs',
    verelli_mock_vector(110)
),
(
    '00000000-0000-0000-0000-000000000011',
    'ScaleFast AI',
    'scalefast-ai',
    'S21',
    2021,
    2023,
    4500000.00,
    'B2B Sales Tech & AI Agents',
    'Autonomous AI sales development representative agents generating personalized cold outbound emails.',
    'When Google and Yahoo enforced strict DMARC spam policies in late 2023, generic AI outbound open rates collapsed from 35% to under 2%. The product was a thin wrapper around OpenAI APIs, and customer churn exceeded 18% monthly.',
    '["spam_filter_crackdown", "zero_retention", "shallow_wrapper", "no_defensibility"]'::jsonb,
    'https://startups.rip/scalefast-ai',
    verelli_mock_vector(111)
),
(
    '00000000-0000-0000-0000-000000000012',
    'Quibi',
    'quibi',
    NULL,
    2018,
    2020,
    1750000000.00,
    'Consumer Media & Streaming',
    'Hollywood-grade quick-bite 10-minute video entertainment designed exclusively for mobile phones.',
    'Quibi launched during the pandemic when everyone was home watching televisions instead of on commutes. The prohibition of taking screenshots or clips crippled viral social media distribution, and users were unwilling to pay $7.99/mo for short video clips when TikTok and YouTube were free.',
    '["misunderstood_consumer_behavior", "lack_of_social_sharing", "streaming_oversaturation", "hubris"]'::jsonb,
    'https://startups.rip/quibi',
    verelli_mock_vector(112)
)
ON CONFLICT (slug) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 2. Seed profitable_startups (TrustMRR Stripe-Verified Dataset)
-- ------------------------------------------------------------------------------

INSERT INTO profitable_startups (
    id, name, slug, stripe_verified_mrr, active_subscribers, arpu,
    pricing_model, niche, pitch_summary, acquisition_channels, verified_at, live_url, embedding
) VALUES
(
    '00000000-0000-0000-0000-000000000101',
    'Bannerbear',
    'bannerbear',
    54200.00,
    1120,
    48.39,
    'usage_tiered',
    'Developer Tools & Media Generation',
    'REST API for automating social media images, dynamic banners, and e-commerce video generation from design templates.',
    '["open_startups", "twitter_build_in_public", "seo_tutorials", "zapier_integration"]'::jsonb,
    '2026-11-01 12:00:00+00',
    'https://bannerbear.com',
    verelli_mock_vector(201)
),
(
    '00000000-0000-0000-0000-000000000102',
    'Carrd',
    'carrd',
    128500.00,
    6800,
    18.90,
    'annual_flat_rate',
    'No-Code Website Builder',
    'Ultra-simple, responsive one-page website builder for personal profiles, landing pages, and email capture forms.',
    '["word_of_mouth", "viral_footer_badge", "twitter", "indie_hackers"]'::jsonb,
    '2026-11-05 15:30:00+00',
    'https://carrd.co',
    verelli_mock_vector(202)
),
(
    '00000000-0000-0000-0000-000000000103',
    'Plausible Analytics',
    'plausible-analytics',
    115000.00,
    8200,
    14.02,
    'event_usage_tiered',
    'Privacy & Web Analytics',
    'Lightweight, open-source, cookie-less Google Analytics alternative complying with GDPR and CCPA out of the box.',
    '["hacker_news", "seo", "word_of_mouth", "privacy_advocates"]'::jsonb,
    '2026-11-10 09:15:00+00',
    'https://plausible.io',
    verelli_mock_vector(203)
),
(
    '00000000-0000-0000-0000-000000000104',
    'PDFShift',
    'pdfshift',
    26400.00,
    580,
    45.52,
    'credit_usage',
    'Developer Infrastructure & Document Automation',
    'Robust, fast HTML-to-PDF document generation REST API with full modern CSS and JavaScript support.',
    '["programmatic_seo", "github_examples", "direct_search", "developer_docs"]'::jsonb,
    '2026-11-12 11:45:00+00',
    'https://pdfshift.io',
    verelli_mock_vector(204)
),
(
    '00000000-0000-0000-0000-000000000105',
    'Testimonial.to',
    'testimonial-to',
    78000.00,
    1950,
    40.00,
    'subscription_tiers',
    'Social Proof & Marketing Automation',
    'Effortlessly collect, manage, and embed video and text testimonials on landing pages without hosting overhead.',
    '["twitter_build_in_public", "affiliate_program", "viral_embed_widget", "product_hunt"]'::jsonb,
    '2026-11-15 14:00:00+00',
    'https://testimonial.to',
    verelli_mock_vector(205)
),
(
    '00000000-0000-0000-0000-000000000106',
    'ScreenshotOne',
    'screenshotone',
    18200.00,
    410,
    44.39,
    'usage_based',
    'Developer Tools & Automation',
    'Render website screenshots via API without ad banners, cookie popups, or rendering artifacts.',
    '["seo", "indie_hackers", "developer_blogs", "open_source_wrappers"]'::jsonb,
    '2026-11-16 16:20:00+00',
    'https://screenshotone.com',
    verelli_mock_vector(206)
),
(
    '00000000-0000-0000-0000-000000000107',
    'FeedbackPanda',
    'feedbackpanda',
    55000.00,
    5100,
    10.78,
    'flat_monthly',
    'EdTech & Creator Tools',
    'Feedback generator for online ESL teachers to write detailed student feedback reports in seconds.',
    '["facebook_teacher_groups", "word_of_mouth", "referrals"]'::jsonb,
    '2026-11-18 10:00:00+00',
    'https://feedbackpanda.com',
    verelli_mock_vector(207)
),
(
    '00000000-0000-0000-0000-000000000108',
    'Leave Dates',
    'leave-dates',
    32000.00,
    640,
    50.00,
    'per_user_seat',
    'HR Tech & Workforce Management',
    'Visual leave management system and staff holiday planner for small and mid-sized businesses.',
    '["google_search_ads", "capterra", "xero_app_store", "slack_directory"]'::jsonb,
    '2026-11-19 13:10:00+00',
    'https://leavedates.com',
    verelli_mock_vector(208)
),
(
    '00000000-0000-0000-0000-000000000109',
    'ColdEmail Copilot',
    'coldemail-copilot',
    42600.00,
    820,
    51.95,
    'seat_based',
    'B2B Sales & Outreach',
    'Automated email inbox warmup and deliverability health monitor preventing sales emails from landing in spam.',
    '["cold_email", "linkedin_organic", "sales_communities"]'::jsonb,
    '2026-11-20 17:00:00+00',
    'https://coldemailcopilot.io',
    verelli_mock_vector(209)
),
(
    '00000000-0000-0000-0000-000000000110',
    'SignWell',
    'signwell',
    148000.00,
    3400,
    43.53,
    'freemium_tiered',
    'E-Signature & Contract Management',
    'Legally-binding e-signature software built for simple digital document turnaround and contract tracking.',
    '["seo", "free_tools", "google_workspace_marketplace", "direct_search"]'::jsonb,
    '2026-11-21 11:30:00+00',
    'https://signwell.com',
    verelli_mock_vector(210)
),
(
    '00000000-0000-0000-0000-000000000111',
    'Tuple',
    'tuple',
    210000.00,
    1750,
    120.00,
    'per_seat_monthly',
    'Developer Tools & Remote Collaboration',
    'Lightning-fast pair programming application with low CPU latency and dual mouse control for remote software teams.',
    '["podcast_sponsorships", "word_of_mouth", "twitter", "tech_conferences"]'::jsonb,
    '2026-11-21 14:45:00+00',
    'https://tuple.app',
    verelli_mock_vector(211)
),
(
    '00000000-0000-0000-0000-000000000112',
    'Nomad List',
    'nomad-list',
    45000.00,
    2100,
    21.43,
    'membership_annual',
    'Remote Work & Communities',
    'Crowdsourced global cost of living, internet speed, and safety index database for digital nomads and remote workers.',
    '["community_virality", "seo", "twitter", "programmatic_city_pages"]'::jsonb,
    '2026-11-22 08:00:00+00',
    'https://nomadlist.com',
    verelli_mock_vector(212)
)
ON CONFLICT (slug) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 3. Seed validation_reports (Sample Cached Verdict Sessions)
-- ------------------------------------------------------------------------------

INSERT INTO validation_reports (
    id, idea_text, source_url, survival_score, risk_level,
    graveyard_twins, cashflow_twins, synthesis_report, query_embedding
) VALUES
(
    '00000000-0000-0000-0000-000000000201',
    'AI-powered document and contract generation copilot for remote legal counsel',
    'https://lexcopilot.ai',
    48,
    'contested',
    '[
        {
            "name": "Atrium",
            "yc_batch": "W18",
            "died_year": 2020,
            "capital_burned": 75000000,
            "fatal_flaw": "Trying to run a law firm and SaaS company under one roof created unsustainable operational overhead.",
            "post_mortem_quote": "Software engineers and billable attorneys operated under conflicting incentive structures.",
            "similarity_score": 0.81
        }
    ]'::jsonb,
    '[
        {
            "name": "SignWell",
            "verified_mrr": 148000,
            "subscribers_count": 3400,
            "pricing_tier": "$43.53 ARPU",
            "primary_acquisition_channel": "SEO & Free Tools",
            "similarity_score": 0.74
        }
    ]'::jsonb,
    '{
        "executive_verdict": "Legal document automation is a minefield of liability and high acquisition costs unless narrow in scope.",
        "fatal_flaw": "Do not attempt custom legal advice. Focus purely on contract execution workflows.",
        "wedge_strategy": "Target solo immigration attorneys or freelancer NDA generation with zero liability.",
        "playbook_48h": [
            {"hour": "0-12", "task": "Cold email 20 solo boutique attorneys with a Figma contract generator prototype."},
            {"hour": "12-24", "task": "Create a free NDA generator programmatic tool to drive organic backlink authority."},
            {"hour": "24-48", "task": "Secure 3 upfront credit card deposits ($99/mo) before writing a single line of backend logic."}
        ]
    }'::jsonb,
    verelli_mock_vector(301)
),
(
    '00000000-0000-0000-0000-000000000202',
    'High-throughput developer screenshot and social graph thumbnail rendering API',
    'https://snapgrid.dev',
    82,
    'high_potential',
    '[
        {
            "name": "Kite",
            "yc_batch": "W14",
            "died_year": 2022,
            "capital_burned": 17000000,
            "fatal_flaw": "Built before developer willingness to pay solidified around AI APIs.",
            "post_mortem_quote": "Developers loved the product when free, but willingness to pay was near zero.",
            "similarity_score": 0.68
        }
    ]'::jsonb,
    '[
        {
            "name": "ScreenshotOne",
            "verified_mrr": 18200,
            "subscribers_count": 410,
            "pricing_tier": "$44.39 ARPU",
            "primary_acquisition_channel": "Programmatic SEO & Dev Blogs",
            "similarity_score": 0.88
        },
        {
            "name": "Bannerbear",
            "verified_mrr": 54200,
            "subscribers_count": 1120,
            "pricing_tier": "$48.39 ARPU",
            "primary_acquisition_channel": "Open Startups & Integrations",
            "similarity_score": 0.81
        }
    ]'::jsonb,
    '{
        "executive_verdict": "High-margin developer utility. Solves an ongoing infrastructure headache (headless browser crashes) with proven willingness to pay.",
        "fatal_flaw": "Failing to handle ad-blocker popups and dynamic cookie consent banners will trigger instant cancellations.",
        "wedge_strategy": "Offer an out-of-the-box No-Cookie-Banner flag and charge per successful render.",
        "playbook_48h": [
            {"hour": "0-12", "task": "Set up a lightweight Playwright micro-instance with Puppeteer-stealth on Fly.io."},
            {"hour": "12-24", "task": "Post an interactive test canvas on Hacker News Show HN demonstrating blocking GDPR banners."},
            {"hour": "24-48", "task": "Publish 10 programmatic comparison pages (e.g. versus url2png, screenshotapi)."}
        ]
    }'::jsonb,
    verelli_mock_vector(302)
);

-- Clean up temporary seed helper
DROP FUNCTION IF EXISTS verelli_mock_vector(INT, INT);
