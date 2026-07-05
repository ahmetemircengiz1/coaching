/**
 * Tek-seferlik veri migration'ı (Aşama 2 — siteMode).
 *
 * Default'u TEMPLATE olan yeni `site_mode` kolonunun, hâlihazırda Section
 * Builder kullanan koçlar için BUILDER'a alınması gerekiyor. Aksi halde Elite
 * paketindeki koçların siteleri bir sonraki render'da boş şablona düşer.
 *
 * Çalıştırma:  npx tsx packages/database/prisma/migrate-sitemode-2026-05-21.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Coach'un landing'ini Section Builder mı yönetiyor:
  //  - landingThemeId === 7 (eski 'theme-elite' seçimi)
  //  - VEYA eliteConfig kayıtlı (koç en az bir kez Builder'a girmiş)
  const builderCoaches = await prisma.coach.findMany({
    where: {
      OR: [{ landingThemeId: 7 }, { eliteConfig: { not: Prisma.JsonNull } }],
    },
    select: { id: true, subdomain: true, landingThemeId: true, eliteConfig: true },
  });

  if (builderCoaches.length === 0) {
    console.log("Builder kullanan koç bulunamadı — tüm koçlar TEMPLATE'te kaldı.");
    return;
  }

  console.log(`${builderCoaches.length} koç BUILDER'a alınacak:`);
  for (const c of builderCoaches) {
    console.log(
      `  • ${c.subdomain}  (landingThemeId=${c.landingThemeId}, eliteConfig=${c.eliteConfig ? "var" : "yok"})`,
    );
  }

  const result = await prisma.coach.updateMany({
    where: {
      OR: [{ landingThemeId: 7 }, { eliteConfig: { not: Prisma.JsonNull } }],
    },
    data: { siteMode: "BUILDER" },
  });

  console.log(`\nBitti: ${result.count} satır güncellendi.`);
}

// Prisma.JsonNull importu Prisma namespace üzerinden
import { Prisma } from "@prisma/client";

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
