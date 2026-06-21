"use client";

import { useMemo } from "react";
import {
  normalizeConversionInput,
  type ConversionPageType,
} from "@/lib/conversion/conversion-input-normalizer";
import { unifiedConversionBrain } from "@/lib/conversion/unified-conversion-brain";
import {
  calculateUserSegment,
  type V5Decision,
} from "@/lib/conversion/v5-segmentation-engine";

export type UseConversionBrainInput = {
  pageType: ConversionPageType;
  trustSignals: string[];
  scrollDepth: number;
  hasProductView: boolean;
  productViews?: number;
  exportPageViewed?: boolean;
  timeOnSite?: number;
  adaptiveWeighting?: boolean;
};

export type { V5Decision };

/**
 * V5 conversion hook — normalize → V4 brain → V5 segment → UI decision.
 */
export function useConversionBrain(input: UseConversionBrainInput): V5Decision {
  return useMemo(() => {
    const unified = normalizeConversionInput({
      pageType: input.pageType,
      rawScrollDepth: input.scrollDepth,
      trustSignals: input.trustSignals,
      productView: input.hasProductView,
    });

    const v4 = unifiedConversionBrain(unified);

    const productViews =
      input.productViews ?? (input.hasProductView ? 1 : 0);
    const exportPageViewed =
      input.exportPageViewed ??
      (input.pageType === "export" || input.trustSignals.includes("export"));
    const timeOnSite = input.timeOnSite ?? 0;

    const decision = calculateUserSegment({
      rfqScore: unified.baseIntentScore,
      funnelStage: v4.funnelStage,
      trustSignals: input.trustSignals,
      productViews,
      exportPageViewed,
      scrollDepth: input.scrollDepth,
      timeOnSite,
      adaptiveWeighting: input.adaptiveWeighting,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[V5 SEGMENT]", {
        segment: decision.segment,
        rfqScore: unified.baseIntentScore,
        productViews,
        exportPageViewed,
      });
    }

    return decision;
  }, [
    input.pageType,
    input.trustSignals,
    input.scrollDepth,
    input.hasProductView,
    input.productViews,
    input.exportPageViewed,
    input.timeOnSite,
    input.adaptiveWeighting,
  ]);
}
