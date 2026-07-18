"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { checkRateLimitAsync, getClientIp, AUTH_LIMIT } from "@/lib/rate-limit";
import prisma from "@coach-os/database";
import {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "@/lib/validation/schemas";
import { mapResendEmailError } from "@/lib/auth-email-errors";
import { checkEmailDomain } from "@/lib/email-check";

function getBaseUrl(hdrs: Headers): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = hdrs.get("host") || "localhost:3002";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signUp(formData: FormData) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`auth:signup:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  const tierRaw = formData.get("tier");
  const tier = typeof tierRaw === "string" && /^[1-3]$/.test(tierRaw) ? tierRaw : "1";

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz giriş bilgileri." };
  }

  // E-posta alan adı gerçekten posta alabiliyor mu? (typo/temp-mail/MX kontrolü)
  const emailCheck = await checkEmailDomain(parsed.data.email);
  if (!emailCheck.ok) {
    return { error: emailCheck.error };
  }

  const supabase = await createClient();
  const { email, password, name } = parsed.data;
  const baseUrl = getBaseUrl(hdrs);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: "coach" },
      emailRedirectTo: `${baseUrl}/platform/auth/callback?next=/platform/onboarding?tier=${tier}`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already") || error.message.toLowerCase().includes("registered")) {
      return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin." };
    }
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  // Email confirmation açıkken kayıtlı bir e-postayla signUp hata DÖNDÜRMEZ;
  // identities'i boş sahte bir user döner (enumeration koruması). Bunu yakala.
  if (data.user && !data.session && (data.user.identities?.length ?? 0) === 0) {
    return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı veya şifre sıfırlamayı deneyin." };
  }

  // Supabase email confirmation açıkken session dönmez
  const needsConfirmation = !data.session;
  if (needsConfirmation) {
    return { emailSent: true, email };
  }

  redirect(`/platform/onboarding?tier=${tier}`);
}

export async function resendConfirmation(formData: FormData) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`auth:resend:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  const parsed = resetPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz e-posta." };
  }

  const supabase = await createClient();
  const baseUrl = getBaseUrl(hdrs);

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${baseUrl}/platform/auth/callback?next=/platform/onboarding`,
    },
  });

  if (error) {
    return mapResendEmailError(error);
  }
  return { success: true };
}

export async function requestPasswordReset(formData: FormData) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`auth:reset:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  const parsed = resetPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz e-posta." };
  }

  const supabase = await createClient();
  const baseUrl = getBaseUrl(hdrs);

  // Enumeration'ı önlemek için sonucu her durumda success döndür.
  // Link callback üzerinden gider: e-posta şablonu token_hash eklerse
  // verifyOtp ile cihaz bağımsız çalışır, sonra reset sayfasına düşer.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${baseUrl}/platform/auth/callback?next=/platform/auth/reset`,
  });

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const parsed = updatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz şifre." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Oturum doğrulanamadı. Lütfen sıfırlama linkine tekrar tıklayın." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: "Şifre güncellenemedi. Lütfen tekrar deneyin." };
  }
  return { success: true };
}

export async function signIn(formData: FormData) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`auth:signin:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  const tierRaw = formData.get("tier");
  const tier = typeof tierRaw === "string" && /^[1-3]$/.test(tierRaw) ? tierRaw : null;

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz giriş bilgileri." };
  }

  const supabase = await createClient();
  const { email, password } = parsed.data;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "E-posta veya şifre hatalı." };
    }
    if (error.message === "Email not confirmed") {
      // Sayfa bu alanla doğrulama ekranını açar (tekrar gönder butonuyla)
      return {
        error: "E-postanız henüz doğrulanmadı. Lütfen e-postanızı kontrol edin.",
        unconfirmedEmail: parsed.data.email,
      };
    }
    return { error: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  if (!data.user) {
    return { error: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  const role = data.user.user_metadata?.role;
  if (role === "admin") {
    redirect("/platform/admin/dashboard");
  }

  const coach = await prisma.coach.findUnique({
    where: { userId: data.user.id },
    select: { subdomain: true },
  });

  if (coach?.subdomain) {
    redirect(`/site/${coach.subdomain}/dashboard`);
  }

  redirect(tier ? `/platform/onboarding?tier=${tier}` : "/platform/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
