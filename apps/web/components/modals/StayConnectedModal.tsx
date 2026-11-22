"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail } from "lucide-react";

interface StayConnectedModalProps {
  onClose: () => void;
  onConfirm: (preferences: { graveyardAlerts: boolean; mrrAlerts: boolean; email?: string }) => void;
}

export default function StayConnectedModal({ onClose, onConfirm }: StayConnectedModalProps) {
  const [graveyardAlerts, setGraveyardAlerts] = useState(true);
  const [mrrAlerts, setMrrAlerts] = useState(true);
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    onConfirm({
      graveyardAlerts,
      mrrAlerts,
      email: email.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop: backdrop-blur-xs bg-black/50 centered modal overlay ON TOP of the 4-step grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="relative z-10 w-full max-w-md bg-[#252622] border border-[#3A3D34] rounded-3xl p-6 sm:p-7 shadow-[0_25px_50px_rgba(0,0,0,0.85)] text-[#EDEFE6] select-none"
      >
        {/* Top Micro-Tag */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[11px] font-mono tracking-wider text-[#A6AC96] bg-[#1A1F0D] border border-[#363E1D] px-2.5 py-0.5 rounded-full">
            [✦ UPDATES & INTEL]
          </span>
        </div>

        {/* Heading: Instrument Serif italic */}
        <h3 className="text-[25px] sm:text-[27px] font-serif italic text-[#EDEFE6] leading-[1.12]">
          Stay updated on newly deceased startups & MRR breakouts
        </h3>

        <p className="text-[13px] leading-relaxed text-[#9A9D93] mt-2">
          Receive distilled failure post-mortems and Stripe-verified revenue signals directly in your inbox.
        </p>

        {/* Optional Email Input */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@domain.com (optional)"
              className="w-full bg-[#161713] border border-[#363E1D] focus:border-[#B8C468] focus:ring-1 focus:ring-[#B8C468] text-[#EDEFE6] placeholder-[#686B60] text-[13px] rounded-xl pl-9 pr-3.5 py-2.5 outline-none transition-all"
            />
            <Mail
              width={15}
              height={15}
              style={{ width: 15, height: 15 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#686B60] stroke-[1.8]"
            />
          </div>
        </div>

        {/* 2 Square Pistachio-Lime Checkboxes (#B8C468) */}
        <div className="mt-4 space-y-2.5">
          {/* Checkbox 1: Weekly Graveyard Post-Mortem Deconstructs */}
          <div
            onClick={() => setGraveyardAlerts(!graveyardAlerts)}
            className="flex items-start gap-3 p-3 rounded-xl bg-[#1B1D19] border border-[#2E3029] hover:border-[#3A3D34] cursor-pointer transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                graveyardAlerts
                  ? "bg-[#B8C468] text-[#14180A]"
                  : "bg-[#161713] border border-[#363E1D] text-transparent"
              }`}
            >
              <Check
                width={13}
                height={13}
                style={{ width: 13, height: 13 }}
                className="stroke-[3]"
              />
            </div>
            <div className="text-[13px] leading-snug">
              <span className="font-medium text-[#EDEFE6] block">
                Weekly Graveyard Post-Mortem Deconstructs
              </span>
              <span className="text-[12px] text-[#9A9D93]">
                Deep dives on YC startup fatal flaws, burned capital, and fatal CAC traps.
              </span>
            </div>
          </div>

          {/* Checkbox 2: Verified Micro-SaaS Niche Revenue Alerts */}
          <div
            onClick={() => setMrrAlerts(!mrrAlerts)}
            className="flex items-start gap-3 p-3 rounded-xl bg-[#1B1D19] border border-[#2E3029] hover:border-[#3A3D34] cursor-pointer transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                mrrAlerts
                  ? "bg-[#B8C468] text-[#14180A]"
                  : "bg-[#161713] border border-[#363E1D] text-transparent"
              }`}
            >
              <Check
                width={13}
                height={13}
                style={{ width: 13, height: 13 }}
                className="stroke-[3]"
              />
            </div>
            <div className="text-[13px] leading-snug">
              <span className="font-medium text-[#EDEFE6] block">
                Verified Micro-SaaS Niche Revenue Alerts
              </span>
              <span className="text-[12px] text-[#9A9D93]">
                Live Stripe notifications on solo founders reaching $10k+ to $50k+ MRR.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom-right actions: "Skip for now" (ghost text) + pistachio pill button "Confirm" (#B8C468 with #14180A text) */}
        <div className="mt-6 pt-3.5 border-t border-[#3A3D34]/70 flex items-center justify-between sm:justify-end gap-5">
          <button
            type="button"
            onClick={onClose}
            className="text-[#9A9D93] hover:text-[#EDEFE6] text-[13.5px] font-medium transition-colors px-2 py-1 focus:outline-none"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center justify-center bg-[#B8C468] hover:bg-[#C6D276] text-[#14180A] font-semibold text-[13.5px] px-6 py-2.5 rounded-full shadow-[0_4px_16px_rgba(184,196,104,0.35)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}
