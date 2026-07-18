/**
 * Bir kullanıcının e-posta adresini değiştirir (Supabase Auth + Coach satırı).
 *
 * Kullanım: node packages/database/scripts/change-email.cjs <eski@mail> <yeni@mail>
 *
 * Yeni adres doğrulanmış sayılır (admin değişikliği); kullanıcı yeni
 * e-postasıyla giriş yapar, şifresi değişmez.
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../../../apps/web/.env.local") });

const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const FROM = (process.argv[2] || "").toLowerCase().trim();
const TO = (process.argv[3] || "").toLowerCase().trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!EMAIL_RE.test(FROM) || !EMAIL_RE.test(TO)) {
  console.error("Kullanım: node change-email.cjs <eski@mail> <yeni@mail>");
  process.exit(1);
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE_ROLE) {
  console.error("SUPABASE URL / SERVICE_ROLE eksik (.env.local)");
  process.exit(1);
}

const prisma = new PrismaClient();
const supabase = createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } });

(async () => {
  // Auth kullanıcısını bul
  let user = null;
  let page = 1;
  while (!user) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`auth list: ${error.message}`);
    user = data.users.find((u) => (u.email || "").toLowerCase() === FROM) || null;
    if (data.users.length < 200) break;
    page++;
  }
  if (!user) {
    console.error(`HATA: ${FROM} auth kullanıcısı bulunamadı.`);
    process.exit(1);
  }

  // Auth e-postasını güncelle (doğrulanmış olarak)
  const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
    email: TO,
    email_confirm: true,
  });
  if (updErr) {
    console.error(`HATA: auth güncellenemedi — ${updErr.message}`);
    process.exit(1);
  }
  console.log(`✓ Auth: ${FROM} → ${TO}`);

  // Coach satırındaki email kolonunu da senkronla (varsa)
  const coach = await prisma.coach.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (coach) {
    await prisma.coach.update({ where: { id: coach.id }, data: { email: TO } });
    console.log(`✓ Coach.email güncellendi`);
  }

  // Student satırı (öğrenci hesabıysa)
  const student = await prisma.student.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (student) {
    await prisma.student.update({ where: { id: student.id }, data: { email: TO } });
    console.log(`✓ Student.email güncellendi`);
  }

  console.log(`\n✓ TAMAM — kullanıcı artık ${TO} ile giriş yapar (şifre aynı).`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("\nHATA:", e);
  await prisma.$disconnect();
  process.exit(1);
});
