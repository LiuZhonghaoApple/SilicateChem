"use client";

import {
  getTrustImageForCategory,
  getTrustImageSrc,
  type TrustImageCategory,
} from "@/lib/trust/image-strategy";

export { getTrustImageForCategory } from "@/lib/trust/image-strategy";

type TrustImageProps = {
  category: TrustImageCategory;
  className?: string;
  showCaption?: boolean;
};

export function TrustImage({
  category,
  className = "",
  showCaption = true,
}: TrustImageProps) {
  const asset = getTrustImageForCategory(category);

  return (
    <figure
      className={`rounded-lg border border-[#E2E6EA] overflow-hidden bg-[#F4F6F8] ${className}`}
      data-image-source={asset.source}
      data-image-category={category}
      data-image-id={asset.id}
    >
      <div className="aspect-video relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getTrustImageSrc(asset.filename)}
          alt={asset.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      {showCaption && (
        <figcaption className="p-4 bg-white">
          <p className="font-bold text-[#0B2D5B] text-sm">{asset.caption}</p>
          <p className="mt-1 text-xs text-[#5A6570] leading-relaxed">{asset.description}</p>
        </figcaption>
      )}
    </figure>
  );
}
