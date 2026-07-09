import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/Section";
import {
  FACTORY_METRICS,
  FACTORY_VERIFICATION_BADGE,
} from "@/content/trust/factory-proof";

const factoryProofImages = [
  {
    src: "/assets/images/factory-proof/factory-gate.jpg",
    alt: "Zhongzhi factory gate and exterior",
  },
  {
    src: "/assets/images/factory-proof/production-equipment.png",
    alt: "Sodium metasilicate production equipment",
  },
  {
    src: "/assets/images/factory-proof/finished-goods-warehouse.png",
    alt: "Finished goods warehouse with packed sodium metasilicate products",
  },
] as const;

export function HomepageFactoryProofSection() {
  return (
    <>
      <SectionHeader
        title="Factory & Production Proof"
        subtitle="Real photos from Changyi, Shandong — factory exterior, production lines, and on-site operations."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {factoryProofImages.map((image) => (
          <div
            key={image.src}
            className="relative h-64 overflow-hidden rounded-2xl border border-[#E2E6EA] bg-white lg:h-72"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-lg border border-[#2E7D9A]/30 bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">
            {FACTORY_METRICS.annualCapacity}
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">
            Annual Capacity
          </p>
        </div>
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">
            {FACTORY_METRICS.equipmentSets}
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">
            Equipment Sets
          </p>
        </div>
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">
            {FACTORY_METRICS.employees}
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">
            Employees
          </p>
        </div>
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <p className="text-2xl font-bold text-[#0B2D5B]">
            {FACTORY_METRICS.productTypes}
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">
            Product Types
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-[#2E7D9A]/40 bg-[#2E7D9A]/5 px-4 py-2">
        <span className="flex h-2 w-2 rounded-full bg-[#2E7D9A]" aria-hidden="true" />
        <span className="text-sm font-semibold text-[#0B2D5B]">
          {FACTORY_VERIFICATION_BADGE.label}
        </span>
        <span className="hidden text-xs text-[#5A6570] sm:inline">
          — {FACTORY_VERIFICATION_BADGE.description}
        </span>
      </div>

      <Link
        href="/factory"
        className="mt-6 inline-block text-sm font-bold text-[#2E7D9A] hover:underline"
      >
        View full factory proof →
      </Link>
    </>
  );
}
