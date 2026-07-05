// Navbar blokları için ortak entegrasyon yardımcıları.
//
// Amaç: navbar sekmeleri sadece "görüntü" olmasın — gerçek sitelerdeki gibi
// tıklanınca ilgili bölüme kaydırsın, CTA butonu kayıt/iletişim sayfasına
// gitsin. Ayrıca navbar yazıları, altından geçen bölümün rengine göre
// otomatik açık/koyu olsun ki hiçbir senaryoda okunaksız kalmasın.
//
// Bölümler `EliteLandingRenderer` içinde şu attribute'larla işaretlenir:
//   data-section-category : sekme hedefi (scrollToCategory)
//   data-section-bg       : bölümün efektif arka plan rengi (adaptif renk)

import { useEffect, useState } from "react";
import type { MouseEventHandler } from "react";
import type { LandingThemeContent } from "../../types";

export interface NavLink {
  /** Hedef bölüm kategorisi (data-section-category değeriyle eşleşir) */
  category: string;
  /** Sekmede görünecek metin */
  label: string;
}

/** Sabit/floating navbar'ın kapladığı yükseklik — kaydırma offset'i. */
export const NAV_SCROLL_OFFSET = 88;

/**
 * Navbar'da gösterilecek KRİTİK bölümler ve Türkçe etiketleri. Tüm sekmeleri
 * eklemek yerine yalnız dönüşüm sürecinde kritik olan birkaç bölüm gösterilir.
 * Sıralama, sekmelerin soldan sağa dizilişini belirler.
 */
const NAV_CATEGORY_LABELS: NavLink[] = [
  { category: "about", label: "Hakkımda" },
  { category: "transformations", label: "Dönüşümler" },
  { category: "packages", label: "Programlar" },
  { category: "faq", label: "S.S.S." },
];

/**
 * Navbar sekmelerini, sayfada gerçekten var olan kritik bölümlerden türetir.
 * Böylece her sekme tıklanınca gerçekten bir bölüme götürür — ölü link olmaz.
 */
export function getNavLinks(content: LandingThemeContent): NavLink[] {
  const sections = content.eliteConfig?.sections;
  if (!Array.isArray(sections)) return NAV_CATEGORY_LABELS;
  const present = new Set<string>(
    sections.filter((s) => s && s.enabled).map((s) => s.category)
  );
  return NAV_CATEGORY_LABELS.filter((c) => present.has(c.category));
}

/**
 * Verilen kategoriye ait ilk bölüme, navbar yüksekliği kadar boşluk bırakarak
 * yumuşak kaydırır. Builder edit modunda (linkler zaten devre dışı) çağrılmaz.
 */
export function scrollToCategory(category: string): void {
  if (typeof document === "undefined") return;
  const el = document.querySelector<HTMLElement>(
    `[data-section-category="${category}"]`
  );
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

/** Sayfanın en üstüne (hero) kaydırır — logo/marka tıklaması için. */
export function scrollToTop(): void {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * "İletişim" hedefi: artık doğrudan WhatsApp'a göndermez — sayfadaki
 * contact/footer bölümüne yumuşak kaydırır. Böylece kullanıcı koçla istediği
 * kanaldan (telefon, e-posta, WhatsApp, sosyal medya) iletişime geçebilir.
 * Footer bölümü bulunamazsa eski davranışa (WhatsApp → e-posta → kayıt) düşer.
 */
export function scrollToContactSection(content: LandingThemeContent): void {
  if (typeof document !== "undefined") {
    const el =
      document.querySelector<HTMLElement>("[data-contact-anchor]") ||
      document.querySelector<HTMLElement>('[data-section-category="footer"]');
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      return;
    }
  }
  if (typeof window === "undefined") return;
  if (content.whatsappNumber) {
    window.open(content.whatsappUrl, "_blank", "noreferrer");
  } else if (content.email) {
    window.location.href = `mailto:${content.email}`;
  } else {
    window.location.href = content.authUrl;
  }
}

/**
 * Navbar "İletişim" butonu prop'ları: contact/footer bölümüne kaydıran bir
 * `<a>` üretir. `href="#iletisim"` JS kapalıyken bile çapaya atlar.
 */
export function getContactLinkProps(content: LandingThemeContent): {
  href: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
} {
  return {
    href: "#iletisim",
    onClick: (e) => {
      e.preventDefault();
      scrollToContactSection(content);
    },
  };
}

/**
 * "Giriş Yap / Başla" butonu hedefi: öğrencinin kayıt olup panele (dashboard)
 * girdiği auth sayfası. Site içi rota olduğu için target gerekmez.
 */
export function getAuthHref(content: LandingThemeContent): string {
  return content.authUrl;
}

// ─────────────────────────────────────────────────────────────────────────
// Adaptif renk — navbar yazıları altındaki bölümün rengine göre açık/koyu olur
// ─────────────────────────────────────────────────────────────────────────

/** Navbar bileşenlerinin tek tip kullanması için renk paleti. */
export interface NavPalette {
  /** Navbar'ın altındaki arka plan açık renkli mi? */
  isLight: boolean;
  /** Ana yazı rengi (logo, aktif sekme) */
  text: string;
  /** Pasif/ikincil yazı rengi */
  textMuted: string;
  /** Şeffaf navbar'larda okunabilirlik için üstten inen degrade perde */
  scrim: string;
  /** Yarı saydam bar/pill arka planı */
  surface: string;
  /** Daha opak yüzey (açılır menüler, overlay başlığı) */
  surfaceSolid: string;
  /** İnce kenarlık rengi */
  border: string;
}

function parseColor(input: string): { r: number; g: number; b: number } | null {
  let s = (input || "").trim();
  if (!s) return null;
  if (s.startsWith("rgb")) {
    const m = s.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
  }
  if (s.startsWith("#")) s = s.slice(1);
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  if (s.length !== 6) return null;
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  return [r, g, b].some((v) => Number.isNaN(v)) ? null : { r, g, b };
}

/** Bir rengin algılanan parlaklığına göre "açık renk mi" kararını verir. */
export function isLightColor(input: string): boolean {
  const c = parseColor(input);
  if (!c) return false;
  const lum = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
  return lum > 0.55;
}

/** isLight değerine göre tam renk paleti üretir. */
export function getNavPalette(isLight: boolean): NavPalette {
  return isLight
    ? {
        isLight: true,
        text: "#0d0d0f",
        textMuted: "rgba(13,13,15,0.58)",
        scrim:
          "linear-gradient(180deg, rgba(255,255,255,0.66), rgba(255,255,255,0))",
        surface: "rgba(255,255,255,0.78)",
        surfaceSolid: "rgba(252,252,252,0.98)",
        border: "rgba(0,0,0,0.12)",
      }
    : {
        isLight: false,
        text: "#ffffff",
        textMuted: "rgba(255,255,255,0.62)",
        scrim:
          "linear-gradient(180deg, rgba(0,0,0,0.52), rgba(0,0,0,0))",
        surface: "rgba(18,18,21,0.72)",
        surfaceSolid: "rgba(13,13,15,0.98)",
        border: "rgba(255,255,255,0.14)",
      };
}

/**
 * Navbar'ın altından o an geçen bölümün `data-section-bg` rengini izleyerek
 * uygun açık/koyu paleti döndürür. Sayfa kaydırıldıkça otomatik güncellenir.
 *
 * @param fallbackBg İlk render'da (scroll öncesi) kullanılacak arka plan rengi.
 */
export function useAdaptiveNavColor(fallbackBg?: string): NavPalette {
  const [isLight, setIsLight] = useState<boolean>(() =>
    fallbackBg ? isLightColor(fallbackBg) : false
  );

  useEffect(() => {
    const probeY = 42; // navbar yazılarının oturduğu dikey bant
    const compute = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-section-bg]");
      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          const v = els[i].getAttribute("data-section-bg");
          if (v) setIsLight(isLightColor(v));
          return;
        }
      }
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return getNavPalette(isLight);
}

/**
 * O an görünümde olan bölümün kategorisini döndürür (scroll-spy).
 * Navbar'lar aktif sekmeyi vurgulamak için kullanır.
 */
export function useActiveCategory(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const compute = () => {
      const els = document.querySelectorAll<HTMLElement>(
        "[data-section-category]"
      );
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      els.forEach((el) => {
        if (el.getBoundingClientRect().top <= line) {
          current = el.getAttribute("data-section-category");
        }
      });
      setActive(current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return active;
}
