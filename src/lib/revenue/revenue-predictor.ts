import type { ConversionFunnelStage } from "@/lib/conversion/unified-conversion-brain";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import { resolveRevenueAction, RevenueAction } from "@/lib/revenue/action-engine";

export type RevenuePredictorInput = {
  userValueScore: number;
  segment: UserSegment;
  rfqScore: number;
  funnelStage?: ConversionFunnelStage;
};

export type RevenuePrediction = {
  expectedRevenue: number;
  conversionProbability: number;
  bestAction: RevenueAction;
};

const SEGMENT_BASE_CONVERSION: Record<UserSegment, number> = {
  cold: 0.02,
  warm: 0.07,
  hot: 0.16,
  buyer_ready: 0.32,
};

const FUNNEL_STAGE_MULTIPLIER: Record<ConversionFunnelStage, number> = {
  awareness: 0.85,
  consideration: 1,
  conversion: 1.25,
};

/** Heuristic average RFQ order value (USD) for client-side revenue estimate. */
const HEURISTIC_AOV_USD = 14_500;

function clampProbability(value: number): number {
  return Math.max(0, Math.min(0.95, value));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

/**
 * Client-side revenue prediction from value score, segment, and intent signals.
 */
export function predictRevenue(input: RevenuePredictorInput): RevenuePrediction {
  const userValueScore = clampScore(input.userValueScore);
  const rfqScore = clampScore(input.rfqScore);
  const bestAction = resolveRevenueAction(userValueScore);

  const segmentBase = SEGMENT_BASE_CONVERSION[input.segment];
  const funnelMultiplier =
    FUNNEL_STAGE_MULTIPLIER[input.funnelStage ?? "consideration"] ?? 1;

  const valueFactor = userValueScore / 100;
  const intentFactor = rfqScore / 100;

  const conversionProbability = clampProbability(
    (segmentBase + valueFactor * 0.22 + intentFactor * 0.12) * funnelMultiplier
  );

  const actionLift =
    bestAction === RevenueAction.PUSH_RFQ
      ? 1.15
      : bestAction === RevenueAction.SHOW_EXPORT
        ? 1.08
        : bestAction === RevenueAction.SHOW_PRODUCT
          ? 1.04
          : 1;

  const expectedRevenue = Math.round(
    conversionProbability * HEURISTIC_AOV_USD * actionLift * (0.75 + valueFactor * 0.5)
  );

  return {
    expectedRevenue,
    conversionProbability: Math.round(conversionProbability * 1000) / 1000,
    bestAction,
  };
}
