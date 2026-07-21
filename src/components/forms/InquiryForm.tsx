"use client";

import { useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { products } from "@/content/products";
import { trackInquiryByType } from "@/lib/analytics";
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

  const ctx = getRfqContext(pathname);
  const product =
    defaultProduct ?? searchParams.get("product") ?? "";
  const requestType =
    defaultRequestType ?? searchParams.get("type") ?? "quote";
  const source = searchParams.get("source") ?? ctx.source ?? pathname;

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

      trackInquiryByType({
        requestType: submittedRequestType,
        pagePath: pathname,
        pageSource: source || pathname,
        productInterest: submittedProduct || undefined,
      });

      setState("success");
      form.reset();
      turnstileRef.current?.reset();
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setState("error");
      turnstileRef.current?.reset();
    }
  }

  function handleTurnstileSuccess(token: string) {
    const payload = pendingPayloadRef.current;
    const form = formRef.current;

    if (!payload || !form) {
      setErrorMsg(VERIFICATION_FAILED_MSG);
      setState("error");
      turnstileRef.current?.reset();
      return;
    }

    pendingPayloadRef.current = null;
    void submitInquiry({ ...payload, turnstileToken: token }, form);
  }

  function handleTurnstileError() {
    pendingPayloadRef.current = null;
    setErrorMsg(VERIFICATION_FAILED_MSG);
    setState("error");
    turnstileRef.current?.reset();
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
    };

    if (TURNSTILE_SITE_KEY) {
      pendingPayloadRef.current = attributedPayload;
      turnstileRef.current?.execute();
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
          onClick={() => setState("idle")}
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="source" value={source} />
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
