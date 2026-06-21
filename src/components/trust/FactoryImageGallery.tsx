"use client";

import { SectionHeader } from "@/components/ui/Section";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import { DeploymentImageGrid } from "@/components/trust/HomepageRealImages";
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
          subtitle="On-site production line, warehouse staging, and manufacturing equipment at Changyi, Shandong."
        />
      )}
      <DeploymentImageGrid images={galleryImages} />
      <p className="mt-6 text-sm text-[#5A6570]">
        Factory inspection and video walkthrough available on request for qualified buyers.
      </p>
      <StrongCTA product={product} className="mt-4" />
    </div>
  );
}
