import { createAdminClient } from "./admin";

export const STORAGE_BUCKETS = {
  logos: "logos",
  heroes: "hero-images",
  transformations: "transformations",
  checkins: "checkins",
  avatars: "avatars",
} as const;

export type BucketName = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Bucket'ları oluştur (uygulama başlatıldığında bir kere çalışır)
export async function ensureBuckets() {
  const supabase = createAdminClient();

  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    const isHeroBucket = bucket === STORAGE_BUCKETS.heroes;
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: isHeroBucket ? 10 * 1024 * 1024 : 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    // Bucket zaten varsa hata vermez
    if (error && !error.message.includes("already exists")) {
      console.error(`Bucket "${bucket}" oluşturulamadı:`, error.message);
    }
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
