/**
 * E-posta gönderim helper'ı.
 *
 * Production'da kurulum:
 *   1) `npm install resend` (apps/web altında)
 *   2) RESEND_API_KEY ve RESEND_FROM env değişkenlerini doldur
 *
 * RESEND_API_KEY tanımlı değilse `sendMail` çağrıları no-op döner ve
 * konsola uyarı yazar — uygulamayı patlatmaz. Bu sayede özellik kodunu
 * Resend hesabı açılmadan da yazıp test edebilirsin.
 */

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "Shred <noreply@shred.com.tr>";

export type SendMailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

export type SendMailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; skipped?: boolean };

export async function sendMail(opts: SendMailOptions): Promise<SendMailResult> {
  if (!API_KEY) {
    console.warn("[email] RESEND_API_KEY tanımlı değil — gönderim atlandı:", {
      to: opts.to,
      subject: opts.subject,
    });
    return { ok: false, error: "Email gönderimi yapılandırılmamış", skipped: true };
  }

  try {
    // Dinamik import — resend paketi yüklü değilse build çökmez, sadece runtime'da
    // gönderim başarısız olur.
    const mod = await import("resend").catch(() => null);
    if (!mod) {
      console.error("[email] 'resend' paketi yüklü değil. `npm install resend` çalıştırın.");
      return { ok: false, error: "Email kütüphanesi yüklü değil" };
    }

    const resend = new mod.Resend(API_KEY);
    const result = await resend.emails.send({
      from: opts.from || FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
    });

    if (result.error) {
      console.error("[email] Resend gönderim hatası:", result.error);
      return { ok: false, error: result.error.message || "Bilinmeyen Resend hatası" };
    }

    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error("[email] Beklenmeyen hata:", err);
    return { ok: false, error: "Email gönderimi başarısız" };
  }
}

// ─────────────────────────────────────────────────────────────
// Template'ler (gerektikçe genişletilir)
// ─────────────────────────────────────────────────────────────

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;">${title}</h1>
        ${body}
        <hr style="border:0;border-top:1px solid #eee;margin:32px 0 16px;" />
        <p style="font-size:11px;color:#888;margin:0;">
          Bu e-postayı Shred otomatik gönderdi. Soruların için
          <a href="mailto:destek@shred.com.tr" style="color:#333;">destek@shred.com.tr</a> adresinden bize ulaşabilirsin.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<p style="margin:24px 0;">
    <a href="${href}" style="display:inline-block;background:#ccff00;color:#000;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:700;">${label}</a>
  </p>`;
}

export function buildWelcomeCoachEmail(input: { name: string; siteUrl: string }): SendMailOptions {
  return {
    to: "",
    subject: "Shred'e hoş geldin!",
    html: shell(
      `Hoş geldin, ${input.name} 👋`,
      `<p>Shred hesabın hazır. Aşağıdaki adresten kendi koçluk sitenize ulaşabilirsin:</p>
       ${ctaButton(input.siteUrl, "Sitene git")}
       <p>İlk adımlar için panelinde "Rehber" butonunu kullanabilirsin.</p>`,
    ),
  };
}

export function buildStudentInviteEmail(input: {
  coachName: string;
  inviteLink: string;
}): SendMailOptions {
  return {
    to: "",
    subject: `${input.coachName} seni koçluk programına davet ediyor`,
    html: shell(
      "Davet aldın",
      `<p><strong>${input.coachName}</strong> seni koçluk programına davet etti.</p>
       <p>Aşağıdaki butona tıklayarak hesabını oluştur ve yolculuğa başla:</p>
       ${ctaButton(input.inviteLink, "Daveti kabul et")}
       <p style="font-size:13px;color:#666;">Bu bağlantı tek kullanımlıktır.</p>`,
    ),
  };
}

export function buildPasswordResetEmail(input: { resetLink: string }): SendMailOptions {
  return {
    to: "",
    subject: "Şifre sıfırlama isteği",
    html: shell(
      "Şifre sıfırlama",
      `<p>Hesabın için bir şifre sıfırlama talebi aldık. Aşağıdaki bağlantı 1 saat içinde geçersiz olur.</p>
       ${ctaButton(input.resetLink, "Şifreyi sıfırla")}
       <p style="font-size:13px;color:#666;">Bu işlemi sen başlatmadıysan bu maili görmezden gelebilirsin.</p>`,
    ),
  };
}

export function buildCheckInFeedbackEmail(input: {
  studentName: string;
  coachName: string;
  feedbackLink: string;
}): SendMailOptions {
  return {
    to: "",
    subject: `${input.coachName} check-in'in için geri bildirim yazdı`,
    html: shell(
      `${input.studentName}, koçun yorum yazdı`,
      `<p>Bu haftaki check-in'in için <strong>${input.coachName}</strong> sana geri bildirim bıraktı.</p>
       ${ctaButton(input.feedbackLink, "Geri bildirimi gör")}`,
    ),
  };
}

export function buildPackageEndingSoonEmail(input: {
  coachName: string;
  studentName: string;
  daysLeft: number;
  renewLink: string;
}): SendMailOptions {
  return {
    to: "",
    subject: "Paketinin bitmesine az kaldı",
    html: shell(
      `Selam ${input.studentName}`,
      `<p><strong>${input.coachName}</strong> ile devam eden paketinin bitmesine <strong>${input.daysLeft} gün</strong> kaldı.</p>
       <p>Yenileme için aşağıdaki butonu kullanabilirsin:</p>
       ${ctaButton(input.renewLink, "Paketimi yenile")}`,
    ),
  };
}
