import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase, isDatabaseConfigured } from "@/lib/db";
import {
  consumePersistentRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

const conversionEventSchema = z
  .object({
    eventId: z.string().min(8).max(80),
    eventName: z.enum([
      "whatsapp_click",
      "ai_advisor_open",
      "ai_advisor_question",
      "ai_advisor_answer",
      "ai_advisor_handoff",
      "rfq_start",
      "rfq_submit",
    ]),
    pagePath: z.string().min(1).max(500),
    pageSource: z.string().max(300).optional(),
    productInterest: z.string().max(180).optional(),
    inquiryType: z.string().max(40).optional(),
    eventLabel: z.string().max(120).optional(),
    visitorId: z.string().max(100).optional(),
    landingPage: z.string().max(1_000).optional(),
    referrerHost: z.string().max(255).optional(),
    utmSource: z.string().max(300).optional(),
    utmMedium: z.string().max(300).optional(),
    utmCampaign: z.string().max(300).optional(),
    geoSource: z.string().max(80).optional(),
  })
  .strict();

function hashIdentifier(value: string | undefined): string | null {
  if (!value || value === "unknown") return null;
  const secret =
    process.env.ATTRIBUTION_HASH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    "silicatechem-conversion-v1";
  return createHmac("sha256", secret).update(value).digest("hex");
}

function nullable(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pathOnly(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value, "https://www.silicatechem.com").pathname;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const [ipLimit, globalLimit] = await Promise.all([
      consumePersistentRateLimit({
        namespace: "conversion-event-ip",
        identifier: clientIp,
        limit: 240,
        windowSeconds: 60 * 60,
      }),
      consumePersistentRateLimit({
        namespace: "conversion-event-global",
        identifier: "all",
        limit: 25_000,
        windowSeconds: 24 * 60 * 60,
      }),
    ]);

    if (!ipLimit.allowed || !globalLimit.allowed) {
      return NextResponse.json(
        { error: "Too many analytics events" },
        { status: 429 }
      );
    }

    const parsed = conversionEventSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid analytics event" }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
    }

    const event = parsed.data;
    const sql = getDatabase();
    await sql`INSERT INTO conversion_events (
      event_id, event_name, page_path, page_source, product_interest,
      inquiry_type, event_label, visitor_id_hash, landing_page,
      referrer_host, utm_source, utm_medium, utm_campaign, geo_source,
      client_ip_hash
    ) VALUES (
      ${event.eventId}, ${event.eventName}, ${pathOnly(event.pagePath) ?? "/"},
      ${nullable(event.pageSource)}, ${nullable(event.productInterest)},
      ${nullable(event.inquiryType)}, ${nullable(event.eventLabel)},
      ${hashIdentifier(event.visitorId)}, ${pathOnly(event.landingPage)},
      ${nullable(event.referrerHost)}, ${nullable(event.utmSource)},
      ${nullable(event.utmMedium)}, ${nullable(event.utmCampaign)},
      ${nullable(event.geoSource)}, ${hashIdentifier(clientIp)}
    ) ON CONFLICT (event_id) DO NOTHING`;

    return NextResponse.json({ accepted: true, stored: true }, { status: 202 });
  } catch (error) {
    console.error("[CONVERSION_EVENT] Failed to store event", error);
    return NextResponse.json({ error: "Analytics event unavailable" }, { status: 503 });
  }
}
