"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { useConversionBrain } from "@/hooks/useConversionBrain";
import { RFQTrustBridge, type RFQTrustBridgePageType } from "@/components/rfq/RFQTrustBridge";
import type { RfqIntentTrustBlock } from "@/lib/rfq/rfq-intent-score";
import { ExportProofMap } from "@/components/trust/ExportProofMap";
import { ProductProofPanel } from "@/components/trust/ProductProofPanel";
import { TechnicalDocsBlock } from "@/components/trust/TechnicalDocsBlock";

export { TechnicalDocsBlock as TechnicalDocsTrustBlock };

type TrustLayerVariant = "homepage" | "product" | "about";

function resolveBridgePageType(variant: TrustLayerVariant): RFQTrustBridgePageType {
  if (variant === "product") return "product";
  if (variant === "about") return "export";
  return "homepage";
}

function resolvePageType(
  variant: TrustLayerVariant
): "homepage" | "product" | "export" | "about" {
  if (variant === "product") return "product";
  if (variant === "about") return "about";
  return "homepage";
}

const VARIANT_DEFAULTS: Record<
  TrustLayerVariant,
  { showExport: boolean; showProductTrust: boolean; showDocsTrust: boolean }
> = {
  homepage: { showExport: true, showProductTrust: true, showDocsTrust: true },
  product: { showExport: true, showProductTrust: true, showDocsTrust: false },
  about: { showExport: true, showProductTrust: false, showDocsTrust: true },
};

type Props = {
  variant: TrustLayerVariant;
  showExport?: boolean;
  showProductTrust?: boolean;
  showDocsTrust?: boolean;
  product?: Product;
  className?: string;
  scrollDepth?: number;
};

function QuoteCTABanner({
  product,
  intensity,
}: {
  product?: string;
  intensity: "low" | "medium" | "high";
}) {
  const href = product
    ? `/contact?type=quote&product=${encodeURIComponent(product)}`
    : "/contact?type=quote";

  return (
    <div
      role="status"
      data-conversion-intent={intensity}
      className="rounded-lg border border-[#2E7D9A]/40 bg-[#2E7D9A]/10 px-4 py-3 text-sm"
    >
      <p className="font-bold text-[#0B2D5B]">Ready for factory-direct pricing?</p>
      <p className="mt-1 text-xs text-[#5A6570]">
        Request a quotation with grade, quantity, and destination details.
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center justify-center rounded bg-[#0B2D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#071F3F] transition-colors"
      >
        Request Quote (RFQ)
      </Link>
    </div>
  );
}

export function TrustLayer({
  variant,
  showExport,
  showProductTrust,
  showDocsTrust,
  product,
  className = "",
  scrollDepth = 0,
}: Props) {
  const defaults = VARIANT_DEFAULTS[variant];
  const exportVisible = showExport ?? defaults.showExport;
  const productTrustVisible = showProductTrust ?? defaults.showProductTrust;
  const docsTrustVisible = showDocsTrust ?? defaults.showDocsTrust;
  const mapVariant = variant === "homepage" ? "preview" : "full";
  const pageType = resolvePageType(variant);

  const viewedTrustBlocks: RfqIntentTrustBlock[] = [];
  if (exportVisible) viewedTrustBlocks.push("export");
  if (productTrustVisible && product) viewedTrustBlocks.push("product");
  if (docsTrustVisible) viewedTrustBlocks.push("docs");

  const trustSignals: string[] = [...viewedTrustBlocks];
  if (variant === "homepage") trustSignals.push("factory");

  const brain = useConversionBrain({
    pageType,
    trustSignals,
    viewedTrustBlocks,
    scrollDepth,
    hasProductView: Boolean(product),
  });

  return (
    <div className={`space-y-12 ${className}`}>
      {brain.showQuoteCTA && (
        <QuoteCTABanner product={product?.name} intensity={brain.intensity} />
      )}

      {brain.showTrust && exportVisible && (
        <ExportProofMap variant={mapVariant} />
      )}

      {brain.showTrust && productTrustVisible && product && (
        <ProductProofPanel product={product} />
      )}

      {brain.showTrust && docsTrustVisible && (
        <TechnicalDocsBlock product={product?.name} />
      )}

      {brain.showRFQ && (
        <RFQTrustBridge
          pageType={resolveBridgePageType(variant)}
          product={product?.name}
        />
      )}
    </div>
  );
}
