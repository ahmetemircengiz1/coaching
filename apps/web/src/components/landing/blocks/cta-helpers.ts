// Hero CTA butonları için ortak hedef çözücü.
//
// Koç, Builder'ın içerik sekmesinden her buton için hedef seçer
// (landingTexts.ctaPrimaryTarget / ctaSecondaryTarget). Seçim yapılmamışsa
// bloğun kendi varsayılanı kullanılır. Bölüm hedefleri sayfadaki
// data-section-category işaretli bölüme yumuşak kaydırır (EliteLandingRenderer
// bu attribute'u her bölüme basar); bölüm sayfada yoksa tıklama boşa düşer.

import type { MouseEventHandler } from "react";
import type { LandingThemeContent } from "../types";
import { scrollToCategory, scrollToContactSection } from "./navbar/nav-helpers";

export type CtaTarget = "auth" | "packages" | "about" | "contact";

export function getCtaProps(
  content: LandingThemeContent,
  target: string | undefined,
  fallback: CtaTarget = "auth"
): { href: string; onClick?: MouseEventHandler<HTMLAnchorElement> } {
  const resolved = (target || fallback) as CtaTarget;
  switch (resolved) {
    case "packages":
    case "about":
      return {
        href: `#${resolved}`,
        onClick: (e) => {
          e.preventDefault();
          scrollToCategory(resolved);
        },
      };
    case "contact":
      return {
        href: "#iletisim",
        onClick: (e) => {
          e.preventDefault();
          scrollToContactSection(content);
        },
      };
    default:
      return { href: content.authUrl };
  }
}
