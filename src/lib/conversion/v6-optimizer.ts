import { getSegmentPerformance } from "@/lib/conversion/v5-feedback-tracker";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import {
  getOutcomeCountSince,
  getVariantPerformance,
} from "@/lib/conversion/v6-conversion-tracker";
import {
  applyWeightUpdateFromOutcomes,
  getStrategyWeights,
  type StrategyWeights,
  type VariantOutcomeSummary,
} from "@/lib/conversion/v6-strategy-engine";

const LAST_OPTIMIZATION_KEY = "silicatechem-v6-last-optimization";

export const SESSION_BATCH_THRESHOLD = 15;
export const OPTIMIZATION_INTERVAL_MS = 24 * 60 * 60 * 1000;

export type OptimizationResult = {
  ranAt: number;
  reason: "interval" | "session_batch" | "forced";
  previousWeights: StrategyWeights;
  nextWeights: StrategyWeights;
  variantPerformance: VariantOutcomeSummary;
  segmentConversion: Record<UserSegment, number>;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readLastOptimizationTime(): number {
  if (!isBrowser()) return 0;
  try {
    const raw = localStorage.getItem(LAST_OPTIMIZATION_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

function writeLastOptimizationTime(timestamp: number): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(LAST_OPTIMIZATION_KEY, String(timestamp));
  } catch {
    // Ignore quota / privacy mode errors.
  }
}

export function getLastOptimizationTime(): number {
  return readLastOptimizationTime();
}

function buildVariantOutcomeSummary(): VariantOutcomeSummary {
  return getVariantPerformance();
}

function buildSegmentConversion(): Record<UserSegment, number> {
  const performance = getSegmentPerformance();
  return {
    cold: performance.cold.rfqRate,
    warm: performance.warm.rfqRate,
    hot: performance.hot.rfqRate,
    buyer_ready: performance.buyer_ready.rfqRate,
  };
}

function runOptimization(reason: OptimizationResult["reason"]): OptimizationResult {
  const previousWeights = getStrategyWeights();
  const variantPerformance = buildVariantOutcomeSummary();
  const nextWeights = applyWeightUpdateFromOutcomes(variantPerformance);
  const ranAt = Date.now();

  writeLastOptimizationTime(ranAt);

  return {
    ranAt,
    reason,
    previousWeights,
    nextWeights,
    variantPerformance,
    segmentConversion: buildSegmentConversion(),
  };
}

export function runOptimizationIfDue(): OptimizationResult | null {
  if (!isBrowser()) return null;

  const lastRun = readLastOptimizationTime();
  const now = Date.now();
  const intervalDue = now - lastRun >= OPTIMIZATION_INTERVAL_MS;
  const batchDue =
    getOutcomeCountSince(lastRun) >= SESSION_BATCH_THRESHOLD;

  if (!intervalDue && !batchDue) return null;

  return runOptimization(intervalDue ? "interval" : "session_batch");
}

export function forceOptimization(): OptimizationResult {
  return runOptimization("forced");
}

export function isOptimizationDue(): {
  due: boolean;
  reason: "interval" | "session_batch" | null;
} {
  if (!isBrowser()) return { due: false, reason: null };

  const lastRun = readLastOptimizationTime();
  const now = Date.now();
  const intervalDue = now - lastRun >= OPTIMIZATION_INTERVAL_MS;
  const batchDue =
    getOutcomeCountSince(lastRun) >= SESSION_BATCH_THRESHOLD;

  if (intervalDue) return { due: true, reason: "interval" };
  if (batchDue) return { due: true, reason: "session_batch" };
  return { due: false, reason: null };
}

export function clearOptimizationState(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(LAST_OPTIMIZATION_KEY);
}
