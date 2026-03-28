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

export function buildWhatsAppUrl(brandName: string): string {
  const message = `Merhaba, ${brandName} koçluk hizmeti hakkında bilgi almak istiyorum.`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
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
