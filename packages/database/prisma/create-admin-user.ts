import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xivvulkxkjvghsxadtun.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdnZ1bGt4a2p2Z2hzeGFkdHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDczNzM1NCwiZXhwIjoyMDg2MzEzMzU0fQ.tZZfHyqWF1yyTDvk_M25GbWzjyFudknNmMpfK8rdPYI";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = "admin@coachsite.com";
  const password = "admin123456";

  console.log("Creating admin user in Supabase Auth...");

  // Mevcut kullanıcıyı kontrol et
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  if (existing) {
    console.log("Admin user already exists:", existing.id);
    // Role metadata güncelle
    await supabase.auth.admin.updateUserById(existing.id, {
      user_metadata: { name: "Admin", role: "admin" },
    });
    console.log("Updated role to admin");
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: "Admin", role: "admin" },
    });

    if (error) {
      console.error("Failed to create admin:", error.message);
      process.exit(1);
    }

    console.log("Created admin user:", data.user.id);
  }

  console.log("\n========================================");
  console.log("Admin Giriş Bilgileri:");
  console.log("  E-posta: admin@coachsite.com");
  console.log("  Şifre:   admin123456");
  console.log("  URL:     http://localhost:3002/platform/auth");
  console.log("========================================\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
