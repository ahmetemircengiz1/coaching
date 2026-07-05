import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  STORAGE_BUCKETS,
  ensureBucket,
  uploadFile,
} from "@/lib/supabase/storage";
import {
  checkRateLimitAsync,
  rateLimitResponse,
  getClientKey,
  UPLOAD_LIMIT,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_HERO_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function extensionFromMimeType(type: string): string {
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  return "mp4";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Yetkisiz - giriş yapın" }, { status: 401 });
    }

    const rl = await checkRateLimitAsync(getClientKey(request, user.id), UPLOAD_LIMIT);
    const blocked = rateLimitResponse(rl);
    if (blocked) return blocked;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece MP4, WebM veya MOV video yüklenebilir" },
        { status: 400 }
      );
    }

    if (file.size > MAX_HERO_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Video boyutu 50MB'dan büyük olamaz" },
        { status: 400 }
      );
    }

    await ensureBucket(STORAGE_BUCKETS.heroVideos, {
      fileSizeLimit: MAX_HERO_VIDEO_BYTES,
      allowedMimeTypes: ALLOWED_TYPES,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = extensionFromMimeType(file.type);
    const path = `${user.id}/hero/${randomUUID()}.${ext}`;
    const url = await uploadFile(
      STORAGE_BUCKETS.heroVideos,
      path,
      buffer,
      file.type
    );

    return NextResponse.json({ url, heroVideoUrl: url });
  } catch (err) {
    console.error("Hero video upload error:", err);
    return NextResponse.json(
      { error: "Video yüklenirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
