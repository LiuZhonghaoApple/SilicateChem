"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import {
  addLeadNote,
  createLeadRecord,
  leadPriorities,
  leadStatuses,
  updateLeadRecord,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/crm/repository";
import { buildStructuredLead } from "@/lib/leads";
import { SITE } from "@/lib/constants";

async function adminUsername(): Promise<string> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session.username;
}

function optionalValue(value: FormDataEntryValue | null, maxLength: number): string | null {
  const normalized = String(value ?? "").trim().slice(0, maxLength);
  return normalized || null;
}

export type ManualLeadState = { ok: boolean; error?: string; nonce?: number };

const MANUAL_REQUEST_TYPES = ["quote", "sample", "tds", "contact"] as const;

// Manually record an inquiry that arrived off-site (WhatsApp, email, exhibition,
// phone, marketplace…) so every channel is managed in one CRM. Reuses the same
// StructuredLead pipeline as the website form; the channel and the operator are
// preserved on the lead (source/utm) and in an audit note.
export async function createManualLeadAction(
  _prev: ManualLeadState,
  formData: FormData
): Promise<ManualLeadState> {
  const actor = await adminUsername();

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const company = String(formData.get("company") ?? "").trim().slice(0, 180);
  const country = String(formData.get("country") ?? "").trim().slice(0, 120);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5_000);
  const email = String(formData.get("email") ?? "").trim().slice(0, 254);
  const product = optionalValue(formData.get("product"), 180) ?? undefined;
  const quantity = optionalValue(formData.get("quantity"), 120) ?? undefined;
  const contactExtra = optionalValue(formData.get("contactExtra"), 200);
  const channel = String(formData.get("channel") ?? "Other").trim().slice(0, 60) || "Other";

  const requestTypeRaw = String(formData.get("requestType") ?? "contact");
  const requestType = (MANUAL_REQUEST_TYPES as readonly string[]).includes(requestTypeRaw)
    ? (requestTypeRaw as (typeof MANUAL_REQUEST_TYPES)[number])
    : "contact";

  const statusRaw = String(formData.get("status") ?? "new") as LeadStatus;
  const status = leadStatuses.includes(statusRaw) ? statusRaw : "new";

  if (name.length < 2 || company.length < 2 || country.length < 2) {
    return { ok: false, error: "请填写联系人、公司、国家（必填）。", nonce: nowNonce() };
  }
  if (message.length < 2) {
    return { ok: false, error: "请填写询盘内容 / 备注。", nonce: nowNonce() };
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "邮箱格式不正确（可留空）。", nonce: nowNonce() };
  }

  const lead = buildStructuredLead(
    {
      name,
      company,
      country,
      email,
      message,
      product,
      quantity,
      requestType,
      source: `manual:${channel}`,
      sourcePath: "手动录入",
      utmSource: channel,
      formStartedAt: Date.now(),
    },
    { siteUrl: SITE.url, userAgent: "manual-entry", ipHash: null, referer: null }
  );

  await createLeadRecord(lead);

  const noteParts = [`人工录入（渠道：${channel}）`];
  if (contactExtra) noteParts.push(`联系方式：${contactExtra}`);
  if (!email) noteParts.push("未提供邮箱");
  await addLeadNote({ id: lead.id, body: noteParts.join(" · "), actor });

  // Apply an initial status other than 'new' when the operator picked one.
  if (status !== "new") {
    await updateLeadRecord({
      id: lead.id,
      status,
      priority: "normal",
      owner: actor,
      nextFollowUpAt: null,
      lostReason: null,
      actor,
    });
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true, nonce: nowNonce() };
}

function nowNonce(): number {
  return Date.now();
}

export async function updateLeadAction(formData: FormData): Promise<void> {
  const actor = await adminUsername();
  const id = String(formData.get("id") ?? "").slice(0, 120);
  const status = String(formData.get("status") ?? "") as LeadStatus;
  const priority = String(formData.get("priority") ?? "") as LeadPriority;

  if (!id || !leadStatuses.includes(status) || !leadPriorities.includes(priority)) {
    throw new Error("Invalid lead update");
  }

  const followUpValue = optionalValue(formData.get("nextFollowUpAt"), 40);
  let nextFollowUpAt: string | null = null;
  if (followUpValue) {
    const parsed = new Date(`${followUpValue}:00+08:00`);
    if (Number.isNaN(parsed.getTime())) throw new Error("Invalid follow-up date");
    nextFollowUpAt = parsed.toISOString();
  }

  await updateLeadRecord({
    id,
    status,
    priority,
    owner: optionalValue(formData.get("owner"), 120),
    nextFollowUpAt,
    lostReason: optionalValue(formData.get("lostReason"), 500),
    actor,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function addLeadNoteAction(formData: FormData): Promise<void> {
  const actor = await adminUsername();
  const id = String(formData.get("id") ?? "").slice(0, 120);
  const body = String(formData.get("body") ?? "").trim().slice(0, 2_000);
  if (!id || !body) throw new Error("Note is required");

  await addLeadNote({ id, body, actor });
  revalidatePath(`/admin/inquiries/${id}`);
}
