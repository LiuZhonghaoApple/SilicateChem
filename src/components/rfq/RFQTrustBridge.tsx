"use client";

import Link from "next/link";
import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";
import { trackRfqClick } from "@/lib/conversion/v5-feedback-tracker";
import { trackOutcome } from "@/lib/conversion/v6-conversion-tracker";
import type { UIVariant } from "@/lib/conversion/v6-types";

export type RFQTrustBridgePageType = "homepage" | "product" | "export";

type InquiryType = "coa" | "tds" | "sds" | "quote" | "export";

type Props = {
  product?: string;
  pageType: RFQTrustBridgePageType;
  className?: string;
  segment?: UserSegment;
  uiVariant?: UIVariant;
};

function technicalInquiryType(pageType: RFQTrustBridgePageType): InquiryType {
  switch (pageType) {
    case "product":
      return "coa";
    case "export":
      return "sds";
    default:
      return "tds";
  }
}

function buildContactHref(type: InquiryType, product?: string): string {
  const params = new URLSearchParams({ type });
  if (product) params.set("product", product);
  return `/contact?${params.toString()}`;
}

const BRIDGE_ACTIONS = [
  {
    id: "technical",
    label: "Request Technical Document",
    resolveType: technicalInquiryType,
  },
  {
    id: "quote",
    label: "Request Quote (RFQ)",
    resolveType: () => "quote" as const,
  },
  {
    id: "export",
    label: "Get Export Documentation",
    resolveType: () => "export" as const,
  },
] as const;

export function RFQTrustBridge({
  product,
  pageType,
  className = "",
  segment,
  uiVariant,
}: Props) {
  return (
    <div
      className={`rounded-lg border border-[#0B2D5B]/15 bg-[#0B2D5B]/5 p-5 md:p-6 ${className}`}
    >
      <p className="text-sm font-bold text-[#0B2D5B]">
        Trust → RFQ Conversion
      </p>
      <p className="mt-1 text-xs text-[#5A6570]">
        Continue from verified trust proof to factory inquiry — no commitment required.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {BRIDGE_ACTIONS.map((action) => {
          const inquiryType = action.resolveType(pageType);
          const href = buildContactHref(inquiryType, product);
          const isPrimary = action.id === "quote";

          return (
            <Link
              key={action.id}
              href={href}
              onClick={() => {
                if (segment && action.id === "quote") {
                  if (uiVariant) {
                    trackOutcome("rfq_click", { segment, uiVariant });
                  } else {
                    trackRfqClick(segment);
                  }
                }
              }}
              className={`inline-flex items-center justify-center rounded px-5 py-2.5 text-sm font-bold transition-colors ${
                isPrimary
                  ? "bg-[#0B2D5B] text-white hover:bg-[#071F3F]"
                  : "border border-[#0B2D5B] bg-white text-[#0B2D5B] hover:bg-[#F4F6F8]"
              }`}
            >
              {action.label}
            </Link>
          );
        })}
      </div>
      {product && (
        <p className="mt-3 text-xs text-[#5A6570]">
          Product context: <span className="font-semibold text-[#0B2D5B]">{product}</span>
        </p>
      )}
    </div>
  );
}
