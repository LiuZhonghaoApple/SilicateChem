import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const imageLimit = 20 * 1024 * 1024;
const videoLimit = 200 * 1024 * 1024;

function safeFileName(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120) || "asset";
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "媒体存储尚未配置：请在 Vercel 添加 BLOB_READ_WRITE_TOKEN，或先使用外部素材 URL。" },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "请选择图片或视频文件。" }, { status: 400 });

  const isImage = imageTypes.has(file.type);
  const isVideo = videoTypes.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "仅支持 JPG、PNG、WebP、MP4、WebM 或 MOV。" }, { status: 400 });
  }
  const limit = isImage ? imageLimit : videoLimit;
  if (file.size <= 0 || file.size > limit) {
    return NextResponse.json(
      { error: `${isImage ? "图片" : "视频"}大小不能超过 ${isImage ? "20MB" : "200MB"}。` },
      { status: 400 }
    );
  }

  try {
    const pathname = `media-ai/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      kind: isImage ? "image" : "video",
      uploadedBy: session.username,
    });
  } catch (error) {
    console.error("[MEDIA_AI_UPLOAD]", error);
    return NextResponse.json({ error: "素材上传失败，请检查 Vercel Blob 配置后重试。" }, { status: 502 });
  }
}
