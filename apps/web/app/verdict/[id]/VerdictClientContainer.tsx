"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FlaskConical, AlertTriangle, RefreshCw, Compass } from "lucide-react";
import { StoredVerdictData, ValidationResponse } from "@/types/verdict";
import { SAMPLE_VERDICT_DATA } from "@/lib/sampleVerdict";
import VerdictBento from "@/components/verdict/VerdictBento";

interface VerdictClientContainerProps {
  id: string;
}

export default function VerdictClientContainer({
  id,
}: VerdictClientContainerProps) {
  const [data, setData] = useState<StoredVerdictData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const loadVerdict = useCallback(async () => {
    setIsLoading(true);

    // Step 1: Check sessionStorage first
    try {
      const cached = sessionStorage.getItem(`verelli_verdict_${id}`);
      if (cached) {
        const parsed: StoredVerdictData = JSON.parse(cached);
        if (parsed?.verdict) {
          setData(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Error reading from sessionStorage:", e);
    }

    // Step 2: Fetch directly from API
    try {
      const res = await fetch(`${API_URL}/api/v1/verdict/${id}`);
      if (!res.ok) {
        throw new Error(`Verdict API returned status ${res.status}`);
      }
      const apiResponse: ValidationResponse = await res.json();
      const storedPayload: StoredVerdictData = {
        report_id: apiResponse.report_id,
        idea_text: "Analyzed startup thesis",
        verdict: apiResponse.verdict,
        created_at: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem(
          `verelli_verdict_${id}`,
          JSON.stringify(storedPayload)
        );
      } catch (err) {
        console.warn("Failed to update sessionStorage:", err);
      }

      setData(storedPayload);
      setIsLoading(false);
    } catch (apiErr: unknown) {
      console.warn("Direct API fetch failed, falling back to sample verdict:", apiErr);
      // Fallback to sample verdict data if offline
      const fallbackPayload: StoredVerdictData = {
        ...SAMPLE_VERDICT_DATA,
        report_id: id,
      };
      setData(fallbackPayload);
      setIsOfflineFallback(true);
      setIsLoading(false);
    }
  }, [id, API_URL]);

  useEffect(() => {
    loadVerdict();
  }, [loadVerdict]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#11120E] text-[#F3F4EF] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Soft Clean Ambient Glow matching ?step=welcome */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 30% at 50% 0%, rgba(163, 184, 99, 0.10) 0%, rgba(17, 18, 14, 0) 75%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#181916] border border-[#363E1D] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(184,196,104,0.25)] animate-pulse">
            <FlaskConical
              width={26}
              height={26}
              style={{ width: 26, height: 26 }}
              className="text-[#B8C468] stroke-[1.8]"
            />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-3xl text-[#EDEFE6] mb-2">
            Loading Verdict Workspace...
          </h2>
          <p className="text-xs font-mono text-[#80979A]">
            Report ID: {id}
          </p>
        </div>
      </div>
    );
  }

  // Render Verdict Bento
  if (data) {
    return <VerdictBento data={data} isOfflineFallback={isOfflineFallback} />;
  }

  // Fallback Error View (unlikely due to offline fallback)
  return (
    <div className="min-h-screen bg-[#11120E] text-[#EDEFE6] flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle
        width={36}
        height={36}
        style={{ width: 36, height: 36 }}
        className="text-[#F87171] mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">Verdict Report Not Found</h2>
      <p className="text-sm text-[#9A9D93] max-w-md mb-6">
        We could not locate this validation report. It may have expired or the
        backend server is unreachable.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={loadVerdict}
          className="inline-flex items-center gap-1.5 bg-[#1B200E] text-[#D8E29A] border border-[#363E1D] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#283015] transition-colors"
        >
          <RefreshCw
            width={14}
            height={14}
            style={{ width: 14, height: 14 }}
          />
          <span>Retry</span>
        </button>
        <Link
          href="/?step=input"
          className="inline-flex items-center gap-1.5 bg-[#B8C468] text-[#14180A] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#C6D276] transition-colors"
        >
          <Compass
            width={14}
            height={14}
            style={{ width: 14, height: 14 }}
          />
          <span>Validate New Idea</span>
        </Link>
      </div>
    </div>
  );
}
