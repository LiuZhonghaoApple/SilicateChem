import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import type { LayoutBlock, SegmentLayout } from "@/lib/conversion/v5-layout-map";
import {
  getStrategyWeights,
  type StrategyWeights,
} from "@/lib/conversion/v6-strategy-engine";
import type { UIVariant } from "@/lib/conversion/v6-types";

export type { UIVariant };

export type UIVariantLayoutHints = {
  boostTrust: boolean;
  boostProduct: boolean;
  boostExport: boolean;
  boostRfq: boolean;
};

export type SelectUIVariantInput = {
  segment: UserSegment;
  weights?: StrategyWeights;
};

function segmentBoost(segment: UserSegment): Record<UIVariant, number> {
  switch (segment) {
    case "buyer_ready":
    case "hot":
      return { rfq_heavy: 0.08, product_heavy: 0.03, trust_heavy: 0 };
    case "warm":
      return { rfq_heavy: 0.02, product_heavy: 0.08, trust_heavy: 0.02 };
    case "cold":
    default:
      return { rfq_heavy: 0, product_heavy: 0.02, trust_heavy: 0.1 };
  }
}

export function selectUIVariant(input: SelectUIVariantInput): UIVariant {
  const weights = input.weights ?? getStrategyWeights();
  const boost = segmentBoost(input.segment);

  const scores: Record<UIVariant, number> = {
    rfq_heavy: weights.rfqWeight + boost.rfq_heavy,
    product_heavy: weights.productWeight + boost.product_heavy,
    trust_heavy: weights.trustWeight + boost.trust_heavy,
  };

  const ranked = (Object.entries(scores) as [UIVariant, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return ranked[0]![0];
}

export function getUIVariantLayoutHints(
  variant: UIVariant,
  weights?: StrategyWeights
): UIVariantLayoutHints {
  const w = weights ?? getStrategyWeights();

  return {
    boostTrust: variant === "trust_heavy" || w.trustWeight >= 0.3,
    boostProduct: variant === "product_heavy" || w.productWeight >= 0.3,
    boostExport: w.exportWeight >= 0.28,
    boostRfq: variant === "rfq_heavy" || w.rfqWeight >= 0.3,
  };
}

function upgradeCtaMode(
  mode: LayoutBlock["mode"]
): LayoutBlock["mode"] | undefined {
  if (mode === "minimal") return "soft";
  if (mode === "soft") return "sticky";
  if (mode === "sticky") return "persistent_sticky";
  return mode;
}

export function applyUIVariantToLayout(
  layout: SegmentLayout,
  variant: UIVariant,
  weights?: StrategyWeights
): SegmentLayout {
  const hints = getUIVariantLayoutHints(variant, weights);

  return layout.map((block) => {
    if (hints.boostTrust && block.type === "trust_core" && block.mode === "compressed") {
      return { ...block, mode: "full" };
    }

    if (hints.boostProduct && block.type === "product_proof" && block.mode !== "full") {
      return { ...block, mode: "full" };
    }

    if (
      hints.boostExport &&
      block.type === "export_map" &&
      block.mode === "compressed"
    ) {
      return { ...block, mode: "full" };
    }

    if (hints.boostRfq && block.type === "cta" && block.mode) {
      const upgraded = upgradeCtaMode(block.mode);
      if (upgraded && upgraded !== block.mode) {
        return { ...block, mode: upgraded };
      }
    }

    return block;
  });
}
