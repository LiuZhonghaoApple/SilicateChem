import { NextResponse } from "next/server";
import { z } from "zod";
import { SITE } from "@/lib/constants";
import {
  consumePersistentRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

const handoffSchema = z.object({
  contact: z.string().min(3, "Contact is required").max(200),
  note: z.string().max(1_500).optional(),
  pagePath: z.string().max(500).optional(),
  conversation: z.string().max(4_000).optional(),
  website: z.string().max(200).optional(),
});

async function sendHandoffEmail(data: {
  contact: string;
  note?: string;
  pagePath?: string;
  conversation?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const toList = (process.env.INQUIRY_TO_EMAIL ?? "padelonesource@gmail.com")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);
  const fromAddress = process.env.INQUIRY_FROM_EMAIL ?? SITE.email;
  const from = `SilicateChem Support <${fromAddress}>`;

  if (!apiKey || toList.length === 0) {
    console.error("[HANDOFF] RESEND_API_KEY or INQUIRY_TO_EMAIL not configured");
    return false;
  }

  const subject = `[SilicateChem] Live handoff — a visitor is waiting for a reply`;
  const text = [
    "A website visitor asked to talk to the sales team and left their contact.",
    "Please follow up as soon as possible.",
    "",
    `Contact: ${data.contact}`,
    `Note: ${data.note?.trim() || "—"}`,
    `Page: ${data.pagePath || "—"}`,
    "",
    "Recent conversation:",
    data.conversation?.trim() || "—",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: toList,
      subject,
      text,
      reply_to: SITE.email,
    }),
  });

  if (!res.ok) {
    console.error("[HANDOFF] Resend error:", await res.text());
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = handoffSchema.safeParse(payload);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] ?? "Invalid data";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  // Honeypot: silently accept without notifying.
  if (result.data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  const rate = await consumePersistentRateLimit({
    namespace: "support-handoff",
    identifier: ip,
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const delivered = await sendHandoffEmail(result.data);
  if (!delivered) {
    return NextResponse.json(
      { error: "Could not reach our team right now. Please try WhatsApp." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
