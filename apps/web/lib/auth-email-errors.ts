import type { AuthError } from "@supabase/supabase-js";

/**
 * Supabase auth e-posta gönderim hatasını kullanıcıya gösterilecek Türkçe
 * mesaja çevirir. Supabase aynı adrese ~60 sn'de birden fazla e-postaya izin
 * vermez ("For security purposes, you can only request this after N seconds");
 * bunu yakalayıp kalan süreyi de döndürürüz ki UI geri sayım gösterebilsin.
 */
export function mapResendEmailError(error: AuthError): {
  error: string;
  retryAfter?: number;
} {
  const msg = error.message.toLowerCase();
  const match = error.message.match(/after (\d+) second/i);

  if (match) {
    const seconds = parseInt(match[1], 10);
    return {
      error: `Güvenlik nedeniyle yeni e-posta ${seconds} saniye sonra gönderilebilir.`,
      retryAfter: seconds,
    };
  }

  if (error.status === 429 || msg.includes("rate limit")) {
    return {
      error:
        "Kısa sürede çok fazla e-posta gönderildi. Lütfen 1-2 dakika sonra tekrar dene.",
      retryAfter: 60,
    };
  }

  if (msg.includes("already confirmed")) {
    return { error: "Bu e-posta zaten doğrulanmış. Giriş yapabilirsin." };
  }

  return { error: "Onay e-postası gönderilemedi. Lütfen tekrar deneyin." };
}
