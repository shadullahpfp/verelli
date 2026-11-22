"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import ThingsToKnowModal from "@/components/modals/ThingsToKnowModal";
import StayConnectedModal from "@/components/modals/StayConnectedModal";
import OnboardingFourGrid from "@/components/onboarding/OnboardingFourGrid";
import IdeaInputCard from "@/components/onboarding/IdeaInputCard";

export default function OnboardingFlow() {
  const {
    currentStep,
    goToHero,
    goToWelcome,
    goToInput,
    isTermsOpen,
    isWelcomeOpen,
    isInputOpen,
  } = useStepNavigation();

  // Screen 3A: Stay Connected Popup overlay state on top of the 4-step grid
  const [showStayConnected, setShowStayConnected] = useState(true);

  // Re-open StayConnectedModal whenever entering ?step=welcome freshly
  useEffect(() => {
    if (isWelcomeOpen) {
      setShowStayConnected(true);
    }
  }, [isWelcomeOpen]);

  return (
    <AnimatePresence mode="wait">
      {/* Screen 2: Things to Know Modal (?step=terms) */}
      {isTermsOpen && (
        <ThingsToKnowModal
          key="terms-modal"
          onExit={goToHero}
          onAgree={goToWelcome}
        />
      )}

      {/* Screen 3B: 4-Step Onboarding Grid (?step=welcome) */}
      {isWelcomeOpen && (
        <div key="welcome-view" className="relative z-40">
          <OnboardingFourGrid
            onExit={goToHero}
            onContinue={goToInput}
          />

          {/* Screen 3A: Stay Connected Popup overlay ON TOP of the 4-step grid */}
          <AnimatePresence>
            {showStayConnected && (
              <StayConnectedModal
                key="stay-connected-modal"
                onClose={() => setShowStayConnected(false)}
                onConfirm={() => setShowStayConnected(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Screen 4: Focused Idea Input Card (?step=input) */}
      {isInputOpen && (
        <IdeaInputCard
          key="input-modal"
          onExit={goToHero}
          onBack={goToWelcome}
        />
      )}
    </AnimatePresence>
  );
}
