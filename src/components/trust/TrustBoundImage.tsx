"use client";

import { ImageDebugWrapper } from "@/components/ui/ImageDebugWrapper";
import { VisualTrustImage } from "@/components/trust/VisualTrustImage";
import { useVisualTrustContext } from "@/components/trust/VisualTrustProvider";
import type { ImageEntry } from "@/content/site-images";

type Props = {
  image: ImageEntry;
  component: string;
  aspect?: "video" | "square" | "wide" | "auto";
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
};

export function TrustBoundImage({
  image,
  component,
  aspect = "wide",
  priority = false,
  className = "rounded-lg border border-[#E2E6EA]",
  wrapperClassName = "",
}: Props) {
  const { trackImageView } = useVisualTrustContext();

  return (
    <ImageDebugWrapper
      src={image.src}
      component={component}
      page={image.page}
      className={wrapperClassName}
    >
      <VisualTrustImage
        src={image.src}
        alt={image.alt}
        aspect={aspect}
        priority={priority}
        onTrustView={trackImageView}
        className={className}
      />
    </ImageDebugWrapper>
  );
}
