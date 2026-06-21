export type ConversionPageType = "homepage" | "product" | "export" | "about";

export type UnifiedInput = {
  baseIntentScore: number;
  pageType: ConversionPageType;
  trustSignals: string[];
  engagementScore: number;
  productSignalStrength: number;
};

export type NormalizeConversionInputArgs = {
  pageType: ConversionPageType;
  rawScrollDepth: number;
  trustSignals: string[];
  productView: boolean;
};

const PAGE_BASE_SCORE: Record<ConversionPageType, number> = {
  homepage: 30,
  product: 55,
  export: 45,
  about: 20,
};

const TRUST_SIGNAL_BOOST: Record<string, number> = {
  export: 10,
  product: 15,
  docs: 20,
  factory: 10,
};

const MAX_ENGAGEMENT_SCORE = 30;

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function clampScrollDepth(scrollDepth: number): number {
  if (scrollDepth < 0) return 0;
  if (scrollDepth > 100) return 100;
  return scrollDepth;
}

function deriveEngagementScore(rawScrollDepth: number): number {
  return Math.min(MAX_ENGAGEMENT_SCORE, clampScrollDepth(rawScrollDepth) / 10);
}

function deriveProductSignalStrength(productView: boolean): number {
  return productView ? 20 : 0;
}

function deriveBaseIntentScore(args: NormalizeConversionInputArgs): number {
  let score = PAGE_BASE_SCORE[args.pageType];
  const signals = new Set(args.trustSignals);

  for (const [signal, bonus] of Object.entries(TRUST_SIGNAL_BOOST)) {
    if (signals.has(signal)) score += bonus;
  }

  score += deriveEngagementScore(args.rawScrollDepth);
  score += deriveProductSignalStrength(args.productView);

  return clampScore(score);
}

/**
 * V4 pure signal normalizer — no legacy RFQ scoring dependencies.
 */
export function normalizeConversionInput(
  args: NormalizeConversionInputArgs
): UnifiedInput {
  return {
    baseIntentScore: deriveBaseIntentScore(args),
    pageType: args.pageType,
    trustSignals: [...args.trustSignals],
    engagementScore: deriveEngagementScore(args.rawScrollDepth),
    productSignalStrength: deriveProductSignalStrength(args.productView),
  };
}
