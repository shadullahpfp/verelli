"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Sparkles, Database, ArrowRight, ShieldCheck, Activity, Terminal } from "lucide-react";
import Link from "next/link";

export default function ExperimentShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full bg-[#191E0B] overflow-hidden pt-12 pb-24 px-4 border-t border-[#232815]">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#B8C468]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto">
        {/* Section Headline */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#23261C] border border-[#363E1D] text-[#C5D37A] text-xs font-mono mb-3">
            <Sparkles width={14} height={14} style={{ width: 14, height: 14 }} className="w-3.5 h-3.5" />
            <span>Product Walkthrough & Technical Proof</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif italic text-[#EDEFE6] tracking-tight">
            How verelli.lol validates before you build
          </h2>
          <p className="text-[#9A9D93] text-sm md:text-base max-w-xl mx-auto mt-2.5">
            Cross-indexing 1,700+ YC graveyard post-mortems against 12,000+ live Stripe revenue feeds in seconds.
          </p>
        </div>

        {/* Video Player Showcase Frame */}
        <div className="relative overflow-hidden aspect-video max-w-4xl mx-auto rounded-2xl border border-[#2E3029] bg-[#14170A]">
          {/* Background poster image behind video container content */}
          <Image
            src="/hero/video-poster.webp"
            alt="Experiment video preview"
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover opacity-60 pointer-events-none z-0"
          />

          {/* Ambient Dashboard Wireframe in Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none p-6 flex flex-col justify-between font-mono text-xs z-0">
            <div className="flex justify-between items-center text-[#80979A] border-b border-[#2E3029] pb-3">
              <span className="flex items-center gap-2">
                <Terminal width={16} height={16} style={{ width: 16, height: 16 }} className="w-4 h-4 text-pomelli-lime" />
                <span>verelli-pipeline --eval-live-mrr</span>
              </span>
              <span className="text-emerald-400">pgvector: 1536 dims ok</span>
            </div>
            <div className="grid grid-cols-3 gap-4 my-auto">
              <div className="bg-[#1C1F16] p-4 rounded-xl border border-[#2E3029]">
                <div className="text-[10px] text-[#80979A]">Startups.RIP Matches</div>
                <div className="text-lg font-bold text-red-400 mt-1">3 Fatal Traps</div>
              </div>
              <div className="bg-[#1C1F16] p-4 rounded-xl border border-[#2E3029]">
                <div className="text-[10px] text-[#80979A]">TrustMRR Cohort</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">$48.2K Median MRR</div>
              </div>
              <div className="bg-[#1C1F16] p-4 rounded-xl border border-[#2E3029]">
                <div className="text-[10px] text-[#80979A]">48h Wedge Strategy</div>
                <div className="text-lg font-bold text-pomelli-lime mt-1">Ready</div>
              </div>
            </div>
            <div className="flex justify-between text-[#80979A] border-t border-[#2E3029] pt-3 text-[10px]">
              <span>Latency: 142ms</span>
              <span>Vector Similarity: 0.812</span>
            </div>
          </div>

          {/* Top-Left Overlay Inside Player */}
          <div className="absolute top-5 left-5 md:top-7 md:left-7 flex items-center gap-2 z-10">
            <div className="w-8 h-8 rounded-full bg-[#1F2412]/90 backdrop-blur-md border border-[#3A451D] flex items-center justify-center">
              <Database width={16} height={16} style={{ width: 16, height: 16 }} className="w-4 h-4 text-pomelli-lime" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-medium text-[#EDEFE6] tracking-tight">
                Introducing verelli.lol
              </span>
              <span className="text-[10px] font-mono text-[#80979A]">
                Live Data Pipeline
              </span>
            </div>
          </div>

          {/* Top-Right Status Indicator */}
          <div className="absolute top-5 right-5 md:top-7 md:right-7 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B12]/80 backdrop-blur-md border border-[#2E351E] text-[11px] font-mono text-[#C5D37A]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEED</span>
            </div>
          </div>

          {/* Center Lockup Inside Player (Relative z-10 overlay) */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
            <h3 className="text-4xl md:text-6xl font-serif italic text-[#F3F4EF] tracking-tight drop-shadow-md">
              verelli.lol
            </h3>

            {/* Red Play Pill Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label="Play experiment preview"
              className="my-4 group/btn relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Play width={24} height={24} style={{ width: 24, height: 24 }} className="w-6 h-6 fill-current translate-x-0.5 text-white" />
            </button>

            {/* Outlined Pill "EXPERIMENT" */}
            <div className="border border-[#8C9184]/70 rounded-full px-5 py-1.5 tracking-[0.25em] text-xs font-mono text-[#D5D8CE] uppercase mt-1">
              EXPERIMENT
            </div>

            {/* Subtitle */}
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#80979A] mt-2">
              VERELLI.LOL / PIPELINE
            </span>
          </div>

          {/* Bottom Bar Inside Player */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between z-10 text-[11px] font-mono text-[#80979A]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck width={14} height={14} style={{ width: 14, height: 14 }} className="w-3.5 h-3.5 text-pomelli-lime" />
              <span>Stripe-Verified & YC Post-Mortem Datasets</span>
            </span>
            <Link
              href="/?step=terms"
              className="text-[#C5D37A] hover:underline flex items-center gap-1"
            >
              <span>Test Idea</span>
              <ArrowRight width={12} height={12} style={{ width: 12, height: 12 }} className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Minimal Footer at Bottom */}
        <footer className="mt-20 pt-8 border-t border-[#232815] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#80979A]">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-lg text-[#EDEFE6]">verelli.lol</span>
            <span>•</span>
            <span>© 2026 verelli.lol Labs. A Product Experiment.</span>
          </div>

          <div className="flex items-center gap-6 text-[12px]">
            <Link
              href="/?step=terms"
              className="hover:text-[#EDEFE6] transition-colors"
            >
              Data Sources (Startups.RIP & TrustMRR)
            </Link>
            <Link
              href="/?step=terms"
              className="hover:text-[#EDEFE6] transition-colors"
            >
              Terms & Privacy
            </Link>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3 h-3" />
              <span>API Status: Operational</span>
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
