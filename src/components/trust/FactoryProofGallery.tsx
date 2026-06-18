"use client";

import { FactoryImageGallery } from "./FactoryImageGallery";

type Props = {
  showHeader?: boolean;
  showMoneyPageLink?: boolean;
  product?: string;
  className?: string;
};

/** @deprecated Use FactoryImageGallery — thin wrapper for backward compatibility */
export function FactoryProofGallery({
  showHeader = true,
  product,
  className = "",
}: Props) {
  return (
    <FactoryImageGallery
      showHeader={showHeader}
      product={product}
      className={className}
    />
  );
}
