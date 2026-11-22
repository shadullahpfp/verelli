"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lightbulb, Sparkles, X } from "lucide-react";

interface IdeaInputCardProps {
  onExit?: () => void;
  onBack?: () => void;
  onSubmitIdea?: (idea: string) => void;
}

export default function IdeaInputCard({
  onExit,
  onBack,
  onSubmitIdea,
}: IdeaInputCardProps) {
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onBack) onBack();
        else if (onExit) onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, onExit]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ideaText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    if (onSubmitIdea) {
      onSubmitIdea(ideaText.trim());
    } else {
      // Default fallback alert/toast until Phase 4 endpoint connects
      setTimeout(() => {
        alert(`Idea submitted for validation analysis: "${ideaText.trim()}"`);
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleRawIdeaPreset = () => {
    setIdeaText(
      "An automated Stripe chargeback and payment disputes resolution agent that generates tailored evidence packages for B2B SaaS merchants."
    );
  };

  const sampleIdeas = [
    "AI chargeback dispute agent for Stripe",
    "B2B procurement negotiation copilot",
    "Automated PostgreSQL query indexer",
  ];

  const hasContent = ideaText.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#11120E] text-[#EDEFE6] overflow-y-auto select-none">
      {/* Prominent soft olive-sage radial backdrop glow */}
      <div
        className="fixed w-[680px] h-[420px] rounded-full blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(163, 184, 99, 0.25) 0%, rgba(17, 18, 14, 0) 70%)",
        }}
      />

      {/* Top Controls */}
      <div className="fixed top-5 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-[#9A9D93] hover:text-[#EDEFE6] bg-[#181916]/80 border border-[#2E3029] px-3 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft
              width={14}
              height={14}
              style={{ width: 14, height: 14 }}
              className="stroke-[2]"
            />
            <span>Back to 4-Step Overview</span>
          </button>
        ) : (
          <div />
        )}

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit to home"
            className="p-1.5 rounded-full bg-[#181916]/80 border border-[#2E3029] text-[#9A9D93] hover:text-[#EDEFE6] transition-colors"
          >
            <X
              width={16}
              height={16}
              style={{ width: 16, height: 16 }}
              className="stroke-[2]"
            />
          </button>
        )}
      </div>

      {/* Centered rounded card #23251F, 1px solid #44473E, rounded-3xl, max-w-[680px] */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="relative z-10 w-full max-w-[680px] bg-[#23251F] border border-[#44473E] rounded-3xl p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] my-auto"
      >
        {/* Header Tag */}
        <div className="flex items-center justify-center mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[#D8E29A] bg-[#1B200E] border border-[#363E1D] px-3 py-0.5 rounded-full">
            <Sparkles
              width={12}
              height={12}
              style={{ width: 12, height: 12 }}
              className="text-[#B8C468]"
            />
            <span>STAGE 1 · IDEA SYNTHESIS</span>
          </span>
        </div>

        {/* Heading: Instrument Serif italic "Enter your startup idea" */}
        <h2 className="text-[32px] sm:text-[40px] font-serif italic text-[#EDEFE6] leading-[1.05] tracking-[-0.01em] text-center">
          Enter your startup idea
        </h2>

        {/* Subtitle */}
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#9A9D93] text-center mt-2.5 max-w-lg mx-auto font-sans">
          We&apos;ll analyze your concept against 1,700+ dead startups and 12,000+ profitable SaaS businesses.
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-7">
          {/* Dark Outlined Input Box (rounded-xl border-[#5A5D52], bg-[#161713], focus ring #B8C468) */}
          <div className="relative">
            <textarea
              rows={4}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. An AI-powered agent that monitors Stripe chargebacks and disputes evidence automatically, or https://mylandingpage.com"
              className="w-full bg-[#161713] border border-[#5A5D52] focus:border-[#B8C468] focus:ring-1 focus:ring-[#B8C468] rounded-xl text-[#EDEFE6] placeholder-[#686B60] text-[15px] sm:text-[16px] leading-relaxed p-4 sm:p-5 outline-none resize-none transition-all shadow-inner"
            />
          </div>

          {/* Sample Chips */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-[#80979A]">Suggestions:</span>
            {sampleIdeas.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIdeaText(sample)}
                className="text-[11.5px] font-sans text-[#A6AC96] bg-[#1A1C16] border border-[#2E3029] hover:border-[#3A3D34] hover:text-[#EDEFE6] px-2.5 py-1 rounded-full transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* 2 Equal-Width Bottom Pill Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-7">
            {/* Left Button: Muted Moss #363E1D ("No website yet?") */}
            <button
              type="button"
              onClick={handleRawIdeaPreset}
              className="w-full bg-[#363E1D] hover:bg-[#454F26] text-[#C5D37A] border border-[#4F5A2C] font-medium text-[14px] sm:text-[14.5px] py-3.5 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Lightbulb
                width={16}
                height={16}
                style={{ width: 16, height: 16 }}
                className="stroke-[2]"
              />
              <span>No website yet?</span>
            </button>

            {/* Right Button: Matte Charcoal #373835 ("Continue" — dynamically turns #B8C468 pistachio when input is non-empty) */}
            <button
              type="submit"
              disabled={!hasContent || isSubmitting}
              className={`w-full font-medium text-[14px] sm:text-[14.5px] py-3.5 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                hasContent
                  ? "bg-[#B8C468] hover:bg-[#C6D276] text-[#14180A] font-semibold border-none shadow-[0_4px_16px_rgba(184,196,104,0.4)] transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
                  : "bg-[#373835] text-[#9E9F9A] border border-[#52544E] cursor-not-allowed opacity-80"
              }`}
            >
              <span>{isSubmitting ? "Synthesizing..." : "Continue"}</span>
              <ArrowRight
                width={16}
                height={16}
                style={{ width: 16, height: 16 }}
                className="stroke-[2.5]"
              />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
