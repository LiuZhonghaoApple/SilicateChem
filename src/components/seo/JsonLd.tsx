import { SITE } from "@/lib/constants";

const ORGANIZATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE.company,
        legalName: SITE.company,
        alternateName: SITE.name,
        url: SITE.url,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE.url}/#logo`,
          url: `${SITE.url}/images/logo.svg`,
        },
        email: SITE.email,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Shandong",
          addressRegion: "Shandong",
          addressCountry: "CN",
        },
        description: SITE.description,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: SITE.phone,
          email: SITE.email,
          availableLanguage: ["English", "Chinese"],
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "productionCapacity",
            value: SITE.capacity,
          },
          {
            "@type": "PropertyValue",
            name: "manufacturingType",
            value: "Chemical manufacturer",
          },
        ],
        knowsAbout: [
          "Sodium metasilicate manufacturing",
          "Industrial chemical production",
          "Export packaging and documentation",
        ],
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${items.at(-1)?.url ?? SITE.url}#breadcrumb`,
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  url,
  sku,
  image,
  cas,
  formula,
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  sku: string;
  image?: string;
  cas?: string;
  formula?: string;
  dateModified: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name,
        description,
        url,
        sku,
        image,
        category: "Industrial chemicals",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name,
          description,
          dateModified,
          inLanguage: "en",
          isPartOf: { "@id": WEBSITE_ID },
          publisher: { "@id": ORGANIZATION_ID },
        },
        brand: {
          "@type": "Brand",
          name: SITE.name,
        },
        manufacturer: { "@id": ORGANIZATION_ID },
        identifier: cas
          ? {
              "@type": "PropertyValue",
              propertyID: "CAS Registry Number",
              value: cas,
            }
          : undefined,
        additionalProperty: formula
          ? [
              {
                "@type": "PropertyValue",
                name: "Chemical formula",
                value: formula,
              },
            ]
          : undefined,
      }}
    />
  );
}

export function FAQSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        datePublished,
        dateModified,
        inLanguage: "en",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: title,
          description,
          datePublished,
          dateModified,
          inLanguage: "en",
          isPartOf: { "@id": WEBSITE_ID },
          publisher: { "@id": ORGANIZATION_ID },
        },
        author: {
          "@id": ORGANIZATION_ID,
        },
        publisher: {
          "@id": ORGANIZATION_ID,
        },
        about: {
          "@type": "Thing",
          name: "Sodium metasilicate procurement",
        },
      }}
    />
  );
}
