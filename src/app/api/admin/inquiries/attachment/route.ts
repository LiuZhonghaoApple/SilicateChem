import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Attachment types allowed on a manually-entered inquiry note: office docs,
// PDF, images, csv/text. octet-stream is included because some browsers send it
// for .docx/.xlsx.
const ALLOWED_CONTENT_TYPES = [
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
];

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB per file

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "附件存储未配置（缺少 BLOB_READ_WRITE_TOKEN）。" },
      { status: 503 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;
  try {
    // NOTE: do NOT gate the whole route on getAdminSession(). handleUpload
    // handles two request types: the token request (from the logged-in browser,
    // cookies present) and the upload-completed webhook (server-to-server from
    // Blob, NO cookies — verified by signature). Auth must live inside
    // onBeforeGenerateToken, which only runs for the token request; gating the
    // top would 401 the webhook and leave the client stuck on "uploading".
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getAdminSession();
        if (!session) throw new Error("Unauthorized");
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ user: session.username }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传失败" },
      { status: 400 }
    );
  }
}
