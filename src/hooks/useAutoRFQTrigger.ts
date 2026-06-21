"use client";

import { useMemo } from "react";
import type { ConversionPageType } from "@/lib/conversion/conversion-input-normalizer";

export type AutoRFQTriggerMode = "high-intent" | "soft-intent";

export type AutoRFQTriggerInput = {
  score: number;
  pageType: ConversionPageType;
  product?: string;
};

export type AutoRFQTriggerState =
  | { showRFQBanner: true; mode: AutoRFQTriggerMode }
  | { showRFQBanner: false; mode?: undefined };

/**
 * LEGACY ONLY — superseded by useConversionBrain (V4).
 */
export function useAutoRFQTrigger({
  score,
  pageType,
  product,
}: AutoRFQTriggerInput): AutoRFQTriggerState {
  return useMemo(() => {
    void pageType;
    void product;

    const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

    if (normalizedScore >= 70) {
      return { showRFQBanner: true, mode: "high-intent" };
    }

    if (normalizedScore >= 40) {
      return { showRFQBanner: true, mode: "soft-intent" };
    }

    return { showRFQBanner: false };
  }, [score, pageType, product]);
}
