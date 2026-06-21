"use client";

import { useMemo } from "react";
import type { Product } from "@/types";
import { useConversionBrain } from "@/hooks/useConversionBrain";
import { useV5Feedback } from "@/hooks/useV5Feedback";
import { useV6Optimization } from "@/hooks/useV6Optimization";
import { useVisualTrustContext } from "@/components/trust/VisualTrustProvider";
import type { V5Decision } from "@/lib/conversion/v5-segmentation-engine";
import { getLayoutBySegment } from "@/lib/conversion/v5-layout-map";
import {
  applyCTAHints,
  resolveCTAController,
} from "@/lib/trust/v6-cta-controller";
import {
  applyVisualTrustToDecision,
  computeVisualTrustScore,
} from "@/lib/trust/v6-visual-trust-engine";
import { applyVisualTrustWeights } from "@/lib/trust/v6-weight-modifier";
import {
  renderSegmentLayout,
  type TrustBlockAvailability,
  type TrustLayerVariant,
} from "@/components/trust/SegmentLayoutRenderer";
import { RFQTrustBridgePageType } from "@/components/rfq/RFQTrustBridge";
import { TechnicalDocsBlock } from "@/components/trust/TechnicalDocsBlock";

export { TechnicalDocsBlock as TechnicalDocsTrustBlock };

const SEGMENT_SURFACE: Record<V5Decision["segment"], string> = {
  cold: "border-[#E2E6EA] bg-[#F4F6F8]",
  warm: "border-[#2E7D9A]/30 bg-[#2E7D9A]/5",
  hot: "border-[#0B2D5B]/25 bg-[#0B2D5B]/5",
  buyer_ready: "border-[#0B2D5B] bg-[#0B2D5B]/10 ring-1 ring-[#0B2D5B]/20",
};

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

const VARIANT_DEFAULTS: Record<TrustLayerVariant, TrustBlockAvailability> = {
  homepage: { export: true, product: true, docs: true },
  product: { export: true, product: true, docs: false },
  about: { export: true, product: false, docs: true },
};

type Props = {
  variant: TrustLayerVariant;
  showExport?: boolean;
  showProductTrust?: boolean;
  showDocsTrust?: boolean;
  product?: Product;
  className?: string;
  scrollDepth?: number;
  inquiryProductName?: string;
  productViews?: number;
  exportPageViewed?: boolean;
  timeOnSite?: number;
  adaptiveWeighting?: boolean;
};

function buildTrustSignals(
  availability: TrustBlockAvailability,
  variant: TrustLayerVariant,
  product?: Product
): string[] {
  const signals: string[] = [];
  if (availability.export) signals.push("export");
  if (availability.product && product) signals.push("product");
  if (availability.docs) signals.push("docs");
  if (variant === "homepage") signals.push("factory");
  return signals;
}

export function TrustLayer({
  variant,
  showExport,
  showProductTrust,
  showDocsTrust,
  product,
  className = "",
  scrollDepth = 0,
  inquiryProductName,
  productViews,
  exportPageViewed,
  timeOnSite,
  adaptiveWeighting,
}: Props) {
  const defaults = VARIANT_DEFAULTS[variant];
  const availability: TrustBlockAvailability = {
    export: showExport ?? defaults.export,
    product: showProductTrust ?? defaults.product,
    docs: showDocsTrust ?? defaults.docs,
  };
  const pageType = resolvePageType(variant);
  const trustSignals = buildTrustSignals(availability, variant, product);

  const resolvedExportPageViewed = exportPageViewed ?? variant === "about";

  const baseDecision = useConversionBrain({
    pageType,
    trustSignals,
    scrollDepth,
    hasProductView: Boolean(product),
    productViews,
    exportPageViewed: resolvedExportPageViewed,
    timeOnSite,
    adaptiveWeighting,
  });

  const { counts: viewCounts } = useVisualTrustContext();

  const visualTrust = useMemo(
    () => computeVisualTrustScore(viewCounts),
    [viewCounts]
  );

  const decision = useMemo(
    () => applyVisualTrustToDecision(baseDecision, visualTrust),
    [baseDecision, visualTrust]
  );

  useV5Feedback(decision.segment, {
    productViews,
    exportPageViewed: resolvedExportPageViewed,
  });

  const v6 = useV6Optimization(decision.segment);

  const ctaHints = useMemo(() => {
    const modifiedWeights = applyVisualTrustWeights(
      visualTrust,
      v6.weights,
      decision.segment
    );
    return resolveCTAController({
      visualTrust,
      segment: decision.segment,
      weights: modifiedWeights,
    });
  }, [visualTrust, v6.weights, decision.segment]);

  const finalLayout = useMemo(() => {
    const baseLayout = getLayoutBySegment(decision.segment);
    const v6Layout = v6.applyToLayout(baseLayout);
    return applyCTAHints(v6Layout, ctaHints);
  }, [decision.segment, v6, ctaHints]);

  const blocks = renderSegmentLayout(finalLayout, {
    variant,
    availability,
    decision,
    product,
    inquiryProductName,
    bridgePageType: resolveBridgePageType(variant),
    uiVariant: v6.uiVariant,
  });

  return (
    <div
      className={`space-y-12 rounded-lg border p-1 md:p-2 ${SEGMENT_SURFACE[decision.segment]} ${className}`}
      data-segment={decision.segment}
      data-base-segment={baseDecision.segment}
      data-intensity={decision.intensity}
      data-layout-version="v6-visual-trust"
      data-ui-variant={v6.uiVariant}
      data-visual-trust-score={visualTrust.visualTrustScore}
      data-trust-level={visualTrust.trustLevel}
      data-show-rfq={decision.ui.showRFQ}
      data-show-quote-cta={decision.ui.showQuoteCTA}
      data-cta-mode={ctaHints.ctaMode}
    >
      {blocks}
    </div>
  );
}
