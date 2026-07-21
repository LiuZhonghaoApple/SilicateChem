import { formatAdminDate } from "@/lib/crm/presentation";
import {
  getGeoCitationObservations,
  getGeoCitationSummary,
  getGeoContentReviews,
  getGeoLandingPerformance,
  getLatestGscInspectionStatus,
  getLatestIndexNowStatus,
} from "@/lib/reporting/repository";
import { getInternalLinkCoverage } from "@/lib/seo/internal-link-graph";
import {
  addGeoCitationObservationAction,
  updateGeoContentReviewAction,
} from "./actions";

const numberFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });

function number(value: number): string {
  return numberFormatter.format(value);
}

function percent(value: number, base: number): string {
  return base > 0 ? `${number((value / base) * 100)}%` : "—";
}

function shortPath(value: string): string {
  try {
    return new URL(value).pathname;
  } catch {
    return value;
  }
}

const citationLabels: Record<string, string> = {
  cited: "已引用",
  not_cited: "未引用",
  incorrect: "引用错误",
};

const reviewLabels: Record<string, string> = {
  source_linked: "已关联证据",
  reviewed: "已人工复核",
  needs_update: "需要更新",
};

export default async function GeoMonitoringPanel() {
  const [
    landingPages,
    inspections,
    indexNow,
    observations,
    citationSummary,
    contentReviews,
  ] = await Promise.all([
    getGeoLandingPerformance(),
    getLatestGscInspectionStatus(),
    getLatestIndexNowStatus(),
    getGeoCitationObservations(),
    getGeoCitationSummary(),
    getGeoContentReviews(),
  ]);
  const linkCoverage = getInternalLinkCoverage();
  const aiSessions = landingPages.reduce((sum, item) => sum + item.sessions, 0);
  const aiInquiries = landingPages.reduce((sum, item) => sum + item.inquiries, 0);
  const inspectionPass = inspections.filter((item) => item.verdict === "PASS").length;
  const reviewedPages = contentReviews.filter((item) => item.reviewStatus === "reviewed").length;
  const minContextLinks = linkCoverage.length
    ? Math.min(...linkCoverage.map((item) => item.outboundLinks))
    : 0;

  const cards = [
    { label: "AI 引荐会话", value: number(aiSessions), note: "近30天 GA4" },
    { label: "AI 来源询盘", value: number(aiInquiries), note: `会话→询盘 ${percent(aiInquiries, aiSessions)}` },
    { label: "AI 引用检查", value: number(citationSummary.total), note: `已引用 ${number(citationSummary.cited)}` },
    { label: "Google URL 检查", value: `${inspectionPass}/${inspections.length}`, note: "最新 URL Inspection 快照" },
    { label: "GEO 内容复核", value: `${reviewedPages}/${contentReviews.length}`, note: "版本与证据受控" },
    { label: "强关联内链", value: `${linkCoverage.length} 页`, note: `每页至少 ${minContextLinks} 条语义链接` },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#B8DCE8] bg-[#F4FBFD] p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0B2D5B]">第四阶段 · GEO 监测闭环</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              AI 引荐、落地页、询盘、引用结果、Google 抓取和内容证据统一追踪。
            </p>
          </div>
          <div className={`rounded-full px-3 py-1.5 text-xs font-bold ${indexNow?.success ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
            {indexNow ? `IndexNow ${indexNow.success ? "已接收" : "提交异常"}` : "IndexNow 尚无记录"}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.label} className="rounded-lg border border-[#DCE4EA] bg-white p-4">
              <p className="text-xs font-bold text-[#64748B]">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#0B2D5B]">{card.value}</p>
              <p className="mt-1 text-xs text-[#64748B]">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="font-bold text-[#0B2D5B]">AI 来源落地页与询盘转化</h2>
          <p className="mt-1 text-xs text-[#64748B]">ChatGPT、Copilot、Perplexity、Claude、Gemini 等引荐按首次落地页归因。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F8FAFC] text-left text-xs text-[#64748B]">
              <tr><th className="px-4 py-3">AI 来源</th><th className="px-4 py-3">落地页</th><th className="px-4 py-3">会话</th><th className="px-4 py-3">访客</th><th className="px-4 py-3">询盘</th><th className="px-4 py-3">转化率</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {landingPages.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">近30天暂无可识别的 AI 引荐流量或询盘。</td></tr>
              ) : landingPages.map((item) => (
                <tr key={`${item.provider}-${item.landingPage}`}>
                  <td className="px-4 py-3 font-bold capitalize text-[#0B2D5B]">{item.provider}</td>
                  <td className="max-w-[480px] break-all px-4 py-3">{item.landingPage}</td>
                  <td className="px-4 py-3">{number(item.sessions)}</td>
                  <td className="px-4 py-3">{number(item.users)}</td>
                  <td className="px-4 py-3">{number(item.inquiries)}</td>
                  <td className="px-4 py-3">{percent(item.inquiries, item.sessions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#0B2D5B]">记录 AI 引用问题</h2>
          <form action={addGeoCitationObservationAction} className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-[#64748B]">AI 平台
                <select name="provider" className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#334155]" required defaultValue="chatgpt">
                  <option value="chatgpt">ChatGPT</option><option value="copilot">Copilot</option><option value="perplexity">Perplexity</option><option value="claude">Claude</option><option value="gemini">Gemini</option><option value="other">其他</option>
                </select>
              </label>
              <label className="text-xs font-bold text-[#64748B]">检查结果
                <select name="resultStatus" className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#334155]" required defaultValue="cited">
                  <option value="cited">已引用</option><option value="not_cited">未引用</option><option value="incorrect">引用错误</option>
                </select>
              </label>
            </div>
            <label className="text-xs font-bold text-[#64748B]">测试问题
              <textarea name="question" rows={2} maxLength={1000} required className="mt-1 w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#334155]" placeholder="例如：Which sodium metasilicate grade is suitable for detergent powder?" />
            </label>
            <label className="text-xs font-bold text-[#64748B]">被引用的 SilicateChem URL（如有）
              <input name="citedUrl" type="url" maxLength={1000} className="mt-1 w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#334155]" placeholder="https://www.silicatechem.com/..." />
            </label>
            <label className="text-xs font-bold text-[#64748B]">答案备注
              <textarea name="answerNote" rows={2} maxLength={2000} className="mt-1 w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#334155]" />
            </label>
            <button className="justify-self-start rounded-lg bg-[#0B2D5B] px-4 py-2.5 text-sm font-bold text-white">保存观察记录</button>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="font-bold text-[#0B2D5B]">最近 AI 引用观察</h2>
            <p className="mt-1 text-xs text-[#64748B]">近30天：未引用 {citationSummary.notCited} · 引用错误 {citationSummary.incorrect}</p>
          </div>
          <div className="max-h-[520px] divide-y divide-[#E2E8F0] overflow-y-auto">
            {observations.length === 0 ? <p className="p-8 text-center text-sm text-[#64748B]">尚未录入人工引用检查。</p> : observations.map((item) => (
              <article key={item.id} className="p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-bold capitalize text-[#0B2D5B]">{item.provider}</p><span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-bold text-[#475569]">{citationLabels[item.resultStatus] ?? item.resultStatus}</span></div>
                <p className="mt-2 text-sm text-[#334155]">{item.question}</p>
                {item.citedPagePath ? <p className="mt-2 break-all text-xs text-[#2E7D9A]">引用：{item.citedPagePath}</p> : null}
                <p className="mt-2 text-xs text-[#94A3B8]">{formatAdminDate(item.observedAt)} · {item.createdBy}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="font-bold text-[#0B2D5B]">Google 收录与抓取新鲜度</h2>
          <p className="mt-1 text-xs text-[#64748B]">URL Inspection 是 Google 当前状态快照；与 sitemap 提交数分开显示。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F8FAFC] text-left text-xs text-[#64748B]"><tr><th className="px-4 py-3">页面</th><th className="px-4 py-3">判定</th><th className="px-4 py-3">覆盖状态</th><th className="px-4 py-3">最近抓取</th><th className="px-4 py-3">Google Canonical</th></tr></thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {inspections.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">等待首次 GSC URL Inspection 同步。</td></tr> : inspections.map((item) => (
                <tr key={item.inspectedUrl}>
                  <td className="max-w-[340px] break-all px-4 py-3 font-semibold">{shortPath(item.inspectedUrl)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.verdict === "PASS" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800"}`}>{item.verdict}</span></td>
                  <td className="max-w-[280px] px-4 py-3">{item.coverageState}</td>
                  <td className="px-4 py-3">{item.lastCrawlTime ? formatAdminDate(item.lastCrawlTime) : "—"}</td>
                  <td className="max-w-[320px] break-all px-4 py-3 text-xs">{item.googleCanonical ? shortPath(item.googleCanonical) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4">
          <div><h2 className="font-bold text-[#0B2D5B]">GEO 内容版本、证据与审核</h2><p className="mt-1 text-xs text-[#64748B]">页面版本变化会自动重置为“已关联证据”，等待人工复核。</p></div>
          {indexNow ? <p className="text-xs text-[#64748B]">IndexNow：{formatAdminDate(indexNow.submittedAt)} · HTTP {indexNow.responseStatus} · {indexNow.urlCount} URLs<br />仅表示提交/发现信号，不代表 Bing 已收录。</p> : null}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F8FAFC] text-left text-xs text-[#64748B]"><tr><th className="px-4 py-3">页面 / 版本</th><th className="px-4 py-3">证据来源</th><th className="px-4 py-3">审核状态</th><th className="px-4 py-3">更新审核</th></tr></thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {contentReviews.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-[#64748B]">等待站点同步建立内容版本清单。</td></tr> : contentReviews.map((item) => (
                <tr key={item.pagePath}>
                  <td className="max-w-[280px] break-all px-4 py-3"><p className="font-semibold text-[#334155]">{item.pagePath}</p><p className="mt-1 text-xs text-[#94A3B8]">{item.contentVersion.slice(0, 10)}</p></td>
                  <td className="max-w-[420px] px-4 py-3 text-xs text-[#64748B]">{item.evidenceSource}</td>
                  <td className="px-4 py-3"><p className="font-semibold">{reviewLabels[item.reviewStatus] ?? item.reviewStatus}</p>{item.reviewedAt ? <p className="mt-1 text-xs text-[#94A3B8]">{formatAdminDate(item.reviewedAt)}</p> : null}</td>
                  <td className="px-4 py-3">
                    <form action={updateGeoContentReviewAction} className="flex min-w-[360px] gap-2">
                      <input type="hidden" name="pagePath" value={item.pagePath} />
                      <select name="reviewStatus" defaultValue={item.reviewStatus} className="rounded-lg border border-[#CBD5E1] bg-white px-2 py-2 text-xs">
                        <option value="source_linked">已关联证据</option><option value="reviewed">已人工复核</option><option value="needs_update">需要更新</option>
                      </select>
                      <input name="notes" defaultValue={item.notes ?? ""} maxLength={1000} placeholder="审核备注" className="min-w-0 flex-1 rounded-lg border border-[#CBD5E1] px-2 py-2 text-xs" />
                      <button className="rounded-lg bg-[#EAF4FA] px-3 py-2 text-xs font-bold text-[#0B2D5B]">保存</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
