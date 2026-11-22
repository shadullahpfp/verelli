"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Skull, ArrowRight, CornerDownLeft, Sparkles, X } from "lucide-react";
import StepCard from "./StepCard";

interface OnboardingFourGridProps {
  onExit?: () => void;
  onContinue: () => void;
}

export default function OnboardingFourGrid({
  onExit,
  onContinue,
}: OnboardingFourGridProps) {
  // Simulated typing text for Card 1
  const fullText = "AI copilot for B2B procurement...";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % (fullText.length + 1);
      setTypedText(fullText.slice(0, index));
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="fixed inset-0 z-40 bg-[#11120E] text-[#EDEFE6] overflow-y-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-between select-none">
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(184, 196, 104, 0.08) 0%, rgba(17, 18, 14, 0) 70%)",
        }}
      />

      {/* Top Bar with Exit */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 z-10 mb-2">
        <div className="flex items-center gap-2">
          <FlaskConical
            width={16}
            height={16}
            style={{ width: 16, height: 16 }}
            className="text-[#B8C468] stroke-[1.8]"
          />
          <span className="text-[13px] font-mono tracking-wider text-[#A6AC96]">
            verelli.lol
          </span>
        </div>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit onboarding"
            className="flex items-center gap-1.5 text-xs text-[#9A9D93] hover:text-[#EDEFE6] transition-colors p-1.5 rounded-lg hover:bg-[#1B1D19]"
          >
            <span className="hidden sm:inline">Exit</span>
            <X
              width={16}
              height={16}
              style={{ width: 16, height: 16 }}
              className="stroke-[1.8]"
            />
          </button>
        )}
      </div>

      {/* Top-Center Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto px-4 my-auto pt-2 pb-6">
        {/* Small Lime Flask Icon Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1B200E] border border-[#363E1D] px-3.5 py-1 rounded-full text-xs font-mono text-[#D8E29A] mb-3 shadow-sm">
          <FlaskConical
            width={14}
            height={14}
            style={{ width: 14, height: 14 }}
            className="text-[#B8C468] stroke-[2]"
          />
          <span>[✦ Product Experiment]</span>
        </div>

        {/* Heading: Instrument Serif italic "Welcome to Verelli.lol" */}
        <h1 className="text-[38px] sm:text-[50px] lg:text-[54px] font-serif italic text-[#EDEFE6] tracking-[-0.02em] leading-[1.05]">
          Welcome to Verelli.lol
        </h1>

        {/* Subtitle: clean sans */}
        <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#9A9D93] font-sans mt-3 max-w-xl">
          Validate your startup idea with hard data before writing a single line of code.
        </p>
      </div>

      {/* 4-Step Onboarding Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 my-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Build your Idea Profile */}
          <StepCard
            stepNumber="1"
            title="Build your Idea Profile"
            description="Enter a single sentence describing your product concept or input an existing landing page URL."
          >
            <div className="w-full flex flex-col gap-2.5">
              {/* Simulated input box with animated typing & blinking cursor */}
              <div className="w-full bg-[#161713] border border-[#363E1D] rounded-xl px-3 py-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center overflow-hidden">
                  <span className="text-[12px] font-sans text-[#EDEFE6] whitespace-nowrap">
                    {typedText}
                  </span>
                  <span className="inline-block w-1.5 h-3.5 bg-[#B8C468] ml-1 rounded-full animate-pulse" />
                </div>
                <CornerDownLeft
                  width={12}
                  height={12}
                  style={{ width: 12, height: 12 }}
                  className="text-[#686B60] shrink-0 ml-1"
                />
              </div>

              {/* Tag previews */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono bg-[#1B200E] border border-[#363E1D] text-[#C5D37A] px-2 py-0.5 rounded">
                  ● 1-Line Concept
                </span>
                <span className="text-[10px] font-mono bg-[#23251F] border border-[#2E3029] text-[#9A9D93] px-2 py-0.5 rounded">
                  URL Scanner
                </span>
              </div>
            </div>
          </StepCard>

          {/* Card 2: Scan the Startup Graveyard */}
          <StepCard
            stepNumber="2"
            title="Scan the Startup Graveyard"
            description="Match against 1,700+ deceased YC and venture-backed startups with post-mortem root causes."
          >
            <div className="w-full flex flex-col gap-2">
              {/* Skull Badge with Red Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#2A1111] text-[#F87171] border border-[#522222] px-2.5 py-0.5 rounded-full">
                  <Skull
                    width={12}
                    height={12}
                    style={{ width: 12, height: 12 }}
                    className="stroke-[2]"
                  />
                  <span>Dead Twin Identified</span>
                </span>
                <span className="text-[11px] font-mono text-[#D3B79C]">-$4.2M Burned</span>
              </div>

              {/* Red Failure Badge */}
              <div className="bg-[#211414] border border-[#441E1E] rounded-lg p-2 text-left">
                <div className="text-[11px] font-semibold text-[#F87171]">
                  Died 2023 · CAC exceeded LTV by 4.2x
                </div>
                <div className="text-[10.5px] italic font-serif text-[#C5BDBA] mt-1 line-clamp-2">
                  &ldquo;Scaled paid acquisition before proving unit retention in enterprise procurement.&rdquo;
                </div>
              </div>

              {/* Attribution */}
              <span className="text-[10px] text-[#80979A] font-mono">
                Startups.RIP Historical Archive
              </span>
            </div>
          </StepCard>

          {/* Card 3: Verify Live Niche MRR */}
          <StepCard
            stepNumber="3"
            title="Verify Live Niche MRR"
            description="Uncover 12,000+ Stripe-verified profitable micro-SaaS companies monetizing adjacent niches."
          >
            <div className="w-full flex flex-col gap-2">
              {/* Stripe Verified Indicator */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#142318] text-[#4ADE80] border border-[#234A29] px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                  Stripe Verified
                </span>
                <span className="text-[11px] font-mono text-[#A6AC96]">+18.4% MoM</span>
              </div>

              {/* Big MRR Stat */}
              <div className="bg-[#151D16] border border-[#253E2A] rounded-lg p-2 text-left">
                <div className="text-[24px] font-serif italic text-[#4ADE80] font-bold leading-none">
                  $31.2K MRR
                </div>
                <div className="text-[11px] text-[#A6AC96] font-mono mt-1">
                  410 Subscribers · $89 ARPU
                </div>
              </div>

              {/* Attribution */}
              <span className="text-[10px] text-[#80979A] font-mono">
                TrustMRR Live Verified Stream
              </span>
            </div>
          </StepCard>

          {/* Card 4: Create your Validation Book & 48h Plan */}
          <StepCard
            stepNumber="4"
            title="Create your Validation Book & 48h Plan"
            description="Synthesize survival probability, calibrated wedge angles, and a zero-code validation plan."
          >
            <div className="w-full flex flex-col gap-2">
              {/* Gauge Preview & Survival Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Miniature SVG Gauge */}
                  <div className="relative w-8 h-8">
                    <svg
                      width={32}
                      height={32}
                      style={{ width: 32, height: 32 }}
                      viewBox="0 0 36 36"
                      className="w-8 h-8 -rotate-90"
                    >
                      <path
                        className="text-[#2E3029]"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#B8C468]"
                        strokeDasharray="78, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#EDEFE6] font-mono">
                      78
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#D8E29A]">SURVIVAL</span>
                </div>
                <span className="text-[10px] font-mono bg-[#1B200E] border border-[#363E1D] text-[#C5D37A] px-2 py-0.5 rounded">
                  ✦ High Wedge
                </span>
              </div>

              {/* Checklist Mini Preview */}
              <div className="bg-[#181916] border border-[#2E3029] rounded-lg p-2 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[10.5px] text-[#EDEFE6]">
                  <span className="text-[#B8C468] text-xs font-bold">✓</span>
                  <span>Fake-door landing page (0-12h)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-[#EDEFE6]">
                  <span className="text-[#B8C468] text-xs font-bold">✓</span>
                  <span>Outbound wedge script (12-24h)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-[#EDEFE6]">
                  <span className="text-[#B8C468] text-xs font-bold">✓</span>
                  <span>Pre-sale deposit threshold (24-48h)</span>
                </div>
              </div>
            </div>
          </StepCard>
        </div>
      </div>

      {/* Bottom Center Pistachio-Lime Pill Button: "Let's go!" (#B8C468, text #14180A, routing to ?step=input) */}
      <div className="relative z-10 flex flex-col items-center mt-8 pb-4">
        <motion.button
          type="button"
          onClick={onContinue}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2.5 bg-[#B8C468] hover:bg-[#C6D276] text-[#14180A] font-semibold text-[16px] px-12 py-3.5 rounded-full shadow-[0_8px_24px_rgba(184,196,104,0.35)] transition-all duration-200"
        >
          <span>Let&apos;s go!</span>
          <ArrowRight
            width={16}
            height={16}
            style={{ width: 16, height: 16 }}
            className="stroke-[2.5]"
          />
        </motion.button>
        <span className="text-[12px] text-[#80979A] mt-2 font-mono">
          Takes ~60 seconds · No credit card required
        </span>
      </div>
    </section>
  );
}
