// Tek seferlik Supabase Storage bucket setup.
// Yeni bucket eklendiğinde tekrar çalıştırılabilir. Mevcut bucket'ları etkilemez.
// Kullanım: node scripts/ensure-buckets.mjs (apps/web içinden)

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// apps/web/.env.local'dan oku
config({ path: resolve(__dirname, "../.env.local") });

// private: öğrenci vücut/yemek fotoları herkese açık OLMAMALI — yalnızca
// uygulama içinden üretilen süreli signed URL ile sunulur.
const BUCKETS = [
  { name: "logos", sizeMb: 5, isPublic: true },
  { name: "hero-images", sizeMb: 10, isPublic: true },
  { name: "transformations", sizeMb: 5, isPublic: true },
  { name: "checkins", sizeMb: 5, isPublic: false },
  { name: "avatars", sizeMb: 5, isPublic: true },
  { name: "meal-photos", sizeMb: 5, isPublic: false },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY env yok.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let created = 0;
let updated = 0;
let failed = 0;

for (const bucket of BUCKETS) {
  const options = {
    public: bucket.isPublic,
    fileSizeLimit: bucket.sizeMb * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  };
  const vis = bucket.isPublic ? "public" : "PRIVATE";
  const { error } = await supabase.storage.createBucket(bucket.name, options);

  if (!error) {
    console.log(`✓ ${bucket.name} oluşturuldu (${vis})`);
    created++;
  } else if (error.message.toLowerCase().includes("already exists")) {
    // Mevcut bucket — gizlilik ayarını ZORLA (public → private geçişi dahil).
    const { error: updErr } = await supabase.storage.updateBucket(bucket.name, options);
    if (updErr) {
      console.error(`✗ ${bucket.name} güncellenemedi: ${updErr.message}`);
      failed++;
    } else {
      console.log(`↻ ${bucket.name} güncellendi (${vis})`);
      updated++;
    }
  } else {
    console.error(`✗ ${bucket.name}: ${error.message}`);
    failed++;
  }
}

console.log(`\nÖzet: ${created} yeni, ${updated} güncellendi, ${failed} hata`);
process.exit(failed > 0 ? 1 : 0);
