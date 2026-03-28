import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { processHeroImage } from "@/lib/media/hero-image-pipeline";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, uploadFile } from "@/lib/supabase/storage";

export const runtime = "nodejs";

const MAX_HERO_IMAGE_BYTES = 10 * 1024 * 1024;
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
        { error: "Dosya boyutu 10MB'dan buyuk olamaz" },
        { status: 400 },
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const processed = await processHeroImage(input);
    const ext = extensionFromMimeType(file.type);
    const assetId = `${user.id}/hero/${randomUUID()}`;
    const originalPath = `${assetId}/original.${ext}`;
    const desktopPath = `${assetId}/desktop.webp`;
    const mobilePath = `${assetId}/mobile.webp`;
    const cutoutPath = `${assetId}/cutout.webp`;

    // Upload original + desktop + mobile
    const uploadPromises: Promise<string>[] = [
      uploadFile(STORAGE_BUCKETS.heroes, originalPath, input, file.type),
      uploadFile(STORAGE_BUCKETS.heroes, desktopPath, processed.desktopBuffer, "image/webp"),
      uploadFile(STORAGE_BUCKETS.heroes, mobilePath, processed.mobileBuffer, "image/webp"),
    ];

    // Upload cutout if background removal succeeded
    if (processed.cutoutBuffer) {
      uploadPromises.push(
        uploadFile(STORAGE_BUCKETS.heroes, cutoutPath, processed.cutoutBuffer, "image/webp"),
      );
    }

    const urls = await Promise.all(uploadPromises);
    const [originalUrl, desktopUrl, mobileUrl] = urls;
    const cutoutUrl = processed.cutoutBuffer ? urls[3] : null;

    return NextResponse.json({
      url: originalUrl,
      heroImageOriginalUrl: originalUrl,
      heroImageDesktopUrl: desktopUrl,
      heroImageMobileUrl: mobileUrl,
      heroImageCutoutUrl: cutoutUrl,
      heroImageBlurDataUrl: processed.blurDataUrl,
      heroFocalX: 50,
      heroFocalY: 35,
      heroMode: processed.autoHeroMode,
      diagnostics: {
        originalWidth: processed.originalWidth,
        originalHeight: processed.originalHeight,
        isLowResolution: processed.isLowResolution,
        hasCutout: !!cutoutUrl,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: `Hero image islenemedi: ${message}` }, { status: 500 });
  }
}
