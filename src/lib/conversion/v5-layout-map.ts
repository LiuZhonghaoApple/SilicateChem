import type { UserSegment } from "@/lib/conversion/v5-segmentation-engine";

export type LayoutBlockType =
  | "trust_core"
  | "company_proof"
  | "product_proof"
  | "application_industries"
  | "export_map"
  | "rfq_bridge"
  | "technical_docs"
  | "cta";

export type LayoutBlockMode =
  | "full"
  | "compressed"
  | "minimal"
  | "soft"
  | "sticky"
  | "persistent_sticky";

export type LayoutBlock = {
  type: LayoutBlockType;
  mode?: LayoutBlockMode;
};

export type SegmentLayout = LayoutBlock[];

const COLD_LAYOUT: SegmentLayout = [
  { type: "trust_core", mode: "full" },
  { type: "company_proof" },
  { type: "cta", mode: "minimal" },
];

const WARM_LAYOUT: SegmentLayout = [
  { type: "trust_core" },
  { type: "product_proof" },
  { type: "application_industries" },
  { type: "export_map", mode: "compressed" },
  { type: "cta", mode: "soft" },
];

const HOT_LAYOUT: SegmentLayout = [
  { type: "trust_core", mode: "compressed" },
  { type: "product_proof", mode: "full" },
  { type: "export_map", mode: "full" },
  { type: "rfq_bridge" },
  { type: "cta", mode: "sticky" },
];

const BUYER_READY_LAYOUT: SegmentLayout = [
  { type: "rfq_bridge" },
  { type: "product_proof", mode: "full" },
  { type: "export_map", mode: "full" },
  { type: "technical_docs" },
  { type: "cta", mode: "persistent_sticky" },
];

export const V5_LAYOUT_MAP: Record<UserSegment, SegmentLayout> = {
  cold: COLD_LAYOUT,
  warm: WARM_LAYOUT,
  hot: HOT_LAYOUT,
  buyer_ready: BUYER_READY_LAYOUT,
};

export function getLayoutBySegment(segment: UserSegment): SegmentLayout {
  return V5_LAYOUT_MAP[segment];
}
