import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, uploadFile } from "@/lib/supabase/storage";
import { checkRateLimitAsync, rateLimitResponse, getClientKey, UPLOAD_LIMIT } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MOBILE_WIDTH = 1080;
const MOBILE_HEIGHT = 1440; // 3:4 portrait

/**
 * Separate mobile hero image upload.
 * Accepts a portrait photo, resizes to 1080×1440 (3:4), returns the mobile URL.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Yetkisiz - giris yapin" }, { status: 401 });
    }

    // Rate limit — per user, 20 uploads per 10 min
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
        { error: "Sadece JPEG, PNG ve WebP dosyalari yuklenebilir" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'dan buyuk olamaz" },
        { status: 400 },
      );
    }

    const input = Buffer.from(await file.arrayBuffer());

    // Resize/crop to portrait 3:4, high quality
    const mobileBuffer = await sharp(input)
      .rotate()
      .resize(MOBILE_WIDTH, MOBILE_HEIGHT, {
        fit: "cover",
        position: "attention", // smart crop — focus on interesting region
      })
      .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer();

    const mobilePath = `${user.id}/hero-mobile/${randomUUID()}.jpg`;
    const mobileUrl = await uploadFile(
      STORAGE_BUCKETS.heroes,
      mobilePath,
      mobileBuffer,
      "image/jpeg",
    );

    return NextResponse.json({
      heroImageMobileUrl: mobileUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Mobil hero yuklenirken bir hata olustu. Lutfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
