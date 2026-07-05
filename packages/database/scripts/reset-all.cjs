/**
 * TAM SIFIRDAN BAŞLANGIÇ — TÜM kullanıcıları, verileri ve dosyaları siler.
 *
 * 1) Supabase Auth — auth.users tüm kayıtları
 * 2) Supabase Storage — 6 bucket'taki tüm dosyalar
 * 3) Prisma DB — tüm domain tabloları (SaasPackage tutulur, koç-öğrenci-veri silinir)
 *
 * Çalıştırma: node packages/database/scripts/reset-all.cjs
 * Kafanı çekmek isterseniz: node packages/database/scripts/reset-all.cjs --dry-run
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../../../apps/web/.env.local") });

const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const DRY = process.argv.includes("--dry-run");
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_ROLE) {
  console.error("SUPABASE URL / SERVICE_ROLE eksik (.env.local)");
  process.exit(1);
}

const prisma = new PrismaClient();
const supabase = createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } });

const BUCKETS = ["logos", "hero-images", "transformations", "checkins", "avatars", "meal-photos"];

function log(s) {
  console.log(`${DRY ? "[DRY] " : ""}${s}`);
}

async function emptyBucket(bucket) {
  // recursive list — sub-dizinleri de gez
  async function walk(prefix = "") {
    const out = [];
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
    if (error) {
      // bucket yoksa "Bucket not found" gelir — atla
      if (!String(error.message || "").toLowerCase().includes("not found")) {
        console.warn(`  ! ${bucket}/${prefix} list:`, error.message);
      }
      return out;
    }
    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id) {
        out.push(full);
      } else {
        // klasör — içine in
        const inner = await walk(full);
        out.push(...inner);
      }
    }
    return out;
  }

  const files = await walk("");
  log(`  ${bucket}: ${files.length} dosya`);
  if (files.length === 0 || DRY) return files.length;
  // 100'lü gruplarda sil
  for (let i = 0; i < files.length; i += 100) {
    const chunk = files.slice(i, i + 100);
    const { error } = await supabase.storage.from(bucket).remove(chunk);
    if (error) console.warn(`  ! ${bucket} remove:`, error.message);
  }
  return files.length;
}

async function emptyAuth() {
  let page = 1;
  const all = [];
  // ilk 1000 yeterli olur, ama 1000+ varsa loop
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error("auth list error:", error.message);
      break;
    }
    all.push(...data.users);
    if (data.users.length < 200) break;
    page++;
  }
  log(`  auth.users: ${all.length} kullanıcı`);
  for (const u of all) log(`    - ${u.email || u.id}`);
  if (DRY) return all.length;
  for (const u of all) {
    const { error } = await supabase.auth.admin.deleteUser(u.id);
    if (error) console.warn(`  ! delete ${u.email}:`, error.message);
  }
  return all.length;
}

/**
 * DB silme sırası — FK constraint'ler için yapraklardan köke.
 * 27 cascade ilişkimiz var ama hepsine güvenmek yerine açık sırada gidiyoruz.
 */
async function emptyDb() {
  // Önce sayım
  const before = {
    coaches: await prisma.coach.count(),
    students: await prisma.student.count(),
    invites: await prisma.studentInvite.count(),
    codes: await prisma.coachRegistrationCode.count(),
    payments: await prisma.payment.count(),
    notifications: await prisma.notification.count(),
    programs: await prisma.program.count(),
    nutritionPlans: await prisma.nutritionPlan.count(),
    trainingPlans: await prisma.trainingPlan.count(),
    checkIns: await prisma.weeklyCheckIn.count(),
    workoutAttendance: await prisma.workoutAttendance.count(),
    mealEntries: await prisma.mealEntry.count(),
    transformations: await prisma.transformation.count(),
    testimonials: await prisma.testimonial.count(),
    exerciseLogs: await prisma.exerciseLog.count(),
    metrics: await prisma.metric.count(),
    saasPackages: await prisma.saasPackage.count(),
  };
  log(`  DB sayım: ${JSON.stringify(before)}`);
  if (DRY) return before;

  // Sıra: log/instance tabloları → plan tabloları → student/coach → saas
  await prisma.exerciseLog.deleteMany();
  await prisma.trainingLog.deleteMany();
  await prisma.mealCompletion.deleteMany();
  await prisma.nutritionLog.deleteMany();
  await prisma.workoutAttendance.deleteMany();
  await prisma.mealEntry.deleteMany();
  await prisma.weeklyCheckIn.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.transformation.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.studentInvite.deleteMany();

  // Plan tabloları (ProgramWorkout/WorkoutExercise/Alternative cascade ile gider ama yine sırasıyla)
  await prisma.workoutExerciseAlternative.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.programWorkout.deleteMany();
  await prisma.trainingPlan.deleteMany();
  await prisma.program.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.nutritionPlan.deleteMany();

  // Custom exercise (koçun eklediği) — global olanlar kalsın diye sadece coachId dolu olanları sil
  await prisma.exercise.deleteMany({ where: { coachId: { not: null } } });

  // CoachPackage / CoachRegistrationCode — Coach'a bağlı
  await prisma.coachRegistrationCode.deleteMany();
  await prisma.coachPackage.deleteMany();

  // Sonra Student → Coach
  await prisma.student.deleteMany();
  await prisma.coach.deleteMany();

  // SaasPackage'ı bırakıyoruz — yeni koç onboarding'i bu paketlere ihtiyaç duyuyor

  const after = {
    coaches: await prisma.coach.count(),
    students: await prisma.student.count(),
    saasPackages: await prisma.saasPackage.count(),
  };
  log(`  DB sonra: ${JSON.stringify(after)}`);
  return after;
}

(async () => {
  console.log(`\n=== TAM SIFIRDAN BAŞLANGIÇ ${DRY ? "(DRY-RUN)" : ""} ===\n`);

  console.log("\n[1/3] Supabase Storage temizleniyor...");
  let totalFiles = 0;
  for (const b of BUCKETS) totalFiles += await emptyBucket(b);
  log(`  toplam ${totalFiles} dosya silindi`);

  console.log("\n[2/3] Supabase Auth kullanıcılar siliniyor...");
  const authCount = await emptyAuth();
  log(`  toplam ${authCount} auth kullanıcı silindi`);

  console.log("\n[3/3] Prisma DB temizleniyor...");
  await emptyDb();

  console.log(`\n✓ TAMAM ${DRY ? "(sadece görüntüleme)" : ""}.\n`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("\nHATA:", e);
  await prisma.$disconnect();
  process.exit(1);
});
