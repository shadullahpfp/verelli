"use client";

import React from "react";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function StepCard({
  stepNumber,
  title,
  description,
  children,
}: StepCardProps) {
  return (
    <div className="w-full min-w-[260px] h-[450px] bg-[#181916] border border-[#2E3029] hover:border-[#3A3D34] rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-[0_16px_36px_rgba(0,0,0,0.5)] select-none">
      {/* Upper Half: Large subtle step number, title, concise description */}
      <div>
        <div className="text-[28px] font-bold text-[#80979A] leading-none font-sans">
          {stepNumber}
        </div>
        <h3 className="text-[17.5px] font-semibold text-[#EDEFE6] mt-3 leading-snug font-sans">
          {title}
        </h3>
        <p className="text-[13px] text-[#9A9D93] mt-2 leading-relaxed line-clamp-2 font-sans">
          {description}
        </p>
      </div>

      {/* Lower Half: Inset Preview Container illuminated by soft radial olive glow */}
      <div className="relative w-full h-[210px] rounded-2xl bg-[#11120E] border border-[#23251F] overflow-hidden p-3.5 flex flex-col items-center justify-center">
        {/* Soft radial olive glow: radial-gradient(circle, rgba(163, 184, 99, 0.22) 0%, rgba(17, 18, 14, 0) 70%) */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(163, 184, 99, 0.22) 0%, rgba(17, 18, 14, 0) 70%)",
          }}
        />

        {/* Inner Preview Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
