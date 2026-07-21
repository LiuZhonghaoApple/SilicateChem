"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  authenticateAdmin,
  canAttemptAdminLogin,
  clearAdminLoginFailures,
  createAdminSession,
  recordAdminLoginFailure,
} from "@/lib/admin-auth";

function loginKey(forwardedFor: string | null, realIp: string | null): string {
  return forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
}

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").slice(0, 120);
  const password = String(formData.get("password") ?? "").slice(0, 500);
  const headerStore = await headers();
  const key = loginKey(
    headerStore.get("x-forwarded-for"),
    headerStore.get("x-real-ip")
  );

  if (!canAttemptAdminLogin(key)) {
    redirect("/admin/login?error=locked");
  }

  if (!(await authenticateAdmin(username, password))) {
    recordAdminLoginFailure(key);
    redirect("/admin/login?error=invalid");
  }

  clearAdminLoginFailures(key);
  await createAdminSession(username);
  redirect("/admin");
}
