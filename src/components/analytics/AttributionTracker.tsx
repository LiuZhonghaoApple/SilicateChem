"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { captureInquiryAttribution } from "@/lib/attribution-client";

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureInquiryAttribution();
  }, [pathname, searchParams]);

  return null;
}
