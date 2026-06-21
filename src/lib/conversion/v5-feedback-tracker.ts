import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";

export type ConversionEvent = {
  segment: UserSegment;
  eventType: "view" | "rfq_click" | "quote_click" | "product_view" | "export_view";
  timestamp: number;
};

export type SegmentPerformanceEntry = {
  rfqRate: number;
  views: number;
  rfqClicks: number;
  quoteClicks: number;
  productViews: number;
  exportViews: number;
  productEngagementRate: number;
};

export type SegmentPerformanceMap = Record<UserSegment, SegmentPerformanceEntry>;

const STORAGE_KEY = "silicatechem-v5-feedback";
const ASSIGNMENT_KEY = "silicatechem-v5-segment-assignments";
const MAX_EVENTS = 500;

const SEGMENTS: UserSegment[] = ["cold", "warm", "hot", "buyer_ready"];

type FeedbackStore = {
  events: ConversionEvent[];
};

type SegmentAssignment = {
  segment: UserSegment;
  timestamp: number;
};

function emptyPerformance(): SegmentPerformanceEntry {
  return {
    rfqRate: 0,
    views: 0,
    rfqClicks: 0,
    quoteClicks: 0,
    productViews: 0,
    exportViews: 0,
    productEngagementRate: 0,
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStore(): FeedbackStore {
  if (!isBrowser()) return { events: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { events: [] };
    const parsed = JSON.parse(raw) as FeedbackStore;
    if (!Array.isArray(parsed.events)) return { events: [] };
    return parsed;
  } catch {
    return { events: [] };
  }
}

function writeStore(store: FeedbackStore): void {
  if (!isBrowser()) return;
  try {
    const trimmed: FeedbackStore = {
      events: store.events.slice(-MAX_EVENTS),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore quota / privacy mode errors.
  }
}

function readAssignments(): SegmentAssignment[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ASSIGNMENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SegmentAssignment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAssignments(assignments: SegmentAssignment[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      ASSIGNMENT_KEY,
      JSON.stringify(assignments.slice(-MAX_EVENTS))
    );
  } catch {
    // Ignore quota / privacy mode errors.
  }
}

export function trackEvent(
  event: Omit<ConversionEvent, "timestamp"> & { timestamp?: number }
): void {
  const store = readStore();
  store.events.push({
    segment: event.segment,
    eventType: event.eventType,
    timestamp: event.timestamp ?? Date.now(),
  });
  writeStore(store);
}

export function trackSegmentAssignment(segment: UserSegment): void {
  const assignments = readAssignments();
  const last = assignments[assignments.length - 1];
  if (last?.segment === segment) return;

  assignments.push({ segment, timestamp: Date.now() });
  writeAssignments(assignments);
}

export function trackUIExposure(segment: UserSegment): void {
  trackEvent({ segment, eventType: "view" });
}

export function trackRfqClick(segment: UserSegment): void {
  trackEvent({ segment, eventType: "rfq_click" });
}

export function trackQuoteClick(segment: UserSegment): void {
  trackEvent({ segment, eventType: "quote_click" });
}

export function trackProductViewDepth(segment: UserSegment, depth?: number): void {
  void depth;
  trackEvent({ segment, eventType: "product_view" });
}

export function trackExportPageVisit(segment: UserSegment): void {
  trackEvent({ segment, eventType: "export_view" });
}

export function getEvents(): ConversionEvent[] {
  return readStore().events;
}

export function getSegmentDistribution(): Record<UserSegment, number> {
  const distribution: Record<UserSegment, number> = {
    cold: 0,
    warm: 0,
    hot: 0,
    buyer_ready: 0,
  };

  for (const assignment of readAssignments()) {
    distribution[assignment.segment] += 1;
  }

  if (readAssignments().length === 0) {
    for (const event of getEvents()) {
      if (event.eventType === "view") {
        distribution[event.segment] += 1;
      }
    }
  }

  return distribution;
}

export function getSegmentPerformance(): SegmentPerformanceMap {
  const performance: SegmentPerformanceMap = {
    cold: emptyPerformance(),
    warm: emptyPerformance(),
    hot: emptyPerformance(),
    buyer_ready: emptyPerformance(),
  };

  for (const event of getEvents()) {
    const entry = performance[event.segment];
    switch (event.eventType) {
      case "view":
        entry.views += 1;
        break;
      case "rfq_click":
        entry.rfqClicks += 1;
        break;
      case "quote_click":
        entry.quoteClicks += 1;
        break;
      case "product_view":
        entry.productViews += 1;
        break;
      case "export_view":
        entry.exportViews += 1;
        break;
    }
  }

  for (const segment of SEGMENTS) {
    const entry = performance[segment];
    const conversions = entry.rfqClicks + entry.quoteClicks;
    entry.rfqRate = entry.views > 0 ? conversions / entry.views : 0;
    entry.productEngagementRate =
      entry.views > 0 ? entry.productViews / entry.views : 0;
  }

  return performance;
}

/** Baseline RFQ rate across segments with measurable exposure. */
export function getPerformanceBaseline(): number {
  const performance = getSegmentPerformance();
  const rates = SEGMENTS.map((s) => performance[s].rfqRate).filter(
    (_, i) => performance[SEGMENTS[i]!].views >= 3
  );
  if (rates.length === 0) return 0;
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
}

export function clearFeedbackData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ASSIGNMENT_KEY);
}
