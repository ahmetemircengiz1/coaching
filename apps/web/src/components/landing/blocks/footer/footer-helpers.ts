// Footer / iletişim blokları için ortak entegrasyon yardımcıları.
//
// Amaç: footer'daki tüm bağlantılar GERÇEKTEN çalışsın — menü linkleri ilgili
// bölüme kaydırsın, telefon `tel:`, e-posta `mailto:`, adres harita linki,
// sosyal medya gerçek profillere gitsin. Koç bu bilgileri ayarlar bölümünden
// (İletişim & Yasal + Sosyal Medya) düzenler; footer onları otomatik okur.

import type { LandingThemeContent } from "../../types";
import { getNavLinks } from "../navbar/nav-helpers";

// ── Menü (bölüm) linkleri ────────────────────────────────────────────────

export interface FooterMenuLink {
  label: string;
  /** Hedef bölüm kategorisi; "__top__" sayfa başına kaydırır. */
  category: string;
}

/** Footer menü sütunu: Ana Sayfa + sayfada var olan kritik bölümler. */
export function getFooterMenuLinks(content: LandingThemeContent): FooterMenuLink[] {
  return [
    { label: "Ana Sayfa", category: "__top__" },
    ...getNavLinks(content).map((l) => ({ label: l.label, category: l.category })),
  ];
}

// ── İletişim kanalları ────────────────────────────────────────────────────

export type ContactKind = "phone" | "email" | "whatsapp" | "address";

export interface ContactItem {
  kind: ContactKind;
  /** Kısa etiket — "Telefon", "E-posta" vb. */
  label: string;
  /** Eylem odaklı etiket — "Bizi Arayın", "E-posta Gönderin" vb. */
  actionLabel: string;
  /** Ham değer — telefon numarası, e-posta adresi, açık adres metni */
  value: string;
  href: string;
  external?: boolean;
}

/** Koçun girdiği iletişim bilgilerinden çalışır kanal listesi üretir. */
export function getContactItems(content: LandingThemeContent): ContactItem[] {
  const items: ContactItem[] = [];
  if (content.contactPhone) {
    items.push({
      kind: "phone",
      label: "Telefon",
      actionLabel: "Bizi Arayın",
      value: content.contactPhone,
      href: `tel:${content.contactPhone.replace(/[^\d+]/g, "")}`,
    });
  }
  if (content.email) {
    items.push({
      kind: "email",
      label: "E-posta",
      actionLabel: "E-posta Gönderin",
      value: content.email,
      href: `mailto:${content.email}`,
    });
  }
  if (content.whatsappNumber) {
    items.push({
      kind: "whatsapp",
      label: "WhatsApp",
      actionLabel: "WhatsApp'tan Yazın",
      value: content.whatsappNumber,
      href: content.whatsappUrl,
      external: true,
    });
  }
  if (content.businessAddress) {
    items.push({
      kind: "address",
      label: "Adres",
      actionLabel: "Bizi Ziyaret Edin",
      value: content.businessAddress,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        content.businessAddress
      )}`,
      external: true,
    });
  }
  return items;
}

// ── Sosyal medya ──────────────────────────────────────────────────────────

export type SocialKey =
  | "instagram"
  | "twitter"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "linkedin";

export interface SocialItem {
  key: SocialKey;
  name: string;
  url: string;
}

/** Koçun doldurduğu sosyal medya profillerinden çalışır link listesi. */
export function getSocialLinks(content: LandingThemeContent): SocialItem[] {
  const defs: { key: SocialKey; name: string; url?: string | null }[] = [
    { key: "instagram", name: "Instagram", url: content.instagramUrl },
    { key: "twitter", name: "X (Twitter)", url: content.twitterUrl },
    { key: "facebook", name: "Facebook", url: content.facebookUrl },
    { key: "youtube", name: "YouTube", url: content.youtubeUrl },
    { key: "tiktok", name: "TikTok", url: content.tiktokUrl },
    { key: "linkedin", name: "LinkedIn", url: content.linkedinUrl },
  ];
  return defs
    .filter((d) => !!d.url)
    .map((d) => ({ key: d.key, name: d.name, url: d.url as string }));
}

// ── Yasal sayfalar ────────────────────────────────────────────────────────

export const LEGAL_LABELS: Record<string, string> = {
  gizlilik: "Gizlilik Politikası",
  kvkk: "KVKK Aydınlatma Metni",
  kullanim: "Kullanım Koşulları",
  mesafeli: "Mesafeli Satış Sözleşmesi",
  iade: "İade ve İptal Politikası",
  cerez: "Çerez Politikası",
};

export interface FooterLinkItem {
  label: string;
  href: string;
}

/** Koçun aktif yasal sayfalarına çalışır link listesi. */
export function getLegalLinks(content: LandingThemeContent): FooterLinkItem[] {
  const slugs = content.legalSlugs?.filter((s) => LEGAL_LABELS[s]) ?? [];
  return slugs.map((s) => ({
    label: LEGAL_LABELS[s],
    href: `/site/${content.domain}/legal/${s}`,
  }));
}
