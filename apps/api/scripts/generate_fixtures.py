"""
Fixture Data Generation Script for verelli.lol.
Generates startups_rip_sample.json (12 YC Graveyard records) and
trustmrr_sample.json (12 Stripe-verified micro-SaaS records)
with normalized 1536-dimensional embeddings.
"""
import json
import os
import sys
from pathlib import Path

# Add apps/api to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.embedding_service import deterministic_embed

FIXTURES_DIR = Path(__file__).resolve().parent.parent / "fixtures"
FIXTURES_DIR.mkdir(parents=True, exist_ok=True)

STARTUPS_RIP_RECORDS = [
    {
        "id": "11111111-1111-4111-8111-111111111101",
        "name": "Atrium",
        "slug": "atrium",
        "yc_batch": "W18",
        "founded_year": 2017,
        "died_year": 2020,
        "capital_raised_usd": 75500000.0,
        "primary_category": "Legal Tech & AI Contracts",
        "pitch_summary": "AI-assisted corporate legal operations and full-service technology-enabled law firm for venture-backed startups and enterprises.",
        "post_mortem_text": "Atrium attempted to build internal workflow software while concurrently employing a full in-house legal services staff. The dual burden created unsustainable burn without software gross margins.",
        "failure_reasons": ["high_cac", "premature_scaling"],
        "fatal_flaw": "Scaling human legal headcount before software automation achieved defensible gross margins, resulting in crushing operational burn and high customer acquisition costs.",
        "post_mortem_quote": "We tried to be both a tech company and a law firm at once, scaling headcount before perfecting our proprietary software efficiencies.",
        "source_url": "https://startups.rip/startups/atrium"
    },
    {
        "id": "11111111-1111-4111-8111-111111111102",
        "name": "ScaleFactor",
        "slug": "scalefactor",
        "yc_batch": "Techstars",
        "founded_year": 2014,
        "died_year": 2020,
        "capital_raised_usd": 104000000.0,
        "primary_category": "B2B AI Accounting & Automated Bookkeeping",
        "pitch_summary": "Autonomous AI-powered bookkeeping, automated financial reconciliations, and cash flow forecasting for small businesses and CFOs.",
        "post_mortem_text": "Marketed automated machine learning bookkeeping while quietly routing reconciliations to outsourced human accountants who made frequent errors, destroying trust and cohort retention.",
        "failure_reasons": ["no_pmf", "zero_retention"],
        "fatal_flaw": "Faking algorithmic automation with offshore manual labor caused massive reconciliation errors and catastrophic customer churn.",
        "post_mortem_quote": "The marketing promised autonomous AI bookkeeping, but the technology wasn't ready to handle complex variance reconciliations without intensive human touch.",
        "source_url": "https://startups.rip/startups/scalefactor"
    },
    {
        "id": "11111111-1111-4111-8111-111111111103",
        "name": "Fast",
        "slug": "fast",
        "yc_batch": None,
        "founded_year": 2019,
        "died_year": 2022,
        "capital_raised_usd": 124000000.0,
        "primary_category": "Fintech & 1-Click Checkout",
        "pitch_summary": "Universal one-click checkout button for headless e-commerce stores and independent online merchants to eliminate cart abandonment.",
        "post_mortem_text": "Blew $10M+ per month on sports sponsorships and bloated engineering salaries while generating under $50K monthly revenue, outmatched by Shopify's native Shop Pay.",
        "failure_reasons": ["high_cac", "premature_scaling"],
        "fatal_flaw": "Aggressive growth spending ahead of merchant distribution parity with Shopify Shop Pay, burning $10M/month on negligible transaction fees.",
        "post_mortem_quote": "We aggressively scaled marketing and executive headcount ahead of distribution parity with native payment processors.",
        "source_url": "https://startups.rip/startups/fast"
    },
    {
        "id": "11111111-1111-4111-8111-111111111104",
        "name": "Teforia",
        "slug": "teforia",
        "yc_batch": None,
        "founded_year": 2014,
        "died_year": 2017,
        "capital_raised_usd": 17000000.0,
        "primary_category": "IoT Hardware & Smart Kitchen",
        "pitch_summary": "Machine learning IoT tea infuser that brews loose-leaf tea using proprietary algorithmic micro-infusion algorithms.",
        "post_mortem_text": "The $999 price tag limited addressable customer demand to an extreme luxury niche, making mass-production manufacturing tooling unprofitable.",
        "failure_reasons": ["no_pmf", "high_cac"],
        "fatal_flaw": "Hardware production minimum order quantities exceeded addressable consumer demand for a $999 appliance.",
        "post_mortem_quote": "The market for an ultra-premium $999 tea infuser was simply too small to justify venture-scale hardware manufacturing tooling.",
        "source_url": "https://startups.rip/startups/teforia"
    },
    {
        "id": "11111111-1111-4111-8111-111111111105",
        "name": "Omnypay",
        "slug": "omnypay",
        "yc_batch": "S16",
        "founded_year": 2015,
        "died_year": 2019,
        "capital_raised_usd": 24500000.0,
        "primary_category": "Retail Mobile Payments & In-Store Loyalty",
        "pitch_summary": "Cloud-based omnichannel mobile checkout and loyalty platform integrated directly into tier-1 enterprise retail POS systems.",
        "post_mortem_text": "18-month enterprise retail pilot cycles and entrenched payment gateway legacy relationships stalled rollout velocity until runway expired.",
        "failure_reasons": ["regulatory_death", "high_cac"],
        "fatal_flaw": "Entrenched legacy point-of-sale integrations and compliance audits created multi-year pilot stagnation.",
        "post_mortem_quote": "Enterprise retail pilots dragged on for 18 months without enterprise-wide deployment commitments.",
        "source_url": "https://startups.rip/startups/omnypay"
    },
    {
        "id": "11111111-1111-4111-8111-111111111106",
        "name": "Pearl Automation",
        "slug": "pearl-automation",
        "yc_batch": None,
        "founded_year": 2014,
        "died_year": 2017,
        "capital_raised_usd": 50000000.0,
        "primary_category": "Automotive ADAS & Smart Vision",
        "pitch_summary": "Solar-powered wireless automotive backup camera and obstacle-warning license plate frame for aftermarket vehicles.",
        "post_mortem_text": "The $500 aftermarket price was rejected by mainstream consumers, and federal regulations soon mandated factory-installed backup cameras in all new vehicles.",
        "failure_reasons": ["high_cac", "no_pmf", "regulatory_death"],
        "fatal_flaw": "Regulatory mandate made backup cameras standard equipment in new cars while high consumer price choked aftermarket demand.",
        "post_mortem_quote": "Automakers made OEM backup cameras mandatory before our aftermarket consumer unit reached cost-effective mass production scale.",
        "source_url": "https://startups.rip/startups/pearl-automation"
    },
    {
        "id": "11111111-1111-4111-8111-111111111107",
        "name": "Shyp",
        "slug": "shyp",
        "yc_batch": None,
        "founded_year": 2013,
        "died_year": 2018,
        "capital_raised_usd": 62100000.0,
        "primary_category": "On-Demand Courier Logistics & Packaging",
        "pitch_summary": "On-demand mobile pickup service that packaged and shipped any consumer item via lowest-cost carrier with 20-minute courier response.",
        "post_mortem_text": "Subsidized consumer package pickups with $5 flat fees while spending $18+ on courier wages, packaging boxes, and transit, losing money on every order.",
        "failure_reasons": ["high_cac", "premature_scaling"],
        "fatal_flaw": "Subsidizing consumer on-demand logistics pickups resulted in negative gross margins on every package shipped.",
        "post_mortem_quote": "We prioritized consumer pickup volume over positive unit economics, subsidizing every box we touched.",
        "source_url": "https://startups.rip/startups/shyp"
    },
    {
        "id": "11111111-1111-4111-8111-111111111108",
        "name": "Homejoy",
        "slug": "homejoy",
        "yc_batch": "S10",
        "founded_year": 2012,
        "died_year": 2015,
        "capital_raised_usd": 39700000.0,
        "primary_category": "Local On-Demand Home Cleaning Services",
        "pitch_summary": "Online marketplace for booking insured local home and office cleaners with flat hourly rates.",
        "post_mortem_text": "Acquired bargain hunters through $19 promotional coupon deals who never booked again, combined with multi-state worker misclassification lawsuits.",
        "failure_reasons": ["zero_retention", "regulatory_death"],
        "fatal_flaw": "Catastrophic 90-day retention from deal-seeking customers and mounting worker classification legal liabilities.",
        "post_mortem_quote": "Our 90-day cohort retention was catastrophic because discount shoppers disappeared the moment rates normalized to market levels.",
        "source_url": "https://startups.rip/startups/homejoy"
    },
    {
        "id": "11111111-1111-4111-8111-111111111109",
        "name": "Kifi",
        "slug": "kifi",
        "yc_batch": "S12",
        "founded_year": 2012,
        "died_year": 2016,
        "capital_raised_usd": 11200000.0,
        "primary_category": "Knowledge Management & Team Bookmarking",
        "pitch_summary": "Contextual bookmarking and collaborative search tool that organizes research links and articles directly inside Slack and browsers.",
        "post_mortem_text": "Users found high friction in organizing links and tagging articles, resulting in poor daily active usage and team churn.",
        "failure_reasons": ["zero_retention", "no_pmf"],
        "fatal_flaw": "High workflow curation friction prevented organic team habit formation and persistent daily engagement.",
        "post_mortem_quote": "Users loved the idea of organized team research, but the manual effort required to curate bookmarks prevented daily retention.",
        "source_url": "https://startups.rip/startups/kifi"
    },
    {
        "id": "11111111-1111-4111-8111-111111111110",
        "name": "Zume Pizza",
        "slug": "zume-pizza",
        "yc_batch": None,
        "founded_year": 2015,
        "died_year": 2020,
        "capital_raised_usd": 445000000.0,
        "primary_category": "FoodTech & Robotic Automation",
        "pitch_summary": "Automated pizza preparation robots installed inside delivery trucks that baked food en route to the customer.",
        "post_mortem_text": "Baking pizzas in moving vehicles proved mechanically fragile, highly capital intensive, and generated unsupportable unit economics compared to standard delivery.",
        "failure_reasons": ["premature_scaling", "no_pmf"],
        "fatal_flaw": "Extreme capital intensity of mobile kitchen robotics and vehicle maintenance outstripped pizza retail margins.",
        "post_mortem_quote": "Baking pizzas inside moving trucks proved far more expensive and prone to mechanical breakdowns than centralized ghost kitchens.",
        "source_url": "https://startups.rip/startups/zume-pizza"
    },
    {
        "id": "11111111-1111-4111-8111-111111111111",
        "name": "Doppler Labs",
        "slug": "doppler-labs",
        "yc_batch": None,
        "founded_year": 2013,
        "died_year": 2017,
        "capital_raised_usd": 50500000.0,
        "primary_category": "Smart Earbuds & Audio Wearables",
        "pitch_summary": "Bionic in-ear computing earbuds that filtered ambient sound and provided directional audio enhancement.",
        "post_mortem_text": "Hardware supply chain bottlenecks delayed shipment, and Apple's launch of AirPods eradicated consumer willingness to buy third-party smart earbuds.",
        "failure_reasons": ["premature_scaling", "high_cac"],
        "fatal_flaw": "Manufacturing delays left them defenseless when Apple launched AirPods with built-in ecosystem distribution.",
        "post_mortem_quote": "We couldn't match the multi-billion dollar R&D budget and supply-chain leverage of Big Tech once AirPods launched.",
        "source_url": "https://startups.rip/startups/doppler-labs"
    },
    {
        "id": "11111111-1111-4111-8111-111111111112",
        "name": "Cast Video",
        "slug": "cast-video",
        "yc_batch": "W15",
        "founded_year": 2015,
        "died_year": 2018,
        "capital_raised_usd": 4800000.0,
        "primary_category": "Developer Video API & Cloud Rendering",
        "pitch_summary": "Cloud-based video editing and programmatic audio recording studio for podcasters and marketing teams.",
        "post_mortem_text": "High GPU cloud rendering costs exceeded developer seat pricing, while sporadic usage led to quarterly churn.",
        "failure_reasons": ["zero_retention", "high_cac"],
        "fatal_flaw": "Sporadic quarterly video creation cadence could not cover high fixed GPU cloud rendering overhead.",
        "post_mortem_quote": "Rendering costs exceeded developer seat pricing, and customers only generated marketing videos once per quarter.",
        "source_url": "https://startups.rip/startups/cast-video"
    }
]

TRUSTMRR_RECORDS = [
    {
        "id": "22222222-2222-4222-8222-222222222201",
        "name": "Testimonial.to",
        "slug": "testimonial-to",
        "stripe_verified_mrr": 68450.0,
        "active_subscribers": 1890,
        "arpu": 36.21,
        "pricing_model": "tiered",
        "pricing_tier": "$25/mo Starter, $59/mo Premium, $99/mo Agency",
        "niche": "Customer Testimonial & Social Proof Video Collection",
        "pitch_summary": "Collect video and text testimonials from customers with zero code and embed them on any website with a single snippet.",
        "acquisition_channels": ["seo", "twitter_build_in_public", "affiliates"],
        "primary_acquisition_channel": "Build in public & embed widget backlink attribution",
        "verified_at": "2024-10-01T12:00:00Z",
        "live_url": "https://testimonial.to"
    },
    {
        "id": "22222222-2222-4222-8222-222222222202",
        "name": "Bannerbear",
        "slug": "bannerbear",
        "stripe_verified_mrr": 54200.0,
        "active_subscribers": 840,
        "arpu": 64.52,
        "pricing_model": "usage_based",
        "pricing_tier": "$49/mo Automate, $99/mo Scale, $299/mo Business",
        "niche": "Automated Image & Video Generation API",
        "pitch_summary": "REST API and Zapier integration that automatically generates social media banners, ecommerce graphics, and dynamic Open Graph images.",
        "acquisition_channels": ["programmatic_seo", "zapier_app_store", "content_marketing"],
        "primary_acquisition_channel": "Zapier integration directory & programmatic SEO templates",
        "verified_at": "2024-09-15T12:00:00Z",
        "live_url": "https://bannerbear.com"
    },
    {
        "id": "22222222-2222-4222-8222-222222222203",
        "name": "PDF.ai",
        "slug": "pdf-ai",
        "stripe_verified_mrr": 92000.0,
        "active_subscribers": 5100,
        "arpu": 18.04,
        "pricing_model": "tiered",
        "pricing_tier": "$15/mo Pro, $50/mo Ultimate",
        "niche": "AI Document Analysis & Interactive Chat with PDFs",
        "pitch_summary": "Upload any PDF, agreement, financial report, or manual and ask questions to extract answers and citations instantly.",
        "acquisition_channels": ["tiktok_viral", "twitter_organic", "chrome_extension"],
        "primary_acquisition_channel": "Organic TikTok demo reels & SEO tool landing pages",
        "verified_at": "2024-10-10T12:00:00Z",
        "live_url": "https://pdf.ai"
    },
    {
        "id": "22222222-2222-4222-8222-222222222204",
        "name": "Senja.io",
        "slug": "senja-io",
        "stripe_verified_mrr": 42500.0,
        "active_subscribers": 1250,
        "arpu": 34.00,
        "pricing_model": "tiered",
        "pricing_tier": "$19/mo Starter, $39/mo Pro, $79/mo Agency",
        "niche": "Testimonial and Social Proof Management Platform",
        "pitch_summary": "Collect, manage, and share customer reviews across Wall of Love, image exports, and high-converting checkout widgets.",
        "acquisition_channels": ["twitter_build_in_public", "widget_attribution", "product_hunt"],
        "primary_acquisition_channel": "Viral widget attribution 'Powered by Senja' on customer sites",
        "verified_at": "2024-10-05T12:00:00Z",
        "live_url": "https://senja.io"
    },
    {
        "id": "22222222-2222-4222-8222-222222222205",
        "name": "Chatbase",
        "slug": "chatbase",
        "stripe_verified_mrr": 185000.0,
        "active_subscribers": 4400,
        "arpu": 42.05,
        "pricing_model": "tiered",
        "pricing_tier": "$19/mo Hobby, $99/mo Standard, $399/mo Unlimited",
        "niche": "Custom AI Chatbots Trained on Website & Knowledge Base",
        "pitch_summary": "Build a custom GPT chatbot using your website URLs, PDF docs, and Notion workspace to embed 24/7 customer support.",
        "acquisition_channels": ["seo_high_intent", "affiliates", "influencer_partnerships"],
        "primary_acquisition_channel": "High-intent search rankings for 'custom AI chatbot'",
        "verified_at": "2024-10-20T12:00:00Z",
        "live_url": "https://chatbase.co"
    },
    {
        "id": "22222222-2222-4222-8222-222222222206",
        "name": "TweetHunter",
        "slug": "tweethunter",
        "stripe_verified_mrr": 165000.0,
        "active_subscribers": 3200,
        "arpu": 51.56,
        "pricing_model": "tiered",
        "pricing_tier": "$49/mo Discover, $99/mo Grow",
        "niche": "Twitter/X Audience Growth, Content Engine & CRM",
        "pitch_summary": "AI-assisted tweet writing, automated scheduling, lead generation CRM, and thread inspiration library.",
        "acquisition_channels": ["twitter_audience", "influencer_affiliates", "lead_magnets"],
        "primary_acquisition_channel": "Proprietary founder Twitter audience & reciprocal affiliate shares",
        "verified_at": "2024-09-28T12:00:00Z",
        "live_url": "https://tweethunter.io"
    },
    {
        "id": "22222222-2222-4222-8222-222222222207",
        "name": "Typedream",
        "slug": "typedream",
        "stripe_verified_mrr": 78000.0,
        "active_subscribers": 2800,
        "arpu": 27.85,
        "pricing_model": "tiered",
        "pricing_tier": "$15/mo Launch, $29/mo Pro",
        "niche": "Notion-like No-Code Website & Landing Page Builder",
        "pitch_summary": "Build websites, landing pages, and customer portals with the simplicity of typing in Notion, featuring custom domains and SEO.",
        "acquisition_channels": ["twitter_templates", "webflow_comparisons", "community_showcases"],
        "primary_acquisition_channel": "Free Notion site templates & Twitter template giveaways",
        "verified_at": "2024-10-12T12:00:00Z",
        "live_url": "https://typedream.com"
    },
    {
        "id": "22222222-2222-4222-8222-222222222208",
        "name": "SiteGPT",
        "slug": "sitegpt",
        "stripe_verified_mrr": 38000.0,
        "active_subscribers": 980,
        "arpu": 38.77,
        "pricing_model": "tiered",
        "pricing_tier": "$19/mo Starter, $49/mo Growth, $99/mo Pro",
        "niche": "Personalized AI Customer Support Chatbot for Small Business",
        "pitch_summary": "Instantly create an AI bot that reads your website and answers visitor questions with accurate reference links.",
        "acquisition_channels": ["twitter_build_in_public", "appsumo_launch", "seo"],
        "primary_acquisition_channel": "Founder build-in-public journey & word-of-mouth indie community",
        "verified_at": "2024-10-14T12:00:00Z",
        "live_url": "https://sitegpt.ai"
    },
    {
        "id": "22222222-2222-4222-8222-222222222209",
        "name": "Postiz",
        "slug": "postiz",
        "stripe_verified_mrr": 26400.0,
        "active_subscribers": 720,
        "arpu": 36.67,
        "pricing_model": "tiered",
        "pricing_tier": "$29/mo Creator, $69/mo Agency",
        "niche": "Open Source AI Social Media Scheduling & Automation",
        "pitch_summary": "Multi-platform social media scheduler that uses AI to repurpose blog posts and videos across X, LinkedIn, Instagram, and Reddit.",
        "acquisition_channels": ["github_trending", "open_source_community", "reddit"],
        "primary_acquisition_channel": "GitHub repo trending page & developer community forks",
        "verified_at": "2024-10-18T12:00:00Z",
        "live_url": "https://postiz.com"
    },
    {
        "id": "22222222-2222-4222-8222-222222222210",
        "name": "Feather.so",
        "slug": "feather-so",
        "stripe_verified_mrr": 34800.0,
        "active_subscribers": 810,
        "arpu": 42.96,
        "pricing_model": "tiered",
        "pricing_tier": "$39/mo Personal, $79/mo Business",
        "niche": "Notion to SEO-Optimized Fast Blog Publishing",
        "pitch_summary": "Turn your Notion workspace into a blazing fast, SEO-friendly blog without touching code or dealing with complex CMS platforms.",
        "acquisition_channels": ["notion_ecosystem", "seo", "indie_hackers"],
        "primary_acquisition_channel": "Notion user directory & programmatic comparisons against WordPress",
        "verified_at": "2024-10-08T12:00:00Z",
        "live_url": "https://feather.so"
    },
    {
        "id": "22222222-2222-4222-8222-222222222211",
        "name": "Disputifier",
        "slug": "disputifier",
        "stripe_verified_mrr": 48200.0,
        "active_subscribers": 650,
        "arpu": 74.15,
        "pricing_model": "usage_based",
        "pricing_tier": "$49/mo + 8% of recovered dispute value",
        "niche": "Automated Stripe Chargeback & Dispute Defense for E-commerce",
        "pitch_summary": "Connects directly to Stripe and Shopify to generate AI dispute evidence packets automatically, doubling win rates.",
        "acquisition_channels": ["shopify_app_store", "stripe_partners", "cold_email"],
        "primary_acquisition_channel": "Shopify App Store listing & targeted merchant cold outreach",
        "verified_at": "2024-10-22T12:00:00Z",
        "live_url": "https://disputifier.com"
    },
    {
        "id": "22222222-2222-4222-8222-222222222212",
        "name": "RepurposePie",
        "slug": "repurposepie",
        "stripe_verified_mrr": 19500.0,
        "active_subscribers": 610,
        "arpu": 31.97,
        "pricing_model": "tiered",
        "pricing_tier": "$19/mo Starter, $49/mo Pro",
        "niche": "Twitter Thread to Viral LinkedIn Carousel Generator",
        "pitch_summary": "Converts high-performing tweets and threads into beautifully formatted PDF slide carousels for LinkedIn in one click.",
        "acquisition_channels": ["linkedin_viral_posts", "chrome_extension", "product_hunt"],
        "primary_acquisition_channel": "Viral carousel watermarks and LinkedIn creator tagging",
        "verified_at": "2024-09-30T12:00:00Z",
        "live_url": "https://repurposepie.com"
    }
]


def generate_fixtures():
    print(f"Generating embeddings for {len(STARTUPS_RIP_RECORDS)} Startups.RIP records...")
    for rec in STARTUPS_RIP_RECORDS:
        # Contextual text for embedding
        embed_text = f"{rec['name']} {rec['primary_category']} {rec['pitch_summary']} {rec['fatal_flaw']} {rec['post_mortem_text']} {' '.join(rec['failure_reasons'])}"
        rec["embedding"] = deterministic_embed(embed_text)

    print(f"Generating embeddings for {len(TRUSTMRR_RECORDS)} TrustMRR records...")
    for rec in TRUSTMRR_RECORDS:
        embed_text = f"{rec['name']} {rec['niche']} {rec['pitch_summary']} {rec['primary_acquisition_channel']} {' '.join(rec['acquisition_channels'])}"
        rec["embedding"] = deterministic_embed(embed_text)

    rip_file = FIXTURES_DIR / "startups_rip_sample.json"
    with open(rip_file, "w", encoding="utf-8") as f:
        json.dump(STARTUPS_RIP_RECORDS, f, indent=2)
    print(f"Saved {len(STARTUPS_RIP_RECORDS)} records to {rip_file}")

    trustmrr_file = FIXTURES_DIR / "trustmrr_sample.json"
    with open(trustmrr_file, "w", encoding="utf-8") as f:
        json.dump(TRUSTMRR_RECORDS, f, indent=2)
    print(f"Saved {len(TRUSTMRR_RECORDS)} records to {trustmrr_file}")


if __name__ == "__main__":
    generate_fixtures()
