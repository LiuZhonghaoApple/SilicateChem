export type RfqIntentPageType = "homepage" | "product" | "export" | "about";

export type RfqIntentLevel = "low" | "medium" | "high";

export type RfqIntentTrustBlock = "export" | "product" | "docs";

export type RfqIntentScoreInput = {
  pageType: RfqIntentPageType;
  hasProduct: boolean;
  viewedTrustBlocks: RfqIntentTrustBlock[];
  scrollDepth: number;
};

export type RfqIntentScoreResult = {
  score: number;
  level: RfqIntentLevel;
};

const BASE_SCORE_BY_PAGE: Record<RfqIntentPageType, number> = {
  homepage: 20,
  product: 50,
  export: 40,
  about: 25,
};

const TRUST_BLOCK_BONUS: Record<RfqIntentTrustBlock, number> = {
  export: 20,
  product: 25,
  docs: 15,
};

function clampScrollDepth(scrollDepth: number): number {
  if (scrollDepth < 0) return 0;
  if (scrollDepth > 100) return 100;
  return scrollDepth;
}

function classifyLevel(score: number): RfqIntentLevel {
  if (score <= 39) return "low";
  if (score <= 69) return "medium";
  return "high";
}

/**
 * Calculates RFQ conversion probability score from page and engagement context.
 * Pure function — no side effects or network calls.
 */
export function calculateRfqIntentScore(
  input: RfqIntentScoreInput
): RfqIntentScoreResult {
  let score = BASE_SCORE_BY_PAGE[input.pageType];

  const viewed = new Set(input.viewedTrustBlocks);
  if (viewed.has("export")) score += TRUST_BLOCK_BONUS.export;
  if (viewed.has("product")) score += TRUST_BLOCK_BONUS.product;
  if (viewed.has("docs")) score += TRUST_BLOCK_BONUS.docs;

  score += clampScrollDepth(input.scrollDepth) / 5;

  score = Math.min(100, Math.round(score));

  return {
    score,
    level: classifyLevel(score),
  };
}
