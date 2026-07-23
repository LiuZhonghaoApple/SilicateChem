"use client";

/* eslint-disable @next/next/no-img-element -- user-uploaded Blob URLs are runtime data. */

import { useMemo, useState } from "react";
import type {
  MediaAiAsset,
  MediaAiAssetType,
  MediaAiDraft,
  MediaAiPriority,
  MediaAiStatus,
  MediaAiSummary,
  MediaAiTask,
} from "@/lib/media-ai/repository";

type UploadedAsset = {
  kind: "image" | "video";
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

type DraftState = {
  title: string;
  caption: string;
  altText: string;
  seoTitle: string;
  seoDescription: string;
  transcript: string;
  evidenceGaps: string[];
  riskFlags: string[];
};

const inputClass = "w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none focus:border-[#159A9C] focus:ring-2 focus:ring-[#159A9C]/15";
const labelClass = "mb-1.5 block text-xs font-bold text-[#475569]";

const statusLabels: Record<MediaAiStatus, string> = {
  draft: "草稿",
  in_progress: "制作中",
  human_review: "HUMAN REVIEW",
  pass: "PASS",
  blocked: "BLOCKED",
};

const statusClasses: Record<MediaAiStatus, string> = {
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-800",
  human_review: "border-amber-200 bg-amber-50 text-amber-900",
  pass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
};

function emptyDraft(): DraftState {
  return {
    title: "",
    caption: "",
    altText: "",
    seoTitle: "",
    seoDescription: "",
    transcript: "",
    evidenceGaps: [],
    riskFlags: [],
  };
}

function normaliseDraft(value: MediaAiDraft | null | undefined): DraftState {
  return {
    title: value?.title ?? "",
    caption: value?.caption ?? "",
    altText: value?.altText ?? "",
    seoTitle: value?.seoTitle ?? "",
    seoDescription: value?.seoDescription ?? "",
    transcript: value?.transcript ?? "",
    evidenceGaps: value?.evidenceGaps ?? [],
    riskFlags: value?.riskFlags ?? [],
  };
}

function taskAsset(task: MediaAiTask | null): MediaAiAsset | null {
  return task?.assets[0] ?? null;
}

function displayDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function updateTask(tasks: MediaAiTask[], next: MediaAiTask): MediaAiTask[] {
  return tasks.some((item) => item.id === next.id)
    ? tasks.map((item) => (item.id === next.id ? next : item))
    : [next, ...tasks];
}

export default function MediaAiWorkbench({
  initialTasks,
  initialSummary,
}: {
  initialTasks: MediaAiTask[];
  initialSummary: MediaAiSummary;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [summary, setSummary] = useState(initialSummary);
  const [selectedId, setSelectedId] = useState(initialTasks[0]?.id ?? "");
  const [createForm, setCreateForm] = useState({
    title: "",
    objective: "",
    targetIcp: "",
    targetPage: "",
    productLine: "",
    primaryKeyword: "",
    assetType: "image" as MediaAiAssetType,
    priority: "normal" as MediaAiPriority,
    brief: "",
    evidenceRefs: "",
  });
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [draft, setDraft] = useState<DraftState>(emptyDraft());
  const [reviewerNote, setReviewerNote] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selected = useMemo(() => tasks.find((item) => item.id === selectedId) ?? null, [selectedId, tasks]);
  const selectedStoredAsset = taskAsset(selected);

  function setNoticeMessage(type: "success" | "error", text: string) {
    setNotice({ type, text });
  }

  function selectTask(task: MediaAiTask) {
    setSelectedId(task.id);
    setDraft(normaliseDraft(task.aiDraft));
    setReviewerNote(task.reviewerNote ?? "");
    setNotice(null);
  }

  async function uploadFile(file: File): Promise<UploadedAsset | null> {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setNoticeMessage("error", "仅支持图片或视频文件。");
      return null;
    }
    setBusy("upload");
    setNotice(null);
    setLocalPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/admin/media-ai/upload", { method: "POST", body: formData });
      const payload = (await response.json()) as UploadedAsset & { error?: string };
      if (!response.ok) {
        setNoticeMessage("error", payload.error ?? "素材上传失败。");
        return null;
      }
      const asset = {
        kind: payload.kind,
        url: payload.url,
        fileName: payload.fileName,
        contentType: payload.contentType,
        sizeBytes: payload.sizeBytes,
      };
      setUploadedAsset(asset);
      setNoticeMessage("success", "素材已上传到受保护的媒体存储，可继续创建任务或挂接到当前任务。");
      return asset;
    } catch {
      setNoticeMessage("error", "素材上传网络异常，请重试。");
      return null;
    } finally {
      setBusy("");
    }
  }

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("create");
    setNotice(null);
    const evidenceRefs = createForm.evidenceRefs
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    try {
      const response = await fetch("/api/admin/media-ai/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          targetPage: createForm.targetPage || null,
          productLine: createForm.productLine || null,
          primaryKeyword: createForm.primaryKeyword || null,
          evidenceRefs,
          asset: uploadedAsset
            ? {
                kind: uploadedAsset.kind,
                storageUrl: uploadedAsset.url,
                fileName: uploadedAsset.fileName,
                contentType: uploadedAsset.contentType,
                sizeBytes: uploadedAsset.sizeBytes,
              }
            : null,
        }),
      });
      const payload = (await response.json()) as { task?: MediaAiTask; error?: string };
      if (!response.ok || !payload.task) {
        setNoticeMessage("error", payload.error ?? "任务创建失败。");
        return;
      }
      setTasks((current) => updateTask(current, payload.task as MediaAiTask));
      setSelectedId(payload.task.id);
      setDraft(emptyDraft());
      setReviewerNote("");
      setSummary((current) => ({ ...current, total: current.total + 1, draft: current.draft + 1 }));
      setCreateForm((current) => ({ ...current, title: "", brief: "", evidenceRefs: "" }));
      setUploadedAsset(null);
      setLocalPreview("");
      setNoticeMessage("success", "工作项已创建，默认进入草稿；不会自动发布。");
    } catch {
      setNoticeMessage("error", "任务创建网络异常，请重试。");
    } finally {
      setBusy("");
    }
  }

  async function generateDraft() {
    if (!selected) return;
    setBusy("generate");
    setNotice(null);
    try {
      const response = await fetch("/api/admin/media-ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selected.title,
          objective: selected.objective,
          targetIcp: selected.targetIcp,
          targetPage: selected.targetPage,
          productLine: selected.productLine,
          primaryKeyword: selected.primaryKeyword,
          assetType: selected.assetType,
          brief: selected.brief,
          evidenceRefs: selected.evidenceRefs,
        }),
      });
      const payload = (await response.json()) as { draft?: MediaAiDraft; error?: string };
      if (!response.ok || !payload.draft) {
        setNoticeMessage("error", payload.error ?? "AI生成失败。");
        return;
      }
      setDraft(normaliseDraft(payload.draft));
      setNoticeMessage("success", "AI草稿已生成，仅作为 HUMAN REVIEW 输入，不代表事实已通过。");
    } catch {
      setNoticeMessage("error", "AI生成网络异常，请重试或人工填写。");
    } finally {
      setBusy("");
    }
  }

  async function updateStatus(status: MediaAiStatus) {
    if (!selected) return;
    setBusy(`status-${status}`);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/media-ai/tasks/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewerNote: reviewerNote || null, aiDraft: draft }),
      });
      const payload = (await response.json()) as { task?: MediaAiTask; error?: string };
      if (!response.ok || !payload.task) {
        setNoticeMessage("error", payload.error ?? "审核状态保存失败。");
        return;
      }
      const nextTask = payload.task;
      setTasks((current) => updateTask(current, nextTask));
      setSummary((current) => {
        const next = { ...current };
        for (const key of ["draft", "inProgress", "humanReview", "pass", "blocked"] as const) {
          next[key] = tasks.filter((item) => item.status === key && item.id !== selected.id).length;
        }
        const statusKey = status === "in_progress" ? "inProgress" : status === "human_review" ? "humanReview" : status;
        next[statusKey] += 1;
        return next;
      });
      setNoticeMessage("success", `审核状态已更新为 ${statusLabels[status]}。未执行任何发布动作。`);
    } catch {
      setNoticeMessage("error", "审核状态网络异常，请重试。");
    } finally {
      setBusy("");
    }
  }

  async function attachUploadedAsset() {
    if (!selected || !uploadedAsset) return;
    setBusy("attach");
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/media-ai/tasks/${selected.id}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: uploadedAsset.kind,
          storageUrl: uploadedAsset.url,
          fileName: uploadedAsset.fileName,
          contentType: uploadedAsset.contentType,
          sizeBytes: uploadedAsset.sizeBytes,
        }),
      });
      const payload = (await response.json()) as { task?: MediaAiTask; error?: string };
      if (!response.ok || !payload.task) {
        setNoticeMessage("error", payload.error ?? "素材挂接失败。");
        return;
      }
      setTasks((current) => updateTask(current, payload.task as MediaAiTask));
      setUploadedAsset(null);
      setLocalPreview("");
      setNoticeMessage("success", "素材已挂接到当前任务，仍需事实证据与人工审核。");
    } catch {
      setNoticeMessage("error", "素材挂接网络异常，请重试。");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#159A9C]">Internal production desk</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0B2D5B]">AI 物料制作工作台</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">图片、视频、字幕、SEO 文案和事实证据的统一生产队列。PASS 只是内部审核通过，不会自动发布。</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">后台登录保护 · 人工发布</span>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ["全部任务", summary.total, "border-[#DCE4EA]"],
          ["草稿", summary.draft, "border-slate-200"],
          ["制作中", summary.inProgress, "border-blue-200"],
          ["HUMAN REVIEW", summary.humanReview, "border-amber-200"],
          ["PASS", summary.pass, "border-emerald-200"],
          ["BLOCKED", summary.blocked, "border-red-200"],
        ].map(([label, value, border]) => (
          <article key={String(label)} className={`rounded-xl border bg-white p-4 shadow-sm ${border}`}>
            <p className="text-xs font-bold text-[#64748B]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[#0B2D5B]">{value}</p>
          </article>
        ))}
      </section>

      {notice ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {notice.text}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(300px,0.9fr)_minmax(360px,1.2fr)]">
        <section className="rounded-2xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-bold text-[#0B2D5B]">新建制作任务</h2><p className="mt-1 text-xs text-[#64748B]">先锁定买家、目标页面和证据</p></div>
            <span className="rounded-full bg-[#EAF4FA] px-2.5 py-1 text-[11px] font-bold text-[#0B2D5B]">MVP</span>
          </div>
          <form onSubmit={createTask} className="mt-5 space-y-3">
            <div><label className={labelClass}>任务名称 *</label><input className={inputClass} required value={createForm.title} onChange={(event) => setCreateForm({ ...createForm, title: event.target.value })} placeholder="例如：偏硅酸钠发货现场短视频" /></div>
            <div><label className={labelClass}>业务目标 *</label><input className={inputClass} required value={createForm.objective} onChange={(event) => setCreateForm({ ...createForm, objective: event.target.value })} placeholder="提升产品页信任并促进 RFQ" /></div>
            <div><label className={labelClass}>目标 ICP *</label><input className={inputClass} required value={createForm.targetIcp} onChange={(event) => setCreateForm({ ...createForm, targetIcp: event.target.value })} placeholder="洗涤剂配方采购经理 / 分销商" /></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div><label className={labelClass}>产品线</label><input className={inputClass} value={createForm.productLine} onChange={(event) => setCreateForm({ ...createForm, productLine: event.target.value })} placeholder="Sodium Metasilicate" /></div>
              <div><label className={labelClass}>主关键词</label><input className={inputClass} value={createForm.primaryKeyword} onChange={(event) => setCreateForm({ ...createForm, primaryKeyword: event.target.value })} placeholder="sodium metasilicate" /></div>
            </div>
            <div><label className={labelClass}>目标页面 URL</label><input className={inputClass} type="url" value={createForm.targetPage} onChange={(event) => setCreateForm({ ...createForm, targetPage: event.target.value })} placeholder="https://www.silicatechem.com/products/..." /></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div><label className={labelClass}>素材类型</label><select className={inputClass} value={createForm.assetType} onChange={(event) => setCreateForm({ ...createForm, assetType: event.target.value as MediaAiAssetType })}><option value="image">图片</option><option value="video">视频</option><option value="both">图片 + 视频</option></select></div>
              <div><label className={labelClass}>优先级</label><select className={inputClass} value={createForm.priority} onChange={(event) => setCreateForm({ ...createForm, priority: event.target.value as MediaAiPriority })}><option value="normal">普通</option><option value="high">高</option><option value="urgent">紧急</option></select></div>
            </div>
            <div><label className={labelClass}>素材与买家说明 *</label><textarea className={`${inputClass} min-h-24`} required value={createForm.brief} onChange={(event) => setCreateForm({ ...createForm, brief: event.target.value })} placeholder="写清视频中可确认的场景、不能声称的内容、买家关心的采购问题。" /></div>
            <div><label className={labelClass}>事实证据（每行一条 URL、文件名或内部记录）</label><textarea className={`${inputClass} min-h-20`} value={createForm.evidenceRefs} onChange={(event) => setCreateForm({ ...createForm, evidenceRefs: event.target.value })} placeholder="/public/downloads/...\n内部批次记录编号（待人工核验）" /></div>
            <div>
              <label className={labelClass}>上传图片 / 视频</label>
              <input className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#EAF4FA] file:px-2 file:py-1 file:text-xs file:font-bold`} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); }} />
              {busy === "upload" ? <p className="mt-1 text-xs text-[#159A9C]">上传中…</p> : null}
              {uploadedAsset ? <p className="mt-1 truncate text-xs text-emerald-700">已就绪：{uploadedAsset.fileName}</p> : null}
            </div>
            {localPreview ? <div className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-slate-50 p-2">{uploadedAsset?.kind === "video" ? <video src={localPreview} controls className="max-h-40 w-full rounded-lg" /> : <img src={localPreview} alt="待上传素材预览" className="max-h-40 w-full rounded-lg object-contain" />}</div> : null}
            <button disabled={busy !== ""} className="w-full rounded-lg bg-[#0B2D5B] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#071F3F] disabled:cursor-not-allowed disabled:opacity-60">{busy === "create" ? "保存中…" : "创建工作项（草稿）"}</button>
          </form>
        </section>

        <section className="min-w-0 rounded-2xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-[#0B2D5B]">任务队列</h2><p className="mt-1 text-xs text-[#64748B]">按优先级与更新时间排序，点击查看制作详情</p></div><span className="text-xs text-[#64748B]">{tasks.length} 条</span></div>
          <div className="mt-4 space-y-3">
            {tasks.length === 0 ? <div className="rounded-xl border border-dashed border-[#CBD5E1] p-8 text-center text-sm text-[#64748B]">还没有制作任务，从左侧创建第一条。</div> : tasks.map((task) => {
              const asset = taskAsset(task);
              return <button key={task.id} type="button" onClick={() => selectTask(task)} className={`w-full rounded-xl border p-4 text-left transition ${selectedId === task.id ? "border-[#159A9C] bg-[#F0FBFB] shadow-sm" : "border-[#E2E8F0] hover:border-[#94A3B8]"}`}>
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-bold text-[#0B2D5B]">{task.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#64748B]">{task.targetIcp} · {task.primaryKeyword || "未设关键词"}</p></div><span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${statusClasses[task.status]}`}>{statusLabels[task.status]}</span></div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]"><span>{task.assetType === "both" ? "图片+视频" : task.assetType === "image" ? "图片" : "视频"}</span><span>·</span><span>{task.priority === "urgent" ? "紧急" : task.priority === "high" ? "高优先级" : "普通"}</span><span>·</span><span>{asset ? "已有素材" : "待上传"}</span><span className="ml-auto">{displayDate(task.updatedAt)}</span></div>
              </button>;
            })}
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-[#DCE4EA] bg-white p-5 shadow-sm">
          {!selected ? <div className="flex min-h-[420px] items-center justify-center text-center text-sm text-[#64748B]">从中间队列选择一个任务，查看素材、AI草稿和审核面板。</div> : <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#159A9C]">Selected task</p><h2 className="mt-1 text-xl font-bold text-[#0B2D5B]">{selected.title}</h2><p className="mt-1 text-xs text-[#64748B]">{selected.objective} · {selected.targetIcp}</p></div><span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClasses[selected.status]}`}>{statusLabels[selected.status]}</span></div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-[#DCE4EA] bg-[#F8FAFC]">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-3 py-2"><p className="text-xs font-bold text-[#475569]">素材预览</p><span className="text-[11px] text-[#64748B]">{selectedStoredAsset?.fileName ?? "暂无持久化素材"}</span></div>
                <div className="flex min-h-44 items-center justify-center p-3">{selectedStoredAsset?.contentType?.startsWith("video/") ? <video src={selectedStoredAsset.storageUrl} controls className="max-h-56 w-full rounded-lg" /> : selectedStoredAsset ? <img src={selectedStoredAsset.storageUrl} alt={selectedStoredAsset.altText ?? selected.title} className="max-h-56 w-full rounded-lg object-contain" /> : <div className="text-center text-xs text-[#94A3B8]">请上传图片 / 视频<br />支持当前任务继续挂接素材</div>}</div>
                <div className="border-t border-[#E2E8F0] p-3"><input className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#EAF4FA] file:px-2 file:py-1 file:text-xs file:font-bold`} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); }} />{uploadedAsset ? <button type="button" disabled={busy !== ""} onClick={() => void attachUploadedAsset()} className="mt-2 w-full rounded-lg border border-[#159A9C] px-3 py-2 text-xs font-bold text-[#0B7779] disabled:opacity-50">{busy === "attach" ? "挂接中…" : "挂接到当前任务"}</button> : null}</div>
              </div>
              <div className="rounded-xl border border-[#DCE4EA] bg-white p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-[#475569]">AI 任务面板</p><button type="button" onClick={() => void generateDraft()} disabled={busy !== ""} className="rounded-lg bg-[#159A9C] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{busy === "generate" ? "生成中…" : "生成草稿"}</button></div><p className="mt-2 text-xs leading-5 text-[#64748B]">模型只读取本任务输入和事实证据；生成结果必须人工复核，未配置 API Key 时可直接人工填写。</p><div className="mt-3 grid gap-2"><input className={inputClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="素材标题" /><textarea className={`${inputClass} min-h-20`} value={draft.caption} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} placeholder="买家视角 caption" /><input className={inputClass} value={draft.altText} onChange={(event) => setDraft({ ...draft, altText: event.target.value })} placeholder="图片 Alt text" /><input className={inputClass} value={draft.seoTitle} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} placeholder="SEO title" /><textarea className={`${inputClass} min-h-16`} value={draft.seoDescription} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} placeholder="SEO description" /><textarea className={`${inputClass} min-h-20`} value={draft.transcript} onChange={(event) => setDraft({ ...draft, transcript: event.target.value })} placeholder="字幕 / transcript" /></div></div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2"><div className="rounded-xl border border-[#DCE4EA] p-4"><p className="text-xs font-bold text-[#475569]">事实证据</p><ul className="mt-2 space-y-1 text-xs leading-5 text-[#64748B]">{selected.evidenceRefs.length ? selected.evidenceRefs.map((item) => <li key={item} className="break-all">• {item}</li>) : <li>• 尚未提供证据；涉及工厂、发货、客户、证书或性能的表达应保持 BLOCKED。</li>}</ul>{draft.evidenceGaps.length ? <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><p className="font-bold">待补证据</p>{draft.evidenceGaps.map((item) => <p key={item} className="mt-1">• {item}</p>)}</div> : null}{draft.riskFlags.length ? <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-800"><p className="font-bold">风险提示</p>{draft.riskFlags.map((item) => <p key={item} className="mt-1">• {item}</p>)}</div> : null}</div><div className="rounded-xl border border-[#DCE4EA] p-4"><p className="text-xs font-bold text-[#475569]">审核记录</p><textarea className={`${inputClass} mt-2 min-h-24`} value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} placeholder="写清事实核验结论、需补拍内容或阻断原因" /><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={busy !== ""} onClick={() => void updateStatus("in_progress")} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 disabled:opacity-50">制作中</button><button type="button" disabled={busy !== ""} onClick={() => void updateStatus("human_review")} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 disabled:opacity-50">HUMAN REVIEW</button><button type="button" disabled={busy !== ""} onClick={() => void updateStatus("pass")} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 disabled:opacity-50">PASS</button><button type="button" disabled={busy !== ""} onClick={() => void updateStatus("blocked")} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800 disabled:opacity-50">BLOCKED</button></div><p className="mt-3 text-[11px] leading-5 text-[#64748B]">PASS 不等于发布；发布仍需业务人员在目标页面或渠道单独执行。</p></div></div>
          </div>}
        </section>
      </div>
    </div>
  );
}
