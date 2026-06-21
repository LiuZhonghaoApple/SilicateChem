"use client";

import Link from "next/link";
import { VisualTrustImage } from "@/components/trust/VisualTrustImage";
import { SectionHeader } from "@/components/ui/Section";
import { useVisualTrustContext } from "@/components/trust/VisualTrustProvider";
import {
  FACTORY_METRICS,
  FACTORY_PROOF_AREAS,
  FACTORY_VERIFICATION_BADGE,
} from "@/content/trust/factory-proof";
import { getFactoryGalleryImages, siteImages } from "@/content/site-images";

type Props = {
  variant?: "full" | "compact";
  showHeader?: boolean;
  className?: string;
};

function getAreaImage(imageKey: "production" | "warehouse" | "shipping") {
  if (imageKey === "production") {
    return siteImages.factory[0] ?? siteImages.home.production[0];
  }
  if (imageKey === "warehouse") {
    return (
      siteImages.factory.find((img) => img.section.includes("Warehouse")) ??
      siteImages.export.packaging[0]
    );
  }
  return (
    siteImages.factory[4] ??
    siteImages.export.shipping[0] ??
    siteImages.export.packaging[0]
  );
}

export function FactoryProofStack({
  variant = "full",
  showHeader = true,
  className = "",
}: Props) {
  const { trackImageView } = useVisualTrustContext();
  const areas =
    variant === "compact" ? FACTORY_PROOF_AREAS.slice(0, 2) : FACTORY_PROOF_AREAS;
  const galleryImages = getFactoryGalleryImages();

  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Proof — Verified Manufacturing Scale"
          subtitle="Capacity, equipment, and workforce from corporate records and QCC registration data."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border border-[#2E7D9A]/30 bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">{FACTORY_METRICS.annualCapacity}</p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">Annual Capacity</p>
          {variant === "full" && (
            <p className="mt-2 text-xs text-[#5A6570]">{FACTORY_METRICS.annualCapacityNote}</p>
          )}
        </div>
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">{FACTORY_METRICS.equipmentSets}</p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">Equipment Sets</p>
        </div>
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">{FACTORY_METRICS.employees}</p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">Employees</p>
          {variant === "full" && (
            <p className="mt-2 text-xs text-[#5A6570]">{FACTORY_METRICS.employeesNote}</p>
          )}
        </div>
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">{FACTORY_METRICS.productTypes}</p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">Product Types</p>
        </div>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2E7D9A]/40 bg-[#2E7D9A]/5 px-4 py-2">
        <span className="flex h-2 w-2 rounded-full bg-[#2E7D9A]" aria-hidden="true" />
        <span className="text-sm font-semibold text-[#0B2D5B]">
          {FACTORY_VERIFICATION_BADGE.label}
        </span>
        <span className="text-xs text-[#5A6570] hidden sm:inline">
          — {FACTORY_VERIFICATION_BADGE.description}
        </span>
      </div>

      <div className={`grid gap-6 ${variant === "compact" ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {areas.map((area) => {
          const image = getAreaImage(area.imageKey);
          return (
            <div
              key={area.id}
              className="rounded-lg border border-[#E2E6EA] bg-white overflow-hidden"
            >
              {image ? (
                <VisualTrustImage
                  src={image.src}
                  alt={image.alt}
                  aspect="video"
                  trustKind="factory"
                  onTrustView={trackImageView}
                  className="border-b border-[#E2E6EA]"
                />
              ) : null}
              <div className="p-4">
                <h3 className="font-bold text-[#0B2D5B] text-sm">{area.title}</h3>
                <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">
                  {area.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {variant === "full" && galleryImages.length > 0 && (
        <div className="mt-10">
          <SectionHeader
            title="Production Line Gallery"
            subtitle="Sequential on-site proof — scroll through production lines and warehouse staging."
          />
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1"
            onScroll={() => trackImageView("gallery")}
          >
            {galleryImages.map((image, index) => (
              <figure
                key={image.src}
                className="snap-center shrink-0 w-[min(85vw,320px)] rounded-lg border border-[#E2E6EA] bg-white overflow-hidden"
                data-image-src={image.src}
                data-image-component="FactoryProofStack"
                data-image-page={image.page}
              >
                <VisualTrustImage
                  src={image.src}
                  alt={image.alt}
                  aspect="video"
                  trustKind="gallery"
                  onTrustView={trackImageView}
                  className="border-b border-[#E2E6EA]"
                />
                <figcaption className="p-3">
                  <p className="text-xs font-bold uppercase text-[#2E7D9A]">
                    {String(index + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0B2D5B]">{image.block}</p>
                  <p className="mt-0.5 text-xs text-[#5A6570]">{image.section}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {variant === "compact" && (
        <Link
          href="/factory"
          className="mt-6 inline-block text-sm font-bold text-[#2E7D9A] hover:underline"
        >
          View full factory proof →
        </Link>
      )}
    </div>
  );
}
