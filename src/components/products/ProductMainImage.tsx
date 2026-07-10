import Image from "next/image";
import { getProductMainImage } from "@/content/product-main-images";

type ProductMainImageProps = {
  productSlug: string;
  className?: string;
  compact?: boolean;
};

export function ProductMainImage({
  productSlug,
  className = "",
  compact = false,
}: ProductMainImageProps) {
  const image = getProductMainImage(productSlug);

  return (
    <div className={`overflow-hidden rounded-lg border border-[#E2E6EA] bg-white ${className}`}>
      <div className={`relative ${compact ? "h-56" : "h-72"}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={compact ? "100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="object-cover"
        />
      </div>
    </div>
  );
}
