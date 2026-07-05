import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { processHeroImage } from "@/lib/media/hero-image-pipeline";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, uploadFile } from "@/lib/supabase/storage";
import { checkRateLimitAsync, rateLimitResponse, getClientKey, UPLOAD_LIMIT } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_HERO_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB — allow high-res photos
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function extensionFromMimeType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

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

    if (file.size > MAX_HERO_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Dosya boyutu 15MB'dan buyuk olamaz" },
        { status: 400 },
      );
    }

    const input = Buffer.from(await file.arrayBuffer());

    // Accept optional focal point for smart mobile crop
    const focalXRaw = formData.get("focalX");
    const focalYRaw = formData.get("focalY");
    const focalX = focalXRaw ? Number(focalXRaw) : 50;
    const focalY = focalYRaw ? Number(focalYRaw) : 50;

    const processed = await processHeroImage(input, focalX, focalY);
    const ext = extensionFromMimeType(file.type);
    const assetId = `${user.id}/hero/${randomUUID()}`;
    const originalPath = `${assetId}/original.${ext}`;
    const mobilePath = `${assetId}/mobile.jpg`;
    const cutoutPath = `${assetId}/cutout.webp`;

    // Desktop = ORIGINAL file, zero quality loss.
    // Mobile = processed portrait crop for phone screens.
    const uploadPromises: Promise<string>[] = [
      uploadFile(STORAGE_BUCKETS.heroes, originalPath, input, file.type),
      uploadFile(STORAGE_BUCKETS.heroes, mobilePath, processed.mobileBuffer, "image/jpeg"),
    ];

    // Upload cutout if background removal succeeded
    if (processed.cutoutBuffer) {
      uploadPromises.push(
        uploadFile(STORAGE_BUCKETS.heroes, cutoutPath, processed.cutoutBuffer, "image/webp"),
      );
    }

    const urls = await Promise.all(uploadPromises);
    const [originalUrl, mobileUrl] = urls;
    const cutoutUrl = processed.cutoutBuffer ? urls[2] : null;

    // Desktop URL = original file (no re-encoding, maximum quality)
    const desktopUrl = originalUrl;

    return NextResponse.json({
      url: originalUrl,
      heroImageOriginalUrl: originalUrl,
      heroImageDesktopUrl: desktopUrl,
      heroImageMobileUrl: mobileUrl,
      heroImageCutoutUrl: cutoutUrl,
      heroImageBlurDataUrl: processed.blurDataUrl,
      heroFocalX: focalX,
      heroFocalY: focalY,
      heroMode: processed.autoHeroMode,
      heroImageDark: processed.heroImageDark,
      diagnostics: {
        originalWidth: processed.originalWidth,
        originalHeight: processed.originalHeight,
        isLowResolution: processed.isLowResolution,
        hasCutout: !!cutoutUrl,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Hero fotograf islenirken bir hata olustu. Lutfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
