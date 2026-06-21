import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import type {
  LayoutBlock,
  LayoutBlockMode,
  SegmentLayout,
} from "@/lib/conversion/v5-layout-map";
import type { StrategyWeights } from "@/lib/conversion/v6-strategy-engine";
import type { VisualTrustResult } from "@/lib/trust/v6-visual-trust-engine";

export type CTAMode = Extract<
  LayoutBlockMode,
  "minimal" | "soft" | "sticky" | "persistent_sticky"
>;

export type CTAControllerHints = {
  ctaMode: CTAMode;
  boostRfqBridge: boolean;
  boostTrust: boolean;
  boostProduct: boolean;
  boostExport: boolean;
};

export type ResolveCTAControllerInput = {
  visualTrust: VisualTrustResult;
  segment: UserSegment;
  weights: StrategyWeights;
};

const CTA_RANK: Record<CTAMode, number> = {
  minimal: 0,
  soft: 1,
  sticky: 2,
  persistent_sticky: 3,
};

function segmentBaseCtaMode(segment: UserSegment): CTAMode {
  switch (segment) {
    case "buyer_ready":
      return "persistent_sticky";
    case "hot":
      return "sticky";
    case "warm":
      return "soft";
    case "cold":
    default:
      return "minimal";
  }
}

function upgradeCtaMode(mode: CTAMode): CTAMode | undefined {
  if (mode === "minimal") return "soft";
  if (mode === "soft") return "sticky";
  if (mode === "sticky") return "persistent_sticky";
  return undefined;
}

function downgradeCtaMode(mode: CTAMode): CTAMode | undefined {
  if (mode === "persistent_sticky") return "sticky";
  if (mode === "sticky") return "soft";
  if (mode === "soft") return "minimal";
  return undefined;
}

function resolveTargetCtaMode(current: CTAMode, target: CTAMode): CTAMode {
  return CTA_RANK[target] > CTA_RANK[current] ? target : current;
}

function upgradeBlockCtaMode(
  mode: LayoutBlock["mode"]
): LayoutBlock["mode"] | undefined {
  if (mode === "minimal") return "soft";
  if (mode === "soft") return "sticky";
  if (mode === "sticky") return "persistent_sticky";
  return mode;
}

/**
 * Derives CTA intensity hints from visual trust exposure, segment, and weights.
 * Logic only — no copy changes.
 */
export function resolveCTAController(
  input: ResolveCTAControllerInput
): CTAControllerHints {
  const { visualTrust, segment, weights } = input;
  const score = visualTrust.visualTrustScore;

  let ctaMode = segmentBaseCtaMode(segment);

  if (score >= 70 && (segment === "hot" || segment === "buyer_ready")) {
    ctaMode = upgradeCtaMode(ctaMode) ?? ctaMode;
  } else if (score < 35 && segment !== "buyer_ready") {
    ctaMode = downgradeCtaMode(ctaMode) ?? ctaMode;
  } else if (score >= 60 && segment === "warm") {
    ctaMode = upgradeCtaMode(ctaMode) ?? ctaMode;
  }

  const boostRfqBridge =
    weights.rfqWeight >= 0.28 &&
    score >= 55 &&
    (segment === "hot" || segment === "buyer_ready" || segment === "warm");

  return {
    ctaMode,
    boostRfqBridge,
    boostTrust: weights.trustWeight >= 0.28 && score < 60,
    boostProduct: weights.productWeight >= 0.28 && score >= 45,
    boostExport:
      weights.exportWeight >= 0.28 &&
      (visualTrust.exportPhotoViews > 0 || score >= 45),
  };
}

/**
 * Applies visual-trust CTA hints after segment, V6, and V7 layout passes.
 */
export function applyCTAHints(
  layout: SegmentLayout,
  hints: CTAControllerHints
): SegmentLayout {
  let result = layout.map((block) => {
    if (hints.boostTrust && block.type === "trust_core" && block.mode === "compressed") {
      return { ...block, mode: "full" as const };
    }

    if (hints.boostProduct && block.type === "product_proof" && block.mode !== "full") {
      return { ...block, mode: "full" as const };
    }

    if (
      hints.boostExport &&
      block.type === "export_map" &&
      block.mode === "compressed"
    ) {
      return { ...block, mode: "full" as const };
    }

    if (block.type === "cta" && block.mode) {
      const target = resolveTargetCtaMode(block.mode as CTAMode, hints.ctaMode);
      if (target !== block.mode) {
        return { ...block, mode: target };
      }

      if (hints.boostRfqBridge && block.mode) {
        const upgraded = upgradeBlockCtaMode(block.mode);
        if (upgraded && upgraded !== block.mode) {
          return { ...block, mode: upgraded };
        }
      }
    }

    return block;
  });

  if (hints.boostRfqBridge && !result.some((block) => block.type === "rfq_bridge")) {
    result = [{ type: "rfq_bridge" }, ...result];
  }

  return result;
}
