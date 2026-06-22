import { isImageRenderingEnabled } from "@/lib/image-system";
import { guardVisualProofRender } from "@/content/trust-visual-allowlist";

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Above-the-fold images should use eager loading */
  priority?: boolean;
  aspect?: "video" | "square" | "wide" | "auto";
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  auto: "",
};

/** Image rendering disabled while IMAGE_SYSTEM_MODE is PENDING. */
export function LazyImage({
  src,
  alt,
  className = "",
  priority = false,
  aspect = "auto",
}: LazyImageProps) {
  if (!isImageRenderingEnabled()) {
    return null;
  }

  if (!guardVisualProofRender(src, "LazyImage")) {
    return null;
  }

  const aspectCls = aspectClass[aspect];

  if (aspect === "auto") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectCls} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
