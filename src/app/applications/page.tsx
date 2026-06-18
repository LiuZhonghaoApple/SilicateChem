import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { industryApplications } from "@/content/applications/industries";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Industry Applications",
  description:
    "Industry use cases for sodium metasilicate. Mid-funnel pages linking to factory-direct quotation.",
  path: "/applications",
  noIndex: true,
});

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
        description="How sodium metasilicate is used across major industrial sectors. All grades manufactured at our Shandong facility."
        breadcrumbs={[{ label: "Applications" }]}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {industryApplications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              className="block rounded-lg border border-[#E2E6EA] p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="font-bold text-[#0B2D5B]">{app.title}</h2>
              <p className="mt-2 text-sm text-[#5A6570]">{app.intro}</p>
              <p className="mt-3 text-sm font-semibold text-[#2E7D9A]">View application →</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={METASILICATE_CATEGORY_PATH}
            className="text-sm font-semibold text-[#2E7D9A] hover:underline"
          >
            Sodium metasilicate manufacturer & supplier →
          </Link>
        </div>
        <ProductFunnelBanner className="mt-8" />
      </Section>
    </>
  );
}
