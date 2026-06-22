"use client";

import {
  getTrustImageForCategory,
  type TrustImageCategory,
} from "@/lib/trust/image-strategy";
import { guardVisualProofRender } from "@/content/trust-visual-allowlist";
import { PRODUCT_VISUAL_PROOF_MESSAGE } from "@/components/trust/ProductVisualProof";

export { getTrustImageForCategory } from "@/lib/trust/image-strategy";

type TrustImageProps = {
  category: TrustImageCategory;
  className?: string;
  showCaption?: boolean;
};

/** @deprecated Bypasses removed — use allowlisted VisualTrustImage or ProductVisualProof. */
export function TrustImage({
  category,
  className = "",
  showCaption = true,
}: TrustImageProps) {
  const asset = getTrustImageForCategory(category);

  if (!guardVisualProofRender(asset.id, "TrustImage")) {
    return (
      <p className={`text-sm font-semibold text-[#0B2D5B] ${className}`}>
        {PRODUCT_VISUAL_PROOF_MESSAGE}
      </p>
    );
  }

  return (
    <figure
      className={`rounded-lg border border-[#E2E6EA] overflow-hidden bg-[#F4F6F8] ${className}`}
      data-image-source={asset.source}
      data-image-category={category}
      data-image-id={asset.id}
    >
      {showCaption && (
        <figcaption className="p-4 bg-white">
          <p className="font-bold text-[#0B2D5B] text-sm">{asset.caption}</p>
          <p className="mt-1 text-xs text-[#5A6570] leading-relaxed">{asset.description}</p>
        </figcaption>
      )}
    </figure>
  );
}
