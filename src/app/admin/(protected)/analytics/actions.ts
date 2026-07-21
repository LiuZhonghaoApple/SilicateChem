"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { syncReportingData } from "@/lib/reporting/sync";

export async function syncReportingAction(): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  await syncReportingData("admin_manual");
  revalidatePath("/admin/analytics");
}

