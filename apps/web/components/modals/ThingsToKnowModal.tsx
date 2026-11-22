"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Database, ShieldCheck, Scale, ExternalLink } from "lucide-react";

interface ThingsToKnowModalProps {
  onExit: () => void;
  onAgree: () => void;
}

export default function ThingsToKnowModal({ onExit, onAgree }: ThingsToKnowModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop: #121210 with backdrop-blur-md */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onExit}
        className="fixed inset-0 bg-[#121210]/80 backdrop-blur-md cursor-pointer"
        aria-hidden="true"
      />

      {/* Centered matte charcoal card #252622, rounded-3xl, max-w-lg, border 1px solid #3A3D34 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        transition={{ type: "spring", stiffness: 340, damping: 26, mass: 0.9 }}
        className="relative z-10 w-full max-w-lg bg-[#252622] border border-[#3A3D34] rounded-3xl p-6 sm:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.85)] text-[#EDEFE6] my-auto select-none"
      >
        {/* Top Experiment Pill */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[#A6AC96] bg-[#1A1F0D] border border-[#363E1D] px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8C468]" />
            DATA DISCLOSURE & ETHICS
          </span>
        </div>

        {/* Heading: Instrument Serif italic "Things to know before we begin" */}
        <h2 className="text-[30px] sm:text-[34px] font-serif italic text-[#EDEFE6] leading-[1.08] tracking-[-0.01em]">
          Things to know before we begin
        </h2>

        <p className="text-[13.5px] text-[#9A9D93] mt-2 leading-relaxed">
          verelli.lol operates as a quantitative startup feasibility engine. Please review our data provenance and operational guidelines.
        </p>

        {/* Transparency Items with Underlined Olive-Tinted Links */}
        <div className="mt-6 space-y-4">
          {/* Item 1: Data Provenance */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1B1D19] border border-[#2E3029]">
            <div className="p-2 rounded-xl bg-[#23251F] border border-[#363E1D] text-[#B8C468] shrink-0 mt-0.5">
              <Database
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
                className="stroke-[1.8]"
              />
            </div>
            <div className="text-[13px] leading-relaxed text-[#D2D6C8]">
              <span className="font-semibold text-[#EDEFE6] block mb-0.5">
                Authentic Data Provenance
              </span>
              Ingested from 1,700+ deceased venture post-mortems via{" "}
              <a
                href="https://startups.rip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#C5D37A] underline decoration-[#5A6332] underline-offset-4 hover:text-[#D8E29A] transition-colors"
              >
                <span>Startups.RIP</span>
                <ExternalLink
                  width={11}
                  height={11}
                  style={{ width: 11, height: 11 }}
                  className="inline stroke-[2]"
                />
              </a>{" "}
              and 12,000+ Stripe-verified micro-SaaS metrics governed by{" "}
              <a
                href="https://trustmrr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#C5D37A] underline decoration-[#5A6332] underline-offset-4 hover:text-[#D8E29A] transition-colors"
              >
                <span>TrustMRR data terms</span>
                <ExternalLink
                  width={11}
                  height={11}
                  style={{ width: 11, height: 11 }}
                  className="inline stroke-[2]"
                />
              </a>
              . We do not fabricate competitors or synthetic revenue.
            </div>
          </div>

          {/* Item 2: Probabilistic Matching */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1B1D19] border border-[#2E3029]">
            <div className="p-2 rounded-xl bg-[#23251F] border border-[#363E1D] text-[#80979A] shrink-0 mt-0.5">
              <Scale
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
                className="stroke-[1.8]"
              />
            </div>
            <div className="text-[13px] leading-relaxed text-[#D2D6C8]">
              <span className="font-semibold text-[#EDEFE6] block mb-0.5">
                Cosine Similarity & Feasibility
              </span>
              Vectors compute semantic cosine distance across problem statements, unit economics, and CAC failure modes. Scores reflect historical risk density and do not constitute legal or financial investment advice.
            </div>
          </div>

          {/* Item 3: Privacy & Idea Security */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1B1D19] border border-[#2E3029]">
            <div className="p-2 rounded-xl bg-[#23251F] border border-[#363E1D] text-[#B8C468] shrink-0 mt-0.5">
              <ShieldCheck
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
                className="stroke-[1.8]"
              />
            </div>
            <div className="text-[13px] leading-relaxed text-[#D2D6C8]">
              <span className="font-semibold text-[#EDEFE6] block mb-0.5">
                Privacy & Idea Protection
              </span>
              Your submitted startup idea is embedded ephemerally in memory solely for vector similarity synthesis. Raw ideas are never shared, sold, or trained into open foundation models.
            </div>
          </div>
        </div>

        {/* Bottom-right actions: Plain text "Exit" (ghost text) & dark olive pill button "Agree & continue" */}
        <div className="mt-7 pt-4 border-t border-[#3A3D34]/70 flex items-center justify-between sm:justify-end gap-5">
          <button
            type="button"
            onClick={onExit}
            className="text-[#9A9D93] hover:text-[#EDEFE6] text-[14.5px] font-medium transition-colors px-2 py-1 focus:outline-none"
          >
            Exit
          </button>

          <button
            type="button"
            onClick={onAgree}
            className="inline-flex items-center justify-center bg-[#1B200E] hover:bg-[#283015] text-[#D8E29A] border border-[#363E1D] text-[14px] font-medium px-6 py-2.5 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Agree & continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
