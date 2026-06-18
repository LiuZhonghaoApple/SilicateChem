"use client";

import { SectionHeader } from "@/components/ui/Section";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import { GALLERY_CATEGORIES } from "@/lib/trust/image-strategy";
import { TrustImage } from "@/components/trust/TrustImageMapper";

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
  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Proof — Production & Export"
          subtitle="On-site production line, QC laboratory, warehouse, packaging, and export loading."
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_CATEGORIES.map((category) => (
          <TrustImage key={category} category={category} />
        ))}
      </div>
      <p className="mt-6 text-sm text-[#5A6570]">
        Factory inspection and video walkthrough available on request for qualified buyers.
      </p>
      <StrongCTA product={product} className="mt-4" />
    </div>
  );
}
