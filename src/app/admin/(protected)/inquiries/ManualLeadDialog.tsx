"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { products } from "@/content/products";
import { leadStatusLabels } from "@/lib/crm/presentation";
import { createManualLeadAction, type ManualLeadState } from "./actions";

const CHANNELS = ["WhatsApp", "Email", "Alibaba", "Exhibition", "Phone", "Referral", "Other"];
const REQUEST_TYPES: Array<{ value: string; label: string }> = [
  { value: "quote", label: "报价 Quote" },
  { value: "sample", label: "样品 Sample" },
  { value: "tds", label: "资料 COA/MSDS/TDS" },
  { value: "contact", label: "一般联系 Contact" },
];

const initialState: ManualLeadState = { ok: false };

const fieldClass =
  "w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#2E7D9A]";
const labelClass = "mb-1 block text-xs font-semibold text-[#334155]";

export function ManualLeadDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createManualLeadAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.ok, state.nonce]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[#0B2D5B] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#071F3F]"
      >
        + 人工录入
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="人工录入询盘"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B2D5B]">人工录入询盘</h2>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  把 WhatsApp、邮件、展会、电话等渠道的询盘录入 CRM 统一管理。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-2xl leading-none text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#334155]"
                aria-label="关闭"
              >
                ×
              </button>
            </div>

            <form ref={formRef} action={formAction} className="space-y-4 px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="ml-name">联系人 *</label>
                  <input id="ml-name" name="name" required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ml-company">公司 *</label>
                  <input id="ml-company" name="company" required className={fieldClass} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="ml-country">国家 *</label>
                  <input id="ml-country" name="country" required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ml-channel">来源渠道 *</label>
                  <select id="ml-channel" name="channel" defaultValue="WhatsApp" className={fieldClass}>
                    {CHANNELS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="ml-email">邮箱（可留空）</label>
                  <input id="ml-email" name="email" type="email" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ml-contact">其他联系方式（WhatsApp/电话）</label>
                  <input id="ml-contact" name="contactExtra" placeholder="如 +49 160 ..." className={fieldClass} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="ml-product">产品</label>
                  <select id="ml-product" name="product" defaultValue="" className={fieldClass}>
                    <option value="">未指定</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="ml-quantity">数量</label>
                  <input id="ml-quantity" name="quantity" placeholder="如 20 MT / 1 FCL" className={fieldClass} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="ml-type">询盘类型</label>
                  <select id="ml-type" name="requestType" defaultValue="quote" className={fieldClass}>
                    {REQUEST_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="ml-status">初始状态</label>
                  <select id="ml-status" name="status" defaultValue="new" className={fieldClass}>
                    {Object.entries(leadStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="ml-message">询盘内容 / 备注 *</label>
                <textarea
                  id="ml-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="客户需求、报价、沟通要点等。"
                  className={fieldClass}
                />
              </div>

              {state.error && !state.ok && (
                <p className="text-sm text-red-600">{state.error}</p>
              )}

              <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-[#0B2D5B] px-5 py-2 text-sm font-bold text-white hover:bg-[#071F3F] disabled:opacity-60"
                >
                  {pending ? "保存中…" : "保存录入"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
