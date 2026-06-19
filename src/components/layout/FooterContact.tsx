"use client";

import { SITE } from "@/lib/constants";
import { TrackedMailto, TrackedWhatsApp } from "@/components/analytics/TrackedLinks";

export function FooterContact() {
  return (
    <>
      <li>
        <TrackedMailto email={SITE.email} className="hover:text-white">
          {SITE.email}
        </TrackedMailto>
      </li>
      <li>
        <TrackedWhatsApp phone={SITE.whatsapp} className="hover:text-white">
          WhatsApp: {SITE.whatsapp}
        </TrackedWhatsApp>
      </li>
      <li>{SITE.location}</li>
    </>
  );
}
