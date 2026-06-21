"use client";

import { ImageDebugWrapper } from "@/components/ui/ImageDebugWrapper";
import { VisualTrustImage } from "@/components/trust/VisualTrustImage";
import { useVisualTrustContext } from "@/components/trust/VisualTrustProvider";
import type { ImageEntry } from "@/content/site-images";

type Props = {
  image: ImageEntry;
  component: string;
  className?: string;
  priority?: boolean;
  onTrustView?: (kind: "factory" | "export" | "loading" | "gallery" | "general") => void;
};

/** Full-width visible image band — no modal, no placeholder. */
export function PageVisualBanner({
  image,
  component,
  className = "",
  priority = false,
  onTrustView,
}: Props) {
  const { trackImageView } = useVisualTrustContext();
  const handleView = onTrustView ?? trackImageView;
  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>
      <ImageDebugWrapper src={image.src} component={component} page={image.page}>
        <VisualTrustImage
          src={image.src}
          alt={image.alt}
          aspect="wide"
          priority={priority}
          onTrustView={handleView}
          className="rounded-lg border border-[#E2E6EA] shadow-sm"
        />
      </ImageDebugWrapper>
    </div>
  );
}

type GridProps = {
  images: ImageEntry[];
  component: string;
  className?: string;
  columns?: string;
};

export function PageVisualGrid({
  images,
  component,
  className = "",
  columns = "grid-cols-2 sm:grid-cols-3",
}: GridProps) {
  const { trackImageView } = useVisualTrustContext();

  if (images.length === 0) return null;

  return (
    <div className={`grid gap-3 ${columns} ${className}`}>
      {images.map((image) => (
        <ImageDebugWrapper
          key={image.src}
          src={image.src}
          component={component}
          page={image.page}
        >
          <VisualTrustImage
            src={image.src}
            alt={image.alt}
            aspect="video"
            onTrustView={trackImageView}
            className="rounded-lg border border-[#E2E6EA]"
          />
        </ImageDebugWrapper>
      ))}
    </div>
  );
}
