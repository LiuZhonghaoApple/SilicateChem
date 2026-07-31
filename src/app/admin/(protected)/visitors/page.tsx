import { listVisitorSessions } from "@/lib/conversion/visitor-events";
import { conversionEventLabel, formatAdminDate } from "@/lib/crm/presentation";

export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
  const sessions = await listVisitorSessions(30, 200);

  const converted = sessions.filter((s) => s.convertedToLead).length;
  const withRfq = sessions.filter((s) => s.submittedRfq).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0B2D5B]">访客行为（近30天）</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          按访客聚合的匿名行为记录：来源、落地页、动作序列、是否最终提交询盘。数据来自站内埋点 <code>conversion_events</code>，实时。Visitor ID 存于浏览器会话，换会话/换设备会重置，故每行是「一次会话」而非跨天身份。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="活跃访客（会话）" value={sessions.length} />
        <StatCard label="发起过询盘提交" value={withRfq} />
        <StatCard label="最终关联到询盘" value={converted} />
      </div>

      <section className="overflow-x-auto rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[#F1F5F9] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-4 py-3">访客</th>
              <th className="px-4 py-3">来源</th>
              <th className="px-4 py-3">落地页</th>
              <th className="px-4 py-3">动作序列</th>
              <th className="px-4 py-3">事件</th>
              <th className="px-4 py-3">最后活跃</th>
              <th className="px-4 py-3">转化</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F6]">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#64748B]">
                  近30天暂无访客行为记录。
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.visitorHash} className="align-top">
                  <td className="px-4 py-3 font-mono text-xs text-[#475569]">
                    {s.visitorHash.slice(0, 10)}…
                  </td>
                  <td className="px-4 py-3 text-[#334155]">
                    {s.geoSource ?? s.utmSource ?? s.referrerHost ?? "直接/未知"}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[#64748B]" title={s.landingPage ?? ""}>
                    {s.landingPage ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.actions.map((a, i) => (
                        <span key={i} className="rounded bg-[#EAF4FA] px-1.5 py-0.5 text-xs text-[#2E7D9A]">
                          {conversionEventLabel(a)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#334155]">{s.eventCount}</td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{formatAdminDate(s.lastSeen)}</td>
                  <td className="px-4 py-3">
                    {s.convertedToLead ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">已提交询盘</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">仅浏览</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#DCE4EA] bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#0B2D5B]">{value}</p>
    </div>
  );
}
