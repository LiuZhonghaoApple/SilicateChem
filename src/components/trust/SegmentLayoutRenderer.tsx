"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/types";
import type { V5Decision } from "@/lib/conversion/v5-segmentation-engine";
import type { LayoutBlock } from "@/lib/conversion/v5-layout-map";
import { trackQuoteClick } from "@/lib/conversion/v5-feedback-tracker";
import { trackOutcome } from "@/lib/conversion/v6-conversion-tracker";
import type { UIVariant } from "@/lib/conversion/v6-types";
import { RFQTrustBridge, type RFQTrustBridgePageType } from "@/components/rfq/RFQTrustBridge";
import { ExportProofMap } from "@/components/trust/ExportProofMap";
import { ProductProofPanel } from "@/components/trust/ProductProofPanel";
import { TechnicalDocsBlock } from "@/components/trust/TechnicalDocsBlock";
import { TrustStack } from "@/components/trust/TrustStack";
import { IndustryApplicationsSummary } from "@/components/trust/IndustryApplicationsSummary";
import { HomeTrustRfqBlock } from "@/components/trust/HomeTrustSection";

export type TrustLayerVariant = "homepage" | "product" | "about";

export type TrustBlockAvailability = {
  export: boolean;
  product: boolean;
  docs: boolean;
};

export type SegmentRenderContext = {
  variant: TrustLayerVariant;
  availability: TrustBlockAvailability;
  decision: V5Decision;
  product?: Product;
  inquiryProductName?: string;
  bridgePageType: RFQTrustBridgePageType;
  uiVariant?: UIVariant;
};

function QuoteCTA({
  product,
  decision,
  mode,
  uiVariant,
}: {
  product?: string;
  decision: V5Decision;
  mode: LayoutBlock["mode"];
  uiVariant?: UIVariant;
}) {
  const href = product
    ? `/contact?type=quote&product=${encodeURIComponent(product)}`
    : "/contact?type=quote";

  const isHigh =
    mode === "sticky" ||
    mode === "persistent_sticky" ||
    decision.segment === "buyer_ready";

  const isMinimal = mode === "minimal";

  const wrapperClass =
    mode === "sticky" || mode === "persistent_sticky"
      ? "sticky bottom-4 z-20"
      : "";

  return (
    <div className={wrapperClass}>
      <div
        role="status"
        data-segment={decision.segment}
        data-cta-mode={mode}
        className={`rounded-lg border px-4 py-3 text-sm ${
          isHigh
            ? "border-[#0B2D5B] bg-[#0B2D5B] text-white shadow-lg"
            : isMinimal
              ? "border-[#E2E6EA] bg-white text-[#0B2D5B]"
              : "border-[#2E7D9A]/40 bg-[#2E7D9A]/10 text-[#0B2D5B]"
        }`}
      >
        <p className="font-bold">
          {decision.segment === "buyer_ready"
            ? "Buyer-ready — request factory quotation"
            : isMinimal
              ? "Learn more about factory-direct supply"
              : "Ready for factory-direct pricing?"}
        </p>
        {!isMinimal && (
          <p className={`mt-1 text-xs ${isHigh ? "text-blue-100" : "text-[#5A6570]"}`}>
            Request a quotation with grade, quantity, and destination details.
          </p>
        )}
        <Link
          href={href}
          onClick={() => {
            if (uiVariant) {
              trackOutcome("quote_click", {
                segment: decision.segment,
                uiVariant,
              });
            } else {
              trackQuoteClick(decision.segment);
            }
          }}
          className={`mt-3 inline-flex items-center justify-center rounded px-4 py-2 text-xs font-bold transition-colors ${
            isHigh
              ? "bg-white text-[#0B2D5B] hover:bg-blue-50"
              : isMinimal
                ? "border border-[#0B2D5B] text-[#0B2D5B] hover:bg-[#F4F6F8]"
                : "bg-[#0B2D5B] text-white hover:bg-[#071F3F]"
          }`}
        >
          {isMinimal ? "Contact Factory" : "Request Quote (RFQ)"}
        </Link>
      </div>
    </div>
  );
}

export function renderSegmentBlock(
  block: LayoutBlock,
  ctx: SegmentRenderContext
): ReactNode {
  const productName = ctx.inquiryProductName ?? ctx.product?.name;

  switch (block.type) {
    case "trust_core":
      return (
        <div data-block="trust_core" data-mode={block.mode ?? "default"}>
          <TrustStack compact={block.mode === "compressed"} />
          {block.mode === "full" && ctx.availability.docs && (
            <div className="mt-8">
              <TechnicalDocsBlock product={ctx.product?.name} />
            </div>
          )}
        </div>
      );

    case "company_proof":
      return ctx.availability.export ? (
        <div data-block="company_proof">
          <ExportProofMap variant="preview" showHeader={false} />
        </div>
      ) : null;

    case "product_proof":
      return ctx.availability.product && ctx.product ? (
        <div data-block="product_proof" data-mode={block.mode ?? "default"}>
          <ProductProofPanel
            product={ctx.product}
            showHeader={block.mode === "full"}
          />
        </div>
      ) : null;

    case "application_industries":
      return (
        <div data-block="application_industries">
          <IndustryApplicationsSummary />
        </div>
      );

    case "export_map":
      return ctx.availability.export ? (
        <div data-block="export_map" data-mode={block.mode ?? "full"}>
          <ExportProofMap
            variant={block.mode === "compressed" ? "preview" : "full"}
          />
        </div>
      ) : null;

    case "rfq_bridge":
      return (
        <div data-block="rfq_bridge">
          <RFQTrustBridge
            pageType={ctx.bridgePageType}
            product={productName}
            segment={ctx.decision.segment}
            uiVariant={ctx.uiVariant}
          />
          {ctx.variant === "homepage" && (
            <div className="mt-6">
              <HomeTrustRfqBlock product={productName} />
            </div>
          )}
        </div>
      );

    case "technical_docs":
      return ctx.availability.docs ? (
        <div data-block="technical_docs">
          <TechnicalDocsBlock product={ctx.product?.name} />
        </div>
      ) : null;

    case "cta":
      return (
        <QuoteCTA
          product={productName}
          decision={ctx.decision}
          mode={block.mode}
          uiVariant={ctx.uiVariant}
        />
      );

    default:
      return null;
  }
}

export function renderSegmentLayout(
  layout: LayoutBlock[],
  ctx: SegmentRenderContext
): ReactNode[] {
  return layout
    .map((block, index) => {
      const node = renderSegmentBlock(block, ctx);
      if (!node) return null;
      return (
        <div key={`${block.type}-${index}`} className="segment-layout-block">
          {node}
        </div>
      );
    })
    .filter(Boolean);
}
