import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import {
  FACTORY_METRICS,
  FACTORY_VERIFICATION_BADGE,
} from "@/content/trust/factory-proof";

const NEEDED_PHOTOS = [
  "Factory exterior",
  "Production line",
  "Packaging line",
  "Warehouse",
  "Loading / dispatch",
  "Product close-up",
] as const;

export function HomepageFactoryProofSection() {
  return (
    <>
      <SectionHeader
        title="Factory & Production Proof"
        subtitle="Real photos from Changyi, Shandong — factory exterior, production lines, and on-site operations."
      />

      <div className="mb-8 rounded-lg border border-dashed border-[#2E7D9A]/40 bg-white p-6 md:p-8">
        <h3 className="text-lg font-bold text-[#0B2D5B]">
          Verified Factory Photos Coming Soon
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5A6570]">
          We are updating this section with verified production line, warehouse,
          packaging, and loading photos from our Changyi manufacturing site.
        </p>
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#2E7D9A]">
            Needed photos
          </p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 text-sm text-[#5A6570]">
            {NEEDED_PHOTOS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[#2E7D9A]" aria-hidden="true">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
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
