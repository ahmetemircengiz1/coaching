import sharp from "sharp";

type PixelStats = {
  alphaCoverage: number | null;
  dominantColorRatio: number;
};

export type HeroProcessingResult = {
  originalWidth: number;
  originalHeight: number;
  isLowResolution: boolean;
  autoHeroMode: "photo" | "logo";
  heroImageDark: boolean;
  mobileBuffer: Buffer;
  blurDataUrl: string;
  /** Transparent cutout version (person only, no background) */
  cutoutBuffer: Buffer | null;
};

// Desktop: original file is served directly — no processing needed.
// Mobile: smart portrait crop (3:4 ratio) centered on focal point for phone screens.
const MOBILE_WIDTH = 1080;
const MOBILE_HEIGHT = 1440; // 3:4 portrait ratio
const CUTOUT_HEIGHT = 1200;

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Compute an extract region for a portrait crop centered on (focalX%, focalY%).
 * Returns { left, top, width, height } in source-pixel coordinates.
 */
function computePortraitCrop(
  srcW: number,
  srcH: number,
  targetRatio: number, // width / height, e.g. 3/4 = 0.75
  focalXPct: number, // 0-100
  focalYPct: number, // 0-100
): { left: number; top: number; width: number; height: number } {
  // Determine the largest rectangle with the target ratio that fits in the source
  let cropW: number;
  let cropH: number;

  if (srcW / srcH > targetRatio) {
    // Source is wider than target ratio — crop width, keep full height
    cropH = srcH;
    cropW = Math.round(srcH * targetRatio);
  } else {
    // Source is taller or equal — crop height, keep full width
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
  }

  // Center the crop on the focal point
  const focalX = Math.round((focalXPct / 100) * srcW);
  const focalY = Math.round((focalYPct / 100) * srcH);

  let left = focalX - Math.round(cropW / 2);
  let top = focalY - Math.round(cropH / 2);

  // Clamp to image bounds
  left = Math.max(0, Math.min(left, srcW - cropW));
  top = Math.max(0, Math.min(top, srcH - cropH));

  return { left, top, width: cropW, height: cropH };
}

async function analyzeImageStats(input: Buffer): Promise<PixelStats> {
  const { data, info } = await sharp(input)
    .rotate()
    .ensureAlpha()
    .resize(96, 96, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const pixelCount = info.width * info.height;
  const bins = new Map<number, number>();
  let visiblePixels = 0;
  let alphaVisible = 0;

  for (let index = 0; index < data.length; index += channels) {
    const r = data[index] ?? 0;
    const g = data[index + 1] ?? 0;
    const b = data[index + 2] ?? 0;
    const a = data[index + 3] ?? 255;
    const visible = a > 16;

    if (visible) {
      visiblePixels += 1;
      alphaVisible += a / 255;
      const bucket =
        ((Math.round(r / 32) << 10) |
          (Math.round(g / 32) << 5) |
          Math.round(b / 32)) >>> 0;
      bins.set(bucket, (bins.get(bucket) ?? 0) + 1);
    }
  }

  const dominantColorRatio =
    visiblePixels > 0
      ? Math.max(...Array.from(bins.values(), (value) => value / visiblePixels))
      : 1;

  const alphaCoverage = pixelCount > 0 ? clamp01(alphaVisible / pixelCount) : null;

  return {
    alphaCoverage,
    dominantColorRatio,
  };
}

async function analyzeHeroBrightness(rotated: Buffer, w: number, h: number): Promise<boolean> {
  // Analyze the top-center region where hero text typically overlays
  const regionW = Math.max(1, Math.round(w * 0.6));
  const regionH = Math.max(1, Math.round(h * 0.5));
  const left = Math.round((w - regionW) / 2);

  const stats = await sharp(rotated)
    .extract({ left, top: 0, width: regionW, height: regionH })
    .stats();

  const rMean = stats.channels[0].mean;
  const gMean = stats.channels[1].mean;
  const bMean = stats.channels[2].mean;
  const luminance = 0.2126 * rMean + 0.7152 * gMean + 0.0722 * bMean;

  return luminance < 128; // true = dark image
}

function detectHeroMode(stats: PixelStats): "photo" | "logo" {
  const transparentLike =
    typeof stats.alphaCoverage === "number" && stats.alphaCoverage < 0.6;
  const emptySpaceLike = stats.dominantColorRatio > 0.65;

  if (transparentLike || emptySpaceLike) {
    return "logo";
  }

  return "photo";
}

async function removeBackground(input: Buffer): Promise<Buffer | null> {
  try {
    const { removeBackground: removeBg } = await import("@imgly/background-removal-node");
    const blob = new Blob([input as unknown as BlobPart], { type: "image/png" });
    const resultBlob = await removeBg(blob, {
      output: { format: "image/png", quality: 0.9 },
    });
    const arrayBuffer = await resultBlob.arrayBuffer();
    const pngBuffer = Buffer.from(arrayBuffer);

    // Resize to consistent height, maintain aspect ratio
    const cutoutBuffer = await sharp(pngBuffer)
      .resize({ height: CUTOUT_HEIGHT, withoutEnlargement: true })
      .webp({ quality: 92, effort: 4, nearLossless: true })
      .toBuffer();

    return cutoutBuffer;
  } catch (error) {
    console.error("Background removal failed:", error);
    return null;
  }
}

export async function processHeroImage(
  input: Buffer,
  focalXPct = 50,
  focalYPct = 50,
): Promise<HeroProcessingResult> {
  // Auto-rotate and get actual dimensions
  const rotated = await sharp(input).rotate().toBuffer();
  const meta = await sharp(rotated).metadata();
  const originalWidth = meta.width ?? 1920;
  const originalHeight = meta.height ?? 1080;

  // Compute smart portrait crop region centered on focal point
  const crop = computePortraitCrop(
    originalWidth,
    originalHeight,
    MOBILE_WIDTH / MOBILE_HEIGHT, // 0.75 = 3:4
    focalXPct,
    focalYPct,
  );

  // Run all processing in parallel (desktop = original, no processing needed)
  const [mobileBuffer, blurBuffer, analysis] = await Promise.all([
    // Mobile: smart 3:4 portrait crop centered on focal point, then resize to 1080×1440
    sharp(rotated)
      .extract(crop)
      .resize(MOBILE_WIDTH, MOBILE_HEIGHT, { fit: "fill" })
      .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer(),

    // Blur placeholder (proportional, no forced crop)
    sharp(rotated)
      .resize(64, undefined, { fit: "inside", withoutEnlargement: false })
      .blur(2.4)
      .webp({ quality: 20, effort: 2 })
      .toBuffer(),

    analyzeImageStats(input),
  ]);

  // Background removal disabled — too heavy for dev server
  const cutoutBuffer: Buffer | null = null;
  // Brightness analysis — determines overlay intensity for text readability
  const heroImageDark = await analyzeHeroBrightness(rotated, originalWidth, originalHeight);

  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
  const autoHeroMode = detectHeroMode(analysis);
  const isLowResolution = originalWidth < 1920 || originalHeight < 1080;

  return {
    originalWidth,
    originalHeight,
    isLowResolution,
    autoHeroMode,
    heroImageDark,
    mobileBuffer,
    blurDataUrl,
    cutoutBuffer,
  };
}
