import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";
import {
  FACTORY_METRICS,
  FACTORY_VERIFICATION_BADGE,
} from "@/content/trust/factory-proof";

export function HomepageFactoryProofSection() {
  return (
    <>
      <SectionHeader
        title="Factory & Production Proof"
        subtitle="Real photos from Changyi, Shandong — factory exterior, production lines, and on-site operations."
      />

      <VisualAssetPendingNotice className="mb-8" />

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
