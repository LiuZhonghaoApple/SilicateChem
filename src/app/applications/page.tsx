import Link from "next/link";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { LazyImage } from "@/components/ui/LazyImage";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { DeploymentImageGrid } from "@/components/trust/HomepageRealImages";
import { industryApplications } from "@/content/applications/industries";
import { getProductImages } from "@/content/site-images";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Industry Applications",
  description:
    "Industry use cases for sodium metasilicate. Mid-funnel pages linking to factory-direct quotation.",
  path: "/applications",
});

export default function ApplicationsIndexPage() {
  const appImages = getProductImages().slice(12, 14);

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
        {appImages.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {appImages.map((img) => (
              <LazyImage
                key={img.src}
                src={img.src}
                alt={img.alt}
                aspect="video"
                className="rounded-lg border border-[#E2E6EA]"
              />
            ))}
          </div>
        )}
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
        <PageCTAs className="mt-8" />
      </Section>
    </>
  );
}
