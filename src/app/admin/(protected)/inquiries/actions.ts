"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import {
  addLeadNote,
  leadPriorities,
  leadStatuses,
  updateLeadRecord,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/crm/repository";

async function adminUsername(): Promise<string> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session.username;
}

function optionalValue(value: FormDataEntryValue | null, maxLength: number): string | null {
  const normalized = String(value ?? "").trim().slice(0, maxLength);
  return normalized || null;
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
