import type { ConversionFunnelStage } from "@/lib/conversion/unified-conversion-brain";

export type UserValueInput = {
  rfqScore: number;
  funnelStage: ConversionFunnelStage;
  trustSignals: string[];
  productViews: number;
  exportViews: number;
};

const FUNNEL_STAGE_WEIGHT: Record<ConversionFunnelStage, number> = {
  awareness: 0,
  consideration: 12,
  conversion: 28,
};

const TRUST_SIGNAL_WEIGHT: Record<string, number> = {
  export: 6,
  product: 10,
  docs: 12,
  factory: 5,
};

const RFQ_WEIGHT = 0.45;
const MAX_PRODUCT_VIEWS_BOOST = 18;
const MAX_EXPORT_VIEWS_BOOST = 12;

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Client-side user value score (0–100) from engagement and intent signals.
 */
export function computeUserValueScore(input: UserValueInput): number {
  let score = clampScore(input.rfqScore) * RFQ_WEIGHT;
  score += FUNNEL_STAGE_WEIGHT[input.funnelStage];

  const seen = new Set<string>();
  for (const signal of input.trustSignals) {
    if (seen.has(signal)) continue;
    seen.add(signal);
    score += TRUST_SIGNAL_WEIGHT[signal] ?? 0;
  }

  score += Math.min(MAX_PRODUCT_VIEWS_BOOST, Math.max(0, input.productViews) * 6);
  score += Math.min(MAX_EXPORT_VIEWS_BOOST, Math.max(0, input.exportViews) * 12);

  return clampScore(score);
}
