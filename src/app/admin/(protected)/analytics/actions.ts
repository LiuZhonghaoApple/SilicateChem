"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import {
  createGeoCitationObservation,
  updateGeoContentReview,
} from "@/lib/reporting/repository";
import { syncReportingData } from "@/lib/reporting/sync";

const GEO_PROVIDERS = new Set(["chatgpt", "copilot", "perplexity", "claude", "gemini", "other"]);
const CITATION_RESULTS = new Set(["cited", "not_cited", "incorrect"]);
const REVIEW_STATUSES = new Set(["source_linked", "reviewed", "needs_update"]);

function textValue(formData: FormData, name: string, maxLength: number): string {
  return String(formData.get(name) ?? "").trim().slice(0, maxLength);
}

export async function syncReportingAction(): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  await syncReportingData("admin_manual");
  revalidatePath("/admin/analytics");
}

export async function addGeoCitationObservationAction(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const provider = textValue(formData, "provider", 30).toLowerCase();
  const question = textValue(formData, "question", 1_000);
  const resultStatus = textValue(formData, "resultStatus", 30).toLowerCase();
  const citedUrl = textValue(formData, "citedUrl", 1_000);
  const answerNote = textValue(formData, "answerNote", 2_000);
  if (!GEO_PROVIDERS.has(provider) || !CITATION_RESULTS.has(resultStatus) || !question) {
    throw new Error("Invalid GEO citation observation");
  }

  let citedPagePath = "";
  if (citedUrl) {
    const url = new URL(citedUrl);
    if (!["silicatechem.com", "www.silicatechem.com"].includes(url.hostname.toLowerCase())) {
      throw new Error("Cited URL must be a SilicateChem page");
    }
    citedPagePath = url.pathname;
  }

  await createGeoCitationObservation({
    provider,
    question,
    citedUrl,
    citedPagePath,
    resultStatus,
    answerNote,
    createdBy: session.username,
  });
  revalidatePath("/admin/analytics");
}

export async function updateGeoContentReviewAction(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const pagePath = textValue(formData, "pagePath", 500);
  const reviewStatus = textValue(formData, "reviewStatus", 30).toLowerCase();
  const notes = textValue(formData, "notes", 1_000);
  if (!pagePath.startsWith("/") || !REVIEW_STATUSES.has(reviewStatus)) {
    throw new Error("Invalid GEO content review");
  }

  await updateGeoContentReview({
    pagePath,
    reviewStatus,
    notes,
    reviewedBy: session.username,
  });
  revalidatePath("/admin/analytics");
}
