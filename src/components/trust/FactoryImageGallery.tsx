"use client";

import { SectionHeader } from "@/components/ui/Section";
import { LazyImage } from "@/components/ui/LazyImage";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import { getFactoryGalleryImages } from "@/content/site-images";

type Props = {
  showHeader?: boolean;
  product?: string;
  className?: string;
};

export function FactoryImageGallery({
  showHeader = true,
  product,
  className = "",
}: Props) {
  const galleryImages = getFactoryGalleryImages();

  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Proof — Production & Export"
          subtitle="On-site production line, QC laboratory, warehouse, packaging, and export loading."
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((src, index) => (
          <LazyImage
            key={src}
            src={src}
            alt={`Sodium metasilicate factory China — production and export facility photo ${index + 1}`}
            aspect="video"
            className="rounded-lg border border-[#E2E6EA]"
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-[#5A6570]">
        Factory inspection and video walkthrough available on request for qualified buyers.
      </p>
      <StrongCTA product={product} className="mt-4" />
    </div>
  );
}
