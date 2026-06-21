"use client";

import { useEffect, useMemo } from "react";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import { trackVariantExposure } from "@/lib/conversion/v6-conversion-tracker";
import { runOptimizationIfDue } from "@/lib/conversion/v6-optimizer";
import {
  applyUIVariantToLayout,
  getUIVariantLayoutHints,
  selectUIVariant,
} from "@/lib/conversion/v6-ui-selector";
import type { UIVariant } from "@/lib/conversion/v6-types";
import { getStrategyWeights, type StrategyWeights } from "@/lib/conversion/v6-strategy-engine";
import type { SegmentLayout } from "@/lib/conversion/v5-layout-map";

export type V6OptimizationState = {
  uiVariant: UIVariant;
  weights: StrategyWeights;
  layoutHints: ReturnType<typeof getUIVariantLayoutHints>;
  applyToLayout: (layout: SegmentLayout) => SegmentLayout;
};

export function useV6Optimization(segment: UserSegment): V6OptimizationState {
  useEffect(() => {
    runOptimizationIfDue();
  }, []);

  return useMemo(() => {
    const weights = getStrategyWeights();
    const uiVariant = selectUIVariant({ segment, weights });
    const layoutHints = getUIVariantLayoutHints(uiVariant, weights);

    trackVariantExposure({ segment, uiVariant });

    return {
      uiVariant,
      weights,
      layoutHints,
      applyToLayout: (layout: SegmentLayout) =>
        applyUIVariantToLayout(layout, uiVariant, weights),
    };
  }, [segment]);
}
