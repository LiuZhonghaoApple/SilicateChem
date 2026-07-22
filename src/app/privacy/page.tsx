import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How SilicateChem collects, uses, protects and shares website, inquiry and analytics data.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information we collect",
    body: [
      "When you send an inquiry, we collect the contact, company, country, product, quantity and message details you provide. We also record limited attribution and security data such as landing page, referrer, campaign parameters, browser information and a protected hash derived from the network address.",
      "The AI procurement advisor records the questions and sourcing details you submit, along with limited session and usage metadata. Product facts and standard questions are handled by local rules and the site knowledge base. Free-form answers, translation or inquiry summaries may be processed by a configured AI model provider.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use this information to answer product and quotation requests, qualify sourcing requirements, prevent abuse, improve technical content, measure inquiry performance and support follow-up by our sales team.",
      "We do not sell personal information. We do not enable advertising storage through our website consent controls.",
    ],
  },
  {
    title: "Service providers and external links",
    body: [
      "We use hosting, database, email-delivery, security, analytics and AI service providers only for the functions described here. Google Analytics 4 and Microsoft Clarity receive analytics consent signals. Cloudflare Turnstile helps identify automated submissions.",
      "WhatsApp links open a service operated by Meta. Information you send there is handled under WhatsApp's own terms and privacy practices.",
    ],
  },
  {
    title: "Retention and protection",
    body: [
      "Inquiry and correspondence records are retained while a commercial discussion is active and for a reasonable period afterwards for follow-up, quality review and legitimate business records. Short-lived security rate-limit records are automatically removed after their operational window. Analytics providers apply their configured retention settings.",
      "We use access controls, hashed identifiers, server-side validation and rate limiting to reduce unauthorized access and abuse. No online system can guarantee absolute security.",
    ],
  },
  {
    title: "Your choices and requests",
    body: [
      "You can accept or reject analytics storage and change your choice at any time using Cookie preferences in the footer. You may ask us to access, correct or delete personal information, subject to applicable legal and business-record requirements.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Section background="grey" className="pt-12 md:pt-16">
      <article className="mx-auto max-w-4xl rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2A86A5]">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[#5A6570]">Last updated: July 22, 2026</p>
        <p className="mt-6 leading-7 text-[#44515D]">
          This policy explains how {SITE.company} (SilicateChem) handles information
          collected through {SITE.url}.
        </p>

        {sections.map((section) => (
          <section className="mt-8" key={section.title}>
            <h2 className="text-xl font-bold text-[#0B2D5B]">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p className="mt-3 leading-7 text-[#44515D]" key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className="mt-8 border-t border-[#D7E6EF] pt-6">
          <h2 className="text-xl font-bold text-[#0B2D5B]">Contact</h2>
          <p className="mt-3 leading-7 text-[#44515D]">
            Privacy requests: <a className="font-semibold text-[#176C8E] underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            For storage details, see our <Link className="font-semibold text-[#176C8E] underline" href="/cookies">Cookie Policy</Link>.
          </p>
        </section>
      </article>
    </Section>
  );
}
