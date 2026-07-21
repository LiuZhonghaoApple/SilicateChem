import Link from "next/link";
import { leadStatuses, listLeads } from "@/lib/crm/repository";
import {
  formatAdminDate,
  leadPriorityLabels,
  leadStatusClasses,
  leadStatusLabels,
} from "@/lib/crm/presentation";

export const dynamic = "force-dynamic";

export default async function InquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const filters = await searchParams;
  const status = leadStatuses.includes(filters.status as (typeof leadStatuses)[number])
    ? filters.status
    : "";
  const query = filters.q?.slice(0, 120) ?? "";
  const leads = await listLeads({ status, query });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0B2D5B]">询盘管理</h1>
        <p className="mt-1 text-sm text-[#64748B]">按状态和联系人检索，进入详情后记录跟进与转化结果。</p>
      </div>

      <form className="grid gap-3 rounded-xl border border-[#DCE4EA] bg-white p-4 shadow-sm sm:grid-cols-[180px_minmax(220px,1fr)_auto]">
        <select name="status" defaultValue={status} className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm">
          <option value="">全部状态</option>
          {leadStatuses.map((item) => (
            <option key={item} value={item}>{leadStatusLabels[item]}</option>
          ))}
        </select>
        <input
          name="q"
          defaultValue={query}
          placeholder="搜索姓名、邮箱、公司或产品"
          className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-[#0B2D5B] px-5 py-2 text-sm font-bold text-white">筛选</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#DCE4EA] bg-white shadow-sm">
        <table className="min-w-[1050px] w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-4 py-3">提交时间</th>
              <th className="px-4 py-3">联系人 / 公司</th>
              <th className="px-4 py-3">产品 / 数量</th>
              <th className="px-4 py-3">来源页面</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">优先级</th>
              <th className="px-4 py-3">负责人</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top hover:bg-[#F8FAFC]">
                <td className="whitespace-nowrap px-4 py-4 text-xs text-[#64748B]">{formatAdminDate(lead.submittedAt)}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-[#0F172A]">{lead.name}</p>
                  <p className="mt-1 text-[#475569]">{lead.company}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{lead.country}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-[#334155]">{lead.product ?? "未指定"}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{lead.quantity ?? "—"}</p>
                </td>
                <td className="max-w-[230px] px-4 py-4">
                  <p className="truncate text-[#334155]">{lead.sourcePath ?? lead.sourcePage ?? "未知"}</p>
                  <p className="mt-1 truncate text-xs text-[#64748B]">{lead.utmSource ?? lead.referrer ?? "Direct / unknown"}</p>
                  {lead.geoSource ? (
                    <p className="mt-1 text-xs font-bold text-[#2E7D9A]">GEO · {lead.geoSource}</p>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${leadStatusClasses[lead.status]}`}>
                    {leadStatusLabels[lead.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4">{leadPriorityLabels[lead.priority]}</td>
                <td className="whitespace-nowrap px-4 py-4">{lead.owner ?? "未分配"}</td>
                <td className="px-4 py-4">
                  <Link href={`/admin/inquiries/${lead.id}`} className="font-bold text-[#2E7D9A] hover:underline">
                    查看详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 ? (
          <p className="p-10 text-center text-sm text-[#64748B]">没有符合条件的询盘。</p>
        ) : null}
      </div>
    </div>
  );
}
