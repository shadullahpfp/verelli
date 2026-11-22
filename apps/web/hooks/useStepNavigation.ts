"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type OnboardingStep = "terms" | "welcome" | "input" | null;

export function useStepNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStep = useMemo<OnboardingStep>(() => {
    const step = searchParams.get("step");
    if (step === "terms" || step === "welcome" || step === "input") {
      return step;
    }
    return null;
  }, [searchParams]);

  const setStep = useCallback(
    (step: OnboardingStep) => {
      const params = new URLSearchParams(searchParams.toString());
      if (step) {
        params.set("step", step);
      } else {
        params.delete("step");
      }
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const goToHero = useCallback(() => {
    setStep(null);
  }, [setStep]);

  const goToTerms = useCallback(() => {
    setStep("terms");
  }, [setStep]);

  const goToWelcome = useCallback(() => {
    setStep("welcome");
  }, [setStep]);

  const goToInput = useCallback(() => {
    setStep("input");
  }, [setStep]);

  return {
    currentStep,
    setStep,
    goToHero,
    goToTerms,
    goToWelcome,
    goToInput,
    isTermsOpen: currentStep === "terms",
    isWelcomeOpen: currentStep === "welcome",
    isInputOpen: currentStep === "input",
  };
}
