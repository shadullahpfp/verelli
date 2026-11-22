"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Skull,
  TrendingUp,
  Share2,
  Check,
  Compass,
  AlertOctagon,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Zap,
  Target,
  FileText,
  DollarSign,
  ChevronRight,
  Flame,
  Clock,
} from "lucide-react";
import { StoredVerdictData } from "@/types/verdict";
import SurvivalScoreGauge from "./SurvivalScoreGauge";

interface VerdictBentoProps {
  data: StoredVerdictData;
  isOfflineFallback?: boolean;
}

export default function VerdictBento({
  data,
  isOfflineFallback = false,
}: VerdictBentoProps) {
  const [copiedToast, setCopiedToast] = useState(false);
  const { verdict, idea_text } = data;

  // Format currency
  const formatMoney = (val: number) => {
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}M`;
    }
    if (val >= 1_000) {
      return `$${(val / 1_000).toFixed(val % 1_000 === 0 ? 0 : 1)}K`;
    }
    return `$${val}`;
  };

  // Copy punchy build-in-public summary card to clipboard
  const handleCopyVerdictCard = async () => {
    const twin1 = verdict.top_dead_twins[0];
    const twin2 = verdict.top_dead_twins[1];
    const deadTwinsStr = twin1
      ? `${twin1.name} (Burned ${formatMoney(twin1.capital_burned)})${
          twin2 ? `, ${twin2.name}` : ""
        }`
      : "None (>65% similarity)";

    const cashflow1 = verdict.top_cashflow_twins[0];
    const cashflowStr = cashflow1
      ? `${cashflow1.name} (${formatMoney(cashflow1.verified_mrr)}/mo)`
      : "Uncharted MRR cohort";

    const clipboardText = [
      `verelli.lol verdict for: ${idea_text}`,
      `Survival Score: ${verdict.survival_score}% | Risk: ${verdict.risk_level}`,
      `Dead Twins: ${deadTwinsStr}`,
      `Live MRR: ${cashflowStr}`,
      `Wedge: ${verdict.wedge_differentiation_angle}`,
      `Validated on verelli.lol`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    } catch (err) {
      console.error("Failed to copy card to clipboard:", err);
    }
  };

  // Handle Export / Print
  const handleExportBook = () => {
    window.print();
  };

  // Badge color helper
  const getRiskBadgeStyles = (risk: string) => {
    const lower = risk.toLowerCase();
    if (lower.includes("high-potential") || lower.includes("proven") || lower.includes("goldmine")) {
      return "bg-[#1B200E] text-[#D8E29A] border-[#4F5A2C]";
    }
    if (lower.includes("contested")) {
      return "bg-[#252219] text-[#EBD5BF] border-[#5A4D3B]";
    }
    if (lower.includes("uncharted")) {
      return "bg-[#1B2024] text-[#C5D0D6] border-[#3E4A52]";
    }
    return "bg-[#2A1616] text-[#FCA5A5] border-[#F87171]/40";
  };

  return (
    <div className="min-h-screen bg-[#11120E] text-[#F3F4EF] relative overflow-x-hidden selection:bg-[#B8C468] selection:text-[#14180A] pb-24">
      {/* Top Ambient Glow matching ?step=welcome */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 30% at 50% 0%, rgba(163, 184, 99, 0.10) 0%, rgba(17, 18, 14, 0) 75%)",
        }}
      />

      {/* Floating Momentary Toast */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#181916] border border-[#B8C468] text-[#F3F4EF] shadow-[0_12px_36px_rgba(0,0,0,0.8)] px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-medium"
          >
            <Check
              width={14}
              height={14}
              style={{ width: 14, height: 14 }}
              className="text-[#B8C468] stroke-[2.5]"
            />
            <span>Copied to clipboard! ✦</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-6 border-b border-[#23251F]">
          {/* Left: Verelli Labs Flask Logo & Verdict Tag */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#181916] border border-[#2A2C26] flex items-center justify-center group-hover:border-[#B8C468] transition-colors">
              <FlaskConical
                width={16}
                height={16}
                style={{ width: 16, height: 16 }}
                className="text-[#B8C468] stroke-[2]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-[#F3F4EF]">
                verelli.lol
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider bg-[#1B200E] text-[#C5D37A] border border-[#363E1D] px-2 py-0.5 rounded-full">
                VERDICT
              </span>
            </div>
          </Link>

          {/* Right Action Pills */}
          <div className="flex items-center gap-3">
            {/* "Validate another idea" muted moss pill */}
            <Link
              href="/?step=input"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#363E1D] hover:bg-[#454F26] text-[#C5D37A] border border-[#4F5A2C] px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
            >
              <Compass
                width={14}
                height={14}
                style={{ width: 14, height: 14 }}
              />
              <span>Validate another idea</span>
            </Link>

            {/* "Copy X Verdict Card" pistachio-lime pill */}
            <button
              type="button"
              onClick={handleCopyVerdictCard}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#B8C468] hover:bg-[#C6D276] text-[#14180A] px-4 py-2 rounded-full transition-all duration-200 shadow-[0_2px_12px_rgba(184,196,104,0.35)] transform active:scale-95"
            >
              <Share2
                width={14}
                height={14}
                style={{ width: 14, height: 14 }}
                className="stroke-[2.2]"
              />
              <span>Copy X Verdict Card</span>
            </button>
          </div>
        </header>

        {/* Offline Fallback Notice Banner */}
        {isOfflineFallback && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#1B1D16] border border-[#363E1D] flex items-center justify-between text-xs text-[#C5D37A]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8C468] animate-pulse" />
              <span>
                Demonstration Mode: Viewing verified benchmark dataset report
                (API fallback active).
              </span>
            </div>
            <Link
              href="/?step=input"
              className="text-[#EDEFE6] underline hover:text-[#B8C468]"
            >
              Run live query
            </Link>
          </div>
        )}

        {/* ============================================================ */}
        {/* ROW 1: Executive Verdict Hero Card                           */}
        {/* ============================================================ */}
        <section className="bg-[#181916] border border-[#2A2C26] rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col (8 cols on lg): Idea & Brutal Reality Check */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-3">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#80979A]">
                    Submitted Concept
                  </span>
                  <span
                    className={`text-[11px] font-mono px-3 py-0.5 rounded-full border ${getRiskBadgeStyles(
                      verdict.risk_level
                    )}`}
                  >
                    ● {verdict.risk_level}
                  </span>
                  {verdict.is_uncharted_niche && (
                    <span className="text-[11px] font-mono bg-[#1E2228] text-[#C5D0D6] border border-[#80979A] px-2.5 py-0.5 rounded-full">
                      ✦ Uncharted Niche (&lt; 0.65 Cosine Sim)
                    </span>
                  )}
                </div>

                {/* Submitted Idea Text in Italic Instrument Serif */}
                <h1 className="font-serif italic text-2xl sm:text-3xl lg:text-[34px] leading-[1.18] text-[#F3F4EF] tracking-[-0.01em]">
                  &ldquo;{idea_text}&rdquo;
                </h1>

                {/* Brutal Executive Reality Check */}
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#11120F] border border-[#23251F]">
                  <div className="flex items-start gap-2.5">
                    <Flame
                      width={16}
                      height={16}
                      style={{ width: 16, height: 16 }}
                      className="text-[#D3B79C] shrink-0 mt-0.5"
                    />
                    <p className="text-sm leading-relaxed text-[#D2D5CA] font-sans">
                      <strong className="text-[#F3F4EF] font-medium mr-1.5">
                        Executive Reality Check:
                      </strong>
                      {verdict.executive_verdict}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col (4 cols on lg): Circular SVG Survival Gauge with Soft Radial Glow */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#11120F] border border-[#23251F] rounded-2xl relative overflow-hidden">
              {/* Subtle Olive Radial Glow strictly behind circular gauge matching ?step=welcome */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(163, 184, 99, 0.14) 0%, rgba(17, 18, 15, 0) 70%)",
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <SurvivalScoreGauge
                  score={verdict.survival_score}
                  riskLevel={verdict.risk_level}
                />
                <p className="text-[11px] font-mono text-[#80979A] text-center mt-3">
                  Calibrated against 1,740+ bankruptcies &amp; 12K+ Stripe feeds
                </p>
              </div>
            </div>
          </div>

          {/* Zero-Hallucination Fallback Callout (if uncharted niche) */}
          {verdict.is_uncharted_niche && (
            <div className="mt-6 p-5 rounded-2xl bg-[#11120F] border border-[#23251F] text-xs">
              <div className="flex items-start gap-3">
                <ShieldAlert
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                  className="text-[#80979A] shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-[#F3F4EF] text-sm">
                    Zero-Hallucination Fallback Active
                  </h4>
                  <p className="mt-1 text-[#9A9D93] leading-relaxed">
                    Cosine distance query returned no direct matches exceeding
                    the mandatory 0.65 similarity threshold in either the YC
                    graveyard or live Stripe cohorts. Rather than hallucinating
                    synthetic comparisons, verelli.lol identifies this as an
                    uncharted niche with the following structural warnings:
                  </p>
                  {verdict.adjacent_market_warnings &&
                    verdict.adjacent_market_warnings.length > 0 && (
                      <ul className="mt-3 space-y-1.5 pl-4 list-disc text-[#C5D0D6]">
                        {verdict.adjacent_market_warnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* ROW 2: Split Bento (Graveyard Twins & Cashflow Twins)        */}
        {/* ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Graveyard Twins (Startups.RIP) */}
          <div className="bg-[#181916] border border-[#2A2C26] rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#23251F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#11120F] border border-[#23251F] flex items-center justify-center">
                  <Skull
                    width={16}
                    height={16}
                    style={{ width: 16, height: 16 }}
                    className="text-[#F87171] stroke-[2]"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F3F4EF] tracking-tight">
                    Startups.RIP Graveyard Twins
                  </h3>
                  <p className="text-[11px] text-[#80979A]">
                    1,740+ deceased YC post-mortems
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#F87171] bg-[#1A1212] border border-[#F87171]/30 px-2.5 py-0.5 rounded-full">
                {verdict.top_dead_twins.length} Matched
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {verdict.top_dead_twins.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#11120F] border border-[#23251F] text-center text-xs text-[#80979A]">
                  No direct graveyard twins above 65% cosine similarity.
                </div>
              ) : (
                verdict.top_dead_twins.map((twin, idx) => (
                  <div
                    key={idx}
                    className="bg-[#11120F] border border-[#23251F] hover:border-[#2A2C26] rounded-2xl p-5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[15px] text-[#F3F4EF]">
                            {twin.name}
                          </span>
                          {twin.yc_batch && (
                            <span className="text-[10px] font-mono bg-[#181916] text-[#A6AC96] border border-[#23251F] px-2 py-0.5 rounded">
                              {twin.yc_batch}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-[#F87171] bg-[#F87171]/10 border border-[#F87171]/30 px-2 py-0.5 rounded-full">
                            {formatMoney(twin.capital_burned)} burned
                          </span>
                        </div>
                        <p className="text-[11px] text-[#80979A] mt-0.5">
                          Shut down {twin.died_year}
                        </p>
                      </div>

                      <span className="text-[11px] font-mono text-[#80979A] bg-[#181916] border border-[#23251F] px-2 py-0.5 rounded shrink-0">
                        {Math.round(twin.similarity_score * 100)}% match
                      </span>
                    </div>

                    {/* Terracotta Fatal Flaw Pill */}
                    <div className="mt-3 p-3 rounded-xl bg-[#1A1212] border border-[#F87171]/25 text-xs text-[#FCA5A5] leading-relaxed">
                      <strong className="text-[#F87171] block mb-0.5 font-medium">
                        Fatal Cause of Death:
                      </strong>
                      {twin.fatal_flaw}
                    </div>

                    {/* Founder Post-Mortem Quote with leading-relaxed & p-4 */}
                    {twin.post_mortem_quote && (
                      <div className="mt-3.5 p-4 rounded-xl bg-[#181916] border border-[#23251F] border-l-2 border-l-[#D3B79C]/60 text-[12.5px] italic font-serif text-[#C5D0D6] leading-relaxed">
                        &ldquo;{twin.post_mortem_quote}&rdquo;
                      </div>
                    )}

                    {twin.source_url && (
                      <div className="mt-3 text-right">
                        <a
                          href={twin.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#80979A] hover:text-[#EDEFE6] transition-colors"
                        >
                          <span>Read full post-mortem</span>
                          <ExternalLink
                            width={10}
                            height={10}
                            style={{ width: 10, height: 10 }}
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Cashflow Twins (TrustMRR) */}
          <div className="bg-[#181916] border border-[#2A2C26] rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#23251F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#11120F] border border-[#23251F] flex items-center justify-center">
                  <TrendingUp
                    width={16}
                    height={16}
                    style={{ width: 16, height: 16 }}
                    className="text-[#4ADE80] stroke-[2]"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F3F4EF] tracking-tight">
                    TrustMRR Cashflow Twins
                  </h3>
                  <p className="text-[11px] text-[#80979A]">
                    12,000+ Stripe-verified MRR feeds
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#4ADE80] bg-[#122416] border border-[#4ADE80]/30 px-2.5 py-0.5 rounded-full">
                ● Live Stripe Feeds
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {verdict.top_cashflow_twins.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#11120F] border border-[#23251F] text-center text-xs text-[#80979A]">
                  No direct cashflow twins above 65% cosine similarity.
                </div>
              ) : (
                verdict.top_cashflow_twins.map((twin, idx) => (
                  <div
                    key={idx}
                    className="bg-[#11120F] border border-[#23251F] hover:border-[#2A2C26] rounded-2xl p-5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[15px] text-[#F3F4EF]">
                            {twin.name}
                          </span>
                          <span className="font-serif italic text-lg text-[#4ADE80] font-normal">
                            {formatMoney(twin.verified_mrr)}/mo
                          </span>
                        </div>
                        <p className="text-[11px] text-[#80979A] mt-0.5">
                          {twin.subscribers_count.toLocaleString()} paying
                          subscribers
                        </p>
                      </div>

                      <span className="text-[11px] font-mono text-[#80979A] bg-[#181916] border border-[#23251F] px-2 py-0.5 rounded shrink-0">
                        {Math.round(twin.similarity_score * 100)}% match
                      </span>
                    </div>

                    {/* Pricing Tier Pill */}
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase text-[#80979A]">
                        Monetization:
                      </span>
                      <span className="text-[11.5px] font-sans text-[#D8E29A] bg-[#1B200E] border border-[#363E1D] px-2.5 py-0.5 rounded-full">
                        {twin.pricing_tier}
                      </span>
                    </div>

                    {/* Acquisition Wedge */}
                    <div className="mt-3 p-3.5 rounded-xl bg-[#181916] border border-[#23251F] text-xs text-[#D2D5CA] leading-relaxed">
                      <span className="text-[#80979A] font-mono text-[10px] uppercase block mb-0.5">
                        Winning Acquisition Wedge:
                      </span>
                      {twin.primary_acquisition_channel}
                    </div>

                    {twin.live_url && (
                      <div className="mt-3 text-right">
                        <a
                          href={twin.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#80979A] hover:text-[#4ADE80] transition-colors"
                        >
                          <span>Inspect live product</span>
                          <ExternalLink
                            width={10}
                            height={10}
                            style={{ width: 10, height: 10 }}
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ROW 3: 48-Hour Zero-Code Validation Playbook                 */}
        {/* ============================================================ */}
        <section className="bg-[#181916] border border-[#2A2C26] rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#23251F]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                  className="text-[#B8C468] stroke-[2]"
                />
                <h2 className="text-xl sm:text-2xl font-serif italic text-[#F3F4EF]">
                  48-Hour Zero-Code Validation Playbook
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#80979A]">
                Tactical execution sprint structured to bypass the Graveyard
                Twins&apos; fatal distribution mistakes
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportBook}
              className="inline-flex items-center gap-2 bg-[#11120F] hover:bg-[#181916] text-[#F3F4EF] border border-[#2A2C26] px-4 py-2 rounded-full text-xs font-medium transition-colors shrink-0"
            >
              <FileText
                width={14}
                height={14}
                style={{ width: 14, height: 14 }}
              />
              <span>Export Validation Book (PDF)</span>
            </button>
          </div>

          {/* Wedge Angle Banner */}
          <div className="mb-8 p-5 rounded-2xl bg-[#11120F] border border-[#363E1D]">
            <div className="flex items-start gap-3">
              <Target
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
                className="text-[#B8C468] shrink-0 mt-0.5"
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B8C468] block mb-1">
                  Counter-Intuitive Wedge Strategy
                </span>
                <p className="text-sm font-sans text-[#F3F4EF] leading-relaxed">
                  {verdict.wedge_differentiation_angle}
                </p>
              </div>
            </div>
          </div>

          {/* Numbered 3-Step Actionable Sprint Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {verdict.validation_playbook_48h.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#11120F] border border-[#23251F] rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif italic text-2xl text-[#80979A]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#B8C468] bg-[#181916] border border-[#363E1D] px-2.5 py-0.5 rounded-full">
                      {step.timeframe}
                    </span>
                  </div>

                  <h4 className="text-[15px] font-semibold text-[#F3F4EF] leading-snug mb-2">
                    {step.title}
                  </h4>

                  <p className="text-xs text-[#9A9D93] leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                {/* Tactical Deliverable */}
                <div className="mt-5 pt-3 border-t border-[#23251F]">
                  <span className="text-[10px] font-mono uppercase text-[#80979A] block mb-1">
                    Deliverable:
                  </span>
                  <div className="p-3 rounded-xl bg-[#181916] border border-[#23251F] text-[11.5px] text-[#D8E29A] font-mono leading-relaxed">
                    {step.tactical_deliverable}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Deadly Pitfalls to Avoid Callout */}
          {verdict.deadly_pitfalls_to_avoid &&
            verdict.deadly_pitfalls_to_avoid.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#23251F]">
                <h4 className="text-xs font-mono uppercase text-[#F87171] tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertOctagon
                    width={14}
                    height={14}
                    style={{ width: 14, height: 14 }}
                  />
                  <span>Deadly Category Pitfalls to Evade</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {verdict.deadly_pitfalls_to_avoid.map((pitfall, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#11120F] border border-[#F87171]/20 text-xs text-[#E8C0C0] leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-[#F87171] font-mono mt-0.5">•</span>
                      <span>{pitfall}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </section>

        {/* Minimal Footer */}
        <footer className="text-center pt-8 pb-12 border-t border-[#23251F] text-xs text-[#686B60]">
          <p>
            verelli.lol — Pre-Build Quantitative Feasibility Engine.
          </p>
          <p className="mt-1">
            Data sourced from Startups.RIP (1,740+ post-mortems) and TrustMRR
            (12,000+ Stripe feeds).
          </p>
        </footer>
      </div>
    </div>
  );
}
