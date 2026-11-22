import HeroFloatingCanvas from "@/components/hero/HeroFloatingCanvas";
import ExperimentShowcase from "@/components/showcase/ExperimentShowcase";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-pomelli-hero text-[#EDEFE6] flex flex-col selection:bg-pomelli-lime selection:text-[#14180A]">
      {/* Section 1: Hero Canvas with Floating Artifacts */}
      <HeroFloatingCanvas />

      {/* Section 2: Experiment Video Showcase & Minimal Footer */}
      <ExperimentShowcase />
    </main>
  );
}

