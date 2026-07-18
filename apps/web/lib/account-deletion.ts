import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Üyelik sonlandırmada storage temizliği: verilen kullanıcı id'lerinin
 * klasörlerini tüm bucket'lardan siler. Tüm upload yolları `${userId}/...`
 * ile başladığından prefix bazlı silme yeterlidir.
 */

const BUCKETS = [
  "logos",
  "hero-images",
  "hero-videos",
  "transformations",
  "checkins",
  "avatars",
  "meal-photos",
];

type AdminClient = ReturnType<typeof createAdminClient>;

async function walkFolder(
  admin: AdminClient,
  bucket: string,
  prefix: string
): Promise<string[]> {
  const out: string[] = [];
  const { data, error } = await admin.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) {
    if (!String(error.message || "").toLowerCase().includes("not found")) {
      console.warn(`[account-deletion] ${bucket}/${prefix} list:`, error.message);
    }
    return out;
  }
  for (const item of data ?? []) {
    const full = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id) out.push(full);
    else out.push(...(await walkFolder(admin, bucket, full)));
  }
  return out;
}

export async function deleteStorageForUsers(userIds: string[]): Promise<number> {
  if (userIds.length === 0) return 0;
  const admin = createAdminClient();
  let total = 0;
  for (const bucket of BUCKETS) {
    for (const uid of userIds) {
      const files = await walkFolder(admin, bucket, uid);
      total += files.length;
      for (let i = 0; i < files.length; i += 100) {
        const { error } = await admin.storage.from(bucket).remove(files.slice(i, i + 100));
        if (error) console.warn(`[account-deletion] ${bucket} remove:`, error.message);
      }
    }
  }
  return total;
}

/** Auth kullanıcılarını siler; hatalar loglanır ama akışı durdurmaz. */
export async function deleteAuthUsers(userIds: string[]): Promise<void> {
  const admin = createAdminClient();
  for (const uid of userIds) {
    const { error } = await admin.auth.admin.deleteUser(uid);
    if (error) console.warn(`[account-deletion] auth delete ${uid}:`, error.message);
  }
}
