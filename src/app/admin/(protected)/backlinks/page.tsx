import {
  backlinkChannels,
  backlinkConnectionStatuses,
  backlinkPriorities,
  backlinkRelValues,
  backlinkStatuses,
  daysSinceObservation,
  getBacklinkBaselines,
  getBacklinkSummary,
  listBacklinkOpportunities,
  BASELINE_STALE_AFTER_DAYS,
  type BacklinkConnectionStatus,
} from "@/lib/backlinks/repository";
import { isBingConfigured } from "@/lib/backlinks/bing";
import {
  createBacklinkAction,
  recordBacklinkBaselineAction,
  syncBingBaselineAction,
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
  has_data: "已有数据",
  confirmed_zero: "已确认为 0",
  unknown: "未知 · 待人工核查",
  not_configured: "未接入 / 未授权",
  error: "读取异常",
};

// Only two states are allowed to look calm: we have data, or we checked and the
// answer really is zero. "Unknown" and "not configured" both mean somebody still
// has to act, so neither may sit quietly on the page the way "processing" did.
const connectionClasses: Record<BacklinkConnectionStatus, string> = {
  has_data: "border-green-200 bg-green-50 text-green-900",
  confirmed_zero: "border-slate-200 bg-slate-50 text-slate-700",
  unknown: "border-amber-200 bg-amber-50 text-amber-950",
  not_configured: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-900",
};

const ACTIONABLE_STATUSES: BacklinkConnectionStatus[] = ["unknown", "not_configured", "error"];

const STALE_CLASS = "border-amber-300 bg-amber-50 text-amber-950";

const GSC_LINKS_REPORT_URL =
  "https://search.google.com/search-console/links?resource_id=https%3A%2F%2Fwww.silicatechem.com%2F";
const BING_BACKLINKS_URL = "https://www.bing.com/webmasters/backlinks";

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
  const bingConfigured = isBingConfigured();

  const baselineCards = (["gsc", "bing"] as const).map((provider) => {
    const item = baselineMap.get(provider);
    // A missing row is an unknown, not an error: nobody has looked yet.
    const status: BacklinkConnectionStatus = item?.connectionStatus ?? "unknown";
    const ageDays = item ? daysSinceObservation(item.observedOn, today) : null;
    const stale = ageDays === null || ageDays > BASELINE_STALE_AFTER_DAYS;
    return { provider, item, status, ageDays, stale, needsAttention: stale || ACTIONABLE_STATUSES.includes(status) };
  });
  const anyBaselineNeedsAttention = baselineCards.some((card) => card.needsAttention);

  const cards = [
    // Excluded rows are hidden from the list below, so counting them here would
    // make this number disagree with what the page actually shows.
    { label: "候选域名", value: summary.activeTotal, note: `另有 ${number(summary.excluded)} 条已排除` },
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

      {/* Read from the ledger rather than hard-coded: the previous fixed wording
          still claimed nobody had been contacted long after outreach began. */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-bold">候选不等于已获得</p>
        {summary.outreachStarted > 0 ? (
          <p className="mt-1">
            台账共 {number(summary.activeTotal)} 个域名（另有 {number(summary.excluded)} 条按“只做免费”政策排除）。
            已对外联系 {number(summary.outreachStarted)} 家，其中 {number(summary.accepted)} 家已接受投稿，
            {number(summary.live)} 条外链已确认上线。仍未注册付费平台、未购买任何链接。
          </p>
        ) : (
          <p className="mt-1">
            当前 {number(summary.activeTotal)} 个域名仅完成公开入口与行业相关性核验；尚未对外联系、未注册平台、未购买链接。
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {baselineCards.map(({ provider, item, status, ageDays, stale, needsAttention }) => {
          const isGsc = provider === "gsc";
          const reportUrl = item?.evidenceUrl || (isGsc ? GSC_LINKS_REPORT_URL : BING_BACKLINKS_URL);
          const autoSynced = !isGsc && item?.observedBy === "vercel_cron";
          return (
            <article
              key={provider}
              className={`rounded-xl border p-5 ${stale ? STALE_CLASS : connectionClasses[status]}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase">
                    {isGsc ? "Google Search Console" : "Bing Webmaster Tools"}
                  </p>
                  {/* Always show how old the reading is — a bare date told nobody
                      that the number had gone unchecked for over a week. */}
                  <p className="mt-1 text-xs">
                    {item ? `最后登记 ${item.observedOn} · 距今 ${ageDays} 天` : "从未登记过"}
                  </p>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
                  {connectionLabels[status]}
                </span>
              </div>

              {/* Every state that needs a human says so out loud, and says what to
                  do. A card that needs action must never look like a resting state. */}
              {needsAttention ? (
                <p className="mt-3 rounded-lg border border-amber-300 bg-white/70 px-3 py-2 text-xs font-bold">
                  {stale
                    ? `⚠️ 超过 ${BASELINE_STALE_AFTER_DAYS} 天未复核${item ? `（距今 ${ageDays} 天）` : ""}，请重新核查并登记。`
                    : status === "not_configured"
                      ? "⚠️ 尚未接入，数字无法自动获取 —— 需先完成下方配置。"
                      : status === "error"
                        ? "⚠️ 上次读取失败，数量仍为未知，请复查。"
                        : item
                          ? // Checked, but the platform declined to answer. Still
                            // unknown — and still must not be written down as 0.
                            "⚠️ 已核查，但平台未给出数字，数量仍为未知 —— 不要填 0。"
                          : "⚠️ 尚无人核查过，请核查后登记。"}
                </p>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><p className="text-xs opacity-70">引用域</p><p className="mt-1 text-xl font-bold">{displayCount(item?.referringDomains ?? null)}</p></div>
                <div><p className="text-xs opacity-70">链接页</p><p className="mt-1 text-xl font-bold">{displayCount(item?.linkingPages ?? null)}</p></div>
                <div><p className="text-xs opacity-70">样本链接</p><p className="mt-1 text-xl font-bold">{displayCount(item?.sampleLinks ?? null)}</p></div>
                <div><p className="text-xs opacity-70">锚文本</p><p className="mt-1 text-xl font-bold">{displayCount(item?.anchorCount ?? null)}</p></div>
              </div>
              {item?.referringDomains == null ||
              item?.linkingPages == null ||
              item?.sampleLinks == null ||
              item?.anchorCount == null ? (
                <p className="mt-1 text-xs opacity-70">“—”表示未知（尚未核查），不代表 0。</p>
              ) : null}

              <p className="mt-4 text-xs leading-5">{item?.note ?? "尚未做过首次基线审计。"}</p>
              {item ? (
                <p className="mt-2 text-xs opacity-80">
                  登记人：{item.observedBy}{autoSynced ? "（自动同步）" : "（人工登记）"}
                </p>
              ) : null}

              <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs leading-5">
                {isGsc ? (
                  <>
                    Google 未开放外链 API（Search Console API 只有站点 / 站点地图 / 搜索表现 / URL 检查四类接口，没有 Links 报告），
                    <strong>此卡片只能人工登录 GSC 网页查看后回来登记</strong>，不会自动更新。
                  </>
                ) : bingConfigured ? (
                  <>已接入 Bing Webmaster API，每日 03:15 随分析同步自动刷新。</>
                ) : (
                  <>
                    尚未接入：在 Bing Webmaster Tools → Settings → API Access 生成 API Key，
                    再作为 Vercel 环境变量 <code>BING_WEBMASTER_API_KEY</code> 加入并重新部署，本卡片即可自动更新。
                  </>
                )}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-bold underline"
                >
                  打开{isGsc ? " GSC 链接报告" : " Bing 外链报告"} ↗
                </a>
                <a href="#baseline-form" className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-bold underline">
                  去登记
                </a>
                {!isGsc ? (
                  <form action={syncBingBaselineAction}>
                    <button className="rounded-lg bg-[#0B2D5B] px-3 py-1.5 text-xs font-bold text-white">
                      立即同步
                    </button>
                  </form>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      {/* Opens itself when a baseline is stale or unknown, so the fix is one
          click away from the warning that sent you here. */}
      <details
        id="baseline-form"
        open={anyBaselineNeedsAttention}
        className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm scroll-mt-4"
      >
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
                <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
                  <p className="text-xs font-bold text-[#334155]">编辑联系人</p>
                  {item.contactEmail ? (
                    <a href={`mailto:${item.contactEmail}`} className="mt-1 block break-all text-xs font-semibold text-[#2E7D9A] hover:underline">
                      {item.contactEmail}
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-[#94A3B8]">未记录 — 请在下方表单补填</p>
                  )}
                  {item.contactName ? <p className="mt-1 text-xs text-[#64748B]">{item.contactName}</p> : null}
                  {item.contactPageUrl ? (
                    <a href={item.contactPageUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-[#2E7D9A] hover:underline">
                      联系页 ↗
                    </a>
                  ) : null}
                </div>
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
                <input name="contactEmail" type="email" defaultValue={item.contactEmail ?? ""} placeholder="编辑邮箱" className={inputClass} />
                <input name="contactName" defaultValue={item.contactName ?? ""} placeholder="编辑姓名 / 职务" className={`${inputClass} md:col-span-2`} />
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
