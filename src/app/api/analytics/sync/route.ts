import { NextResponse } from "next/server";
import { syncBingBaseline } from "@/lib/backlinks/baseline-sync";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { isDatabaseConfigured } from "@/lib/db";
import { syncReportingData } from "@/lib/reporting/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!isAuthorizedCronRequest(request)) {
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
    const result = await syncReportingData("vercel_cron");

    // Rides the same daily slot rather than claiming a third Vercel cron. A Bing
    // failure must not fail the reporting sync, so it is reported, not thrown.
    let backlinkBaseline;
    try {
      backlinkBaseline = await syncBingBaseline("vercel_cron");
    } catch (error) {
      console.error("[BACKLINKS] Bing baseline sync failed", error);
      backlinkBaseline = {
        provider: "bing" as const,
        status: "error" as const,
        observedOn: "",
        written: false,
        detail: error instanceof Error ? error.message : "Unknown Bing baseline sync error",
      };
    }

    return NextResponse.json(
      { ...result, backlinkBaseline },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[REPORTING] Daily sync failed", error);
    return NextResponse.json(
      { error: "Daily reporting sync failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}

