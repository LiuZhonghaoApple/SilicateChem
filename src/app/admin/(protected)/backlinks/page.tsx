import {
  backlinkChannels,
  backlinkConnectionStatuses,
  backlinkPriorities,
  backlinkRelValues,
  backlinkStatuses,
  getBacklinkBaselines,
  getBacklinkSummary,
  listBacklinkOpportunities,
  type BacklinkConnectionStatus,
} from "@/lib/backlinks/repository";
import {
  createBacklinkAction,
  recordBacklinkBaselineAction,
  updateBacklinkAction,
} from "./actions";

export const dynamic = "force-dynamic";

const channelLabels = {
  association: "行业协会",
  "trade-media": "行业媒体",
  "industry-directory": "行业目录",
  marketplace: "B2B平台",
  partner: "合作伙伴",
} as const;

const statusLabels = {
  candidate: "待核验",
  qualified: "已核验",
  "contact-ready": "可联系",
  contacted: "已联系",
  accepted: "已接受",
  live: "已上线",
  rejected: "已拒绝",
  lost: "已失效",
} as const;

const connectionLabels: Record<BacklinkConnectionStatus, string> = {
  ready: "数据已就绪",
  processing: "数据生成中",
  not_authenticated: "未登录 / 待授权",
  error: "读取异常",
};

const connectionClasses: Record<BacklinkConnectionStatus, string> = {
  ready: "border-green-200 bg-green-50 text-green-800",
  processing: "border-amber-200 bg-amber-50 text-amber-900",
  not_authenticated: "border-slate-200 bg-slate-50 text-slate-700",
  error: "border-red-200 bg-red-50 text-red-800",
};

const inputClass = "rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm";

function number(value: number): string {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(value);
}

function displayCount(value: number | null): string {
  return value == null ? "—" : number(value);
}

export default async function BacklinkDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; priority?: string; status?: string; channel?: string }>;
}) {
  const filters = await searchParams;
  const priority = backlinkPriorities.includes(filters.priority as (typeof backlinkPriorities)[number])
    ? filters.priority
    : "";
  const status = backlinkStatuses.includes(filters.status as (typeof backlinkStatuses)[number])
    ? filters.status
    : "";
  const channel = backlinkChannels.includes(filters.channel as (typeof backlinkChannels)[number])
    ? filters.channel
    : "";
  const query = filters.q?.slice(0, 120) ?? "";
  const [baselines, summary, opportunities] = await Promise.all([
    getBacklinkBaselines(),
    getBacklinkSummary(),
    listBacklinkOpportunities({ query, priority, status, channel }),
  ]);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
  const baselineMap = new Map(baselines.map((item) => [item.provider, item]));
  const cards = [
    { label: "候选域名", value: summary.total, note: "首批经核验台账" },
    { label: "S/A 优先级", value: summary.highPriority, note: "优先投入内容资产" },
    { label: "已上线外链", value: summary.live, note: "仅统计确认可访问链接" },
    { label: "30天引荐会话", value: summary.sessions, note: `${number(summary.users)} 访客` },
    { label: "30天关键事件", value: summary.keyEvents, note: "GA4 Referral" },
    { label: "30天引荐询盘", value: summary.inquiries, note: "CRM referrer / UTM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B2D5B]">外链管理</h1>
        <p className="mt-1 text-sm text-[#64748B]">外链基线、机会台账、GA4 流量与 CRM 询盘归因。</p>
      </div>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-bold">候选不等于已获得</p>
        <p className="mt-1">当前30个域名仅完成公开入口与行业相关性核验；本阶段未对外联系、未注册平台、未购买链接。</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {(["gsc", "bing"] as const).map((provider) => {
          const item = baselineMap.get(provider);
          const currentStatus = item?.connectionStatus ?? "error";
          return (
            <article key={provider} className={`rounded-xl border p-5 ${connectionClasses[currentStatus]}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase">{provider === "gsc" ? "Google Search Console" : "Bing Webmaster Tools"}</p>
                  <p className="mt-1 text-xs">{item?.observedOn ?? "尚未记录"}</p>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold">{connectionLabels[currentStatus]}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><p className="text-xs opacity-70">引用域</p><p className="mt-1 text-xl font-bold">{displayCount(item?.referringDomains ?? null)}</p></div>
                <div><p className="text-xs opacity-70">链接页</p><p className="mt-1 text-xl font-bold">{displayCount(item?.linkingPages ?? null)}</p></div>
                <div><p className="text-xs opacity-70">样本链接</p><p className="mt-1 text-xl font-bold">{displayCount(item?.sampleLinks ?? null)}</p></div>
                <div><p className="text-xs opacity-70">锚文本</p><p className="mt-1 text-xl font-bold">{displayCount(item?.anchorCount ?? null)}</p></div>
              </div>
              <p className="mt-4 text-xs leading-5">{item?.note ?? "等待首次基线审计。"}</p>
              {item ? <a href={item.evidenceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold underline">查看数据源</a> : null}
            </article>
          );
        })}
      </section>

      <details className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
        <summary className="cursor-pointer font-bold text-[#0B2D5B]">更新 GSC / Bing 基线快照</summary>
        <form action={recordBacklinkBaselineAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <select name="provider" required className={inputClass}><option value="gsc">GSC</option><option value="bing">Bing</option></select>
          <input name="observedOn" type="date" required defaultValue={today} className={inputClass} />
          <select name="connectionStatus" required className={inputClass}>
            {backlinkConnectionStatuses.map((item) => <option key={item} value={item}>{connectionLabels[item]}</option>)}
          </select>
          <input name="referringDomains" type="number" min="0" placeholder="引用域（未知留空）" className={inputClass} />
          <input name="linkingPages" type="number" min="0" placeholder="链接页（未知留空）" className={inputClass} />
          <input name="sampleLinks" type="number" min="0" placeholder="样本链接（未知留空）" className={inputClass} />
          <input name="anchorCount" type="number" min="0" placeholder="锚文本（未知留空）" className={inputClass} />
          <input name="evidenceUrl" type="url" required placeholder="数据源 URL" className={`${inputClass} md:col-span-2`} />
          <textarea name="note" required placeholder="审计证据与限制" className={`${inputClass} md:col-span-2`} />
          <button className="rounded-lg bg-[#0B2D5B] px-4 py-2 text-sm font-bold text-white md:col-span-4">保存快照</button>
        </form>
      </details>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-[#DCE4EA] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-[#64748B]">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#0B2D5B]">{number(card.value)}</p>
            <p className="mt-1 text-xs text-[#64748B]">{card.note}</p>
          </article>
        ))}
      </section>

      <form className="grid gap-3 rounded-xl border border-[#DCE4EA] bg-white p-4 shadow-sm md:grid-cols-[minmax(200px,1fr)_140px_160px_180px_auto]">
        <input name="q" defaultValue={query} placeholder="搜索域名、机构或行业" className={inputClass} />
        <select name="priority" defaultValue={priority} className={inputClass}>
          <option value="">全部优先级</option>
          {backlinkPriorities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select name="status" defaultValue={status} className={inputClass}>
          <option value="">全部状态</option>
          {backlinkStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
        </select>
        <select name="channel" defaultValue={channel} className={inputClass}>
          <option value="">全部渠道</option>
          {backlinkChannels.map((item) => <option key={item} value={item}>{channelLabels[item]}</option>)}
        </select>
        <button className="rounded-lg bg-[#0B2D5B] px-5 py-2 text-sm font-bold text-white">筛选</button>
      </form>

      <details className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
        <summary className="cursor-pointer font-bold text-[#0B2D5B]">新增候选域名</summary>
        <form action={createBacklinkAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input name="sourceDomain" required placeholder="域名，例如 example.org" className={inputClass} />
          <input name="sourceName" required placeholder="机构 / 网站名称" className={inputClass} />
          <select name="channel" required className={inputClass}>{backlinkChannels.map((item) => <option key={item} value={item}>{channelLabels[item]}</option>)}</select>
          <input name="industryFocus" required placeholder="行业相关性" className={inputClass} />
          <input name="region" required placeholder="覆盖地区" className={inputClass} />
          <div className="grid grid-cols-2 gap-3"><input name="fitScore" type="number" min="0" max="100" required placeholder="匹配分" className={inputClass} /><select name="priority" className={inputClass}>{backlinkPriorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <input name="evidenceUrl" type="url" required placeholder="公开证据 URL" className={`${inputClass} md:col-span-2`} />
          <input name="plannedTargetPath" placeholder="计划承接页，如 /products/..." className={inputClass} />
          <textarea name="accessModel" required placeholder="公开投稿 / 目录 / 会员等准入方式" className={inputClass} />
          <textarea name="verificationNote" required placeholder="核验记录" className={`${inputClass} md:col-span-2`} />
          <button className="rounded-lg bg-[#0B2D5B] px-4 py-2 text-sm font-bold text-white md:col-span-3">保存候选</button>
        </form>
      </details>

      <div className="space-y-3">
        {opportunities.map((item) => (
          <article key={item.id} className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(240px,1fr)_minmax(260px,1fr)]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0B2D5B] px-2.5 py-1 text-xs font-bold text-white">{item.priority} · {item.fitScore}</span>
                  <span className="rounded-full bg-[#EAF4FA] px-2.5 py-1 text-xs font-bold text-[#0B2D5B]">{channelLabels[item.channel]}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{statusLabels[item.status]}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-[#0B2D5B]">{item.sourceName}</h2>
                <a href={item.evidenceUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#2E7D9A] hover:underline">{item.sourceDomain}</a>
                <p className="mt-2 text-sm text-[#475569]">{item.industryFocus} · {item.region}</p>
                <p className="mt-2 text-xs leading-5 text-[#64748B]">{item.verificationNote}</p>
              </div>
              <div className="text-sm">
                <p className="font-bold text-[#334155]">准入与内容</p>
                <p className="mt-2 text-[#64748B]">{item.accessModel}</p>
                {item.costNote ? <p className="mt-2 text-xs text-amber-700">{item.costNote}</p> : null}
                <p className="mt-3 text-xs text-[#64748B]">计划承接：{item.plannedTargetPath ?? "待定"}</p>
                <p className="mt-1 text-xs text-[#64748B]">建议资产：{item.suggestedAsset ?? "待定"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4 xl:grid-cols-2">
                <div className="rounded-lg bg-[#F8FAFC] p-3"><p className="text-[#64748B]">会话</p><p className="mt-1 text-lg font-bold text-[#0B2D5B]">{number(item.sessions)}</p></div>
                <div className="rounded-lg bg-[#F8FAFC] p-3"><p className="text-[#64748B]">访客</p><p className="mt-1 text-lg font-bold text-[#0B2D5B]">{number(item.users)}</p></div>
                <div className="rounded-lg bg-[#F8FAFC] p-3"><p className="text-[#64748B]">关键事件</p><p className="mt-1 text-lg font-bold text-[#0B2D5B]">{number(item.keyEvents)}</p></div>
                <div className="rounded-lg bg-[#F8FAFC] p-3"><p className="text-[#64748B]">询盘</p><p className="mt-1 text-lg font-bold text-[#0B2D5B]">{number(item.inquiries)}</p></div>
              </div>
            </div>
            <details className="mt-4 border-t border-[#E2E8F0] pt-4">
              <summary className="cursor-pointer text-sm font-bold text-[#2E7D9A]">更新执行状态与上线证据</summary>
              <form action={updateBacklinkAction} className="mt-4 grid gap-3 md:grid-cols-4">
                <input type="hidden" name="id" value={item.id} />
                <select name="status" defaultValue={item.status} className={inputClass}>{backlinkStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select>
                <select name="linkRel" defaultValue={item.linkRel} className={inputClass}>{backlinkRelValues.map((value) => <option key={value} value={value}>{value}</option>)}</select>
                <input name="owner" defaultValue={item.owner ?? ""} placeholder="负责人" className={inputClass} />
                <input name="nextReviewAt" type="date" defaultValue={item.nextReviewAt ?? ""} className={inputClass} />
                <input name="plannedTargetPath" defaultValue={item.plannedTargetPath ?? ""} placeholder="承接页" className={inputClass} />
                <input name="sourcePageUrl" type="url" defaultValue={item.sourcePageUrl ?? ""} placeholder="已上线来源页 URL" className={`${inputClass} md:col-span-2`} />
                <input name="anchorText" defaultValue={item.anchorText ?? ""} placeholder="锚文本" className={inputClass} />
                <textarea name="notes" defaultValue={item.notes ?? ""} placeholder="执行备注" className={`${inputClass} md:col-span-3`} />
                <button className="rounded-lg bg-[#0B2D5B] px-4 py-2 text-sm font-bold text-white">保存更新</button>
              </form>
            </details>
          </article>
        ))}
        {opportunities.length === 0 ? <p className="rounded-xl border border-[#DCE4EA] bg-white p-10 text-center text-sm text-[#64748B]">没有符合条件的候选域名。</p> : null}
      </div>
    </div>
  );
}
