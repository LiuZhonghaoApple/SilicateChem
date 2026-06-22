"use client";

import {
  getTrustImageForCategory,
  type TrustImageCategory,
} from "@/lib/trust/image-strategy";
import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";
import { isImageRenderingEnabled } from "@/lib/image-system";

export { getTrustImageForCategory } from "@/lib/trust/image-strategy";

type TrustImageProps = {
  category: TrustImageCategory;
  className?: string;
  showCaption?: boolean;
};

/** @deprecated Image rendering disabled while IMAGE_SYSTEM_MODE is PENDING. */
export function TrustImage({
  category,
  className = "",
  showCaption = true,
}: TrustImageProps) {
  if (!isImageRenderingEnabled()) {
    return <VisualAssetPendingNotice compact className={className} />;
  }

  const asset = getTrustImageForCategory(category);

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
