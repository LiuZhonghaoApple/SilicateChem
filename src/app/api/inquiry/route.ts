import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { buildStructuredLead } from "@/lib/leads";
import { SITE } from "@/lib/constants";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createLeadRecord,
  updateLeadEmailDelivery,
} from "@/lib/crm/repository";
import { checkInquiryRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  isTurnstileVerificationEnabled,
  verifyTurnstileToken,
} from "@/lib/turnstile";
import { inquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

type EmailSendResult =
  | { ok: true }
  | { ok: false; reason: "missing_config" | "resend_error"; detail?: string };

async function sendInquiryEmail(
  lead: ReturnType<typeof buildStructuredLead>
): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL ?? "padelonesource@gmail.com";
  const fromAddress = process.env.INQUIRY_FROM_EMAIL ?? SITE.email;
  const from = `SilicateChem Inquiry <${fromAddress}>`;

  if (!apiKey) {
    console.error("[INQUIRY] RESEND_API_KEY not configured — email skipped");
    return { ok: false, reason: "missing_config" };
  }

  if (!to || !from) {
    console.error("[INQUIRY] INQUIRY_TO_EMAIL or INQUIRY_FROM_EMAIL not configured");
    return { ok: false, reason: "missing_config" };
  }

  const subject = `[SilicateChem] ${lead.classification.inquiryType.toUpperCase()} — ${lead.contact.company}`;
  const text = [
    `Lead ID: ${lead.id}`,
    `Submitted: ${lead.submittedAt}`,
    "",
    `Name: ${lead.contact.name}`,
    `Email: ${lead.contact.email}`,
    `Company: ${lead.contact.company}`,
    `Country: ${lead.contact.country}`,
    "",
    `Product: ${lead.interest.product ?? "—"}`,
    `Quantity: ${lead.interest.quantity ?? "—"}`,
    `Type: ${lead.classification.inquiryType}`,
    `Source: ${lead.classification.sourcePage ?? "—"}`,
    `Source path: ${lead.classification.sourcePath ?? "—"}`,
    `Funnel: ${lead.classification.funnelLayer}`,
    `Landing page: ${lead.attribution.landingPage ?? "—"}`,
    `Referrer: ${lead.attribution.referrer ?? "—"}`,
    `GEO source: ${lead.attribution.geoSource ?? "—"}`,
    `GEO referrer host: ${lead.attribution.geoReferrerHost ?? "—"}`,
    `GEO landing path: ${lead.attribution.geoLandingPath ?? "—"}`,
    `UTM: ${[
      lead.attribution.utmSource,
      lead.attribution.utmMedium,
      lead.attribution.utmCampaign,
    ].filter(Boolean).join(" / ") || "—"}`,
    "",
    "Message:",
    lead.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      reply_to: lead.contact.email,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[INQUIRY] Resend error:", detail);
    return { ok: false, reason: "resend_error", detail };
  }

  return { ok: true };
}

function hashClientIp(ip: string): string | null {
  if (!ip || ip === "unknown") return null;
  const secret =
    process.env.ATTRIBUTION_HASH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    SITE.url;
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const rateLimit = await checkInquiryRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.error },
        { status: rateLimit.status }
      );
    }

    const body = await request.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] ?? "Invalid form data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const clientIp = getClientIp(request);

    if (isTurnstileVerificationEnabled()) {
      const token = result.data.turnstileToken;
      if (!token) {
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 400 }
        );
      }

      const verified = await verifyTurnstileToken(token, clientIp);
      if (!verified) {
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 400 }
        );
      }
    }

    const lead = buildStructuredLead(result.data, {
      userAgent: request.headers.get("user-agent"),
      ipHash: hashClientIp(clientIp),
      referer: request.headers.get("referer"),
      siteUrl: SITE.url,
    });

    let databaseStored = false;
    if (isDatabaseConfigured()) {
      try {
        await createLeadRecord(lead);
        databaseStored = true;
      } catch (error) {
        console.error(`[INQUIRY] Database persistence failed for ${lead.id}`, error);
      }
    } else {
      console.error("[INQUIRY] DATABASE_URL not configured — using email fallback");
    }

    const emailResult = await sendInquiryEmail(lead);

    if (databaseStored) {
      try {
        await updateLeadEmailDelivery(
          lead.id,
          emailResult.ok ? "sent" : "failed",
          emailResult.ok
            ? undefined
            : emailResult.detail ?? emailResult.reason
        );
      } catch (error) {
        console.error(`[INQUIRY] Failed to update email status for ${lead.id}`, error);
      }
    }

    if (!databaseStored && !emailResult.ok) {
      const logDetail =
        emailResult.reason === "missing_config"
          ? "RESEND_API_KEY or inquiry email addresses not set"
          : emailResult.detail ?? "Resend API rejected the send";

      console.error("[INQUIRY] Email delivery failed:", logDetail);

      return NextResponse.json(
        {
          error:
            "Inquiry delivery failed. Please contact us via WhatsApp or info@silicatechem.com",
          stored: false,
          emailDelivered: false,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      stored: databaseStored,
      emailDelivered: emailResult.ok,
      message: "Inquiry received — our sales team will respond shortly.",
    });
  } catch (error) {
    console.error("[INQUIRY] Failed to process inquiry:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
