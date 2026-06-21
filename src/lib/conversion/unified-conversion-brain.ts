import type { UnifiedInput } from "@/lib/conversion/conversion-input-normalizer";

export type ConversionFunnelStage = "awareness" | "consideration" | "conversion";

export type ConversionBannerPriority = "high" | "low" | "none";

export type ConversionDecision = {
  showTrust: boolean;
  showProduct: boolean;
  showRFQ: boolean;
  showQuoteCTA: boolean;
  bannerPriority: ConversionBannerPriority;
  funnelStage: ConversionFunnelStage;
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function hasProductSignal(input: UnifiedInput): boolean {
  return input.productSignalStrength > 0 && input.trustSignals.includes("product");
}

/**
 * V4 unified conversion decision engine — UnifiedInput only.
 */
export function unifiedConversionBrain(input: UnifiedInput): ConversionDecision {
  void input.pageType;

  const score = clampScore(input.baseIntentScore);

  if (score >= 70) {
    return {
      showTrust: true,
      showProduct: hasProductSignal(input),
      showRFQ: true,
      showQuoteCTA: false,
      bannerPriority: "high",
      funnelStage: "conversion",
    };
  }

  if (score >= 40) {
    return {
      showTrust: true,
      showProduct: hasProductSignal(input),
      showRFQ: false,
      showQuoteCTA: true,
      bannerPriority: "low",
      funnelStage: "consideration",
    };
  }

  return {
    showTrust: true,
    showProduct: hasProductSignal(input),
    showRFQ: false,
    showQuoteCTA: false,
    bannerPriority: "none",
    funnelStage: "awareness",
  };
}

export type { UnifiedInput } from "@/lib/conversion/conversion-input-normalizer";
