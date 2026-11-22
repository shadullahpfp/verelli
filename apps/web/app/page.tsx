import { Suspense } from "react";
import HeroFloatingCanvas from "@/components/hero/HeroFloatingCanvas";
import ExperimentShowcase from "@/components/showcase/ExperimentShowcase";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-pomelli-hero text-[#EDEFE6] flex flex-col selection:bg-pomelli-lime selection:text-[#14180A]">
      {/* Section 1: Hero Canvas with Floating Artifacts */}
      <HeroFloatingCanvas />

      {/* Section 2: Experiment Video Showcase & Minimal Footer */}
      <ExperimentShowcase />

      {/* Phase 2: Query-Param Driven Onboarding Modals & Journey */}
      <Suspense fallback={null}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
