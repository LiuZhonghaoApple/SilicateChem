"use client";

import { useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { products } from "@/content/products";
import { trackInquiryByType, trackRfqStart } from "@/lib/analytics";
import { getRfqContext } from "@/lib/page-rfq-context";
import { getInquiryAttributionPayload } from "@/lib/attribution-client";
import {
  TurnstileField,
  TURNSTILE_SITE_KEY,
  type TurnstileFieldHandle,
} from "@/components/forms/TurnstileField";
import { RFQTrustPreflight } from "@/components/forms/RFQTrustPreflight";

type FormState = "idle" | "submitting" | "success" | "error";

const EMAIL_DELIVERY_FAILED_MSG =
  "Email delivery failed. Please contact us via WhatsApp or info@silicatechem.com";

const VERIFICATION_FAILED_MSG = "Verification failed. Please try again.";

// If the Turnstile challenge does not resolve within this window (script blocked,
// network issue, widget never ready), stop waiting and submit anyway. The server
// treats a missing token as a logged, allowed event so a real buyer is never
// blocked by a third-party outage — honeypot, form age and rate limiting remain
// the hard anti-spam gates.
const TURNSTILE_TIMEOUT_MS = 8_000;

type InquiryPayload = Record<string, string | undefined>;

export function InquiryForm({
  defaultProduct,
  defaultRequestType,
}: {
  defaultProduct?: string;
  defaultRequestType?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<TurnstileFieldHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingPayloadRef = useRef<InquiryPayload | null>(null);
  const formStartedAtRef = useRef(Date.now());
  const formStartTrackedRef = useRef(false);
  const turnstileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settledRef = useRef(true);

  const ctx = getRfqContext(pathname);
  const product =
    defaultProduct ?? searchParams.get("product") ?? "";
  const requestType =
    defaultRequestType ?? searchParams.get("type") ?? "quote";
  const source = searchParams.get("source") ?? ctx.source ?? pathname;

  function handleFormStart() {
    if (formStartTrackedRef.current) return;
    formStartTrackedRef.current = true;
    trackRfqStart({
      pagePath: pathname,
      pageSource: source || pathname,
      productInterest: product || undefined,
      inquiryType: requestType,
      location: "inquiry_form",
    });
  }

  async function submitInquiry(
    payload: InquiryPayload,
    form: HTMLFormElement
  ) {
    const submittedRequestType = String(payload.requestType ?? requestType);
    const submittedProduct = String(payload.product ?? product);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || (result.emailDelivered === false && result.stored !== true)) {
        setErrorMsg(
          res.status === 503 || result.emailDelivered === false
            ? EMAIL_DELIVERY_FAILED_MSG
            : (result.error ?? "Submission failed. Please try again.")
        );
        setState("error");
        turnstileRef.current?.reset();
        return;
      }

      // Emits 'rfq_submit' internally (see trackInquiryByType) plus the
      // type-specific event. Do NOT also call trackRfqSubmit here — that
      // double-counts every submission in the admin conversion funnel.
      trackInquiryByType({
        requestType: submittedRequestType,
        pagePath: pathname,
        pageSource: source || pathname,
        productInterest: submittedProduct || undefined,
      });

      setState("success");
      form.reset();
      formStartedAtRef.current = Date.now();
      formStartTrackedRef.current = false;
      turnstileRef.current?.reset();
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setState("error");
      turnstileRef.current?.reset();
    }
  }

  // Single, idempotent completion path for a Turnstile-gated submit. Whichever
  // fires first — success callback, error callback or the timeout watchdog —
  // wins; the rest are ignored via settledRef. `token` is null when the
  // challenge could not be completed, in which case we still submit and let the
  // server log/allow it rather than trapping the buyer on "Submitting...".
  function finalizeTurnstileSubmit(token: string | null) {
    if (settledRef.current) return;
    settledRef.current = true;

    if (turnstileTimeoutRef.current) {
      clearTimeout(turnstileTimeoutRef.current);
      turnstileTimeoutRef.current = null;
    }

    const payload = pendingPayloadRef.current;
    const form = formRef.current;
    pendingPayloadRef.current = null;
    turnstileRef.current?.reset();

    if (!payload || !form) {
      setErrorMsg(VERIFICATION_FAILED_MSG);
      setState("error");
      return;
    }

    const finalPayload = token
      ? { ...payload, turnstileToken: token }
      : { ...payload, turnstileStatus: "unavailable" };
    void submitInquiry(finalPayload, form);
  }

  function handleTurnstileSuccess(token: string) {
    finalizeTurnstileSubmit(token);
  }

  function handleTurnstileError() {
    finalizeTurnstileSubmit(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries()) as InquiryPayload;
    const attributedPayload = {
      ...payload,
      ...getInquiryAttributionPayload(pathname),
      formStartedAt: String(formStartedAtRef.current),
      // Elapsed time measured entirely on THIS device. The server's anti-spam
      // gate must not subtract a client timestamp from its own clock: a buyer
      // whose device clock runs a few minutes fast produces a negative age and
      // is silently rejected as a bot. Sending the delta cancels clock skew.
      formElapsedMs: String(Math.max(0, Date.now() - formStartedAtRef.current)),
    };

    if (TURNSTILE_SITE_KEY) {
      pendingPayloadRef.current = attributedPayload;
      settledRef.current = false;
      turnstileTimeoutRef.current = setTimeout(
        () => finalizeTurnstileSubmit(null),
        TURNSTILE_TIMEOUT_MS
      );
      const handle = turnstileRef.current;
      if (handle) {
        handle.execute();
      } else {
        // Widget ref never attached — don't wait, degrade immediately.
        finalizeTurnstileSubmit(null);
      }
      return;
    }

    await submitInquiry(attributedPayload, form);
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800">Inquiry Submitted</h3>
        <p className="mt-2 text-sm text-green-700">
          Our sales team will respond within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={() => {
            formStartedAtRef.current = Date.now();
            formStartTrackedRef.current = false;
            setState("idle");
          }}
          className="mt-4 text-sm font-semibold text-[#2E7D9A] hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded border border-[#E2E6EA] px-3 py-2.5 text-sm text-[#0B2D5B] placeholder:text-[#5A6570]/60 focus:border-[#2E7D9A] focus:outline-none focus:ring-1 focus:ring-[#2E7D9A]";
  const labelClass = "block text-sm font-medium text-[#0B2D5B] mb-1";

  return (
    <form
      ref={formRef}
      onFocusCapture={handleFormStart}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input type="hidden" name="source" value={source} />
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Contact Name *
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company Name *
          </label>
          <input id="company" name="company" required className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            Country *
          </label>
          <input id="country" name="country" required className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product" className={labelClass}>
            Product
          </label>
          <select id="product" name="product" defaultValue={product} className={inputClass}>
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className={labelClass}>
            Estimated Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            placeholder="e.g. 20 MT / 1 FCL"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="requestType" className={labelClass}>
          Inquiry Type
        </label>
        <select
          id="requestType"
          name="requestType"
          defaultValue={requestType}
          className={inputClass}
        >
          <option value="quote">Request Quote</option>
          <option value="contact">Contact Factory</option>
          <option value="sample">Request Sample</option>
          <option value="tds">Get COA / MSDS / TDS</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Product grade, packaging, destination port, and any specification requirements."
          className={inputClass}
        />
      </div>

      <TurnstileField
        ref={turnstileRef}
        onSuccess={handleTurnstileSuccess}
        onError={handleTurnstileError}
      />

      {state === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <RFQTrustPreflight />

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full sm:w-auto rounded bg-[#0B2D5B] px-8 py-3 text-sm font-semibold text-white hover:bg-[#071F3F] transition-colors disabled:opacity-60"
      >
        {state === "submitting" ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
