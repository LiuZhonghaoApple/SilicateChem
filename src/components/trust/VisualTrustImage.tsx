"use client";

import { useEffect, useRef } from "react";
import { LazyImage } from "@/components/ui/LazyImage";
import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";
import {
  guardVisualProofRender,
  isAllowedVisualProofSrc,
} from "@/content/trust-visual-allowlist";
import { isImageRenderingEnabled } from "@/lib/image-system";
import { classifyImageSrc } from "@/lib/trust/v6-visual-trust-engine";

type TrustImageKind = "factory" | "export" | "loading" | "gallery" | "general";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspect?: "video" | "square" | "wide" | "auto";
  onTrustView?: (kind: TrustImageKind) => void;
  trustKind?: TrustImageKind;
};

function resolveKind(src: string, explicit?: TrustImageKind): TrustImageKind {
  if (explicit) return explicit;
  const c = classifyImageSrc(src);
  if (c.loading) return "loading";
  if (c.export) return "export";
  if (c.factory) return "factory";
  return "general";
}

/** LazyImage that fires visual-trust view tracking when ≥50% visible. */
export function VisualTrustImage({
  onTrustView,
  trustKind,
  src,
  alt,
  className = "",
  priority,
  aspect,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!onTrustView || !ref.current) return;
    if (!isAllowedVisualProofSrc(src)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            onTrustView(resolveKind(src, trustKind));
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onTrustView, src, trustKind]);

  if (!isImageRenderingEnabled()) {
    return <VisualAssetPendingNotice compact className={className} />;
  }

  if (!guardVisualProofRender(src, "VisualTrustImage")) {
    return null;
  }

  return (
    <div ref={ref}>
      <LazyImage
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        aspect={aspect}
      />
    </div>
  );
}

export function trackGalleryInteraction(onTrustView?: (kind: TrustImageKind) => void) {
  onTrustView?.("gallery");
}
