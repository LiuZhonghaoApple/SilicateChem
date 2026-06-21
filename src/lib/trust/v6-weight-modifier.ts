import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import type { StrategyWeights } from "@/lib/conversion/v6-strategy-engine";
import type { VisualTrustResult } from "@/lib/trust/v6-visual-trust-engine";

const MAX_VISUAL_ADJUSTMENT = 0.03;

function normalize(weights: StrategyWeights): StrategyWeights {
  const sum =
    weights.exportWeight +
    weights.productWeight +
    weights.rfqWeight +
    weights.trustWeight;

  if (sum <= 0) {
    return {
      exportWeight: 0.25,
      productWeight: 0.25,
      rfqWeight: 0.25,
      trustWeight: 0.25,
    };
  }

  return {
    exportWeight: weights.exportWeight / sum,
    productWeight: weights.productWeight / sum,
    rfqWeight: weights.rfqWeight / sum,
    trustWeight: weights.trustWeight / sum,
  };
}

/**
 * Applies conservative image-trust nudges to V6 strategy weights.
 * Max ±3% per weight — image scoring only, no outcome feedback.
 */
export function applyVisualTrustWeights(
  visualTrust: VisualTrustResult,
  weights: StrategyWeights,
  segment: UserSegment
): StrategyWeights {
  const score = visualTrust.visualTrustScore;
  const delta = MAX_VISUAL_ADJUSTMENT;
  const next = { ...weights };

  if (score >= 75) {
    next.rfqWeight += delta * 0.5;
    next.trustWeight -= delta * 0.3;
    next.exportWeight += delta * 0.15;
    next.productWeight += delta * 0.15;
  } else if (score < 40) {
    next.trustWeight += delta;
    next.rfqWeight -= delta * 0.5;
    next.productWeight -= delta * 0.25;
    next.exportWeight -= delta * 0.25;
  } else if (score < 55) {
    next.trustWeight += delta * 0.4;
    next.rfqWeight -= delta * 0.2;
    next.productWeight -= delta * 0.1;
    next.exportWeight -= delta * 0.1;
  }

  if (segment === "cold" && score < 50) {
    next.trustWeight += delta * 0.25;
    next.rfqWeight -= delta * 0.15;
    next.productWeight -= delta * 0.05;
    next.exportWeight -= delta * 0.05;
  }

  if (segment === "buyer_ready" && score >= 65) {
    next.rfqWeight += delta * 0.25;
    next.trustWeight -= delta * 0.15;
    next.exportWeight += delta * 0.05;
    next.productWeight += delta * 0.05;
  }

  return normalize(next);
}
