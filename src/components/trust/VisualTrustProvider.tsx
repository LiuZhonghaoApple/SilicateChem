"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  useVisualTrustViews,
  type VisualTrustViewCounts,
} from "@/hooks/useVisualTrustViews";

type VisualTrustContextValue = {
  counts: VisualTrustViewCounts;
  trackImageView: (
    kind: "factory" | "export" | "loading" | "gallery" | "general"
  ) => void;
};

const VisualTrustContext = createContext<VisualTrustContextValue | null>(null);

export function VisualTrustProvider({ children }: { children: ReactNode }) {
  const { counts, trackImageView } = useVisualTrustViews();
  const value = useMemo(
    () => ({ counts, trackImageView }),
    [counts, trackImageView]
  );
  return (
    <VisualTrustContext.Provider value={value}>{children}</VisualTrustContext.Provider>
  );
}

export function useVisualTrustContext(): VisualTrustContextValue {
  const ctx = useContext(VisualTrustContext);
  if (!ctx) {
    return {
      counts: {
        imageViews: 0,
        galleryViews: 0,
        exportPhotoViews: 0,
        factoryPhotoViews: 0,
        loadingImageViews: 0,
      },
      trackImageView: () => {},
    };
  }
  return ctx;
}
