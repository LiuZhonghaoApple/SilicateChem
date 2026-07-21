import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLeadById,
  getLeadNotes,
  getLeadStatusHistory,
  leadPriorities,
  leadStatuses,
} from "@/lib/crm/repository";
import {
  formatAdminDate,
  leadPriorityLabels,
  leadStatusClasses,
  leadStatusLabels,
  toChinaDateTimeLocal,
} from "@/lib/crm/presentation";
import { addLeadNoteAction, updateLeadAction } from "../actions";

export const dynamic = "force-dynamic";

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</dt>
      <dd className="mt-1 break-words text-sm text-[#1E293B]">{value || "—"}</dd>
    </div>
  );
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, notes, history] = await Promise.all([
    getLeadById(id),
    getLeadNotes(id),
    getLeadStatusHistory(id),
  ]);
  if (!lead) notFound();

  const whatsappText = encodeURIComponent(
    `Hello ${lead.name}, thank you for your inquiry about ${lead.product ?? "sodium metasilicate"}. This is SilicateChem sales. We would like to confirm your specification, quantity, packing and destination requirements.`
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/inquiries" className="text-sm font-semibold text-[#2E7D9A] hover:underline">
            ← 返回询盘列表
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[#0B2D5B]">{lead.company} · {lead.name}</h1>
          <p className="mt-1 text-sm text-[#64748B]">{lead.id} · {formatAdminDate(lead.submittedAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${leadStatusClasses[lead.status]}`}>
            {leadStatusLabels[lead.status]}
          </span>
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: SilicateChem inquiry — ${lead.product ?? "Sodium Metasilicate"}`)}`}
            className="rounded-lg border border-[#0B2D5B] px-3 py-2 text-sm font-bold text-[#0B2D5B] hover:bg-[#EAF4FA]"
          >
            邮件回复
          </a>
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-bold text-white hover:bg-[#1FBD59]"
          >
            WhatsApp草稿
          </a>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#0B2D5B]">询盘内容</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="联系人" value={lead.name} />
              <DetailItem label="邮箱" value={<a href={`mailto:${lead.email}`} className="text-[#2E7D9A] hover:underline">{lead.email}</a>} />
              <DetailItem label="公司" value={lead.company} />
              <DetailItem label="国家" value={lead.country} />
              <DetailItem label="产品" value={lead.product} />
              <DetailItem label="数量" value={lead.quantity} />
              <DetailItem label="询盘类型" value={lead.inquiryType} />
              <DetailItem label="邮件状态" value={lead.emailDeliveryStatus} />
              <DetailItem label="首次响应" value={formatAdminDate(lead.firstContactedAt)} />
            </dl>
            <div className="mt-5 rounded-lg bg-[#F8FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">买家需求</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#334155]">{lead.message}</p>
            </div>
          </section>

          <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#0B2D5B]">精准来源归因</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailItem label="提交页面" value={lead.sourcePath ?? lead.sourcePage} />
              <DetailItem label="首次落地页" value={lead.landingPage} />
              <DetailItem label="Referrer" value={lead.referrer} />
              <DetailItem label="漏斗层级" value={lead.funnelLayer} />
              <DetailItem label="UTM Source / Medium" value={[lead.utmSource, lead.utmMedium].filter(Boolean).join(" / ")} />
              <DetailItem label="UTM Campaign" value={lead.utmCampaign} />
              <DetailItem label="UTM Term" value={lead.utmTerm} />
              <DetailItem label="Visitor ID" value={lead.visitorId} />
              <DetailItem label="GEO / AI 来源" value={lead.geoSource} />
              <DetailItem label="AI Referrer Host" value={lead.geoReferrerHost} />
              <DetailItem label="AI 首次落地路径" value={lead.geoLandingPath} />
            </dl>
          </section>

          <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#0B2D5B]">跟进备注</h2>
            <form action={addLeadNoteAction} className="mt-4">
              <input type="hidden" name="id" value={lead.id} />
              <textarea
                name="body"
                required
                maxLength={2_000}
                rows={4}
                placeholder="记录客户反馈、报价重点、下一步谈判事项……"
                className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm outline-none focus:border-[#2E7D9A]"
              />
              <button className="mt-2 rounded-lg bg-[#0B2D5B] px-4 py-2.5 text-sm font-bold text-white">
                添加备注
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {notes.length === 0 ? <p className="text-sm text-[#64748B]">暂无备注。</p> : notes.map((note) => (
                <article key={note.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[#334155]">{note.body}</p>
                  <p className="mt-2 text-xs text-[#64748B]">{note.author} · {formatAdminDate(note.createdAt)}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#0B2D5B]">销售处理</h2>
            <form action={updateLeadAction} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={lead.id} />
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#475569]">状态</label>
                <select name="status" defaultValue={lead.status} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm">
                  {leadStatuses.map((status) => <option key={status} value={status}>{leadStatusLabels[status]}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#475569]">优先级</label>
                <select name="priority" defaultValue={lead.priority} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm">
                  {leadPriorities.map((priority) => <option key={priority} value={priority}>{leadPriorityLabels[priority]}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#475569]">负责人</label>
                <input name="owner" defaultValue={lead.owner ?? ""} maxLength={120} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#475569]">下次跟进时间（北京时间）</label>
                <input name="nextFollowUpAt" type="datetime-local" defaultValue={toChinaDateTimeLocal(lead.nextFollowUpAt)} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#475569]">丢单原因</label>
                <textarea name="lostReason" defaultValue={lead.lostReason ?? ""} maxLength={500} rows={3} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm" />
              </div>
              <button className="w-full rounded-lg bg-[#0B2D5B] px-4 py-3 text-sm font-bold text-white hover:bg-[#071F3F]">
                保存销售进度
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#0B2D5B]">状态历史</h2>
            <div className="mt-4 space-y-4 border-l-2 border-[#D7E6EF] pl-4">
              {history.map((item) => (
                <div key={item.id}>
                  <p className="text-sm font-semibold text-[#334155]">
                    {item.fromStatus ? `${leadStatusLabels[item.fromStatus as keyof typeof leadStatusLabels] ?? item.fromStatus} → ` : ""}
                    {leadStatusLabels[item.toStatus as keyof typeof leadStatusLabels] ?? item.toStatus}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">{item.changedBy} · {formatAdminDate(item.changedAt)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
