import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { ApplicationIcon } from "@/components/applications/ApplicationIcon";
import { industryApplications } from "@/content/applications/industries";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Industry Applications",
  description:
    "Industry use cases for sodium metasilicate. Review detergent, water treatment, textile, and paper applications with grade and RFQ guidance.",
  path: "/applications",
});

// Downstream application fields transcribed from the factory product showroom boards.
const downstreamApplicationFields = [
  "Detergents, industrial cleaning agents and metal surface treatment",
  "Cotton textile scouring and bleaching (pre-treatment)",
  "Pulp and paper deinking / bleaching aids",
  "Ceramic grinding aids and concrete water-reducing admixtures",
  "Refractory agents and plasticity / water-retention aids",
  "Mineral oil recovery",
  "Dispersants and quick-drying aids for construction and metallurgy",
  "Oilfield drilling aids",
  "Water treatment",
] as const;

// Product properties transcribed from the showroom product-introduction panels.
const showroomProductFacts = [
  {
    name: "Sodium Metasilicate Pentahydrate / 五水偏硅酸钠",
    formula: "Na₂SiO₃·5H₂O",
    appearance: "White granules or powder (crystalline)",
    facts: [
      "Relative molecular mass ≈ 212",
      "Melting point ≈ 72.2 °C",
      "Bulk density ≈ 0.8–1.0 g/mL",
    ],
  },
  {
    name: "Anhydrous Sodium Metasilicate / 无水（零水）偏硅酸钠",
    formula: "Na₂SiO₃",
    appearance: "White granules or powder",
    facts: [
      "Relative molecular mass ≈ 122",
      "Melting point ≈ 1089 °C",
      "Bulk density ≈ 1.05–1.35 g/mL",
    ],
  },
] as const;

export default function ApplicationsIndexPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Applications", url: `${SITE.url}/applications` },
        ]}
      />
      <PageHeader
        title="Industry Applications"
        description="How sodium metasilicate supports detergent, water treatment, textile, paper, and industrial formulation applications."
        breadcrumbs={[{ label: "Applications" }]}
      />
      <Section>
        <SectionHeader
          title="Choose by Application"
          subtitle="Review common sodium metasilicate use cases, recommended grades, buying notes, and RFQ requirements for each industry."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {industryApplications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              className="group flex min-h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2E7D9A] hover:shadow-lg"
            >
              <ApplicationIcon
                slug={app.slug}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <h2 className="mt-5 text-lg font-bold leading-snug text-[#0B2D5B]">
                {app.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                {app.intro}
              </p>
              {app.recommendedGradeSlug && (
                <p className="mt-4 rounded-full bg-[#EAF4FA] px-3 py-1 text-xs font-bold text-[#0B2D5B]">
                  Recommended grade available
                </p>
              )}
              <p className="mt-auto pt-5 text-sm font-bold text-[#2E7D9A]">
                View application → RFQ
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-[#D7E6EF] bg-[#F4F8FB] p-6 text-center">
          <h2 className="text-2xl font-bold text-[#0B2D5B]">
            Need application-based grade selection?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#5A6570]">
            Start from your formulation, process requirement, packing preference,
            and target destination. Then confirm the suitable sodium metasilicate
            grade before quotation.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={METASILICATE_CATEGORY_PATH}
              className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
            >
              View Sodium Metasilicate Grades
            </Link>
            <Link
              href="/contact?type=quote&product=Sodium%20Metasilicate"
              className="inline-flex items-center justify-center rounded border border-[#0B2D5B] px-5 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-white"
            >
              Request Application Quote
            </Link>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Downstream Application Fields"
          subtitle="Application fields and product properties transcribed from the factory product showroom."
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B2D5B]">Where Sodium Metasilicate Is Used</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {downstreamApplicationFields.map((field) => (
                <li key={field} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4">
            {showroomProductFacts.map((product) => (
              <div
                key={product.name}
                className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-[#0B2D5B]">{product.name}</h3>
                <p className="mt-1 text-sm text-[#5A6570]">
                  <span className="font-semibold">Formula:</span> {product.formula}
                  <span className="mx-2 text-[#D7E6EF]">|</span>
                  <span className="font-semibold">Appearance:</span> {product.appearance}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.facts.map((fact) => (
                    <li
                      key={fact}
                      className="rounded-full border border-[#D7E6EF] bg-[#F2F8FB] px-3 py-1 text-xs font-semibold text-[#1D6680]"
                    >
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
