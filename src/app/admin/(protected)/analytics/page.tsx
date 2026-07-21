import { AI_CRAWLER_POLICY } from "@/lib/seo/ai-crawler-policy";
import { getContentReleaseTimeline } from "@/lib/content-freshness";
import { getGoogleReportingConfiguration } from "@/lib/reporting/config";
import {
  getGeoTrafficSources,
  getInquiryFunnel,
  getLatestSiteSnapshot,
  getLatestSyncStatuses,
  getPagePerformance,
  getReportingOverview,
  getReportingTrend,
  getTopGscPages,
  getTopGscQueries,
  getTrafficSources,
} from "@/lib/reporting/repository";
import { formatAdminDate } from "@/lib/crm/presentation";
import { syncReportingAction } from "./actions";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });

function number(value: number): string {
  return numberFormatter.format(value);
}

function percent(value: number): string {
  return `${number(value * 100)}%`;
}

function ratio(value: number, base: number): string {
  return base > 0 ? percent(value / base) : "—";
}

function shortPath(value: string): string {
  try {
    return new URL(value).pathname;
  } catch {
    return value;
  }
}

const syncStatusLabels = {
  success: "已同步",
  failed: "同步失败",
  not_configured: "待授权",
} as const;

const syncStatusClasses = {
  success: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  not_configured: "bg-amber-50 text-amber-800 border-amber-200",
} as const;

export default async function AnalyticsDashboardPage() {
  const [
    overview,
    trend,
    sources,
    geoSources,
    pages,
    queries,
    searchPages,
    funnel,
    syncStatuses,
    siteSnapshot,
  ] = await Promise.all([
    getReportingOverview(),
    getReportingTrend(),
    getTrafficSources(),
    getGeoTrafficSources(),
    getPagePerformance(),
    getTopGscQueries(),
    getTopGscPages(),
    getInquiryFunnel(),
    getLatestSyncStatuses(),
    getLatestSiteSnapshot(),
  ]);
  const configuration = getGoogleReportingConfiguration();
  const releases = getContentReleaseTimeline();
  const statusMap = new Map(syncStatuses.map((item) => [item.provider, item]));
  const funnelStages = [
    { label: "网站会话", value: funnel.sessions, rate: "GA4" },
    { label: "产品页会话", value: funnel.productSessions, rate: ratio(funnel.productSessions, funnel.sessions) },
    { label: "网站询盘", value: funnel.inquiries, rate: ratio(funnel.inquiries, funnel.productSessions) },
    { label: "有效询盘", value: funnel.qualified, rate: ratio(funnel.qualified, funnel.inquiries) },
    { label: "已报价", value: funnel.quoted, rate: ratio(funnel.quoted, funnel.qualified) },
    { label: "已成交", value: funnel.won, rate: ratio(funnel.won, funnel.quoted) },
  ];
  const cards = [
    { label: "近30天会话", value: number(overview.sessions), note: "GA4" },
    { label: "访客", value: number(overview.users), note: `新访客 ${number(overview.newUsers)}` },
    { label: "浏览量", value: number(overview.pageViews), note: `互动率 ${percent(overview.engagementRate)}` },
    { label: "关键事件", value: number(overview.keyEvents), note: "GA4 key events" },
    { label: "Google 点击", value: number(overview.clicks), note: `曝光 ${number(overview.impressions)}` },
    { label: "搜索 CTR", value: percent(overview.ctr), note: `平均排名 ${number(overview.position)}` },
    { label: "公开页面", value: number(siteSnapshot?.publicPageCount ?? 0), note: "Sitemap" },
    {
      label: "GSC 已收录",
      value: siteSnapshot?.sitemapIndexed == null ? "—" : number(siteSnapshot.sitemapIndexed),
      note: siteSnapshot?.sitemapSubmitted == null ? "待 GSC 同步" : `提交 ${number(siteSnapshot.sitemapSubmitted)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2D5B]">SEO · GEO · 流量</h1>
          <p className="mt-1 text-sm text-[#64748B]">GA4、Search Console、页面发布和询盘转化的统一运营视图。</p>
        </div>
        <form action={syncReportingAction}>
          <button className="rounded-lg bg-[#0B2D5B] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#071F3F]">
            立即同步
          </button>
        </form>
      </div>

      {!configuration.configured ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-bold">Google Data API 待授权</p>
          <p className="mt-1">
            GA4 Property {configuration.ga4PropertyId} 与 GSC {configuration.gscSiteUrl} 已登记；站点、GEO 和 CRM
            数据正常运行。配置只读服务账号后，系统会自动回填最近30天数据。
          </p>
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        {(["site", "ga4", "gsc"] as const).map((provider) => {
          const item = statusMap.get(provider);
          const status = item?.status ?? (provider === "site" ? "not_configured" : "not_configured");
          return (
            <article key={provider} className={`rounded-xl border p-4 ${syncStatusClasses[status]}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold uppercase">{provider}</p>
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">
                  {item ? syncStatusLabels[status] : "尚未执行"}
                </span>
              </div>
              <p className="mt-2 text-xs">
                {item
                  ? `${formatAdminDate(item.completedAt)} · ${item.rowCount} 行 · ${item.trigger}`
                  : "等待首次每日同步"}
              </p>
              {item?.error ? <p className="mt-2 line-clamp-2 text-xs">{item.error}</p> : null}
            </article>
          );
        })}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#64748B]">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#0B2D5B]">{card.value}</p>
            <p className="mt-1 text-xs text-[#64748B]">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
        <h2 className="font-bold text-[#0B2D5B]">近30天询盘转化漏斗</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {funnelStages.map((stage, index) => (
            <article key={stage.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-xs font-bold text-[#64748B]">{index + 1}. {stage.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#0B2D5B]">{number(stage.value)}</p>
              <p className="mt-1 text-xs text-[#2E7D9A]">转化 {stage.rate}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="font-bold text-[#0B2D5B]">每日趋势</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs text-[#64748B]">
                <tr><th className="px-4 py-3">日期</th><th className="px-4 py-3">会话</th><th className="px-4 py-3">访客</th><th className="px-4 py-3">浏览</th><th className="px-4 py-3">点击/曝光</th></tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {trend.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">等待首次 Google 数据同步。</td></tr>
                ) : trend.map((item) => (
                  <tr key={item.date}><td className="px-4 py-3">{item.date}</td><td className="px-4 py-3">{number(item.sessions)}</td><td className="px-4 py-3">{number(item.users)}</td><td className="px-4 py-3">{number(item.pageViews)}</td><td className="px-4 py-3">{number(item.clicks)} / {number(item.impressions)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="font-bold text-[#0B2D5B]">访客来源</h2>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {sources.length === 0 ? <p className="p-8 text-center text-sm text-[#64748B]">暂无 GA4 来源数据。</p> : sources.map((item) => (
              <div key={`${item.source}-${item.medium}-${item.channelGroup}`} className="flex items-start justify-between gap-4 px-5 py-3">
                <div><p className="font-semibold text-[#334155]">{item.source} / {item.medium}</p><p className="mt-1 text-xs text-[#64748B]">{item.channelGroup}</p></div>
                <div className="text-right"><p className="font-bold text-[#0B2D5B]">{number(item.sessions)} 会话</p><p className="text-xs text-[#64748B]">{number(item.users)} 访客 · {number(item.keyEvents)} 关键事件</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] px-5 py-4"><h2 className="font-bold text-[#0B2D5B]">页面表现与询盘</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F8FAFC] text-left text-xs text-[#64748B]"><tr><th className="px-4 py-3">页面</th><th className="px-4 py-3">浏览量</th><th className="px-4 py-3">会话</th><th className="px-4 py-3">询盘</th><th className="px-4 py-3">会话→询盘</th></tr></thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {pages.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">暂无页面数据。</td></tr> : pages.map((item) => (
                <tr key={item.pagePath}><td className="max-w-[520px] break-all px-4 py-3 font-semibold text-[#334155]">{item.pagePath}</td><td className="px-4 py-3">{number(item.pageViews)}</td><td className="px-4 py-3">{number(item.sessions)}</td><td className="px-4 py-3">{number(item.inquiries)}</td><td className="px-4 py-3">{ratio(item.inquiries, item.sessions)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {[{ title: "GSC 关键词", items: queries }, { title: "GSC 搜索页面", items: searchPages }].map((section) => (
          <section key={section.title} className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-5 py-4"><h2 className="font-bold text-[#0B2D5B]">{section.title}</h2></div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#F8FAFC] text-left text-xs text-[#64748B]"><tr><th className="px-4 py-3">{section.title.includes("页面") ? "页面" : "关键词"}</th><th className="px-4 py-3">曝光</th><th className="px-4 py-3">点击</th><th className="px-4 py-3">CTR</th><th className="px-4 py-3">排名</th></tr></thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {section.items.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">暂无 GSC 数据。</td></tr> : section.items.map((item) => (
                    <tr key={item.label}><td className="max-w-[360px] break-all px-4 py-3 font-semibold text-[#334155]">{section.title.includes("页面") ? shortPath(item.label) : item.label}</td><td className="px-4 py-3">{number(item.impressions)}</td><td className="px-4 py-3">{number(item.clicks)}</td><td className="px-4 py-3">{percent(item.ctr)}</td><td className="px-4 py-3">{number(item.position)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#0B2D5B]">GEO / AI 流量来源</h2>
          {geoSources.length === 0 ? <p className="mt-4 text-sm text-[#64748B]">暂无 GA4 AI 引荐数据；CRM 的 AI 来源询盘仍在数据总览中记录。</p> : (
            <div className="mt-4 divide-y divide-[#E2E8F0]">{geoSources.map((item) => <div key={`${item.source}-${item.medium}`} className="flex justify-between gap-4 py-3"><div><p className="font-semibold">{item.source} / {item.medium}</p><p className="text-xs text-[#64748B]">{item.channelGroup}</p></div><p className="font-bold text-[#0B2D5B]">{number(item.sessions)} 会话</p></div>)}</div>
          )}
        </section>

        <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#0B2D5B]">页面上线 / 更新时间</h2>
          <div className="mt-4 divide-y divide-[#E2E8F0]">{releases.slice(0, 10).map((item) => <div key={item.date} className="flex items-center justify-between py-3"><div><p className="font-semibold">{item.date}</p><p className="text-xs text-[#64748B]">已登记内容更新时间</p></div><span className="rounded-full bg-[#EAF4FA] px-3 py-1 text-sm font-bold text-[#0B2D5B]">{item.count} 页</span></div>)}</div>
        </section>
      </div>

      <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-[#0B2D5B]">AI Crawler 策略矩阵</h2><p className="text-xs text-[#64748B]">默认规则：公开内容允许；API、后台和调试路径禁止。</p></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{AI_CRAWLER_POLICY.map((crawler) => <article key={crawler.userAgent} className="rounded-lg border border-[#E2E8F0] p-4"><div className="flex items-center justify-between gap-3"><p className="font-mono text-sm font-bold text-[#0B2D5B]">{crawler.userAgent}</p><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${crawler.access === "allow" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{crawler.access === "allow" ? "允许" : "禁止"}</span></div><p className="mt-2 text-xs text-[#64748B]">{crawler.provider} · {crawler.purpose}</p>{crawler.note ? <p className="mt-2 text-xs text-amber-700">{crawler.note}</p> : null}</article>)}</div>
      </section>
    </div>
  );
}

