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
  desktopBuffer: Buffer;
  mobileBuffer: Buffer;
  blurDataUrl: string;
  /** Transparent cutout version (person only, no background) */
  cutoutBuffer: Buffer | null;
};

const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;
const MOBILE_WIDTH = 1080;
const MOBILE_HEIGHT = 1350;
const CUTOUT_HEIGHT = 1200;

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
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

export async function processHeroImage(input: Buffer): Promise<HeroProcessingResult> {
  const meta = await sharp(input).rotate().metadata();
  const originalWidth = meta.width ?? DESKTOP_WIDTH;
  const originalHeight = meta.height ?? DESKTOP_HEIGHT;

  // Run all processing in parallel
  const [desktopBuffer, mobileBuffer, blurBuffer, analysis, cutoutBuffer] = await Promise.all([
    sharp(input)
      .rotate()
      .resize(DESKTOP_WIDTH, DESKTOP_HEIGHT, {
        fit: "cover",
        position: "attention",
        withoutEnlargement: false,
      })
      .sharpen({ sigma: 0.8, m1: 1.0, m2: 0.5 })
      .webp({ quality: 92, effort: 4, smartSubsample: true })
      .toBuffer(),

    sharp(input)
      .rotate()
      .resize(MOBILE_WIDTH, MOBILE_HEIGHT, {
        fit: "cover",
        position: "attention",
        withoutEnlargement: false,
      })
      .sharpen({ sigma: 0.8, m1: 1.0, m2: 0.5 })
      .webp({ quality: 90, effort: 4, smartSubsample: true })
      .toBuffer(),

    sharp(input)
      .rotate()
      .resize(64, 64, {
        fit: "cover",
        position: "attention",
        withoutEnlargement: false,
      })
      .blur(2.4)
      .webp({ quality: 20, effort: 2 })
      .toBuffer(),

    analyzeImageStats(input),

    removeBackground(input),
  ]);

  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
  const autoHeroMode = detectHeroMode(analysis);
  const isLowResolution = originalWidth < DESKTOP_WIDTH || originalHeight < DESKTOP_HEIGHT;

  return {
    originalWidth,
    originalHeight,
    isLowResolution,
    autoHeroMode,
    desktopBuffer,
    mobileBuffer,
    blurDataUrl,
    cutoutBuffer,
  };
}
