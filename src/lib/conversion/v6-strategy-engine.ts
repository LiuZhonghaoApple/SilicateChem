import type { UIVariant } from "@/lib/conversion/v6-types";

export type StrategyWeights = {
  exportWeight: number;
  productWeight: number;
  rfqWeight: number;
  trustWeight: number;
};

export type VariantOutcomeSummary = Record<
  UIVariant,
  {
    views: number;
    rfqClicks: number;
    quoteClicks: number;
    productViews: number;
    exportEngagements: number;
    rfqRate: number;
  }
>;

const STORAGE_KEY = "silicatechem-v6-strategy-weights";

const DEFAULT_WEIGHTS: StrategyWeights = {
  exportWeight: 0.25,
  productWeight: 0.25,
  rfqWeight: 0.25,
  trustWeight: 0.25,
};

const MAX_ADJUSTMENT = 0.05;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalize(weights: StrategyWeights): StrategyWeights {
  const sum =
    weights.exportWeight +
    weights.productWeight +
    weights.rfqWeight +
    weights.trustWeight;

  if (sum <= 0) return { ...DEFAULT_WEIGHTS };

  return {
    exportWeight: weights.exportWeight / sum,
    productWeight: weights.productWeight / sum,
    rfqWeight: weights.rfqWeight / sum,
    trustWeight: weights.trustWeight / sum,
  };
}

function readWeights(): StrategyWeights {
  if (!isBrowser()) return { ...DEFAULT_WEIGHTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_WEIGHTS };
    const parsed = JSON.parse(raw) as StrategyWeights;
    return normalize(parsed);
  } catch {
    return { ...DEFAULT_WEIGHTS };
  }
}

function writeWeights(weights: StrategyWeights): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalize(weights)));
  } catch {
    // Ignore quota / privacy mode errors.
  }
}

export function getStrategyWeights(): StrategyWeights {
  return readWeights();
}

export function updateStrategyWeights(partial: Partial<StrategyWeights>): StrategyWeights {
  const next = normalize({ ...readWeights(), ...partial });
  writeWeights(next);
  return next;
}

export function resetStrategyWeights(): StrategyWeights {
  writeWeights(DEFAULT_WEIGHTS);
  return { ...DEFAULT_WEIGHTS };
}

export function clearStrategyWeights(): StrategyWeights {
  return resetStrategyWeights();
}

/**
 * Nudges weights toward UI variants with stronger RFQ conversion signals.
 * Max ±5% per weight per optimization cycle.
 */
export function applyWeightUpdateFromOutcomes(
  outcomes: VariantOutcomeSummary
): StrategyWeights {
  const current = readWeights();
  const variants: UIVariant[] = ["rfq_heavy", "product_heavy", "trust_heavy"];

  const eligible = variants.filter((variant) => outcomes[variant].views >= 5);
  if (eligible.length === 0) return current;

  const ranked = [...eligible].sort(
    (a, b) => outcomes[b].rfqRate - outcomes[a].rfqRate
  );
  const best = ranked[0]!;
  const worst = ranked[ranked.length - 1]!;

  if (best === worst || outcomes[best].rfqRate <= outcomes[worst].rfqRate) {
    return current;
  }

  const delta = MAX_ADJUSTMENT;
  const next = { ...current };

  if (best === "rfq_heavy") {
    next.rfqWeight += delta;
    next.productWeight -= delta / 2;
    next.trustWeight -= delta / 2;
  } else if (best === "product_heavy") {
    next.productWeight += delta;
    next.rfqWeight -= delta / 2;
    next.trustWeight -= delta / 2;
  } else {
    next.trustWeight += delta;
    next.rfqWeight -= delta / 2;
    next.productWeight -= delta / 2;
  }

  const exportSignal =
    outcomes.rfq_heavy.exportEngagements +
    outcomes.product_heavy.exportEngagements +
    outcomes.trust_heavy.exportEngagements;
  const productSignal =
    outcomes.rfq_heavy.productViews +
    outcomes.product_heavy.productViews +
    outcomes.trust_heavy.productViews;

  if (exportSignal > productSignal * 1.2) {
    next.exportWeight += delta / 2;
    next.trustWeight -= delta / 4;
    next.productWeight -= delta / 4;
  } else if (productSignal > exportSignal * 1.2) {
    next.productWeight += delta / 4;
    next.exportWeight -= delta / 4;
  }

  const normalized = normalize(next);
  writeWeights(normalized);
  return normalized;
}
