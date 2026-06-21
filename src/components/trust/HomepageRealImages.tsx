"use client";

import { useState } from "react";
import { LazyImage } from "@/components/ui/LazyImage";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  priority?: boolean;
};

/** Rotates through hero banner images without changing page copy. */
export function HomepageHeroBackground({ images, alt, className = "" }: Props) {
  const [index] = useState(0);
  const src = images[index] ?? images[0];

  if (!src) return null;

  return (
    <LazyImage
      src={src}
      alt={alt}
      priority
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

export function HomepageImageStrip({
  images,
  alt,
  className = "",
}: Omit<Props, "priority">) {
  if (images.length === 0) return null;

  return (
    <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {images.map((src, i) => (
        <LazyImage
          key={src}
          src={src}
          alt={`${alt}${images.length > 1 ? ` (${i + 1})` : ""}`}
          aspect="video"
          className="rounded-lg border border-[#E2E6EA]"
        />
      ))}
    </div>
  );
}
