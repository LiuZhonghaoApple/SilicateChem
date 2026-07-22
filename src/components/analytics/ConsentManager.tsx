"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  type AnalyticsConsent,
} from "@/lib/consent";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}
const OPEN_PREFERENCES_EVENT = "silicatechem:open-consent";

function readStoredConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function applyConsent(consent: AnalyticsConsent) {
  const analyticsStorage = consent === "granted" ? "granted" : "denied";

  window.gtag?.("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: analyticsStorage,
  });
}

export function ConsentManager() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(readStoredConsent() === null);

    const openPreferences = () => setIsOpen(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
  }, []);

  function save(consent: AnalyticsConsent) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, consent);
    } catch {
      // Consent still applies for the current page if storage is unavailable.
    }
    applyConsent(consent);
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <section
      aria-label="Cookie preferences"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-xl rounded-2xl border border-[#BBD4E2] bg-white p-5 shadow-2xl md:bottom-6 md:left-6 md:right-auto md:mx-0"
      role="dialog"
    >
      <h2 className="text-base font-bold text-[#0B2D5B]">Your privacy choices</h2>
      <p className="mt-2 text-sm leading-6 text-[#5A6570]">
        Essential storage keeps the site secure. With your permission, analytics
        cookies help us understand which technical pages buyers find useful. We do
        not enable advertising storage.
      </p>
      <p className="mt-2 text-xs text-[#5A6570]">
        Read our <Link className="underline hover:text-[#0B2D5B]" href="/cookies">Cookie Policy</Link>{" "}
        and <Link className="underline hover:text-[#0B2D5B]" href="/privacy">Privacy Policy</Link>.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          className="rounded-lg border border-[#9FB8C7] px-4 py-2 text-sm font-semibold text-[#0B2D5B] hover:bg-[#F4F8FA]"
          onClick={() => save("denied")}
          type="button"
        >
          Reject analytics
        </button>
        <button
          className="rounded-lg bg-[#0B2D5B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123D70]"
          onClick={() => save("granted")}
          type="button"
        >
          Accept analytics
        </button>
      </div>
    </section>
  );
}

export function ConsentPreferencesButton() {
  return (
    <button
      className="text-blue-200/70 hover:text-white"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
      type="button"
    >
      Cookie preferences
    </button>
  );
}
