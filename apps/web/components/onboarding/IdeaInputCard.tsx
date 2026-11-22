"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Sparkles,
  X,
  AlertTriangle,
  RefreshCw,
  FlaskConical,
} from "lucide-react";
import { ValidationResponse, StoredVerdictData } from "@/types/verdict";
import { SAMPLE_VERDICT_DATA } from "@/lib/sampleVerdict";

interface IdeaInputCardProps {
  onExit?: () => void;
  onBack?: () => void;
  onSubmitIdea?: (idea: string) => void;
}

const ANALYZING_STEPS = [
  "Embedding your startup thesis...",
  "Scanning 1,740+ dead YC post-mortems...",
  "Cross-checking 12,000+ Stripe-verified MRR feeds...",
  "Synthesizing 48h zero-code validation playbook...",
];

export default function IdeaInputCard({
  onExit,
  onBack,
  onSubmitIdea,
}: IdeaInputCardProps) {
  const router = useRouter();
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Cycle through step ticker while analyzing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setTickerIndex((prev) => (prev + 1) % ANALYZING_STEPS.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isAnalyzing) {
        if (onBack) onBack();
        else if (onExit) onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, onExit, isAnalyzing]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = ideaText.trim();
    if (!trimmed || isSubmitting || isAnalyzing) return;

    setIsSubmitting(true);
    setIsAnalyzing(true);
    setErrorMessage(null);
    setTickerIndex(0);

    if (onSubmitIdea) {
      onSubmitIdea(trimmed);
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea_text: trimmed,
        }),
      });

      if (!response.ok) {
        let errorDetail = `Validation server returned ${response.status} ${response.statusText}`;
        try {
          const errorJson = await response.json();
          if (errorJson?.detail) {
            errorDetail =
              typeof errorJson.detail === "string"
                ? errorJson.detail
                : JSON.stringify(errorJson.detail);
          }
        } catch {
          // Keep response.statusText
        }
        throw new Error(errorDetail);
      }

      const data: ValidationResponse = await response.json();

      const storedPayload: StoredVerdictData = {
        report_id: data.report_id,
        idea_text: trimmed,
        verdict: data.verdict,
        created_at: new Date().toISOString(),
      };

      // Store report in sessionStorage (verelli_verdict_${report_id})
      try {
        sessionStorage.setItem(
          `verelli_verdict_${data.report_id}`,
          JSON.stringify(storedPayload)
        );
      } catch (storageErr) {
        console.warn("Unable to save verdict to sessionStorage:", storageErr);
      }

      // Smooth delay to complete visual ticker experience
      setTimeout(() => {
        router.push(`/verdict/${data.report_id}`);
      }, 600);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to validation engine. Please ensure the backend is running or check your connection.";
      setIsAnalyzing(false);
      setIsSubmitting(false);
      setErrorMessage(message);
    }
  };

  const handleUseOfflineDemo = () => {
    const demoPayload: StoredVerdictData = {
      ...SAMPLE_VERDICT_DATA,
      idea_text: ideaText.trim() || SAMPLE_VERDICT_DATA.idea_text,
      created_at: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem(
        `verelli_verdict_${demoPayload.report_id}`,
        JSON.stringify(demoPayload)
      );
    } catch (storageErr) {
      console.warn("sessionStorage warning:", storageErr);
    }
    router.push(`/verdict/${demoPayload.report_id}`);
  };

  const handleRawIdeaPreset = () => {
    setIdeaText(
      "An automated Stripe chargeback and payment disputes resolution agent that generates tailored evidence packages for B2B SaaS merchants."
    );
    setErrorMessage(null);
  };

  const sampleIdeas = [
    "AI chargeback dispute agent for Stripe",
    "B2B procurement negotiation copilot",
    "Automated PostgreSQL query indexer",
  ];

  const hasContent = ideaText.trim().length > 0;

  return (
    <>
      {/* Full-Screen Analyzing Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#11120E] text-[#EDEFE6] select-none"
          >
            {/* Pulsing soft radial olive glow */}
            <div
              className="fixed w-[720px] h-[520px] rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-0 animate-pulseSlow"
              style={{
                background:
                  "radial-gradient(circle, rgba(163, 184, 99, 0.25) 0%, rgba(17, 18, 14, 0) 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
              {/* Radar Scanner / Flask Pulse */}
              <div className="relative mb-8 flex items-center justify-center">
                {/* Outer concentric rings */}
                <div className="w-24 h-24 rounded-full border border-[#363E1D] animate-ping opacity-25" />
                <div className="absolute w-20 h-20 rounded-full border border-[#B8C468]/30 animate-pulse" />
                <div className="absolute w-14 h-14 rounded-full bg-[#181916] border border-[#4F5A2C] flex items-center justify-center shadow-[0_0_25px_rgba(184,196,104,0.35)]">
                  <FlaskConical
                    width={24}
                    height={24}
                    style={{ width: 24, height: 24 }}
                    className="text-[#B8C468] stroke-[1.8]"
                  />
                </div>
              </div>

              {/* Status Header Badge */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-[#B8C468] bg-[#1B200E] border border-[#363E1D] px-3.5 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8C468] animate-pulse" />
                <span>Vector Intelligence In Progress</span>
              </span>

              {/* Dynamic Step Ticker with AnimatePresence */}
              <div className="h-16 flex items-center justify-center px-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tickerIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="font-serif italic text-2xl sm:text-3xl text-[#EDEFE6] tracking-tight text-center"
                  >
                    {ANALYZING_STEPS[tickerIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Step Dots Progress */}
              <div className="flex items-center gap-2 mt-6">
                {ANALYZING_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === tickerIndex
                        ? "w-8 bg-[#B8C468]"
                        : idx < tickerIndex
                        ? "w-2 bg-[#4F5A2C]"
                        : "w-2 bg-[#2E3029]"
                    }`}
                  />
                ))}
              </div>

              {/* Idea Preview Snippet */}
              <div className="mt-8 px-5 py-3 rounded-xl bg-[#181916]/80 border border-[#2E3029] max-w-md">
                <p className="text-xs text-[#80979A] font-mono truncate">
                  Thesis: &ldquo;{ideaText.trim()}&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Idea Input Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#11120E] text-[#EDEFE6] overflow-y-auto select-none">
        {/* Soft olive-sage radial backdrop glow */}
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
              disabled={isAnalyzing}
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
              disabled={isAnalyzing}
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

          {/* Inline Error Banner if API connection fails */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl bg-[#2A1616] border border-[#F87171]/40 text-[#FCA5A5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle
                  width={16}
                  height={16}
                  style={{ width: 16, height: 16 }}
                  className="text-[#F87171] shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-[#EDEFE6]">
                    API Connection Issue
                  </p>
                  <p className="mt-0.5 text-[#E3B8B8] leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="inline-flex items-center gap-1.5 bg-[#3B2222] hover:bg-[#4D2A2A] text-[#EDEFE6] border border-[#F87171]/40 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <RefreshCw
                    width={12}
                    height={12}
                    style={{ width: 12, height: 12 }}
                  />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleUseOfflineDemo}
                  className="inline-flex items-center gap-1 bg-[#181916] hover:bg-[#242620] text-[#D8E29A] border border-[#363E1D] px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <span>Offline Demo</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Dark Outlined Input Box */}
            <div className="relative">
              <textarea
                rows={4}
                value={ideaText}
                onChange={(e) => {
                  setIdeaText(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isSubmitting}
                placeholder="e.g. An AI-powered agent that monitors Stripe chargebacks and disputes evidence automatically, or https://mylandingpage.com"
                className="w-full bg-[#161713] border border-[#5A5D52] focus:border-[#B8C468] focus:ring-1 focus:ring-[#B8C468] rounded-xl text-[#EDEFE6] placeholder-[#686B60] text-[15px] sm:text-[16px] leading-relaxed p-4 sm:p-5 outline-none resize-none transition-all shadow-inner disabled:opacity-60"
              />
            </div>

            {/* Sample Chips */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-[#80979A]">
                Suggestions:
              </span>
              {sampleIdeas.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setIdeaText(sample);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="text-[11.5px] font-sans text-[#A6AC96] bg-[#1A1C16] border border-[#2E3029] hover:border-[#3A3D34] hover:text-[#EDEFE6] px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
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
                disabled={isSubmitting}
                onClick={handleRawIdeaPreset}
                className="w-full bg-[#363E1D] hover:bg-[#454F26] text-[#C5D37A] border border-[#4F5A2C] font-medium text-[14px] sm:text-[14.5px] py-3.5 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Lightbulb
                  width={16}
                  height={16}
                  style={{ width: 16, height: 16 }}
                  className="stroke-[2]"
                />
                <span>No website yet?</span>
              </button>

              {/* Right Button: Continue */}
              <button
                type="submit"
                disabled={!hasContent || isSubmitting}
                className={`w-full font-medium text-[14px] sm:text-[14.5px] py-3.5 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                  hasContent && !isSubmitting
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
    </>
  );
}
