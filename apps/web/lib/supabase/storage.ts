import { createAdminClient } from "./admin";

export const STORAGE_BUCKETS = {
  logos: "logos",
  heroes: "hero-images",
  heroVideos: "hero-videos",
  transformations: "transformations",
  checkins: "checkins",
  avatars: "avatars",
  meals: "meal-photos",
} as const;

export type BucketName = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Gizliliği önemli olan bucket'lar PRIVATE'tır: öğrenci vücut/ilerleme fotoları
// (checkins) ve yemek fotoları (meal-photos). Bunlara yalnızca süreli signed URL
// ile erişilir (bkz. lib/supabase/signed-url.ts). Diğer bucket'lar (logo, hero,
// transformation, avatar) public — landing'de herkese görünmesi gerekir.
export const PRIVATE_BUCKETS = new Set<string>([
  STORAGE_BUCKETS.checkins,
  STORAGE_BUCKETS.meals,
]);

// Bucket'ları oluştur (uygulama başlatıldığında bir kere çalışır).
// Mevcut bucket'larda public/private ayarını updateBucket ile ZORLAR — yani
// bir bucket yanlışlıkla public kalmışsa düzeltir.
export async function ensureBuckets() {
  const supabase = createAdminClient();

  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    const isHeroBucket = bucket === STORAGE_BUCKETS.heroes;
    const isVideoBucket = bucket === STORAGE_BUCKETS.heroVideos;
    const isPublic = !PRIVATE_BUCKETS.has(bucket);
    const options = {
      public: isPublic,
      fileSizeLimit: isVideoBucket
        ? 50 * 1024 * 1024 // 50MB hero video
        : isHeroBucket
        ? 10 * 1024 * 1024
        : 5 * 1024 * 1024,
      allowedMimeTypes: isVideoBucket
        ? ["video/mp4", "video/webm", "video/quicktime"]
        : ["image/jpeg", "image/png", "image/webp"],
    };
    const { error } = await supabase.storage.createBucket(bucket, options);

    if (error && !error.message.includes("already exists")) {
      console.error(`Bucket "${bucket}" oluşturulamadı:`, error.message);
    } else if (error) {
      // Zaten var — gizlilik/limit ayarlarını zorla (private migration dahil).
      const { error: updErr } = await supabase.storage.updateBucket(bucket, options);
      if (updErr) {
        console.error(`Bucket "${bucket}" güncellenemedi:`, updErr.message);
      }
    }
  }
}

// Tek bir bucket'ı lazy olarak oluştur (route içinden upload öncesi çağrılır)
export async function ensureBucket(
  bucket: BucketName,
  options: { fileSizeLimit?: number; allowedMimeTypes?: string[] } = {}
) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.createBucket(bucket, {
    public: !PRIVATE_BUCKETS.has(bucket),
    fileSizeLimit: options.fileSizeLimit ?? 5 * 1024 * 1024,
    allowedMimeTypes: options.allowedMimeTypes ?? [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  });
  if (error && !error.message.includes("already exists")) {
    console.error(`Bucket "${bucket}" oluşturulamadı:`, error.message);
  }
}

// Dosya yükle
export async function uploadFile(
  bucket: BucketName,
  filePath: string,
  file: Buffer | Uint8Array,
  contentType: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Dosya yüklenemedi: ${error.message}`);
  }

  // Public URL oluştur
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Dosya sil
export async function deleteFile(bucket: BucketName, filePath: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error(`Dosya silinemedi: ${error.message}`);
  }
}
