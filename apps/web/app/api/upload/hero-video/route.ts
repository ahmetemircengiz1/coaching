import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKETS, ensureBucket } from "@/lib/supabase/storage";
import {
  checkRateLimitAsync,
  rateLimitResponse,
  getClientKey,
  UPLOAD_LIMIT,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

// Vercel'in 4.5MB istek limiti yüzünden video DOSYASI buraya gelmez:
// bu uç yalnızca imzalı yükleme adresi üretir, istemci videoyu doğrudan
// Supabase Storage'a yükler (limitten etkilenmez).
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

    const body = (await request.json().catch(() => null)) as
      | { contentType?: string; size?: number }
      | null;
    const contentType = body?.contentType || "";
    const size = Number(body?.size) || 0;

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Sadece MP4, WebM veya MOV video yüklenebilir" },
        { status: 400 }
      );
    }

    if (size <= 0 || size > MAX_HERO_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Video boyutu 50MB'dan büyük olamaz" },
        { status: 400 }
      );
    }

    await ensureBucket(STORAGE_BUCKETS.heroVideos, {
      fileSizeLimit: MAX_HERO_VIDEO_BYTES,
      allowedMimeTypes: ALLOWED_TYPES,
    });

    const ext = extensionFromMimeType(contentType);
    const path = `${user.id}/hero/${randomUUID()}.${ext}`;

    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(STORAGE_BUCKETS.heroVideos)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Hero video sign error:", error);
      return NextResponse.json(
        { error: "Yükleme adresi oluşturulamadı. Lütfen tekrar deneyin." },
        { status: 500 }
      );
    }

    const { data: pub } = admin.storage
      .from(STORAGE_BUCKETS.heroVideos)
      .getPublicUrl(path);

    return NextResponse.json({
      path,
      token: data.token,
      publicUrl: pub.publicUrl,
    });
  } catch (err) {
    console.error("Hero video upload error:", err);
    return NextResponse.json(
      { error: "Video yüklenirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
