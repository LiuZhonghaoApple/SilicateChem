"use client";

import { useCallback, useEffect, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getSegmentPerformance } from "@/lib/conversion/v5-feedback-tracker";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import {
  clearV6OutcomeData,
  getOutcomeCountSince,
  getOutcomeSummary,
  getOutcomes,
  getVariantPerformance,
  type ConversionOutcome,
  type VariantPerformanceEntry,
} from "@/lib/conversion/v6-conversion-tracker";
import {
  clearOptimizationState,
  forceOptimization,
  getLastOptimizationTime,
  isOptimizationDue,
  OPTIMIZATION_INTERVAL_MS,
  SESSION_BATCH_THRESHOLD,
} from "@/lib/conversion/v6-optimizer";
import {
  getStrategyWeights,
  resetStrategyWeights,
  type StrategyWeights,
} from "@/lib/conversion/v6-strategy-engine";
import { selectUIVariant } from "@/lib/conversion/v6-ui-selector";
import type { UIVariant } from "@/lib/conversion/v6-types";
import { UI_VARIANTS } from "@/lib/conversion/v6-types";

const SEGMENTS: UserSegment[] = ["cold", "warm", "hot", "buyer_ready"];

const SEGMENT_LABELS: Record<UserSegment, string> = {
  cold: "Cold",
  warm: "Warm",
  hot: "Hot",
  buyer_ready: "Buyer Ready",
};

const VARIANT_LABELS: Record<UIVariant, string> = {
  rfq_heavy: "RFQ Heavy",
  product_heavy: "Product Heavy",
  trust_heavy: "Trust Heavy",
};

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function formatWeight(weights: StrategyWeights): string {
  return `export ${formatRate(weights.exportWeight)} · product ${formatRate(weights.productWeight)} · rfq ${formatRate(weights.rfqWeight)} · trust ${formatRate(weights.trustWeight)}`;
}

function StatTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E2E6EA] bg-white">
      <div className="border-b border-[#E2E6EA] bg-[#F4F6F8] px-4 py-3">
        <h3 className="text-sm font-bold text-[#0B2D5B]">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E6EA] text-xs uppercase tracking-wide text-[#5A6570]">
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#E2E6EA] last:border-b-0 even:bg-[#F4F6F8]/50"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-[#0B2D5B]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function variantPerfRows(perf: Record<UIVariant, VariantPerformanceEntry>) {
  return UI_VARIANTS.map((variant) => [
    VARIANT_LABELS[variant],
    perf[variant].views,
    perf[variant].rfqClicks + perf[variant].quoteClicks,
    formatRate(perf[variant].rfqRate),
    formatRate(perf[variant].productEngagementRate),
    formatRate(perf[variant].exportEngagementRate),
  ]);
}

export default function V6DebugPage() {
  const isDev = process.env.NODE_ENV === "development";
  const [weights, setWeights] = useState<StrategyWeights>(getStrategyWeights());
  const [lastOptimization, setLastOptimization] = useState(getLastOptimizationTime());
  const [batchCount, setBatchCount] = useState(0);
  const [summary, setSummary] = useState(getOutcomeSummary());
  const [variantPerf, setVariantPerf] = useState(getVariantPerformance());
  const [segmentPerf, setSegmentPerf] = useState(getSegmentPerformance());
  const [events, setEvents] = useState<ConversionOutcome[]>([]);
  const [optimizationDue, setOptimizationDue] = useState(isOptimizationDue());

  const refresh = useCallback(() => {
    const lastRun = getLastOptimizationTime();
    setWeights(getStrategyWeights());
    setLastOptimization(lastRun);
    setBatchCount(getOutcomeCountSince(lastRun));
    setSummary(getOutcomeSummary());
    setVariantPerf(getVariantPerformance());
    setSegmentPerf(getSegmentPerformance());
    setEvents(getOutcomes().slice(-20).reverse());
    setOptimizationDue(isOptimizationDue());
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 2000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  if (!isDev) {
    return (
      <Section background="grey">
        <SectionHeader
          title="V6 Debug Dashboard"
          subtitle="This page is only available in development builds."
        />
        <p className="text-sm text-[#5A6570]">
          Set NODE_ENV=development to inspect V6 optimization data locally.
        </p>
      </Section>
    );
  }

  const lastRunLabel =
    lastOptimization > 0
      ? new Date(lastOptimization).toLocaleString()
      : "Never";

  return (
    <>
      <Section background="grey">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            title="V6 Autonomous Optimization"
            subtitle="Strategy weights, variant performance, and optimization loop — client-side only."
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refresh}
              className="rounded border border-[#0B2D5B] px-4 py-2 text-xs font-bold text-[#0B2D5B] hover:bg-[#0B2D5B]/5"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                forceOptimization();
                refresh();
              }}
              className="rounded border border-[#2E7D9A] px-4 py-2 text-xs font-bold text-[#2E7D9A] hover:bg-[#2E7D9A]/5"
            >
              Force Optimize
            </button>
            <button
              type="button"
              onClick={() => {
                resetStrategyWeights();
                refresh();
              }}
              className="rounded border border-[#5A6570] px-4 py-2 text-xs font-bold text-[#5A6570] hover:bg-[#F4F6F8]"
            >
              Reset Weights
            </button>
            <button
              type="button"
              onClick={() => {
                clearV6OutcomeData();
                clearOptimizationState();
                resetStrategyWeights();
                refresh();
              }}
              className="rounded bg-[#0B2D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#071F3F]"
            >
              Clear All V6 Data
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-4">
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              Strategy Weights
            </p>
            <p className="mt-2 text-sm font-medium text-[#0B2D5B]">{formatWeight(weights)}</p>
          </div>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              Last Optimization
            </p>
            <p className="mt-2 text-sm font-bold text-[#0B2D5B]">{lastRunLabel}</p>
          </div>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              Batch Events
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0B2D5B]">
              {batchCount}
              <span className="ml-1 text-sm font-normal text-[#5A6570]">
                / {SESSION_BATCH_THRESHOLD}
              </span>
            </p>
          </div>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              Optimization Due
            </p>
            <p className="mt-2 text-lg font-bold text-[#0B2D5B]">
              {optimizationDue.due ? `Yes (${optimizationDue.reason})` : "No"}
            </p>
            <p className="mt-1 text-xs text-[#5A6570]">
              Interval: {OPTIMIZATION_INTERVAL_MS / 3600000}h
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <StatTable
            title="UI Variant Performance"
            headers={[
              "Variant",
              "Views",
              "Conversions",
              "RFQ Rate",
              "Product Eng.",
              "Export Eng.",
            ]}
            rows={variantPerfRows(variantPerf)}
          />

          <StatTable
            title="Segment Conversion Rates (V5 feedback)"
            headers={["Segment", "Views", "RFQ Rate", "Selected UI Variant"]}
            rows={SEGMENTS.map((segment) => [
              SEGMENT_LABELS[segment],
              segmentPerf[segment].views,
              formatRate(segmentPerf[segment].rfqRate),
              VARIANT_LABELS[selectUIVariant({ segment, weights })],
            ])}
          />
        </div>

        <div className="mt-8">
          <StatTable
            title="Outcome Summary"
            headers={["Metric", "Count"]}
            rows={[
              ["Total outcomes", summary.total],
              ["RFQ clicks", summary.byType.rfq_click],
              ["Quote clicks", summary.byType.quote_click],
              ["Product depth", summary.byType.product_view_depth],
              ["Export engagement", summary.byType.export_engagement],
            ]}
          />
        </div>
      </Section>

      <Section background="grey">
        <StatTable
          title="Recent V6 Outcomes (last 20)"
          headers={["Variant", "Segment", "Type", "Time"]}
          rows={events.map((event) => [
            VARIANT_LABELS[event.uiVariant],
            SEGMENT_LABELS[event.segment],
            event.type,
            new Date(event.timestamp).toLocaleString(),
          ])}
        />
        {events.length === 0 && (
          <p className="mt-4 text-sm text-[#5A6570]">
            No V6 outcomes yet. Browse TrustLayer pages and click RFQ/quote CTAs to populate data.
          </p>
        )}
      </Section>
    </>
  );
}
