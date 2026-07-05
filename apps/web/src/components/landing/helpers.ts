export function formatPackagePrice(price: number, currency = "TRY"): string {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency || "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `₺${Math.round(price).toLocaleString("tr-TR")}`;
  }
}

export function formatCount(value: number): string {
  if (!value) {
    return "0";
  }

  if (value >= 1000) {
    return `+${value.toLocaleString("tr-TR")}`;
  }

  return `${value}`;
}

export function getBrandInitials(brandName: string): string {
  const parts = brandName
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "CO";
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

export function buildWhatsAppUrl(brandName: string, whatsappNumber?: string | null): string {
  const message = `Merhaba, ${brandName} koçluk hizmeti hakkında bilgi almak istiyorum.`;
  const cleanNumber = whatsappNumber?.replace(/[^+\d]/g, "").replace(/^\+/, "") || "";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Package CTA URL — koç kodu ile öğrenci kayıt akışına yönlendirir.
 * Öğrenciler artık paket butonuna basınca doğrudan kayıt sayfasına gidiyor;
 * orada koçlarından aldıkları kod ile hesap açıyorlar.
 *
 * `brandName`, `packageName`, `whatsappNumber`, `email` parametreleri geriye
 * dönük uyum için tutulur (ileride farklı CTA modları desteklenebilir).
 */
export function buildPackageInquiryUrl(
  brandName: string,
  packageName: string,
  _whatsappNumber?: string | null,
  _email?: string | null,
  fallbackUrl?: string,
): { href: string; external: boolean } {
  void brandName;
  void packageName;
  // /site/[domain]/auth?tab=register — kullanıcı bunu auth/page.tsx'te yakalıyor
  if (fallbackUrl) {
    const sep = fallbackUrl.includes("?") ? "&" : "?";
    return { href: `${fallbackUrl}${sep}tab=register`, external: false };
  }
  return { href: "#", external: false };
}

export function withFallbackFeatures(features: string[]): string[] {
  if (features.length > 0) {
    return features;
  }

  return [
    "Kişiye özel antrenman programı",
    "Kişiye özel beslenme planı",
    "Haftalık takip ve revize",
  ];
}
