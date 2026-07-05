import { PrismaClient } from "@prisma/client";
import { EXERCISE_DATABASE } from "./seed-exercises";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // SaaS Paketleri oluştur
  const starterPackage = await prisma.saasPackage.upsert({
    where: { tier: 1 },
    update: {},
    create: {
      name: "Başlangıç",
      tier: 1,
      price: 499,
      currency: "TRY",
      maxStudents: 5,
      features: [
        "Profesyonel landing page",
        "1 tasarım şablonu",
        "Aynı anda 5 öğrenci",
        "Antrenman programları",
        "Beslenme programları",
        "Haftalık check-in",
        "Öğrenci ilerleme takibi",
        "Mesajlaşma",
        "PWA mobil uygulama",
      ],
      templates: ["classic-dark"],
    },
  });

  const proPackage = await prisma.saasPackage.upsert({
    where: { tier: 2 },
    update: {},
    create: {
      name: "Profesyonel",
      tier: 2,
      price: 899,
      currency: "TRY",
      maxStudents: 10,
      features: [
        "Başlangıç paketindeki her şey",
        "3 tasarım şablonu",
        "Aynı anda 10 öğrenci",
        "Dönüşüm hikayeleri sayfası",
        "Gelişmiş ilerleme grafikleri",
        "Toplu program atama",
        "Öncelikli destek",
      ],
      templates: ["classic-dark", "modern-teal", "fresh-light"],
    },
  });

  const premiumPackage = await prisma.saasPackage.upsert({
    where: { tier: 3 },
    update: {},
    create: {
      name: "Premium",
      tier: 3,
      price: 1499,
      currency: "TRY",
      maxStudents: 999,
      features: [
        "Profesyonel paketindeki her şey",
        "Tüm tasarım şablonları",
        "Sınırsız öğrenci",
        "Özel domain desteği",
        "Layout özelleştirme",
        "Gelişmiş analitik",
        "Beyaz etiket (Shred markası yok)",
        "7/24 öncelikli destek",
      ],
      templates: ["classic-dark", "modern-teal", "fresh-light", "clean-red", "sport-dark"],
    },
  });

  console.log("Created packages:", {
    starter: starterPackage.id,
    pro: proPackage.id,
    premium: premiumPackage.id,
  });

  // Demo Coach oluştur
  const demoCoach = await prisma.coach.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      userId: "demo-user-id",
      email: "demo@coachsite.com",
      name: "Ahmet Coach",
      brandName: "FitCoach Ahmet",
      bio: "Profesyonel online fitness koçluğu ile hayalindeki vücuda kavuş. Kişiselleştirilmiş antrenman ve beslenme programları.",
      subdomain: "demo",
      primaryColor: "#050505",
      secondaryColor: "#ccff00",
      landingThemeId: 1,
      dashboardThemeId: 1,
      plan: "pro",
      templateId: "classic-dark",
      dashboardTemplateId: "dark-teal",
      packageId: proPackage.id,
      subscriptionStatus: "active",
    },
  });

  // Demo Coach'un koçluk paketleri
  await prisma.coachPackage.upsert({
    where: { id: "demo-pkg-1" },
    update: {},
    create: {
      id: "demo-pkg-1",
      coachId: demoCoach.id,
      name: "12 Haftalık Dönüşüm",
      description: "12 hafta boyunca kişiye özel antrenman ve beslenme programı ile tam dönüşüm.",
      duration: 12,
      price: 3990,
      currency: "TRY",
      features: [
        "Kişiselleştirilmiş antrenman programı",
        "Kişiselleştirilmiş beslenme programı",
        "Haftalık check-in ve takip",
        "7/24 mesajlaşma desteği",
        "İlerleme analizi ve raporlama",
      ],
      isActive: true,
      orderIndex: 0,
    },
  });

  await prisma.coachPackage.upsert({
    where: { id: "demo-pkg-2" },
    update: {},
    create: {
      id: "demo-pkg-2",
      coachId: demoCoach.id,
      name: "24 Haftalık Pro Dönüşüm",
      description: "6 aylık kapsamlı program. Detaylı takip, video analiz ve öncelikli destek dahil.",
      duration: 24,
      price: 6990,
      currency: "TRY",
      features: [
        "12 Haftalık Dönüşüm paketindeki her şey",
        "Video form analizi",
        "Supplement danışmanlığı",
        "Haftalık görüntülü görüşme",
        "Öncelikli destek",
      ],
      isActive: true,
      orderIndex: 1,
    },
  });

  console.log("Demo coach created:", demoCoach.id);

  // ═══ HAZIR EGZERSİZ VERİTABANI ═══
  console.log("Seeding system exercises...");

  // Mevcut sistem egzersizlerini kontrol et
  const existingSystemExercises = await prisma.exercise.count({
    where: { isSystem: true },
  });

  if (existingSystemExercises === 0) {
    // Toplu oluştur
    const result = await prisma.exercise.createMany({
      data: EXERCISE_DATABASE.map((ex) => ({
        name: ex.name,
        category: ex.category,
        description: ex.description,
        isSystem: true,
        coachId: null,
      })),
      skipDuplicates: true,
    });
    console.log(`Created ${result.count} system exercises`);
  } else {
    console.log(`System exercises already exist (${existingSystemExercises}), skipping...`);
  }

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
