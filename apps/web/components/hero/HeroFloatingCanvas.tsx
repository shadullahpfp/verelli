"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FlaskConical } from "lucide-react";

export default function HeroFloatingCanvas() {
  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid mouse movement
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      mouseX.set(x * 14);
      mouseY.set(y * 14);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative w-full h-screen min-h-[760px] max-h-[960px] flex flex-col items-center justify-center overflow-hidden bg-[#191E0B] pt-8 pb-16 px-4 select-none">
      {/* Subtle camera film-grain noise overlay (scoped to Hero only) */}
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* Background vignette & ambient olive-green lighting spots */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, transparent 35%, rgba(10, 12, 5, 0.7) 100%)",
        }}
      />
      {/* Soft olive-green ambient light spot behind center */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[rgba(65,78,30,0.35)] blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
      {/* Soft olive-green ambient light spot behind right cards */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[rgba(65,78,30,0.30)] blur-[120px] pointer-events-none top-[35%] right-[8%] z-0" />

      {/* Top Header Bar */}
      <header className="absolute top-5 left-6 flex items-center gap-2.5 z-30">
        <FlaskConical
          width={20}
          height={20}
          style={{ width: 20, height: 20 }}
          className="w-5 h-5 text-white stroke-[1.8]"
        />
        <span className="text-[15px] font-medium text-[#E4E6DE]">
          Verelli Labs
        </span>
        <span className="text-[11px] font-mono tracking-wider text-[#A6AC96] bg-[#222715]/80 border border-[#5A5E4D] px-2 py-0.5 rounded shadow-sm">
          [EXPERIMENT]
        </span>
      </header>

      {/* Top-Right: verelli.lol badge */}
      <div className="absolute top-5 right-6 z-30 pointer-events-none select-none flex items-center gap-2">
        <div className="w-4 h-4 rounded-[4px] bg-[#4A4F3B] border border-[#636854] shadow-sm" />
        <span className="text-[15px] text-[#D5D8CE] font-normal font-sans">
          verelli.lol
        </span>
      </div>

      {/* Centerpiece Hero Lockup (z-20) */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto px-4 mt-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[96px] lg:text-[116px] font-serif italic text-[#F7F8F3] tracking-[-0.02em] leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        >
          Verelli.lol
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[18px] leading-[1.45] text-[#D0D4C8] font-normal mt-4 max-w-[450px] whitespace-pre-line text-center"
        >
          {"Validate your startup idea with graveyard\npost-mortems and verified MRR"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          <Link
            href="/?step=terms"
            className="group inline-flex items-center gap-2 bg-[#B5C463] hover:bg-[#C2D170] active:bg-[#A3AE5C] text-[#14180A] font-semibold text-[15px] px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-200 transform hover:scale-[1.03]"
          >
            <span>Let&apos;s get started</span>
            <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </motion.div>
      </div>

      {/* =========================================================================
          7 PHYSICAL 3D SCRAP-BOOK COLLAGE ARTIFACTS (LOCKED TAILWIND PROPS)
          ========================================================================= */}

      {/* 4. Artifact B — Left 84% SURVIVAL SCORE Vintage Seal */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [-4, 4], rotate: [-15, -13] }}
        transition={{ duration: 5.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden md:flex absolute top-[27%] left-[-15px] w-[165px] h-[165px] rounded-full -rotate-[14deg] z-10 shadow-[0_18px_36px_rgba(0,0,0,0.7)] transition-transform duration-200 hover:scale-[1.03]"
      >
        <div className="relative w-full h-full rounded-full bg-[#E5DEC9] border-[12px] border-[#E4DEC8] p-2 flex flex-col items-center justify-center text-center shadow-inner">
          {/* Double inner embossed dark-brass rings */}
          <div className="absolute inset-1.5 rounded-full border-[2px] border-[#5C5338] pointer-events-none" />
          <div className="absolute inset-2.5 rounded-full border border-dashed border-[#8C7D54]/70 pointer-events-none" />

          {/* 84% */}
          <div className="text-[48px] leading-none font-serif text-[#231F18] font-normal tracking-tight">
            84%
          </div>

          {/* SURVIVAL SCORE */}
          <div className="text-[15px] leading-[1.05] font-extrabold tracking-wider text-[#2B261D] mt-1 uppercase font-sans whitespace-pre-line">
            {"SURVIVAL\nSCORE"}
          </div>
        </div>
      </motion.div>

      {/* 3. Artifact A — Top-Left YC Cemetery Circle */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [-5, 5], rotate: [-6, -4] }}
        transition={{ duration: 5.6, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden lg:flex absolute top-[5%] left-[10%] w-[330px] h-[330px] rounded-full -rotate-[5deg] z-20 overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.75)] border border-[#3A2824] transition-transform duration-200 hover:scale-[1.02]"
      >
        <div className="relative w-full h-full bg-[#2A0F0F] flex flex-col items-center justify-between py-6 px-3 text-center overflow-hidden">
          {/* Real moody twilight cemetery photo with mist & silhouetted tombstones */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Image
              src="/hero/cemetery-twilight.webp"
              alt="YC Cemetery"
              fill
              sizes="330px"
              className="object-cover opacity-85"
            />
            {/* Soft dark vignette gradient to protect legibility of text & banner */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2A0A0A]/40 via-transparent to-[#150505]/85" />
          </div>

          {/* Top Label pill badge */}
          <div className="relative z-10 bg-[#1A0E0E]/90 border border-[#4A2424] px-3.5 py-1 rounded-full text-[14px] font-medium text-[#E8E2DC] tracking-wide font-sans shadow-sm mt-1">
            YC Cemetery
          </div>

          {/* Middle Handwritten Text */}
          <div className="relative z-10 font-mono text-[24px] tracking-tight text-[#F4EFEA] -rotate-[4deg] mt-3 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            YC W21 • B2C AI
          </div>

          {/* Full-Width Taupe Paper Band */}
          <div className="relative z-10 bg-[#786E65] py-2.5 px-3 w-[92%] mx-auto -rotate-[4deg] shadow-md border border-[#8A8075] rounded-[2px] text-center">
            <div className="text-[28px] leading-[0.95] font-black tracking-tight text-white uppercase font-sans">
              1,740+ DEAD
              <br />
              YC STARTUPS
            </div>
          </div>

          {/* Bottom Tag */}
          <div className="relative z-10 bg-[#EE5D36] text-[#1A110D] font-bold text-[17px] px-5 py-1.5 rounded-[4px] -rotate-[4deg] mt-2.5 shadow-lg inline-block">
            No PMF
          </div>
        </div>
      </motion.div>

      {/* 4. Artifact C — Left 3-Color Swatch Card (w-[265px], zero overlap with 84% seal) */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [-5, 5], rotate: [13, 15] }}
        transition={{ duration: 4.8, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden lg:flex absolute top-[46%] left-[11.5%] w-[265px] rotate-[14deg] z-20 transition-transform duration-200 hover:scale-[1.03]"
      >
        <div className="relative">
          {/* Main Swatch Card (w-[265px]) */}
          <div className="w-[265px] bg-[#E8E5DC] p-3.5 pb-5 rounded-[4px] shadow-[0_20px_40px_rgba(0,0,0,0.65)] border border-[#C5BDAA]">
            <div className="flex items-center justify-between gap-2.5 px-1">
              {/* Dot 1 */}
              <div className="flex flex-col items-center">
                <div className="w-[54px] h-[54px] rounded-full bg-[#34534D] shadow-inner border border-black/15" />
                <span className="text-[10px] font-bold text-[#2C2C2A] tracking-tight mt-1.5 font-mono uppercase">
                  #34534D
                </span>
              </div>
              {/* Dot 2 */}
              <div className="flex flex-col items-center">
                <div className="w-[54px] h-[54px] rounded-full bg-[#80979A] shadow-inner border border-black/15" />
                <span className="text-[10px] font-bold text-[#2C2C2A] tracking-tight mt-1.5 font-mono uppercase">
                  #80979A
                </span>
              </div>
              {/* Dot 3 */}
              <div className="flex flex-col items-center">
                <div className="w-[54px] h-[54px] rounded-full bg-[#D3B79C] shadow-inner border border-black/15" />
                <span className="text-[10px] font-bold text-[#2C2C2A] tracking-tight mt-1.5 font-mono uppercase">
                  #DS979C
                </span>
              </div>
            </div>
          </div>

          {/* Hanging Luggage Tag (#mrr_ok) with angled cut corners */}
          <div
            className="absolute -bottom-[70px] right-[-20px] rotate-[5deg] w-[165px] bg-[#DCD8CC] px-4 py-3 rounded-[3px] shadow-[0_14px_28px_rgba(0,0,0,0.6)] border border-[#BDB7A6] z-30"
            style={{
              clipPath: "polygon(14px 0%, 100% 0%, 100% 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)",
            }}
          >
            {/* Dark punch-hole circle on left */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#191E0B] border border-[#8C836E] absolute left-3 top-1/2 -translate-y-1/2 shadow-inner" />

            <div className="flex flex-col gap-0.5 pl-4">
              <span className="text-[17px] leading-[1.18] font-serif italic font-semibold text-[#1B1B19]">
                #mrr_ok
              </span>
              <span className="text-[17px] leading-[1.18] font-serif italic font-semibold text-[#1E1E1C]">
                #cac_risk
              </span>
              <span className="text-[17px] leading-[1.18] font-serif italic font-semibold text-[#1E1E1C]">
                #dead_twin
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 1. Artifact D — Bottom-Left Pinned Cards Cluster (bottom-[16px] left-[3.5%] -rotate-[14deg]) */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [4, -4], rotate: [-15, -13] }}
        transition={{ duration: 5.4, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden xl:flex absolute bottom-[16px] left-[3.5%] -rotate-[14deg] z-20 scale-105 origin-bottom-left transition-transform duration-200 hover:scale-[1.08]"
      >
        <div className="relative">
          {/* Overlapping Right Tan Card (48h Validation, z-20, sits behind Kraft card & Graveyard Checked) */}
          <div className="absolute bottom-[-8px] left-[175px] rotate-[6deg] w-[160px] bg-[#DFD3B8] p-3.5 rounded-[3px] shadow-[0_20px_40px_rgba(0,0,0,0.75)] border border-[#B8AA8C] z-10">
            {/* Round golden metallic thumbtack at top-center */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FFE599] via-[#C9A959] to-[#6A5218] shadow-md border border-white/60 flex items-center justify-center -top-2 left-1/2 -translate-x-1/2 absolute z-15">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>

            <div className="border border-[#8C7D60] p-2.5 text-center">
              <div className="text-[36px] leading-none font-serif text-[#231F1A] font-bold">
                48h
              </div>
              <div className="text-[21px] leading-tight font-serif text-[#231F1A] mt-1 font-normal">
                Validation
              </div>
            </div>
          </div>

          {/* Left Kraft Card (z-20, sits ON TOP of 48h card's left edge) */}
          <div className="w-[225px] bg-[#DED8C8] p-4 pb-6 rounded-[3px] shadow-[0_22px_45px_rgba(0,0,0,0.75)] border border-[#C5BDA8] relative z-20">
            {/* Top metallic round push-pin */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7A7870] to-[#3A3832] shadow-md mx-auto -mt-6 mb-3 border border-white/40" />

            {/* Pill 1: Stripe Verified */}
            <div className="bg-[#2C2D2A] text-[#F4F4EE] text-[16px] font-medium py-2 px-5 rounded-full shadow-md mb-2.5 whitespace-nowrap inline-block">
              Stripe Verified
            </div>

            {/* Pill 2: Graveyard Checked (relative z-30, extends past right edge ON TOP of 48h card) */}
            <div className="relative z-30 bg-[#2C2D2A] text-[#F4F4EE] text-[16px] font-medium py-2 px-5 rounded-full shadow-lg mb-2.5 whitespace-nowrap inline-block -mr-16 translate-x-3.5">
              Graveyard Checked
            </div>

            {/* Bottom-left text on card: Low CAC Wedge (fully visible) */}
            <div className="text-[26px] leading-[1.02] font-serif text-[#1E1D1A] pt-1 pb-2 pl-1 whitespace-pre-line font-normal">
              {"Low CAC\nWedge"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Artifact E — Top-Right $38.4K Revenue Card */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [-5, 5], rotate: [6, 8] }}
        transition={{ duration: 5.0, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden lg:block absolute top-[7%] right-[11%] w-[310px] rotate-[7deg] z-10 transition-transform duration-200 hover:scale-[1.03]"
      >
        <div className="bg-[#EAE8E1] rounded-[8px] pt-7 pb-5 px-7 shadow-[0_24px_50px_rgba(0,0,0,0.75)] relative overflow-hidden border border-[#D5D0C2]">
          {/* Huge italic serif $38.4K */}
          <div className="text-[68px] leading-[0.9] font-serif italic text-[#161614] tracking-tight font-bold">
            $38.4K
          </div>

          {/* Subtitle */}
          <div className="text-[15.5px] font-medium text-[#32322E] mt-2 font-sans">
            Verified Monthly Revenue
          </div>

          {/* Horizontal paper crease/fold line across bottom */}
          <div className="bg-gradient-to-b from-[#D2CFC6] to-[#DFDDD5] h-[48px] -mx-7 -mb-5 mt-6 border-t border-[#BEB9AE] px-5 flex items-center justify-end relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]">
            {/* Gold Badge (#12 TRUSTMRR) straddling the fold */}
            <div className="bg-gradient-to-b from-[#E5A93B] to-[#C68620] text-[#1E1608] font-extrabold text-[14.5px] tracking-wide px-5 py-2.5 rounded-[5px] shadow-[0_6px_14px_rgba(0,0,0,0.3)] inline-block float-right -mt-3.5 border border-[#B8851B]">
              #12 TRUSTMRR
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. Artifact F — Middle-Right 14.2% Waitlist CVR Circle (top-[29%] right-[-24px] w-[260px] h-[260px]) */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [5, -5], rotate: [-1, 1] }}
        transition={{ duration: 4.8, delay: 0.15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden md:flex absolute top-[29%] right-[-24px] w-[260px] h-[260px] z-10 transition-transform duration-200 hover:scale-[1.03]"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Off-white crescent paper coaster backing peeking on the left */}
          <div className="absolute inset-0 rounded-full bg-[#DFD9C8] -translate-x-2 -translate-y-1 -z-10 shadow-[0_16px_36px_rgba(0,0,0,0.6)]" />

          {/* Main dark circular coaster */}
          <div className="relative w-full h-full rounded-full bg-[#252622] border-[3px] border-[#383A32] shadow-[0_24px_48px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col justify-center items-center">
            {/* Funnel diagram & horizontal measurement lines SVG with explicit dimensions */}
            <svg
              width={260}
              height={260}
              style={{ width: "100%", height: "100%" }}
              className="absolute inset-0 w-full h-full pointer-events-none p-3"
              viewBox="0 0 100 100"
              fill="none"
            >
              {/* Horizontal measurement lines across the circle */}
              <line x1="6" y1="20" x2="94" y2="20" stroke="rgba(255,255,255,0.22)" strokeWidth="0.65" />
              <text x="7" y="18" fontSize="4.2" fill="rgba(255,255,255,0.4)" fontFamily="monospace">10.0%</text>

              <line x1="6" y1="36" x2="94" y2="36" stroke="rgba(255,255,255,0.22)" strokeWidth="0.65" />
              <text x="7" y="34" fontSize="4.2" fill="rgba(255,255,255,0.4)" fontFamily="monospace">7.5%</text>

              <line x1="6" y1="52" x2="94" y2="52" stroke="rgba(255,255,255,0.22)" strokeWidth="0.65" />
              <text x="7" y="50" fontSize="4.2" fill="rgba(255,255,255,0.4)" fontFamily="monospace">5.0%</text>

              <line x1="6" y1="68" x2="94" y2="68" stroke="rgba(255,255,255,0.22)" strokeWidth="0.65" />
              <text x="7" y="66" fontSize="4.2" fill="rgba(255,255,255,0.4)" fontFamily="monospace">2.5%</text>

              <line x1="6" y1="84" x2="94" y2="84" stroke="rgba(255,255,255,0.22)" strokeWidth="0.65" />
              <text x="7" y="82" fontSize="4.2" fill="rgba(255,255,255,0.4)" fontFamily="monospace">0.0%</text>

              {/* Glass Funnel Outline */}
              <polygon
                points="18,12 82,12 58,54 58,88 42,88 42,54"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                fill="rgba(255,255,255,0.04)"
              />

              {/* Solid thin curved funnel rings */}
              <ellipse cx="50" cy="22" rx="26" ry="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <ellipse cx="50" cy="36" rx="18" ry="3.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <ellipse cx="50" cy="50" rx="10" ry="2.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            </svg>

            {/* Bold high-contrast white serif typography centered right over funnel */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center pt-6 select-none">
              <div className="text-[52px] leading-[0.92] font-serif font-bold text-[#F5F5F0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                14.2%
              </div>
              <div className="text-[36px] leading-[0.98] font-serif font-bold text-[#F5F5F0] mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-pre-line">
                {"Waitlist\nCVR"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Artifact G — Bottom-Right YOUR IDEA Scalloped Cloud (w-[370px] h-[335px] bottom-[-12px] right-[3%]) */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ y: [-5, 5], rotate: [-0.5, 0.5] }}
        transition={{ duration: 5.3, delay: 0.35, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden lg:flex absolute bottom-[-12px] right-[3%] w-[370px] h-[335px] z-20 drop-shadow-[0_26px_50px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:scale-[1.03]"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* SVG definitions and shapes with explicit dimensions */}
          <svg
            width={370}
            height={335}
            style={{ width: "100%", height: "100%" }}
            viewBox="0 0 370 335"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <clipPath id="inner-cloud-clip-370">
                {/* 8 inner circles centered at (185, 168) */}
                <circle cx="185" cy="168" r="106" />
                <circle cx="279" cy="168" r="47" />
                <circle cx="251.5" cy="234.5" r="47" />
                <circle cx="185" cy="262" r="47" />
                <circle cx="118.5" cy="234.5" r="47" />
                <circle cx="91" cy="168" r="47" />
                <circle cx="118.5" cy="101.5" r="47" />
                <circle cx="185" cy="74" r="47" />
                <circle cx="251.5" cy="101.5" r="47" />
              </clipPath>
            </defs>

            {/* Outer thick cream paper border */}
            <g fill="#E6E1D3">
              <circle cx="185" cy="168" r="115" />
              <circle cx="285" cy="168" r="56" />
              <circle cx="255.7" cy="238.7" r="56" />
              <circle cx="185" cy="268" r="56" />
              <circle cx="114.3" cy="238.7" r="56" />
              <circle cx="85" cy="168" r="56" />
              <circle cx="114.3" cy="97.3" r="56" />
              <circle cx="185" cy="68" r="56" />
              <circle cx="255.7" cy="97.3" r="56" />
            </g>

            {/* Clean inner corridor photo clipped by inner circles */}
            <g clipPath="url(#inner-cloud-clip-370)">
              <image
                href="/hero/archive-corridor-clean-v2.webp"
                x="10"
                y="0"
                width="350"
                height="335"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x="0"
                y="0"
                width="370"
                height="335"
                fill="#14180A"
                opacity="0.25"
              />
            </g>
          </svg>

          {/* Centered Overlay Text in lower half with safe padding px-10 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 px-10 text-center pointer-events-none select-none z-10">
            <div className="text-[40px] leading-none font-black tracking-[-0.03em] text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] font-sans">
              YOUR IDEA
            </div>
            <div className="text-[11.5px] font-bold tracking-wider text-[#F5F3EB] whitespace-nowrap mt-1.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] uppercase font-sans">
              3 DEAD TWINS • 5 LIVE WINNERS
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
