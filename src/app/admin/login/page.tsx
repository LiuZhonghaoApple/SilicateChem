import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  invalid: "用户名或密码错误。",
  locked: "登录失败次数过多，请15分钟后再试。",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F8] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#DCE4EA] bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E7D9A]">
          SilicateChem
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#0B2D5B]">管理后台登录</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          询盘、来源归因与销售跟进平台
        </p>

        {error && errorMessages[error] ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessages[error]}
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-semibold text-[#334155]">
              管理员账号
            </label>
            <input
              id="username"
              name="username"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-[#2E7D9A] focus:ring-1 focus:ring-[#2E7D9A]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#334155]">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-[#2E7D9A] focus:ring-1 focus:ring-[#2E7D9A]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#0B2D5B] px-4 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
          >
            登录后台
          </button>
        </form>
      </div>
    </div>
  );
}
