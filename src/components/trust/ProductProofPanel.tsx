"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ProductVisualProof } from "@/components/trust/ProductVisualProof";
import { SectionHeader } from "@/components/ui/Section";
import type { Product } from "@/types";
import {
  getFactoryVerificationBadgeLabel,
  getKbApplicationFields,
  getKbPhysicalForm,
  getKbProductCas,
  getSpecificationSheetHref,
  GRADE_SPEC_DISCLAIMER,
  VERIFIED_EXPORT_PACKAGING,
} from "@/content/trust/product-trust";

type Props = {
  product: Product;
  showHeader?: boolean;
  className?: string;
};

function ProofSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#E2E6EA] bg-white p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E7D9A]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ProductProofPanel({
  product,
  showHeader = true,
  className = "",
}: Props) {
  const cas = getKbProductCas(product);
  const physicalForm = getKbPhysicalForm(product);
  const applicationFields = getKbApplicationFields(product);
  const specHref = getSpecificationSheetHref(product);
  const factoryBadge = getFactoryVerificationBadgeLabel();

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <SectionHeader
          title="Product Trust"
          subtitle="Verified product identity, applications, and factory production — specifications on request."
        />
      )}

      <p className="text-xs text-[#5A6570] italic">{GRADE_SPEC_DISCLAIMER}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Section 1 — Product Spec (KB only) */}
        <ProofSection title="Product Spec">
          <dl className="space-y-2 text-sm">
            {cas ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[#5A6570]">CAS No.</dt>
                <dd className="font-semibold text-[#0B2D5B] text-right">{cas}</dd>
              </div>
            ) : (
              <p className="text-[#5A6570]">CAS — confirm grade on inquiry</p>
            )}
            {physicalForm ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[#5A6570]">Physical form</dt>
                <dd className="font-semibold text-[#0B2D5B] text-right">{physicalForm}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[#5A6570] mb-2">Packaging (verified export records)</dt>
              <dd>
                <ul className="space-y-1">
                  {VERIFIED_EXPORT_PACKAGING.map((pkg) => (
                    <li
                      key={pkg}
                      className="flex items-start gap-2 text-sm text-[#0B2D5B]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                      {pkg}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </ProofSection>

        {/* Section 2 — Application Fields */}
        <ProofSection title="Application Fields">
          {applicationFields.length > 0 ? (
            <ul className="space-y-2">
              {applicationFields.map((field) => (
                <li
                  key={field.id}
                  className="flex items-center gap-2 text-sm font-medium text-[#0B2D5B]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E7D9A]/15 text-[10px] font-bold text-[#2E7D9A]">
                    ✓
                  </span>
                  {field.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#5A6570]">
              Application mapping not published for this grade — inquire for use-case fit.
            </p>
          )}
        </ProofSection>
      </div>

      {/* Section 3 — Factory Verification Badge */}
      <ProofSection title="Factory Verification">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0B2D5B]/20 bg-[#F4F6F8] px-4 py-2">
          <span
            className="flex h-2.5 w-2.5 rounded-full bg-[#0B2D5B]"
            aria-hidden="true"
          />
          <span className="text-sm font-bold text-[#0B2D5B]">{factoryBadge}</span>
        </div>
      </ProofSection>

      <ProofSection title="Product Visual Proof">
        <ProductVisualProof />
      </ProofSection>

      {/* Section 4 — RFQ CTA */}
      <div className="rounded-lg border border-[#0B2D5B]/15 bg-[#0B2D5B]/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#5A6570]">
          Full grade specifications, COA fields, and batch requirements provided on request.
        </p>
        <Link
          href={specHref}
          className="inline-flex shrink-0 items-center justify-center rounded bg-[#0B2D5B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#071F3F] transition-colors"
        >
          Request Full Specification Sheet
        </Link>
      </div>
    </div>
  );
}
