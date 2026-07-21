"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import {
  backlinkChannels,
  backlinkConnectionStatuses,
  backlinkPriorities,
  backlinkProviders,
  backlinkRelValues,
  backlinkStatuses,
  createBacklinkOpportunity,
  recordBacklinkBaseline,
  updateBacklinkOpportunity,
  type BacklinkChannel,
  type BacklinkConnectionStatus,
  type BacklinkPriority,
  type BacklinkProvider,
  type BacklinkRel,
  type BacklinkStatus,
} from "@/lib/backlinks/repository";

async function adminUsername(): Promise<string> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session.username;
}

function requiredValue(value: FormDataEntryValue | null, maxLength: number): string {
  const normalized = String(value ?? "").trim().slice(0, maxLength);
  if (!normalized) throw new Error("Required field is missing");
  return normalized;
}

function optionalValue(value: FormDataEntryValue | null, maxLength: number): string | null {
  const normalized = String(value ?? "").trim().slice(0, maxLength);
  return normalized || null;
}

function optionalInteger(value: FormDataEntryValue | null): number | null {
  const normalized = String(value ?? "").trim();
  if (!normalized) return null;
  const number = Number(normalized);
  if (!Number.isInteger(number) || number < 0) throw new Error("Invalid count");
  return number;
}

function normalizeDomain(value: FormDataEntryValue | null): string {
  const input = requiredValue(value, 253).toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  const domain = input.replace(/^www\./, "");
  if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(domain)) {
    throw new Error("Invalid source domain");
  }
  return domain;
}

function validateUrl(value: FormDataEntryValue | null): string {
  const url = requiredValue(value, 1_000);
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("Invalid evidence URL");
  return parsed.toString();
}

export async function createBacklinkAction(formData: FormData): Promise<void> {
  const actor = await adminUsername();
  const channel = String(formData.get("channel") ?? "") as BacklinkChannel;
  const priority = String(formData.get("priority") ?? "") as BacklinkPriority;
  const fitScore = Number(formData.get("fitScore"));
  if (!backlinkChannels.includes(channel) || !backlinkPriorities.includes(priority)) {
    throw new Error("Invalid backlink classification");
  }
  if (!Number.isInteger(fitScore) || fitScore < 0 || fitScore > 100) throw new Error("Invalid fit score");

  await createBacklinkOpportunity({
    sourceDomain: normalizeDomain(formData.get("sourceDomain")),
    sourceName: requiredValue(formData.get("sourceName"), 200),
    channel,
    industryFocus: requiredValue(formData.get("industryFocus"), 300),
    region: requiredValue(formData.get("region"), 120),
    fitScore,
    priority,
    accessModel: requiredValue(formData.get("accessModel"), 500),
    evidenceUrl: validateUrl(formData.get("evidenceUrl")),
    verificationNote: requiredValue(formData.get("verificationNote"), 1_000),
    plannedTargetPath: optionalValue(formData.get("plannedTargetPath"), 500),
    actor,
  });
  revalidatePath("/admin/backlinks");
}

export async function updateBacklinkAction(formData: FormData): Promise<void> {
  const actor = await adminUsername();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "") as BacklinkStatus;
  const linkRel = String(formData.get("linkRel") ?? "") as BacklinkRel;
  if (!Number.isInteger(id) || id <= 0 || !backlinkStatuses.includes(status) || !backlinkRelValues.includes(linkRel)) {
    throw new Error("Invalid backlink update");
  }

  const reviewDate = optionalValue(formData.get("nextReviewAt"), 10);
  if (reviewDate && !/^\d{4}-\d{2}-\d{2}$/.test(reviewDate)) throw new Error("Invalid review date");

  await updateBacklinkOpportunity({
    id,
    status,
    plannedTargetPath: optionalValue(formData.get("plannedTargetPath"), 500),
    owner: optionalValue(formData.get("owner"), 120),
    sourcePageUrl: optionalValue(formData.get("sourcePageUrl"), 1_000),
    anchorText: optionalValue(formData.get("anchorText"), 500),
    linkRel,
    nextReviewAt: reviewDate,
    notes: optionalValue(formData.get("notes"), 2_000),
    actor,
  });
  revalidatePath("/admin/backlinks");
}

export async function recordBacklinkBaselineAction(formData: FormData): Promise<void> {
  const actor = await adminUsername();
  const provider = String(formData.get("provider") ?? "") as BacklinkProvider;
  const connectionStatus = String(formData.get("connectionStatus") ?? "") as BacklinkConnectionStatus;
  const observedOn = requiredValue(formData.get("observedOn"), 10);
  if (!backlinkProviders.includes(provider) || !backlinkConnectionStatuses.includes(connectionStatus)) {
    throw new Error("Invalid baseline source");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(observedOn)) throw new Error("Invalid observation date");

  await recordBacklinkBaseline({
    provider,
    connectionStatus,
    observedOn,
    referringDomains: optionalInteger(formData.get("referringDomains")),
    linkingPages: optionalInteger(formData.get("linkingPages")),
    sampleLinks: optionalInteger(formData.get("sampleLinks")),
    anchorCount: optionalInteger(formData.get("anchorCount")),
    evidenceUrl: validateUrl(formData.get("evidenceUrl")),
    note: requiredValue(formData.get("note"), 1_000),
    actor,
  });
  revalidatePath("/admin/backlinks");
}
