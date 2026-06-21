"use client";

import { useEffect, useRef } from "react";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import {
  trackExportPageVisit,
  trackProductViewDepth,
  trackSegmentAssignment,
  trackUIExposure,
} from "@/lib/conversion/v5-feedback-tracker";

type UseV5FeedbackOptions = {
  productViews?: number;
  exportPageViewed?: boolean;
};

/**
 * V5.3 feedback loop — records segment assignment, UI exposure, and depth signals.
 */
export function useV5Feedback(
  segment: UserSegment,
  options: UseV5FeedbackOptions = {}
): void {
  const prevSegment = useRef<UserSegment | null>(null);
  const prevProductViews = useRef<number | undefined>(undefined);
  const prevExportViewed = useRef<boolean | undefined>(undefined);
  const exposureKey = useRef<string | null>(null);

  useEffect(() => {
    if (prevSegment.current !== segment) {
      trackSegmentAssignment(segment);
      prevSegment.current = segment;
    }

    const exposureId = `${segment}:${window.location.pathname}`;
    if (exposureKey.current !== exposureId) {
      trackUIExposure(segment);
      exposureKey.current = exposureId;
    }
  }, [segment]);

  useEffect(() => {
    const views = options.productViews ?? 0;
    if (prevProductViews.current !== undefined && views > prevProductViews.current) {
      trackProductViewDepth(segment, views);
    }
    prevProductViews.current = views;
  }, [segment, options.productViews]);

  useEffect(() => {
    const exportViewed = options.exportPageViewed ?? false;
    if (exportViewed && !prevExportViewed.current) {
      trackExportPageVisit(segment);
    }
    prevExportViewed.current = exportViewed;
  }, [segment, options.exportPageViewed]);
}
