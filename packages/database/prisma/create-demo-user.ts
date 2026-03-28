import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const supabaseUrl = "https://xivvulkxkjvghsxadtun.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdnZ1bGt4a2p2Z2hzeGFkdHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDczNzM1NCwiZXhwIjoyMDg2MzEzMzU0fQ.tZZfHyqWF1yyTDvk_M25GbWzjyFudknNmMpfK8rdPYI";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const prisma = new PrismaClient();

async function main() {
  const email = "coach@demo.com";
  const password = "demo123456";

  console.log("Creating demo coach user in Supabase Auth...");

  // Önce mevcut kullanıcıyı kontrol et
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  let userId: string;

  if (existing) {
    console.log("User already exists:", existing.id);
    userId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: "Ahmet Coach", role: "coach" },
    });

    if (error) {
      console.error("Failed to create user:", error.message);
      process.exit(1);
    }

    userId = data.user.id;
    console.log("Created user:", userId);
  }

  // Demo coach'un userId'sini güncelle
  const coach = await prisma.coach.findUnique({
    where: { subdomain: "demo" },
  });

  if (!coach) {
    console.error("Demo coach not found in DB!");
    process.exit(1);
  }

  await prisma.coach.update({
    where: { id: coach.id },
    data: { userId },
  });

  console.log("Updated demo coach userId to:", userId);
  console.log("\n========================================");
  console.log("Demo Coach Giriş Bilgileri:");
  console.log("  E-posta: coach@demo.com");
  console.log("  Şifre:   demo123456");
  console.log("  URL:     http://localhost:3002/site/demo/auth");
  console.log("========================================\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
