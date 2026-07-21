"use client";

import { SITE } from "@/lib/constants";
import { TrackedMailto, TrackedWhatsApp } from "@/components/analytics/TrackedLinks";

export function ContactDirectLinks() {
  return (
    <ul className="mt-4 space-y-3 text-sm text-[#5A6570]">
      <li>
        <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Email</span>
        <TrackedMailto email={SITE.email} location="contact_page" className="hover:text-[#2E7D9A]">
          {SITE.email}
        </TrackedMailto>
      </li>
      <li>
        <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">WhatsApp</span>
        <TrackedWhatsApp phone={SITE.whatsapp} location="contact_page" className="hover:text-[#2E7D9A]">
          {SITE.whatsapp}
        </TrackedWhatsApp>
      </li>
      <li>
        <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Telephone</span>
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-[#2E7D9A]">
          {SITE.phone}
        </a>
      </li>
      <li>
        <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Location</span>
        {SITE.location}
      </li>
      <li>
        <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Company</span>
        {SITE.company}
      </li>
    </ul>
  );
}
