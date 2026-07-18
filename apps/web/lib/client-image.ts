/**
 * Tarayıcı tarafında görsel hazırlama.
 *
 * Vercel serverless fonksiyonlarının istek gövdesi limiti 4.5MB — daha büyük
 * dosyalar API'ye hiç ulaşmadan 413 ile kesilir. Bu yardımcı, büyük
 * fotoğrafları yüklemeden ÖNCE tarayıcıda yeniden boyutlandırıp (en uzun
 * kenar 4K) JPEG olarak sıkıştırır; kalite gözle görülür düşmeden dosya
 * limitin altına iner. Zaten küçük dosyalara dokunulmaz.
 */

const DEFAULT_MAX_BYTES = 4 * 1024 * 1024; // 4MB — Vercel 4.5MB limitine güvenli pay
const DEFAULT_MAX_EDGE = 3840; // 4K

export async function prepareImageForUpload(
  file: File,
  opts: { maxBytes?: number; maxEdge?: number } = {}
): Promise<File> {
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxEdge = opts.maxEdge ?? DEFAULT_MAX_EDGE;

  // Küçük dosya → olduğu gibi gönder (orijinal kalite korunur)
  if (file.size <= maxBytes) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Decode edilemiyorsa olduğu gibi dene — sunucu anlamlı hata döner
    return file;
  }

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (quality: number) =>
    new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

  // Kaliteyi kademeli düşürerek limitin altına in (0.9 → 0.6)
  for (const quality of [0.9, 0.85, 0.8, 0.7, 0.6]) {
    const blob = await toBlob(quality);
    if (blob && blob.size <= maxBytes) {
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], name, { type: "image/jpeg" });
    }
  }

  // 0.6'da bile sığmadıysa kenarı yarıya indirip son bir dene
  const half = document.createElement("canvas");
  half.width = Math.max(1, Math.round(width / 2));
  half.height = Math.max(1, Math.round(height / 2));
  const hctx = half.getContext("2d");
  if (hctx) {
    hctx.drawImage(canvas, 0, 0, half.width, half.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      half.toBlob(resolve, "image/jpeg", 0.8)
    );
    if (blob && blob.size <= maxBytes) {
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], name, { type: "image/jpeg" });
    }
  }

  return file; // pes — sunucu/limit hatası kullanıcıya net iletilir
}
