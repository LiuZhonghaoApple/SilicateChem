"use client";

import { useCallback, useMemo, useState } from "react";
import type { VisualTrustInputs } from "@/lib/trust/v6-visual-trust-engine";

export type VisualTrustViewCounts = VisualTrustInputs;

const INITIAL: VisualTrustViewCounts = {
  imageViews: 0,
  galleryViews: 0,
  exportPhotoViews: 0,
  factoryPhotoViews: 0,
  loadingImageViews: 0,
};

export function useVisualTrustViews() {
  const [counts, setCounts] = useState<VisualTrustViewCounts>(INITIAL);

  const trackImageView = useCallback(
    (kind: "factory" | "export" | "loading" | "gallery" | "general") => {
      setCounts((prev) => {
        const next = { ...prev, imageViews: prev.imageViews + 1 };
        if (kind === "factory") next.factoryPhotoViews += 1;
        if (kind === "export") next.exportPhotoViews += 1;
        if (kind === "loading") {
          next.loadingImageViews = (prev.loadingImageViews ?? 0) + 1;
          next.exportPhotoViews += 1;
        }
        if (kind === "gallery") next.galleryViews += 1;
        return next;
      });
    },
    []
  );

  return useMemo(
    () => ({
      counts,
      trackImageView,
    }),
    [counts, trackImageView]
  );
}
