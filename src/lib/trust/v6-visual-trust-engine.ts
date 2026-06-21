import type { UserSegment, V5Decision } from "@/lib/conversion/v5-segmentation-engine";

export type VisualTrustInputs = {
  imageViews: number;
  galleryViews: number;
  exportPhotoViews: number;
  factoryPhotoViews: number;
  loadingImageViews?: number;
};

export type TrustLevel = "low" | "medium" | "high" | "verified";

export type VisualTrustResult = VisualTrustInputs & {
  visualTrustScore: number;
  trustLevel: TrustLevel;
};

const SCORE_CAP = 100;

export function resolveTrustLevel(score: number): TrustLevel {
  if (score >= 76) return "verified";
  if (score >= 51) return "high";
  if (score >= 26) return "medium";
  return "low";
}

/**
 * Scores visual trust from observed image exposure.
 * factory +10 | export +15 | loading +20 | gallery +25 | cap 100
 */
export function computeVisualTrustScore(
  input: VisualTrustInputs
): VisualTrustResult {
  const loadingViews = input.loadingImageViews ?? 0;

  const raw =
    input.factoryPhotoViews * 10 +
    input.exportPhotoViews * 15 +
    loadingViews * 20 +
    input.galleryViews * 25;

  const visualTrustScore = Math.min(SCORE_CAP, raw);

  return {
    ...input,
    loadingImageViews: loadingViews,
    visualTrustScore,
    trustLevel: resolveTrustLevel(visualTrustScore),
  };
}

export function upgradeSegmentFromVisualTrust(
  segment: UserSegment,
  trust: VisualTrustResult
): UserSegment {
  const { visualTrustScore, trustLevel } = trust;

  if (visualTrustScore >= 85 && segment === "hot") return "buyer_ready";
  if (visualTrustScore >= 65 && segment === "warm") return "hot";
  if (visualTrustScore >= 45 && segment === "cold") return "warm";
  if (trustLevel === "verified" && segment === "hot") return "buyer_ready";
  if (trustLevel === "high" && segment === "cold") return "warm";

  return segment;
}

/**
 * Visual trust unlocks RFQ / quote UI flags and may upgrade segment.
 */
export function applyVisualTrustToDecision(
  decision: V5Decision,
  trust: VisualTrustResult
): V5Decision {
  const segment = upgradeSegmentFromVisualTrust(decision.segment, trust);
  const ui = { ...decision.ui };

  if (trust.visualTrustScore >= 30) {
    ui.showTrust = true;
  }
  if (trust.visualTrustScore >= 40 || trust.factoryPhotoViews >= 1) {
    ui.showProduct = true;
    ui.showExportLayer = true;
  }
  if (trust.visualTrustScore >= 55 || trust.exportPhotoViews >= 1) {
    ui.showRFQ = true;
  }
  if (trust.visualTrustScore >= 70 || (trust.loadingImageViews ?? 0) >= 1) {
    ui.showQuoteCTA = true;
  }
  if (trust.trustLevel === "verified") {
    ui.showRFQ = true;
    ui.showQuoteCTA = true;
    ui.showExportLayer = true;
    ui.showProduct = true;
  }

  let intensity = decision.intensity;
  let bannerPriority = decision.bannerPriority;

  if (segment !== decision.segment) {
    if (segment === "buyer_ready" || segment === "hot") {
      intensity = "high";
      bannerPriority = "high";
    } else if (segment === "warm") {
      intensity = "medium";
      bannerPriority = "low";
    }
  }

  return {
    ...decision,
    segment,
    ui,
    intensity,
    bannerPriority,
  };
}

export function classifyImageSrc(src: string): {
  factory: boolean;
  export: boolean;
  loading: boolean;
  gallery: boolean;
} {
  const isFactory =
    src.includes("/images/factory/") ||
    src.includes("/images/home/factory-preview") ||
    src.includes("/images/home/production-");
  const isExport = src.includes("/images/export/");
  const isLoading = src.includes("export-loading");
  return {
    factory: isFactory,
    export: isExport,
    loading: isLoading,
    gallery: false,
  };
}
