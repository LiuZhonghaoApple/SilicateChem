/** Global image system state — set to "ACTIVE" when approved assets are ready to render. */
export const IMAGE_SYSTEM_MODE = "PENDING" as const;

export type ImageSystemMode = typeof IMAGE_SYSTEM_MODE | "ACTIVE";

export function isImageSystemPending(): boolean {
  return IMAGE_SYSTEM_MODE === "PENDING";
}

/** When false, all buyer-facing image components must render VisualAssetPendingNotice only. */
export function isImageRenderingEnabled(): boolean {
  return !isImageSystemPending();
}
