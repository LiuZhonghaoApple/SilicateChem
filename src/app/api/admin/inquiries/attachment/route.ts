import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/csv",
  "text/plain",
  "application/octet-stream",
]);

const ALLOWED_EXT = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".txt",
  ".jpg", ".jpeg", ".png", ".webp", ".gif",
]);

// Vercel serverless request body cap is ~4.5MB; stay safely under it.
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

function safeBaseName(value: string): string {
  const dot = value.lastIndexOf(".");
  const base = (dot >= 0 ? value.slice(0, dot) : value)
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return base || "file";
}

function extOf(value: string): string {
  const dot = value.lastIndexOf(".");
  return dot >= 0 ? value.slice(dot).toLowerCase() : "";
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "附件存储未配置（缺少 BLOB_READ_WRITE_TOKEN）。" },
      { status: 503 }
    );
  }

  let file: FormDataEntryValue | null;
  try {
    const formData = await request.formData();
    file = formData.get("file");
  } catch {
    return NextResponse.json({ error: "读取文件失败。" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择文件。" }, { status: 400 });
  }

  const ext = extOf(file.name);
  const typeOk = ALLOWED_CONTENT_TYPES.has(file.type) || ALLOWED_EXT.has(ext);
  if (!typeOk) {
    return NextResponse.json(
      { error: "仅支持 Word / Excel / PDF / 图片 / CSV / TXT。" },
      { status: 400 }
    );
  }
  if (file.size <= 0 || file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "单个附件不能超过 4MB。" },
      { status: 400 }
    );
  }

  try {
    const pathname = `lead-attachments/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeBaseName(file.name)}${ext}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return NextResponse.json({ url: blob.url, name: file.name });
  } catch (error) {
    console.error("[INQUIRY_ATTACHMENT]", error);
    return NextResponse.json(
      { error: "附件上传失败，请重试。" },
      { status: 502 }
    );
  }
}
