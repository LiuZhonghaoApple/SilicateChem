"use client";

import { useCallback, useEffect, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import {
  clearFeedbackData,
  getEvents,
  getPerformanceBaseline,
  getSegmentDistribution,
  getSegmentPerformance,
  type ConversionEvent,
  type SegmentPerformanceMap,
} from "@/lib/conversion/v5-feedback-tracker";

const SEGMENTS: UserSegment[] = ["cold", "warm", "hot", "buyer_ready"];

const SEGMENT_LABELS: Record<UserSegment, string> = {
  cold: "Cold",
  warm: "Warm",
  hot: "Hot",
  buyer_ready: "Buyer Ready",
};

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
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

export default function V5DebugPage() {
  const isDev = process.env.NODE_ENV === "development";
  const [distribution, setDistribution] = useState<Record<UserSegment, number>>({
    cold: 0,
    warm: 0,
    hot: 0,
    buyer_ready: 0,
  });
  const [performance, setPerformance] = useState<SegmentPerformanceMap | null>(null);
  const [baseline, setBaseline] = useState(0);
  const [events, setEvents] = useState<ConversionEvent[]>([]);

  const refresh = useCallback(() => {
    setDistribution(getSegmentDistribution());
    setPerformance(getSegmentPerformance());
    setBaseline(getPerformanceBaseline());
    setEvents(getEvents().slice(-20).reverse());
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
          title="V5 Debug Dashboard"
          subtitle="This page is only available in development builds."
        />
        <p className="text-sm text-[#5A6570]">
          Set NODE_ENV=development to inspect conversion feedback data locally.
        </p>
      </Section>
    );
  }

  const perf = performance ?? getSegmentPerformance();
  const totalAssignments = SEGMENTS.reduce(
    (sum, segment) => sum + distribution[segment],
    0
  );

  return (
    <>
      <Section background="grey">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            title="V5.3 Conversion Feedback Loop"
            subtitle="Client-side segment performance from localStorage — no backend API."
          />
          <div className="flex gap-2">
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
                clearFeedbackData();
                refresh();
              }}
              className="rounded bg-[#0B2D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#071F3F]"
            >
              Clear Data
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              Total Assignments
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0B2D5B]">{totalAssignments}</p>
          </div>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              Tracked Events
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0B2D5B]">{getEvents().length}</p>
          </div>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5A6570]">
              RFQ Baseline Rate
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0B2D5B]">
              {formatRate(baseline)}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <StatTable
            title="Segment Distribution"
            headers={["Segment", "Assignments", "Share"]}
            rows={SEGMENTS.map((segment) => [
              SEGMENT_LABELS[segment],
              distribution[segment],
              totalAssignments > 0
                ? formatRate(distribution[segment] / totalAssignments)
                : "0.0%",
            ])}
          />

          <StatTable
            title="RFQ Conversion Rate by Segment"
            headers={["Segment", "Views", "RFQ Clicks", "Quote Clicks", "RFQ Rate"]}
            rows={SEGMENTS.map((segment) => [
              SEGMENT_LABELS[segment],
              perf[segment].views,
              perf[segment].rfqClicks,
              perf[segment].quoteClicks,
              formatRate(perf[segment].rfqRate),
            ])}
          />
        </div>

        <div className="mt-8">
          <StatTable
            title="Product Engagement by Segment"
            headers={[
              "Segment",
              "Product Views",
              "Export Views",
              "Engagement Rate",
            ]}
            rows={SEGMENTS.map((segment) => [
              SEGMENT_LABELS[segment],
              perf[segment].productViews,
              perf[segment].exportViews,
              formatRate(perf[segment].productEngagementRate),
            ])}
          />
        </div>
      </Section>

      <Section background="grey">
        <StatTable
          title="Recent Events (last 20)"
          headers={["Segment", "Event", "Time"]}
          rows={events.map((event) => [
            SEGMENT_LABELS[event.segment],
            event.eventType,
            new Date(event.timestamp).toLocaleString(),
          ])}
        />
        {events.length === 0 && (
          <p className="mt-4 text-sm text-[#5A6570]">
            No events yet. Browse the site with TrustLayer pages to populate feedback data.
          </p>
        )}
      </Section>
    </>
  );
}
