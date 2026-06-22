import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";

export { VISUAL_ASSET_PENDING_MESSAGE as PRODUCT_VISUAL_PROOF_MESSAGE } from "@/components/trust/VisualAssetPendingNotice";

/** Product Visual Proof — placeholder only while IMAGE_SYSTEM_MODE is PENDING. */
export function ProductVisualProof() {
  return <VisualAssetPendingNotice compact />;
}
