import type { ConversionFunnelStage } from "@/lib/conversion/unified-conversion-brain";
import {
  getPerformanceBaseline,
  getSegmentPerformance,
} from "@/lib/conversion/v5-feedback-tracker";

export type SegmentationInput = {
  rfqScore: number;
  funnelStage: ConversionFunnelStage;
  trustSignals: string[];
  productViews: number;
  exportPageViewed: boolean;
  scrollDepth: number;
  timeOnSite: number;
  /** When true, slowly adjusts score thresholds from V5.3 feedback performance. */
  adaptiveWeighting?: boolean;
};

export type SegmentThresholds = {
  coldMax: number;
  hotMin: number;
  buyerReadyMin: number;
};

const DEFAULT_THRESHOLDS: SegmentThresholds = {
  coldMax: 40,
  hotMin: 70,
  buyerReadyMin: 85,
};

export type UserSegment = "cold" | "warm" | "hot" | "buyer_ready";

export const segmentPerformance: Record<UserSegment, { rfqRate: number }> = {
  cold: { rfqRate: 0 },
  warm: { rfqRate: 0 },
  hot: { rfqRate: 0 },
  buyer_ready: { rfqRate: 0 },
};

export type V5Decision = {
  segment: UserSegment;
  ui: {
    showTrust: boolean;
    showProduct: boolean;
    showRFQ: boolean;
    showQuoteCTA: boolean;
    showExportLayer: boolean;
  };
  intensity: "low" | "medium" | "high";
  bannerPriority: "high" | "low" | "none";
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Derives conservative threshold shifts from client-side segment performance.
 * Max adjustment is ±3 points per boundary.
 */
export function resolveAdaptiveThresholds(
  adaptiveWeighting?: boolean
): SegmentThresholds {
  if (!adaptiveWeighting) {
    return DEFAULT_THRESHOLDS;
  }

  const performance = getSegmentPerformance();
  const baseline = getPerformanceBaseline();
  let { coldMax, hotMin, buyerReadyMin } = DEFAULT_THRESHOLDS;

  if (baseline <= 0) {
    return DEFAULT_THRESHOLDS;
  }

  const cold = performance.cold;
  const hot = performance.hot;
  const buyerReady = performance.buyer_ready;

  if (cold.views >= 5) {
    if (cold.rfqRate > baseline * 1.15) {
      coldMax = Math.max(35, coldMax - 2);
    } else if (cold.rfqRate < baseline * 0.5) {
      coldMax = Math.min(45, coldMax + 1);
    }
  }

  if (hot.views >= 5) {
    if (hot.rfqRate > baseline * 1.2) {
      hotMin = Math.max(65, hotMin - 2);
    } else if (hot.rfqRate < baseline * 0.7) {
      hotMin = Math.min(75, hotMin + 2);
    }
  }

  if (buyerReady.views >= 3) {
    if (buyerReady.rfqRate > baseline * 1.25) {
      buyerReadyMin = Math.max(80, buyerReadyMin - 2);
    } else if (buyerReady.rfqRate < baseline * 0.6) {
      buyerReadyMin = Math.min(90, buyerReadyMin + 2);
    }
  }

  return { coldMax, hotMin, buyerReadyMin };
}

function isBuyerReady(
  input: SegmentationInput,
  thresholds: SegmentThresholds
): boolean {
  return (
    input.rfqScore >= thresholds.buyerReadyMin &&
    input.timeOnSite > 60 &&
    input.exportPageViewed
  );
}

function isHot(input: SegmentationInput, thresholds: SegmentThresholds): boolean {
  return (
    input.rfqScore >= thresholds.hotMin &&
    (input.productViews >= 2 || input.exportPageViewed)
  );
}

function isCold(input: SegmentationInput, thresholds: SegmentThresholds): boolean {
  return input.rfqScore < thresholds.coldMax && input.productViews < 1;
}

function isWarm(input: SegmentationInput): boolean {
  return (
    (input.rfqScore >= 40 && input.rfqScore <= 69) ||
    input.productViews >= 1
  );
}

const COLD_UI: V5Decision["ui"] = {
  showTrust: true,
  showProduct: false,
  showRFQ: false,
  showQuoteCTA: false,
  showExportLayer: false,
};

const WARM_UI: V5Decision["ui"] = {
  showTrust: true,
  showProduct: true,
  showRFQ: false,
  showQuoteCTA: false,
  showExportLayer: true,
};

const HOT_UI: V5Decision["ui"] = {
  showTrust: true,
  showProduct: true,
  showRFQ: true,
  showQuoteCTA: true,
  showExportLayer: true,
};

const BUYER_READY_UI: V5Decision["ui"] = {
  showTrust: true,
  showProduct: true,
  showRFQ: true,
  showQuoteCTA: true,
  showExportLayer: true,
};

/**
 * V5 behavioral segmentation — classifies user into segment-driven UI profile.
 */
export function calculateUserSegment(input: SegmentationInput): V5Decision {
  void input.funnelStage;
  void input.trustSignals;
  void input.scrollDepth;

  const rfqScore = clampScore(input.rfqScore);
  const thresholds = resolveAdaptiveThresholds(input.adaptiveWeighting);
  const performance = getSegmentPerformance();

  segmentPerformance.cold.rfqRate = performance.cold.rfqRate;
  segmentPerformance.warm.rfqRate = performance.warm.rfqRate;
  segmentPerformance.hot.rfqRate = performance.hot.rfqRate;
  segmentPerformance.buyer_ready.rfqRate = performance.buyer_ready.rfqRate;

  const segmentedInput = { ...input, rfqScore };

  if (isBuyerReady(segmentedInput, thresholds)) {
    return {
      segment: "buyer_ready",
      ui: BUYER_READY_UI,
      intensity: "high",
      bannerPriority: "high",
    };
  }

  if (isHot(segmentedInput, thresholds)) {
    return {
      segment: "hot",
      ui: HOT_UI,
      intensity: "high",
      bannerPriority: "high",
    };
  }

  if (isCold(segmentedInput, thresholds)) {
    return {
      segment: "cold",
      ui: COLD_UI,
      intensity: "low",
      bannerPriority: "none",
    };
  }

  if (isWarm(segmentedInput)) {
    return {
      segment: "warm",
      ui: WARM_UI,
      intensity: "medium",
      bannerPriority: "low",
    };
  }

  return {
    segment: "warm",
    ui: WARM_UI,
    intensity: "medium",
    bannerPriority: "low",
  };
}
