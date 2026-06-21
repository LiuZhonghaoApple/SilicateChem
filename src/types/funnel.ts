import type { RfqIntentLevel, RfqIntentPageType, RfqIntentTrustBlock } from "@/lib/rfq/rfq-intent-score";

/** Trust block identifiers aligned with TrustLayer / trust_blocks. */
export type FunnelTrustSignal = RfqIntentTrustBlock;

export type FunnelPageType = RfqIntentPageType;

export type FunnelStage = "awareness" | "consideration" | "conversion";

/** Funnel RFQ heat — distinct from scoring tier `RfqIntentLevel`. */
export type FunnelRfqIntent = "none" | "warm" | "hot";

export type FunnelRecommendedAction = "show_trust" | "show_rfq" | "show_quote_cta";

export type FunnelBannerPriority = "none" | "low" | "high";

export type FunnelOptimizerInput = {
  rfqScore: number;
  rfqLevel: RfqIntentLevel;
  trustSignals: FunnelTrustSignal[];
  pageType: FunnelPageType;
  hasProductView: boolean;
};

export type FunnelState = {
  funnelStage: FunnelStage;
  rfqIntent: FunnelRfqIntent;
  recommendedAction: FunnelRecommendedAction;
  bannerPriority: FunnelBannerPriority;
};

export type { RfqIntentLevel, RfqIntentPageType, RfqIntentTrustBlock };
