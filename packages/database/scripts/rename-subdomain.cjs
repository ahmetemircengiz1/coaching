/**
 * Bir koçun site adresini (subdomain) değiştirir.
 *
 * Kullanım: node packages/database/scripts/rename-subdomain.cjs <eski> <yeni>
 * Örnek:    node packages/database/scripts/rename-subdomain.cjs ahmetemircengiz tahakaral
 *
 * Wildcard *.shred.com.tr Vercel'de tanımlı olduğundan DNS değişikliği
 * gerekmez; yeni adres anında çalışır, eski adres landing'e 404 düşer.
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../../../apps/web/.env.local") });

const { PrismaClient } = require("@prisma/client");

const FROM = (process.argv[2] || "").toLowerCase().trim();
const TO = (process.argv[3] || "").toLowerCase().trim();

if (!FROM || !TO || !/^[a-z0-9-]{3,63}$/.test(TO)) {
  console.error("Kullanım: node rename-subdomain.cjs <eski-subdomain> <yeni-subdomain>");
  console.error("Yeni subdomain yalnız a-z, 0-9 ve tire içerebilir (3-63 karakter).");
  process.exit(1);
}

const prisma = new PrismaClient();

(async () => {
  const coach = await prisma.coach.findUnique({
    where: { subdomain: FROM },
    select: { id: true, brandName: true },
  });
  if (!coach) {
    console.error(`HATA: '${FROM}' subdomainli koç bulunamadı.`);
    process.exit(1);
  }
  const taken = await prisma.coach.findUnique({ where: { subdomain: TO } });
  if (taken) {
    console.error(`HATA: '${TO}' zaten başka bir koçta kullanımda.`);
    process.exit(1);
  }
  const updated = await prisma.coach.update({
    where: { id: coach.id },
    data: { subdomain: TO },
    select: { brandName: true, subdomain: true },
  });
  console.log(`✓ ${coach.brandName}: ${FROM}.shred.com.tr → ${updated.subdomain}.shred.com.tr`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("HATA:", e);
  await prisma.$disconnect();
  process.exit(1);
});
