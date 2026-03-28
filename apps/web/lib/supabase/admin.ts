import { createClient } from "@supabase/supabase-js";

// Service role client - sadece server-side'da kullanılmalı
// RLS bypass eder, dikkatli kullanılmalı
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
