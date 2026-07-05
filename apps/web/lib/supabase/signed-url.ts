import "server-only";
import { createAdminClient } from "./admin";
import { PRIVATE_BUCKETS } from "./storage";

// Gizliliği önemli olan bucket'lar (checkins, meal-photos) PRIVATE'tır; bu
// bucket'lardaki dosyalar yalnızca süreli "signed URL" ile sunulur. Public URL
// formatı (.../object/public/<bucket>/<path>) DB'de saklanmaya devam eder
// (legacy + cron uyumu) ama okuma anında imzalı URL'e çevrilir.

const SIGN_TTL_SECONDS = 60 * 60; // 1 saat

// Saklanan değer tam public URL (.../object/public/<bucket>/<path>) ya da
// imzalı URL (.../object/sign/<bucket>/<path>) olabilir; bucket + path ayıkla.
function parseStored(stored: string): { bucket: string; path: string } | null {
  const m = stored.match(
    /\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/([^?]+)/
  );
  if (m) return { bucket: m[1], path: decodeURIComponent(m[2]) };
  return null;
}

/**
 * Bir grup saklanmış foto referansını imzalı URL'e çevirir.
 * - Boş/null → null
 * - Public bucket veya tanınmayan format → olduğu gibi döner (imza gerekmez)
 * - Private bucket → süreli signed URL; dosya yok/erişilemezse null
 * Aynı bucket'taki yollar tek istekte (createSignedUrls) imzalanır.
 */
export async function signPhotoUrls(
  stored: (string | null | undefined)[],
  ttl: number = SIGN_TTL_SECONDS
): Promise<(string | null)[]> {
  const result: (string | null)[] = new Array(stored.length).fill(null);
  const byBucket = new Map<string, { idx: number; path: string }[]>();

  stored.forEach((s, idx) => {
    if (!s) {
      result[idx] = null;
      return;
    }
    const parsed = parseStored(s);
    if (!parsed || !PRIVATE_BUCKETS.has(parsed.bucket)) {
      result[idx] = s; // public/bilinmeyen → değiştirme
      return;
    }
    const arr = byBucket.get(parsed.bucket) || [];
    arr.push({ idx, path: parsed.path });
    byBucket.set(parsed.bucket, arr);
  });

  if (byBucket.size === 0) return result;

  const supabase = createAdminClient();
  await Promise.all(
    [...byBucket.entries()].map(async ([bucket, items]) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrls(
          items.map((i) => i.path),
          ttl
        );
      if (error || !data) return; // hata → ilgili index'ler null kalır
      data.forEach((d, i) => {
        result[items[i].idx] = d.error ? null : d.signedUrl || null;
      });
    })
  );

  return result;
}

/** Tek bir foto referansını imzalı URL'e çevirir. */
export async function signPhotoUrl(
  stored: string | null | undefined,
  ttl: number = SIGN_TTL_SECONDS
): Promise<string | null> {
  const [r] = await signPhotoUrls([stored], ttl);
  return r ?? null;
}
