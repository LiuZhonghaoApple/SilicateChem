"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { products } from "@/content/products";
import { createManualLeadAction, type ManualLeadState } from "./actions";

const CHANNELS = ["WhatsApp", "Email", "Alibaba", "Exhibition", "Phone", "Referral", "Other"];
const ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp,.gif," +
  "application/pdf,application/msword,image/*," +
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
  "application/vnd.ms-excel," +
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const initialState: ManualLeadState = { ok: false };

const fieldClass =
  "w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#2E7D9A]";
const labelClass = "mb-1 block text-xs font-semibold text-[#334155]";

type Attachment = { url: string; name: string };

export function ManualLeadDialog({ defaultOwner }: { defaultOwner: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createManualLeadAction, initialState);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setAttachments([]);
      setUploadError("");
      setOpen(false);
    }
  }, [state.ok, state.nonce]);

  async function onFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError("");
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/inquiries/attachment", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json().catch(() => ({}))) as {
          url?: string;
          name?: string;
          error?: string;
        };
        if (!res.ok || !data.url) {
          throw new Error(data.error || `上传失败（${res.status}）`);
        }
        setAttachments((cur) => [...cur, { url: data.url!, name: data.name || file.name }]);
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "附件上传失败，请重试。");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeAttachment(url: string) {
    setAttachments((cur) => cur.filter((a) => a.url !== url));
  }

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
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B2D5B]">人工录入询盘</h2>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  录入日期为今天（自动保存）。WhatsApp、邮件、展会等渠道统一收进 CRM。
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
              <input
                type="hidden"
                name="attachments"
                value={JSON.stringify(attachments)}
                readOnly
              />

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
                  <label className={labelClass} htmlFor="ml-product">产品</label>
                  <select id="ml-product" name="product" defaultValue="" className={fieldClass}>
                    <option value="">未指定</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="ml-owner">跟进人</label>
                  <input id="ml-owner" name="owner" defaultValue={defaultOwner} className={fieldClass} />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="ml-message">备注</label>
                <textarea
                  id="ml-message"
                  name="message"
                  rows={4}
                  placeholder="客户需求、报价、沟通要点、联系方式等。"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>附件（Word / Excel / PDF / 图片，可多选，单个≤4MB）</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPT}
                  onChange={(e) => void onFilesSelected(e.target.files)}
                  disabled={uploading}
                  className="block w-full text-sm text-[#334155] file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF4FA] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#0B2D5B] hover:file:bg-[#D7EAF4]"
                />
                {uploading && <p className="mt-1 text-xs text-[#64748B]">上传中…</p>}
                {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
                {attachments.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {attachments.map((a) => (
                      <li
                        key={a.url}
                        className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs"
                      >
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-medium text-[#2E7D9A] hover:underline"
                        >
                          {a.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeAttachment(a.url)}
                          className="ml-3 shrink-0 text-[#94A3B8] hover:text-red-600"
                          aria-label={`移除 ${a.name}`}
                        >
                          移除
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
                  disabled={pending || uploading}
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
