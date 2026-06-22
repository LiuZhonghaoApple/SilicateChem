"use client";

import { useEffect, useState } from "react";
import { ImageDebugWrapper, logImageMount } from "@/components/ui/ImageDebugWrapper";
import { VisualTrustImage } from "@/components/trust/VisualTrustImage";
import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";
import { useVisualTrustContext } from "@/components/trust/VisualTrustProvider";
import { filterAllowedVisualProofImages } from "@/content/trust-visual-allowlist";
import { isImageRenderingEnabled } from "@/lib/image-system";
import type { ImageEntry } from "@/content/site-images";

type Props = {
  images: ImageEntry[];
  className?: string;
  priority?: boolean;
};

/** Rotates through all hero banner images — every slide stays mounted in the DOM. */
export function HomepageHeroBackground({ images, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const { trackImageView } = useVisualTrustContext();

  useEffect(() => {
    if (!isImageRenderingEnabled() || images.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  if (!isImageRenderingEnabled()) {
    return <VisualAssetPendingNotice className={className} />;
  }

  if (images.length === 0) return null;

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {images.map((entry, i) => {
        logImageMount(entry.src, "HomepageHeroBackground", entry.page);
        return (
          <ImageDebugWrapper
            key={entry.src}
            src={entry.src}
            component="HomepageHeroBackground"
            page={entry.page}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <VisualTrustImage
              src={entry.src}
              alt={entry.alt}
              priority={i === 0}
              trustKind="factory"
              onTrustView={trackImageView}
              className="absolute inset-0 h-full w-full object-cover"
              aspect="auto"
            />
          </ImageDebugWrapper>
        );
      })}
    </div>
  );
}

export function HomepageImageStrip({
  images,
  className = "",
}: Omit<Props, "priority">) {
  const { trackImageView } = useVisualTrustContext();

  if (!isImageRenderingEnabled()) {
    return <VisualAssetPendingNotice className={className} />;
  }

  if (images.length === 0) return null;

  return (
    <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {images.map((entry) => {
        logImageMount(entry.src, "HomepageImageStrip", entry.page);
        return (
          <ImageDebugWrapper
            key={entry.src}
            src={entry.src}
            component="HomepageImageStrip"
            page={entry.page}
          >
            <VisualTrustImage
              src={entry.src}
              alt={entry.alt}
              aspect="video"
              trustKind="factory"
              onTrustView={trackImageView}
              className="rounded-lg border border-[#E2E6EA]"
            />
          </ImageDebugWrapper>
        );
      })}
    </div>
  );
}

export function DeploymentImageGrid({
  images,
  className = "",
  columns = "sm:grid-cols-2 lg:grid-cols-3",
  component = "DeploymentImageGrid",
}: {
  images: ImageEntry[];
  className?: string;
  columns?: string;
  component?: string;
}) {
  const { trackImageView } = useVisualTrustContext();

  if (!isImageRenderingEnabled()) {
    return <VisualAssetPendingNotice className={className} />;
  }

  const allowedImages = filterAllowedVisualProofImages(images);
  if (allowedImages.length === 0) {
    return <VisualAssetPendingNotice className={className} />;
  }

  return (
    <div className={`grid gap-4 ${columns} ${className}`}>
      {allowedImages.map((entry) => {
        logImageMount(entry.src, component, entry.page);
        return (
          <ImageDebugWrapper
            key={entry.src}
            src={entry.src}
            component={component}
            page={entry.page}
          >
            <VisualTrustImage
              src={entry.src}
              alt={entry.alt}
              aspect="video"
              onTrustView={trackImageView}
              className="rounded-lg border border-[#E2E6EA]"
            />
          </ImageDebugWrapper>
        );
      })}
    </div>
  );
}
