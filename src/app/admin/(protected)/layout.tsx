import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div data-admin-shell className="min-h-screen bg-[#F3F6F8] text-[#1E293B]">
      <header className="border-b border-[#DCE4EA] bg-[#0B2D5B] text-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link href="/admin" className="text-lg font-bold">
              SilicateChem 管理后台
            </Link>
            <p className="text-xs text-white/65">询盘CRM · SEO/GEO · 精准来源归因</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/75 sm:inline">{session.username}</span>
            <form action={logoutAction}>
              <button className="rounded-lg border border-white/30 px-3 py-2 font-semibold hover:bg-white/10">
                退出登录
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-[#DCE4EA] bg-white p-3 shadow-sm">
          <nav className="grid gap-1 text-sm font-semibold">
            <Link href="/admin" className="rounded-lg px-3 py-2.5 text-[#0B2D5B] hover:bg-[#EAF4FA]">
              数据总览
            </Link>
            <Link href="/admin/inquiries" className="rounded-lg px-3 py-2.5 text-[#0B2D5B] hover:bg-[#EAF4FA]">
              询盘管理
            </Link>
            <Link href="/admin/analytics" className="rounded-lg px-3 py-2.5 text-[#0B2D5B] hover:bg-[#EAF4FA]">
              SEO与流量
            </Link>
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
