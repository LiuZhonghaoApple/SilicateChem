import type {
  FunnelOptimizerInput,
  FunnelState,
} from "@/types/funnel";

function normalizeScore(score: number): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

/**
 * Unified funnel state from RFQ intent score, trust signals, and page context.
 * Pure function — no rendering, routing, or network calls.
 */
export function calculateFunnelState(input: FunnelOptimizerInput): FunnelState {
  const score = normalizeScore(input.rfqScore);

  if (score >= 70) {
    return {
      funnelStage: "conversion",
      rfqIntent: "hot",
      recommendedAction: "show_rfq",
      bannerPriority: "high",
    };
  }

  if (score >= 40) {
    return {
      funnelStage: "consideration",
      rfqIntent: "warm",
      recommendedAction: "show_quote_cta",
      bannerPriority: "low",
    };
  }

  return {
    funnelStage: "awareness",
    rfqIntent: "none",
    recommendedAction: "show_trust",
    bannerPriority: "none",
  };
}

export type {
  FunnelBannerPriority,
  FunnelOptimizerInput,
  FunnelPageType,
  FunnelRecommendedAction,
  FunnelRfqIntent,
  FunnelStage,
  FunnelState,
  FunnelTrustSignal,
} from "@/types/funnel";
