import Link from "next/link";
import {
  getDashboardStats,
  getGeoInquiryStats,
  getLatestIndexNowSubmission,
  getProductInquiryStats,
  listLeads,
} from "@/lib/crm/repository";
import {
  formatAdminDate,
  leadStatusClasses,
  leadStatusLabels,
} from "@/lib/crm/presentation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, recentLeads, productStats, geoStats, indexNowStatus] = await Promise.all([
    getDashboardStats(),
    listLeads({ limit: 8 }),
    getProductInquiryStats(),
    getGeoInquiryStats(),
    getLatestIndexNowSubmission(),
  ]);

  const cards = [
    { label: "全部询盘", value: stats.total },
    { label: "近30天", value: stats.last30Days },
    { label: "新询盘", value: stats.newCount },
    { label: "有效询盘", value: stats.qualifiedCount },
    { label: "已报价", value: stats.quotedCount },
    { label: "已成交", value: stats.wonCount },
    { label: "逾期跟进", value: stats.overdueCount, alert: stats.overdueCount > 0 },
    { label: "AI来源询盘（30天）", value: stats.geoCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2D5B]">询盘数据总览</h1>
          <p className="mt-1 text-sm text-[#64748B]">当前阶段展示网站询盘承接与销售跟进数据。</p>
        </div>
        <Link
          href="/admin/inquiries"
          className="rounded-lg bg-[#0B2D5B] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#071F3F]"
        >
          进入询盘管理
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#64748B]">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.alert ? "text-red-600" : "text-[#0B2D5B]"}`}>
              {card.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="font-bold text-[#0B2D5B]">最新询盘</h2>
            <Link href="/admin/inquiries" className="text-sm font-semibold text-[#2E7D9A] hover:underline">
              查看全部
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#64748B]">暂无询盘。</p>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/inquiries/${lead.id}`}
                  className="grid gap-2 px-5 py-4 hover:bg-[#F8FAFC] sm:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#0F172A]">{lead.company} · {lead.name}</p>
                    <p className="mt-1 truncate text-sm text-[#64748B]">
                      {lead.product ?? "未指定产品"} · {lead.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${leadStatusClasses[lead.status]}`}>
                      {leadStatusLabels[lead.status]}
                    </span>
                    <span className="text-xs text-[#64748B]">{formatAdminDate(lead.submittedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="font-bold text-[#0B2D5B]">近30天产品页面询盘</h2>
          </div>
          {productStats.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#64748B]">暂无归因数据。</p>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {productStats.map((item) => (
                <div key={`${item.product}-${item.sourcePath}`} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-[#334155]">{item.product}</p>
                    <span className="rounded-full bg-[#EAF4FA] px-2.5 py-1 text-xs font-bold text-[#0B2D5B]">
                      {item.count}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-xs text-[#64748B]">{item.sourcePath}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="font-bold text-[#0B2D5B]">近30天 GEO / AI 来源询盘</h2>
          </div>
          {geoStats.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#64748B]">暂无 AI 引荐询盘。</p>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {geoStats.map((item) => (
                <div key={item.source} className="flex items-center justify-between px-5 py-3">
                  <p className="font-semibold text-[#334155]">{item.source}</p>
                  <span className="rounded-full bg-[#EAF4FA] px-2.5 py-1 text-xs font-bold text-[#0B2D5B]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#0B2D5B]">IndexNow 状态</h2>
          {indexNowStatus ? (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase text-[#64748B]">最近提交</dt>
                <dd className="mt-1 text-sm text-[#334155]">{formatAdminDate(indexNowStatus.submittedAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-[#64748B]">结果</dt>
                <dd className={`mt-1 text-sm font-bold ${indexNowStatus.success ? "text-green-700" : "text-red-600"}`}>
                  {indexNowStatus.success ? "成功" : "失败"} · HTTP {indexNowStatus.responseStatus}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-[#64748B]">URL数量</dt>
                <dd className="mt-1 text-sm text-[#334155]">{indexNowStatus.urlCount}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-[#64748B]">触发方式</dt>
                <dd className="mt-1 text-sm text-[#334155]">{indexNowStatus.trigger}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-[#64748B]">尚未执行首次 IndexNow 提交。</p>
          )}
        </section>
      </div>
    </div>
  );
}
