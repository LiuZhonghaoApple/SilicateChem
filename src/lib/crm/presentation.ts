import type { LeadPaymentStatus, LeadPriority, LeadStatus } from "@/lib/crm/repository";

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "新询盘",
  pending: "待确认",
  qualified: "有效询盘",
  quoted: "已报价",
  sample: "寄样",
  negotiating: "谈判中",
  won: "成交",
  lost: "丢单",
  spam: "垃圾询盘",
};

export const leadPaymentStatusLabels: Record<LeadPaymentStatus, string> = {
  unpaid: "未回款",
  deposit: "已付定金",
  partial: "部分回款",
  paid: "已全部回款",
};

// Human-readable labels for conversion_events.event_name (used by the visitor
// timeline / anonymous-behaviour panel).
export const conversionEventLabels: Record<string, string> = {
  whatsapp_click: "点击WhatsApp",
  ai_advisor_open: "打开在线咨询",
  ai_advisor_question: "咨询提问",
  ai_advisor_answer: "咨询回复",
  ai_advisor_handoff: "转人工",
  rfq_start: "开始填写询盘",
  rfq_submit: "提交询盘",
};

export function conversionEventLabel(name: string): string {
  return conversionEventLabels[name] ?? name;
}

/** Compact USD money formatting for CRM commercial fields. */
export function formatMoney(value: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export const leadPriorityLabels: Record<LeadPriority, string> = {
  low: "低",
  normal: "普通",
  high: "高",
  urgent: "紧急",
};

export const leadStatusClasses: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  qualified: "bg-cyan-100 text-cyan-800",
  quoted: "bg-violet-100 text-violet-800",
  sample: "bg-indigo-100 text-indigo-800",
  negotiating: "bg-orange-100 text-orange-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-slate-200 text-slate-700",
  spam: "bg-red-100 text-red-800",
};

export function formatAdminDate(value: string | Date | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function toChinaDateTimeLocal(value: string | Date | null): string {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
