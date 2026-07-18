/**
 * SEÇİCİ TEMİZLİK — KEEP_EMAIL ile kayıtlı kullanıcı ve onun sitesi HARİÇ
 * tüm kullanıcıları, koçları, öğrencileri ve dosyaları siler.
 *
 * Korunanlar:
 *  - KEEP_EMAIL auth kullanıcısı + ona bağlı Coach satırı (cascade zinciriyle
 *    paketleri, programları, site ayarları vb. tüm içeriği)
 *  - Kullanılmamış kayıt kodları (kullanılmışlar silinen öğrencilere işaret
 *    ettiğinden temizlenir)
 *  - SaasPackage'lar ve global egzersizler (coachId=null)
 *  - Storage'da keptUser.id/ altındaki dosyalar
 *
 * Silinenler: diğer tüm auth kullanıcıları, diğer koçlar (cascade ile tüm
 * verileri), TÜM öğrenciler, tüm davetler/bildirimler/ödemeler, storage'da
 * diğer kullanıcıların klasörleri.
 *
 * Çalıştırma: node packages/database/scripts/cleanup-keep.cjs [--dry-run]
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../../../apps/web/.env.local") });

const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const KEEP_EMAIL = "ahmetemircengiz1@gmail.com";
const DRY = process.argv.includes("--dry-run");
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_ROLE) {
  console.error("SUPABASE URL / SERVICE_ROLE eksik (.env.local)");
  process.exit(1);
}

const prisma = new PrismaClient();
const supabase = createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } });

const BUCKETS = ["logos", "hero-images", "hero-videos", "transformations", "checkins", "avatars", "meal-photos"];

function log(s) {
  console.log(`${DRY ? "[DRY] " : ""}${s}`);
}

async function listAllAuthUsers() {
  let page = 1;
  const all = [];
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`auth list: ${error.message}`);
    all.push(...data.users);
    if (data.users.length < 200) break;
    page++;
  }
  return all;
}

async function cleanBucket(bucket, keepPrefix) {
  async function walk(prefix = "") {
    const out = [];
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
    if (error) {
      if (!String(error.message || "").toLowerCase().includes("not found")) {
        console.warn(`  ! ${bucket}/${prefix} list:`, error.message);
      }
      return out;
    }
    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id) out.push(full);
      else out.push(...(await walk(full)));
    }
    return out;
  }

  const files = await walk("");
  const toDelete = files.filter((f) => !f.startsWith(`${keepPrefix}/`));
  log(`  ${bucket}: ${files.length} dosya, ${toDelete.length} silinecek (${files.length - toDelete.length} korunuyor)`);
  if (toDelete.length === 0 || DRY) return toDelete.length;
  for (let i = 0; i < toDelete.length; i += 100) {
    const chunk = toDelete.slice(i, i + 100);
    const { error } = await supabase.storage.from(bucket).remove(chunk);
    if (error) console.warn(`  ! ${bucket} remove:`, error.message);
  }
  return toDelete.length;
}

(async () => {
  console.log(`\n=== SEÇİCİ TEMİZLİK ${DRY ? "(DRY-RUN)" : ""} — korunan: ${KEEP_EMAIL} ===\n`);

  // 0) Korunacak kullanıcıyı bul
  const users = await listAllAuthUsers();
  const keptUser = users.find(
    (u) => (u.email || "").toLowerCase() === KEEP_EMAIL.toLowerCase()
  );
  if (!keptUser) {
    console.error(`HATA: ${KEEP_EMAIL} auth kullanıcısı bulunamadı — hiçbir şey silinmedi.`);
    process.exit(1);
  }
  console.log(`Korunan kullanıcı: ${keptUser.email} (${keptUser.id})`);

  const keptCoach = await prisma.coach.findUnique({
    where: { userId: keptUser.id },
    select: { id: true, brandName: true, subdomain: true },
  });
  console.log(
    keptCoach
      ? `Korunan koç sitesi: ${keptCoach.brandName} (${keptCoach.subdomain})`
      : "Bu kullanıcıya bağlı Coach satırı yok (sadece auth hesabı korunur)."
  );

  // 1) DB
  console.log("\n[1/3] Veritabanı temizleniyor...");
  const delCoaches = await prisma.coach.findMany({
    where: { userId: { not: keptUser.id } },
    select: { id: true, brandName: true, subdomain: true },
  });
  const studentCount = await prisma.student.count();
  log(`  Silinecek koç: ${delCoaches.length}`);
  for (const c of delCoaches) log(`    - ${c.brandName} (${c.subdomain})`);
  log(`  Silinecek öğrenci: ${studentCount} (tamamı)`);

  if (!DRY) {
    // Cascade zincirleri işi yapar: Student ve Coach silinince bağlı her şey gider.
    await prisma.student.deleteMany({});
    await prisma.coach.deleteMany({ where: { userId: { not: keptUser.id } } });
    // FK'sız gevşek tablolar — temiz başlangıç için hepsi
    await prisma.notification.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.studentInvite.deleteMany({});
    // Silinen öğrencilerce kullanılmış kodlar (kept koçunkiler dahil) anlamsız kaldı
    await prisma.coachRegistrationCode.deleteMany({ where: { usedByStudentId: { not: null } } });
  }

  // 2) Auth
  console.log("\n[2/3] Auth kullanıcıları temizleniyor...");
  const delUsers = users.filter((u) => u.id !== keptUser.id);
  log(`  Silinecek auth kullanıcı: ${delUsers.length}`);
  for (const u of delUsers) log(`    - ${u.email || u.id}`);
  if (!DRY) {
    for (const u of delUsers) {
      const { error } = await supabase.auth.admin.deleteUser(u.id);
      if (error) console.warn(`  ! delete ${u.email}:`, error.message);
    }
  }

  // 3) Storage — keptUser.id/ dışındaki tüm klasörler
  console.log("\n[3/3] Storage temizleniyor...");
  let totalFiles = 0;
  for (const b of BUCKETS) totalFiles += await cleanBucket(b, keptUser.id);
  log(`  toplam ${totalFiles} dosya silindi`);

  // Son durum
  const after = {
    coaches: await prisma.coach.count(),
    students: await prisma.student.count(),
    saasPackages: await prisma.saasPackage.count(),
    globalExercises: await prisma.exercise.count({ where: { coachId: null } }),
  };
  console.log(`\nSon durum: ${JSON.stringify(after)}`);
  console.log(`\n✓ TAMAM ${DRY ? "(sadece görüntüleme — hiçbir şey silinmedi)" : ""}.\n`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("\nHATA:", e);
  await prisma.$disconnect();
  process.exit(1);
});
