"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "coach",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Kayıt başarılı - onboarding'e yönlendir
  redirect("/platform/onboarding");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Kullanıcının rolüne göre yönlendir
  const role = data.user?.user_metadata?.role;

  if (role === "admin") {
    redirect("/platform/admin/dashboard");
  }

  // Coach ise kendi sitesine yönlendir
  const { data: coach } = await supabase
    .from("Coach")
    .select("subdomain")
    .eq("userId", data.user.id)
    .single();

  if (coach?.subdomain) {
    redirect(`/site/${coach.subdomain}/dashboard`);
  }

  // Henüz onboarding tamamlanmamış
  redirect("/platform/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
