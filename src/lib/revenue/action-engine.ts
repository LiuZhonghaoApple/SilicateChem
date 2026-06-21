import type { LayoutBlock, SegmentLayout } from "@/lib/conversion/v5-layout-map";

export enum RevenueAction {
  PUSH_RFQ = "PUSH_RFQ",
  SHOW_EXPORT = "SHOW_EXPORT",
  SHOW_PRODUCT = "SHOW_PRODUCT",
  HOLD = "HOLD",
}

function upgradeCtaForRfq(
  mode: LayoutBlock["mode"]
): LayoutBlock["mode"] | undefined {
  if (mode === "minimal") return "soft";
  if (mode === "soft") return "sticky";
  if (mode === "sticky") return "persistent_sticky";
  return mode;
}

/**
 * Map user value score to a revenue-driving layout action.
 */
export function resolveRevenueAction(score: number): RevenueAction {
  if (score > 80) return RevenueAction.PUSH_RFQ;
  if (score > 60) return RevenueAction.SHOW_EXPORT;
  if (score > 40) return RevenueAction.SHOW_PRODUCT;
  return RevenueAction.HOLD;
}

/**
 * Apply V7 revenue action boosts after segment + V6 layout hints.
 * Revenue action overrides V6 hints when they conflict.
 */
export function applyRevenueActionToLayout(
  layout: SegmentLayout,
  action: RevenueAction
): SegmentLayout {
  if (action === RevenueAction.HOLD) {
    return layout;
  }

  let result = layout.map((block) => {
    if (action === RevenueAction.SHOW_EXPORT) {
      if (block.type === "export_map" && block.mode !== "full") {
        return { ...block, mode: "full" as const };
      }
      return block;
    }

    if (action === RevenueAction.SHOW_PRODUCT) {
      if (block.type === "product_proof" && block.mode !== "full") {
        return { ...block, mode: "full" as const };
      }
      return block;
    }

    if (action === RevenueAction.PUSH_RFQ) {
      if (block.type === "cta" && block.mode) {
        const upgraded = upgradeCtaForRfq(block.mode);
        if (upgraded && upgraded !== block.mode) {
          return { ...block, mode: upgraded };
        }
      }
      return block;
    }

    return block;
  });

  if (
    action === RevenueAction.PUSH_RFQ &&
    !result.some((block) => block.type === "rfq_bridge")
  ) {
    result = [{ type: "rfq_bridge" }, ...result];
  }

  return result;
}
