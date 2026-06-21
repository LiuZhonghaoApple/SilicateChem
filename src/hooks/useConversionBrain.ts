"use client";

import { useMemo } from "react";
import {
  normalizeConversionInput,
  unifiedInputToLegacyLevel,
} from "@/lib/conversion/conversion-input-normalizer";
import {
  unifiedConversionBrain,
  type ConversionOutput,
} from "@/lib/conversion/unified-conversion-brain";
import { calculateFunnelState } from "@/lib/funnel/funnel-optimizer";
import type { RfqIntentPageType, RfqIntentTrustBlock } from "@/lib/rfq/rfq-intent-score";
import type { FunnelTrustSignal } from "@/types/funnel";

export type UseConversionBrainInput = {
  pageType: RfqIntentPageType;
  trustSignals: string[];
  viewedTrustBlocks: RfqIntentTrustBlock[];
  scrollDepth: number;
  hasProductView: boolean;
};

export type ConversionBrainUIState = ConversionOutput;

/**
 * V3 conversion hook — normalizes input, then delegates to unifiedConversionBrain only.
 */
export function useConversionBrain({
  pageType,
  trustSignals,
  viewedTrustBlocks,
  scrollDepth,
  hasProductView,
}: UseConversionBrainInput): ConversionBrainUIState {
  return useMemo(() => {
    const unified = normalizeConversionInput({
      pageType,
      rawScrollDepth: scrollDepth,
      trustSignals,
      productView: hasProductView,
      viewedTrustBlocks,
    });

    // Legacy funnel layer — backward compatibility only (side-effect free)
    calculateFunnelState({
      rfqScore: unified.baseIntentScore,
      rfqLevel: unifiedInputToLegacyLevel(unified),
      trustSignals: trustSignals as FunnelTrustSignal[],
      pageType,
      hasProductView,
    });

    return unifiedConversionBrain(unified);
  }, [
    pageType,
    trustSignals,
    viewedTrustBlocks,
    scrollDepth,
    hasProductView,
  ]);
}
