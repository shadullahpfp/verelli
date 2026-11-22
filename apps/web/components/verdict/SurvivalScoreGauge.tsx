"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SurvivalScoreGaugeProps {
  score: number; // 0 to 100
  riskLevel: string;
}

export default function SurvivalScoreGauge({
  score,
  riskLevel,
}: SurvivalScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // SVG Geometry
  const size = 148;
  const strokeWidth = 9;
  const radius = (size - strokeWidth * 2) / 2; // radius ~ 65
  const circumference = 2 * Math.PI * radius; // ~ 408.4

  useEffect(() => {
    // Animate score counter smoothly
    const duration = 1200;
    const startTime = performance.now();
    const startScore = 0;
    const targetScore = Math.max(0, Math.min(100, score));

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(startScore + (targetScore - startScore) * eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  // Stroke offset
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine stroke color based on survival score & risk
  const getStrokeColor = (val: number) => {
    if (val >= 70) return "#4ADE80"; // soft emerald / pistachio
    if (val >= 45) return "#D3B79C"; // warm ochre / amber
    return "#F87171"; // terracotta / crimson
  };

  const strokeColor = getStrokeColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Soft radial glow behind gauge */}
        <div
          className="absolute inset-0 rounded-full blur-[24px] pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(circle, ${strokeColor} 0%, transparent 70%)`,
          }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ width: size, height: size }}
          className="transform -rotate-90"
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#262822"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated active score circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Center Display: Instrument Serif Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif italic text-4xl sm:text-5xl font-normal text-[#EDEFE6] tracking-tight leading-none">
            {animatedScore}%
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#80979A] mt-1">
            Survival
          </span>
        </div>
      </div>
    </div>
  );
}
