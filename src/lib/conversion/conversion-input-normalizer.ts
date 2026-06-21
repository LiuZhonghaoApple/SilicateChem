import {
  calculateRfqIntentScore,
  type RfqIntentLevel,
  type RfqIntentPageType,
  type RfqIntentTrustBlock,
} from "@/lib/rfq/rfq-intent-score";

export type UnifiedInput = {
  baseIntentScore: number;
  pageType: RfqIntentPageType;
  trustSignals: string[];
  engagementScore: number;
  productSignalStrength: number;
};

export type NormalizeConversionInputArgs = {
  pageType: RfqIntentPageType;
  rawScrollDepth: number;
  trustSignals: string[];
  productView: boolean;
  legacyScore?: number;
  legacyLevel?: RfqIntentLevel;
  viewedTrustBlocks?: RfqIntentTrustBlock[];
};

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function clampScrollDepth(scrollDepth: number): number {
  if (scrollDepth < 0) return 0;
  if (scrollDepth > 100) return 100;
  return scrollDepth;
}

function resolveLegacyIntent(args: NormalizeConversionInputArgs): {
  score: number;
  level: RfqIntentLevel;
} {
  if (args.legacyScore !== undefined && args.legacyLevel !== undefined) {
    return {
      score: clampScore(args.legacyScore),
      level: args.legacyLevel,
    };
  }

  if (args.viewedTrustBlocks) {
    const intent = calculateRfqIntentScore({
      pageType: args.pageType,
      hasProduct: args.productView,
      viewedTrustBlocks: args.viewedTrustBlocks,
      scrollDepth: args.rawScrollDepth,
    });
    return { score: intent.score, level: intent.level };
  }

  return { score: 0, level: "low" };
}

function deriveProductSignalStrength(
  productView: boolean,
  trustSignals: string[]
): number {
  if (!productView) return 0;
  const signals = new Set(trustSignals);
  if (signals.has("product")) return 100;
  return 60;
}

/**
 * Pure input standardization — single normalized source for the conversion brain.
 * Legacy RFQ intent scoring is resolved here (not inside unifiedConversionBrain).
 */
export function normalizeConversionInput(
  args: NormalizeConversionInputArgs
): UnifiedInput {
  const legacy = resolveLegacyIntent(args);
  void legacy.level;

  return {
    baseIntentScore: clampScore(legacy.score),
    pageType: args.pageType,
    trustSignals: [...args.trustSignals],
    engagementScore: clampScrollDepth(args.rawScrollDepth),
    productSignalStrength: deriveProductSignalStrength(
      args.productView,
      args.trustSignals
    ),
  };
}

export function unifiedInputToLegacyLevel(
  input: UnifiedInput
): RfqIntentLevel {
  if (input.baseIntentScore <= 39) return "low";
  if (input.baseIntentScore <= 69) return "medium";
  return "high";
}
