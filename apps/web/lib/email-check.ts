import { promises as dns } from "dns";

/**
 * E-posta alan adı geçerlilik kontrolü (kayıt anında, sunucu tarafı).
 *
 * Üç katman:
 *  1. Yaygın yazım hataları (gmial.com → gmail.com önerisi)
 *  2. Geçici/kullan-at e-posta domainleri (reddedilir)
 *  3. DNS MX (yoksa A/AAAA) kaydı — domain posta alamıyorsa reddedilir
 *
 * Kullanıcı adı kısmının (ör. yoktale@gmail.com) var olup olmadığı kayıt
 * anında bilinemez; onu doğrulama maili katmanı çözer. DNS'e ulaşılamayan
 * belirsiz durumlarda fail-open davranır (gerçek kullanıcıyı engellememek için).
 */

// Bilinen büyük sağlayıcılar — DNS sorgusuna gerek yok, hızlı yol.
const KNOWN_GOOD = new Set([
  "gmail.com", "googlemail.com",
  "hotmail.com", "hotmail.com.tr", "outlook.com", "outlook.com.tr", "live.com", "msn.com", "windowslive.com",
  "yahoo.com", "yahoo.com.tr", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "protonmail.com", "proton.me", "pm.me",
  "yandex.com", "yandex.com.tr", "yandex.ru",
  "mynet.com", "mail.com", "gmx.com", "gmx.net", "aol.com",
]);

// Tipik yazım hataları → doğru domain önerisi
const TYPO_SUGGESTIONS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gmai.com": "gmail.com",
  "gamil.com": "gmail.com", "gmali.com": "gmail.com", "gnail.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
  "gmail.comm": "gmail.com", "gmaill.com": "gmail.com", "gemail.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmil.com": "hotmail.com",
  "hotmali.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com", "outllook.com": "outlook.com", "outlook.co": "outlook.com",
  "outlook.con": "outlook.com", "otlook.com": "outlook.com",
  "yaho.com": "yahoo.com", "yahou.com": "yahoo.com", "yahoo.co": "yahoo.com", "yhoo.com": "yahoo.com",
  "iclould.com": "icloud.com", "icoud.com": "icloud.com", "icloud.co": "icloud.com", "iclud.com": "icloud.com",
};

// Yaygın kullan-at e-posta servisleri
const DISPOSABLE = new Set([
  "mailinator.com", "yopmail.com", "guerrillamail.com", "sharklasers.com",
  "10minutemail.com", "temp-mail.org", "tempmail.com", "tempmail.dev",
  "trashmail.com", "getnada.com", "dispostable.com", "maildrop.cc",
  "throwawaymail.com", "fakeinbox.com", "mohmal.com", "tempmailo.com",
]);

// Aynı domain'i tekrar tekrar DNS'e sormamak için kısa süreli bellek önbelleği
const dnsCache = new Map<string, { receives: boolean; at: number }>();
const DNS_CACHE_TTL_MS = 10 * 60 * 1000;
const DNS_TIMEOUT_MS = 3000;

export type EmailDomainCheck = { ok: true } | { ok: false; error: string };

function isNxDomain(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException)?.code;
  return code === "ENOTFOUND" || code === "ENODATA";
}

/** true = posta alır, false = kesin almaz, null = bilinemedi */
async function domainReceivesMail(domain: string): Promise<boolean | null> {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0) return true;
  } catch (err) {
    if (!isNxDomain(err)) return null;
  }
  // MX yoksa RFC gereği teslimat A/AAAA kaydına denenir
  try {
    const a = await dns.resolve4(domain);
    if (a.length > 0) return true;
  } catch (err) {
    if (!isNxDomain(err)) return null;
  }
  try {
    const aaaa = await dns.resolve6(domain);
    if (aaaa.length > 0) return true;
  } catch (err) {
    if (!isNxDomain(err)) return null;
  }
  return false;
}

export async function checkEmailDomain(email: string): Promise<EmailDomainCheck> {
  const atIndex = email.lastIndexOf("@");
  if (atIndex < 0) {
    return { ok: false, error: "Geçerli bir e-posta adresi girin." };
  }
  const domain = email.slice(atIndex + 1).trim().toLowerCase();
  if (!domain || !domain.includes(".")) {
    return { ok: false, error: "Geçerli bir e-posta adresi girin." };
  }

  const suggestion = TYPO_SUGGESTIONS[domain];
  if (suggestion) {
    return {
      ok: false,
      error: `E-posta adresinde yazım hatası görünüyor ("${domain}"). "${suggestion}" mi demek istedin?`,
    };
  }

  if (DISPOSABLE.has(domain)) {
    return {
      ok: false,
      error: "Geçici (kullan-at) e-posta adresleriyle kayıt olunamaz. Lütfen gerçek e-posta adresini kullan.",
    };
  }

  if (KNOWN_GOOD.has(domain)) return { ok: true };

  const cached = dnsCache.get(domain);
  let receives: boolean | null;
  if (cached && Date.now() - cached.at < DNS_CACHE_TTL_MS) {
    receives = cached.receives;
  } else {
    // DNS yavaşsa kullanıcıyı bekletme — belirsiz say (fail-open)
    receives = await Promise.race([
      domainReceivesMail(domain),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), DNS_TIMEOUT_MS)),
    ]);
    if (receives !== null) {
      dnsCache.set(domain, { receives, at: Date.now() });
    }
  }

  if (receives === false) {
    return {
      ok: false,
      error: `"${domain}" alan adı e-posta kabul etmiyor. Lütfen geçerli bir e-posta adresi gir — doğrulama linki bu adrese gönderilecek.`,
    };
  }

  return { ok: true };
}
