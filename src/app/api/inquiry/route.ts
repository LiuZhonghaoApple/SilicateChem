import { NextResponse } from "next/server";
import { buildStructuredLead } from "@/lib/leads";
import { SITE } from "@/lib/constants";
import { inquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

async function sendInquiryEmail(lead: ReturnType<typeof buildStructuredLead>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) return false;

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
    `Funnel: ${lead.classification.funnelLayer}`,
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
    console.error("[INQUIRY] Resend error:", await res.text());
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] ?? "Invalid form data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const lead = buildStructuredLead(result.data, {
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
      siteUrl: SITE.url,
    });

    console.log("[INQUIRY]", JSON.stringify(lead, null, 2));

    const emailed = await sendInquiryEmail(lead);

    return NextResponse.json({
      success: true,
      message: emailed
        ? "Inquiry received — our sales team will respond shortly."
        : "Inquiry received",
    });
  } catch (error) {
    console.error("[INQUIRY] Failed to process inquiry:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
