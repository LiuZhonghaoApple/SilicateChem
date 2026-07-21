import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { submitLatestUrlsToIndexNow } from "@/lib/geo/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  const provided = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!secret || !provided || secret.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(provided));
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const result = await submitLatestUrlsToIndexNow("vercel_cron");
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[GEO] IndexNow submission failed", error);
    return NextResponse.json(
      { error: "IndexNow submission failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
