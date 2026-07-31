"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import {
  addLeadNote,
  createLeadRecord,
  leadPaymentStatuses,
  leadPriorities,
  leadStatuses,
  updateLeadRecord,
  type LeadPaymentStatus,
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

type ManualAttachment = { url: string; name: string };

function parseAttachments(raw: FormDataEntryValue | null): ManualAttachment[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (a): a is ManualAttachment =>
          a &&
          typeof a.url === "string" &&
          typeof a.name === "string" &&
          /^https:\/\/[^\s]+\.public\.blob\.vercel-storage\.com\//.test(a.url)
      )
      .slice(0, 20)
      .map((a) => ({ url: a.url, name: a.name.slice(0, 200) }));
  } catch {
    return [];
  }
}

// Manually record an inquiry that arrived off-site (WhatsApp, email, exhibition,
// phone, marketplace…) so every channel is managed in one CRM. Simplified entry:
// date is auto (submitted_at), plus country, product, owner, channel and a note
// that can carry file attachments (uploaded to Blob, referenced by URL).
export async function createManualLeadAction(
  _prev: ManualLeadState,
  formData: FormData
): Promise<ManualLeadState> {
  const actor = await adminUsername();

  const country = String(formData.get("country") ?? "").trim().slice(0, 120);
  const note = String(formData.get("message") ?? "").trim().slice(0, 5_000);
  const product = optionalValue(formData.get("product"), 180) ?? undefined;
  const owner = String(formData.get("owner") ?? "").trim().slice(0, 120) || actor;
  const channel = String(formData.get("channel") ?? "Other").trim().slice(0, 60) || "Other";
  const attachments = parseAttachments(formData.get("attachments"));

  if (country.length < 2) {
    return { ok: false, error: "请填写国家（必填）。", nonce: nowNonce() };
  }
  if (note.length < 2 && attachments.length === 0) {
    return { ok: false, error: "请填写备注或至少上传一个附件。", nonce: nowNonce() };
  }

  // Compose the stored message: the note plus any attachment links so the
  // record is self-contained on the lead detail page.
  const messageLines: string[] = [];
  if (note) messageLines.push(note);
  if (attachments.length > 0) {
    messageLines.push("", "附件：");
    for (const a of attachments) messageLines.push(`- ${a.name}: ${a.url}`);
  }
  const message = messageLines.join("\n").slice(0, 5_000) || "（无备注）";

  const lead = buildStructuredLead(
    {
      // Identity fields are optional for off-site logging; keep placeholders so
      // NOT NULL constraints hold. Customer details live in the note/attachments.
      name: "人工录入",
      company: "—",
      email: "",
      country,
      message,
      product,
      requestType: "quote",
      source: `manual:${channel}`,
      sourcePath: "手动录入",
      utmSource: channel,
      formStartedAt: Date.now(),
    },
    { siteUrl: SITE.url, userAgent: "manual-entry", ipHash: null, referer: null }
  );

  await createLeadRecord(lead);

  const noteParts = [`人工录入（渠道：${channel}）· 跟进人：${owner}`];
  if (attachments.length > 0) {
    noteParts.push(`附件 ${attachments.length} 个：`);
    for (const a of attachments) noteParts.push(`${a.name} → ${a.url}`);
  }
  await addLeadNote({ id: lead.id, body: noteParts.join("\n"), actor });

  // Assign the follow-up owner (status stays 'new').
  await updateLeadRecord({
    id: lead.id,
    status: "new",
    priority: "normal",
    owner,
    nextFollowUpAt: null,
    lostReason: null,
    actor,
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true, nonce: nowNonce() };
}

function nowNonce(): number {
  return Date.now();
}

// Parse an optional non-negative money/tonnage number from a form field.
// Empty string => null (clear the field). Invalid/negative => throws.
function optionalNumber(value: FormDataEntryValue | null, label: string): number | null {
  const raw = String(value ?? "").trim().replace(/,/g, "");
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label}必须是非负数字`);
  }
  return parsed;
}

// Parse an optional YYYY-MM-DD date field. Empty => null.
function optionalDate(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error("交期格式应为 YYYY-MM-DD");
  return raw;
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

  const paymentRaw = optionalValue(formData.get("paymentStatus"), 20);
  const paymentStatus =
    paymentRaw && leadPaymentStatuses.includes(paymentRaw as LeadPaymentStatus)
      ? (paymentRaw as LeadPaymentStatus)
      : null;

  await updateLeadRecord({
    id,
    status,
    priority,
    owner: optionalValue(formData.get("owner"), 120),
    nextFollowUpAt,
    lostReason: optionalValue(formData.get("lostReason"), 500),
    actor,
    inquiryTonnage: optionalNumber(formData.get("inquiryTonnage"), "询价吨位"),
    quoteAmount: optionalNumber(formData.get("quoteAmount"), "报价金额"),
    dealAmount: optionalNumber(formData.get("dealAmount"), "成交金额"),
    expectedDeliveryDate: optionalDate(formData.get("expectedDeliveryDate")),
    paymentStatus,
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
