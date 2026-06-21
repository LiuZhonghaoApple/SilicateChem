import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import type { UIVariant } from "@/lib/conversion/v6-types";
import { UI_VARIANTS } from "@/lib/conversion/v6-types";
import {
  trackExportPageVisit,
  trackProductViewDepth,
  trackQuoteClick,
  trackRfqClick,
  trackUIExposure,
} from "@/lib/conversion/v5-feedback-tracker";

export type { UIVariant };

export type OutcomeType =
  | "rfq_click"
  | "quote_click"
  | "product_view_depth"
  | "export_engagement";

export type ConversionOutcome = {
  type: OutcomeType;
  segment: UserSegment;
  uiVariant: UIVariant;
  timestamp: number;
  depth?: number;
};

export type OutcomeSummary = {
  total: number;
  byType: Record<OutcomeType, number>;
  byVariant: Record<UIVariant, number>;
  bySegment: Record<UserSegment, number>;
};

export type VariantPerformanceEntry = {
  views: number;
  rfqClicks: number;
  quoteClicks: number;
  productViews: number;
  exportEngagements: number;
  rfqRate: number;
  productEngagementRate: number;
  exportEngagementRate: number;
};

export type VariantPerformanceMap = Record<UIVariant, VariantPerformanceEntry>;

const STORAGE_KEY = "silicatechem-v6-outcomes";
const MAX_OUTCOMES = 500;

type OutcomeStore = {
  outcomes: ConversionOutcome[];
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function emptyVariantEntry(): VariantPerformanceEntry {
  return {
    views: 0,
    rfqClicks: 0,
    quoteClicks: 0,
    productViews: 0,
    exportEngagements: 0,
    rfqRate: 0,
    productEngagementRate: 0,
    exportEngagementRate: 0,
  };
}

function readStore(): OutcomeStore {
  if (!isBrowser()) return { outcomes: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { outcomes: [] };
    const parsed = JSON.parse(raw) as OutcomeStore;
    if (!Array.isArray(parsed.outcomes)) return { outcomes: [] };
    return parsed;
  } catch {
    return { outcomes: [] };
  }
}

function writeStore(store: OutcomeStore): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ outcomes: store.outcomes.slice(-MAX_OUTCOMES) })
    );
  } catch {
    // Ignore quota / privacy mode errors.
  }
}

export type OutcomeContext = {
  segment: UserSegment;
  uiVariant: UIVariant;
  depth?: number;
};

export function trackOutcome(type: OutcomeType, context: OutcomeContext): void {
  const store = readStore();
  store.outcomes.push({
    type,
    segment: context.segment,
    uiVariant: context.uiVariant,
    timestamp: Date.now(),
    depth: context.depth,
  });
  writeStore(store);

  switch (type) {
    case "rfq_click":
      trackRfqClick(context.segment);
      break;
    case "quote_click":
      trackQuoteClick(context.segment);
      break;
    case "product_view_depth":
      trackProductViewDepth(context.segment, context.depth);
      break;
    case "export_engagement":
      trackExportPageVisit(context.segment);
      break;
  }
}

export function trackVariantExposure(context: OutcomeContext): void {
  const store = readStore();
  const last = store.outcomes[store.outcomes.length - 1];
  if (
    last?.uiVariant === context.uiVariant &&
    last.segment === context.segment &&
    Date.now() - last.timestamp < 5000
  ) {
    trackUIExposure(context.segment);
    return;
  }

  store.outcomes.push({
    type: "product_view_depth",
    segment: context.segment,
    uiVariant: context.uiVariant,
    timestamp: Date.now(),
    depth: 0,
  });
  writeStore(store);
  trackUIExposure(context.segment);
}

export function getOutcomes(): ConversionOutcome[] {
  return readStore().outcomes;
}

export function getOutcomeCountSince(timestamp: number): number {
  return getOutcomes().filter((outcome) => outcome.timestamp > timestamp).length;
}

export function getOutcomeSummary(): OutcomeSummary {
  const summary: OutcomeSummary = {
    total: 0,
    byType: {
      rfq_click: 0,
      quote_click: 0,
      product_view_depth: 0,
      export_engagement: 0,
    },
    byVariant: {
      rfq_heavy: 0,
      product_heavy: 0,
      trust_heavy: 0,
    },
    bySegment: {
      cold: 0,
      warm: 0,
      hot: 0,
      buyer_ready: 0,
    },
  };

  for (const outcome of getOutcomes()) {
    summary.total += 1;
    summary.byType[outcome.type] += 1;
    summary.byVariant[outcome.uiVariant] += 1;
    summary.bySegment[outcome.segment] += 1;
  }

  return summary;
}

export function getVariantPerformance(): VariantPerformanceMap {
  const performance: VariantPerformanceMap = {
    rfq_heavy: emptyVariantEntry(),
    product_heavy: emptyVariantEntry(),
    trust_heavy: emptyVariantEntry(),
  };

  for (const outcome of getOutcomes()) {
    const entry = performance[outcome.uiVariant];
    switch (outcome.type) {
      case "rfq_click":
        entry.rfqClicks += 1;
        entry.views += 1;
        break;
      case "quote_click":
        entry.quoteClicks += 1;
        entry.views += 1;
        break;
      case "product_view_depth":
        entry.productViews += 1;
        entry.views += 1;
        break;
      case "export_engagement":
        entry.exportEngagements += 1;
        entry.views += 1;
        break;
    }
  }

  for (const variant of UI_VARIANTS) {
    const entry = performance[variant];
    const conversions = entry.rfqClicks + entry.quoteClicks;
    entry.rfqRate = entry.views > 0 ? conversions / entry.views : 0;
    entry.productEngagementRate =
      entry.views > 0 ? entry.productViews / entry.views : 0;
    entry.exportEngagementRate =
      entry.views > 0 ? entry.exportEngagements / entry.views : 0;
  }

  return performance;
}

export function clearV6OutcomeData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
