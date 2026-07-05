"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import type { LandingThemeContent } from "../types";

interface LandingFooterProps {
  content: LandingThemeContent;
  /** Açık tema mı koyu tema mı (renk seçimi için). Varsayılan: dark */
  variant?: "dark" | "light";
  /** Coach iletişim verisi (Coach modelinden gelir) */
  contactPhone?: string | null;
  businessAddress?: string | null;
  /** Coach legal pages için available slug listesi (legalTexts JSON anahtarları) */
  availableLegalSlugs?: string[];
}

const LEGAL_LINK_LABELS: Record<string, string> = {
  gizlilik: "Gizlilik Politikası",
  kvkk: "KVKK Aydınlatma Metni",
  kullanim: "Kullanım Koşulları",
  mesafeli: "Mesafeli Satış Sözleşmesi",
  iade: "İade ve İptal Politikası",
  cerez: "Çerez Politikası",
};

const ALL_LEGAL_SLUGS = Object.keys(LEGAL_LINK_LABELS);

export function LandingFooter({
  content,
  variant = "dark",
  contactPhone,
  businessAddress,
  availableLegalSlugs,
}: LandingFooterProps) {
  const isDark = variant === "dark";
  const colors = isDark
    ? {
        bg: "#0a0a0a",
        border: "rgba(255,255,255,0.1)",
        title: "#ffffff",
        text: "rgba(255,255,255,0.65)",
        muted: "rgba(255,255,255,0.4)",
        hover: "#ffffff",
      }
    : {
        bg: "#fafafa",
        border: "rgba(0,0,0,0.08)",
        title: "#0a0a0a",
        text: "rgba(0,0,0,0.65)",
        muted: "rgba(0,0,0,0.45)",
        hover: "#0a0a0a",
      };

  const legalSlugs = availableLegalSlugs && availableLegalSlugs.length > 0
    ? availableLegalSlugs.filter((s) => ALL_LEGAL_SLUGS.includes(s))
    : ALL_LEGAL_SLUGS.slice(0, 4); // Default: ilk 4

  const tagline = content.tagline || content.bio || `${content.brandName} ile fitness yolculuğunuzda yanınızdayız.`;
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-6 pt-16 pb-8"
      style={{ backgroundColor: colors.bg, borderTop: `1px solid ${colors.border}` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Sütun 1: Logo + Açıklama */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {content.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.logo} alt={content.brandName} className="h-8 w-auto" />
              ) : (
                <span className="text-xl font-bold tracking-tight" style={{ color: colors.title }}>
                  {content.brandName}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text }}>
              {tagline}
            </p>
            <SocialLinks content={content} colors={colors} />
          </div>

          {/* Sütun 2: Hızlı Erişim */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.title }}>
              Hızlı Erişim
            </h4>
            <ul className="space-y-2.5 text-sm">
              <FooterLink href={`/site/${content.domain}`} colors={colors}>Anasayfa</FooterLink>
              <FooterLink href={`/site/${content.domain}/hakkimizda`} colors={colors}>Hakkımızda</FooterLink>
              <FooterLink href={`/site/${content.domain}#packages`} colors={colors}>Paketler</FooterLink>
              <FooterLink href={`/site/${content.domain}#transformations`} colors={colors}>Dönüşümler</FooterLink>
              <FooterLink href={`/site/${content.domain}/auth`} colors={colors}>Giriş Yap</FooterLink>
            </ul>
          </div>

          {/* Sütun 3: Yasal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.title }}>
              Yasal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {legalSlugs.map((slug) => (
                <FooterLink key={slug} href={`/site/${content.domain}/legal/${slug}`} colors={colors}>
                  {LEGAL_LINK_LABELS[slug]}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Sütun 4: İletişim */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.title }}>
              İletişim
            </h4>
            <ul className="space-y-3 text-sm">
              {content.email && (
                <li className="flex items-start gap-2" style={{ color: colors.text }}>
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.muted }} />
                  <a href={`mailto:${content.email}`} className="hover:underline transition-colors break-all" style={{ color: colors.text }}>
                    {content.email}
                  </a>
                </li>
              )}
              {(contactPhone || content.whatsappNumber) && (
                <li className="flex items-start gap-2" style={{ color: colors.text }}>
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.muted }} />
                  <a
                    href={`tel:${(contactPhone || content.whatsappNumber || "").replace(/\s/g, "")}`}
                    className="hover:underline transition-colors"
                    style={{ color: colors.text }}
                  >
                    {contactPhone || content.whatsappNumber}
                  </a>
                </li>
              )}
              {businessAddress && (
                <li className="flex items-start gap-2" style={{ color: colors.text }}>
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.muted }} />
                  <span>{businessAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: `1px solid ${colors.border}`, color: colors.muted }}
        >
          <p>
            © {year} {content.brandName}. Tüm hakları saklıdır.
          </p>
          <p>
            Bu site{" "}
            <a href="/" target="_blank" rel="noreferrer" className="hover:underline" style={{ color: colors.text }}>
              Shred
            </a>
            {" "}ile oluşturuldu.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, colors, children }: { href: string; colors: { text: string; hover: string }; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="transition-colors hover:opacity-100"
        style={{ color: colors.text }}
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLinks({ content, colors }: { content: LandingThemeContent; colors: { muted: string; hover: string } }) {
  const links = [
    { url: content.instagramUrl, label: "Instagram", icon: "IG" },
    { url: content.facebookUrl, label: "Facebook", icon: "FB" },
    { url: content.tiktokUrl, label: "TikTok", icon: "TT" },
    { url: content.youtubeUrl, label: "YouTube", icon: "YT" },
    { url: content.linkedinUrl, label: "LinkedIn", icon: "LI" },
    { url: content.twitterUrl, label: "Twitter / X", icon: "X" },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="inline-flex w-8 h-8 items-center justify-center rounded-md text-[10px] font-bold border transition-colors hover:scale-105"
          style={{ borderColor: colors.muted, color: colors.muted }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
