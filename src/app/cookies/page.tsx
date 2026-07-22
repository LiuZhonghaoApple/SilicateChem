import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Cookie Policy",
  description:
    "SilicateChem cookie categories, analytics consent controls and storage choices.",
  path: "/cookies",
});

const storageRows = [
  ["Essential and security", "Required", "Consent preference, form protection, rate limiting and secure administration. The public consent choice is stored in your browser's local storage."],
  ["Google Analytics 4", "Optional", "Measures page and conversion performance. Analytics storage is denied by default; when accepted, GA4 may set _ga and _ga_<container-id> cookies, normally for up to two years subject to browser limits and property settings."],
  ["Microsoft Clarity", "Optional", "Helps diagnose page usability. Clarity receives denied analytics and ad-storage signals by default and may use cookies such as _clck and _clsk only when analytics consent is granted."],
  ["Cloudflare Turnstile", "Essential", "Checks whether an inquiry submission is likely to be automated. It is used for security, not advertising."],
];

export default function CookiePolicyPage() {
  return (
    <Section background="grey" className="pt-12 md:pt-16">
      <article className="mx-auto max-w-5xl rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2A86A5]">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">Cookie Policy</h1>
        <p className="mt-3 text-sm text-[#5A6570]">Last updated: July 22, 2026</p>
        <p className="mt-6 leading-7 text-[#44515D]">
          {SITE.name} uses essential storage for security and optional analytics
          storage only according to your choice. Advertising storage, advertising
          user data and ad personalization remain disabled.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-[#D7E6EF]">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-[#EAF4FA] text-[#0B2D5B]">
              <tr>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Purpose and storage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E6EF] text-[#44515D]">
              {storageRows.map(([category, status, purpose]) => (
                <tr key={category}>
                  <th className="px-4 py-4 align-top font-semibold text-[#0B2D5B]">{category}</th>
                  <td className="px-4 py-4 align-top">{status}</td>
                  <td className="px-4 py-4 leading-6">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#0B2D5B]">Change your choice</h2>
          <p className="mt-3 leading-7 text-[#44515D]">
            Use <strong>Cookie preferences</strong> in the footer to accept or reject
            analytics storage at any time. Rejecting analytics does not prevent you
            from viewing product information or sending an inquiry. Browser controls
            can also delete existing cookies and local storage.
          </p>
        </section>

        <p className="mt-8 border-t border-[#D7E6EF] pt-6 leading-7 text-[#44515D]">
          For broader data-handling information, read our <Link className="font-semibold text-[#176C8E] underline" href="/privacy">Privacy Policy</Link> or email{" "}
          <a className="font-semibold text-[#176C8E] underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </article>
    </Section>
  );
}
