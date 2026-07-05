// Section Builder — hazır şablon kütüphanesi
//
// Her şablon manifest'teki 12 kategoriyi (navbar → hero → about → stats →
// features → howItWorks → transformations → testimonials → packages →
// faq → cta → footer) tam olarak bir kez içerir. Kategoriden seçilen
// variant ve renk-font paleti şablona kimliğini verir. Tasarımla
// uğraşmak istemeyen koçlar için tek tıkla hazır site senaryosu.

import type { EliteLandingConfig } from "../elite-config";

export interface BuilderTemplate {
  id: string;
  name: string;
  description: string;
  /** Önizleme için bir hero blok ID'si (thumbnail tarafından kullanılır) */
  previewHeroBlockId: string;
  config: EliteLandingConfig;
}

const sectionId = (cat: string) => `${cat}-${Math.random().toString(36).slice(2, 7)}`;

/** Şablon sıralaması — tüm şablonlarda aynı 12'li sırayı zorlar. */
function buildSections(blocks: {
  navbar: string;
  hero: string;
  about: string;
  stats: string;
  features: string;
  howItWorks: string;
  transformations: string;
  testimonials: string;
  packages: string;
  faq: string;
  cta: string;
  footer: string;
}): EliteLandingConfig["sections"] {
  return [
    { id: sectionId("nav"), category: "navbar", enabled: true, blockId: blocks.navbar },
    { id: sectionId("hero"), category: "hero", enabled: true, blockId: blocks.hero },
    { id: sectionId("about"), category: "about", enabled: true, blockId: blocks.about },
    { id: sectionId("stats"), category: "stats", enabled: true, blockId: blocks.stats },
    { id: sectionId("feat"), category: "features", enabled: true, blockId: blocks.features },
    { id: sectionId("how"), category: "howItWorks", enabled: true, blockId: blocks.howItWorks },
    { id: sectionId("trans"), category: "transformations", enabled: true, blockId: blocks.transformations },
    { id: sectionId("test"), category: "testimonials", enabled: true, blockId: blocks.testimonials },
    { id: sectionId("pack"), category: "packages", enabled: true, blockId: blocks.packages },
    { id: sectionId("faq"), category: "faq", enabled: true, blockId: blocks.faq },
    { id: sectionId("cta"), category: "cta", enabled: true, blockId: blocks.cta },
    { id: sectionId("foot"), category: "footer", enabled: true, blockId: blocks.footer },
  ];
}

// ─────────────────────────────────────────────────────────────
// 1. Klasik Spor Koçu — sade, güçlü, satış odaklı
// ─────────────────────────────────────────────────────────────
const CLASSIC_SPORTS: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-gympro",
    hero: "hero-cinematic",
    about: "about-fightness",
    stats: "stats-gradient-bold",
    features: "feature-image-bento",
    howItWorks: "how-numbered-list",
    transformations: "transformations-cinematic-strip",
    testimonials: "testimonial-dual-marquee",
    packages: "pricing-sportix",
    faq: "faq-outpace",
    cta: "cta-curtis",
    footer: "footer-gymix",
  }),
  globalStyles: {
    primaryColor: "#ccff00",
    backgroundColor: "#050505",
    textColor: "#ffffff",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md",
  },
};

// ─────────────────────────────────────────────────────────────
// 2. Beslenme Uzmanı — zarif, organik, sıcak palet
// ─────────────────────────────────────────────────────────────
const NUTRITION: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-fithu",
    hero: "hero-italic-cinema",
    about: "about-progrex",
    stats: "stats-simple-card",
    features: "feature-split-showcase",
    howItWorks: "how-stacked-steps",
    transformations: "transformations-scratch-reveal",
    testimonials: "testimonial-stack-scroll",
    packages: "pricing-curtis",
    faq: "faq-fightness",
    cta: "cta-goalz",
    footer: "footer-yogus",
  }),
  globalStyles: {
    primaryColor: "#d4a574",
    backgroundColor: "#1a1410",
    textColor: "#fff5e6",
    fontFamilyHeading: "Playfair Display, serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "lg",
  },
};

// ─────────────────────────────────────────────────────────────
// 3. Premium Lüks — koyu, editorial, tipografi-ağırlıklı
// ─────────────────────────────────────────────────────────────
const PREMIUM_LUX: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-sensoria",
    hero: "hero-cinematic",
    about: "about-fightness",
    stats: "stats-motivational",
    features: "feature-stacked-cards",
    howItWorks: "how-tabbed-steps",
    transformations: "transformations-story-carousel",
    testimonials: "testimonial-big-card",
    packages: "pricing-peak",
    faq: "faq-sensoria",
    cta: "cta-progrex",
    footer: "footer-peak",
  }),
  globalStyles: {
    primaryColor: "#c9a961",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    fontFamilyHeading: "Cormorant Garamond, serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "none",
  },
};

// ─────────────────────────────────────────────────────────────
// 4. Minimal Modern — koyu zemin üzerinde sade, modern, profesyonel
// (Açık zeminli versiyonu, blokların hardcoded beyaz metinleriyle
//  okunabilirlik sorunu yaratıyordu — koyu varyantta güvenli kontrast.)
// ─────────────────────────────────────────────────────────────
const MINIMAL_MODERN: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-danzia",
    hero: "hero-display-bold",
    about: "about-curtis",
    stats: "stats-flowing-strip",
    features: "feature-flip-cards",
    howItWorks: "how-colorful-cards",
    transformations: "transformations-stat-card",
    testimonials: "testimonial-spotlight-slider",
    packages: "pricing-goalz",
    faq: "faq-fitflow",
    cta: "cta-brutalist",
    footer: "footer-athlex",
  }),
  globalStyles: {
    primaryColor: "#ff5733",
    backgroundColor: "#0a0a0a",
    textColor: "#f5f5f5",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "sm",
  },
};

// ─────────────────────────────────────────────────────────────
// 5. Transformation Odaklı — öğrenci sonuçlarını öne çıkar
// ─────────────────────────────────────────────────────────────
const TRANSFORMATION_FOCUS: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-transform",
    hero: "hero-split-accent",
    about: "about-fitence",
    stats: "stats-flowing-strip",
    features: "feature-stacked-cards",
    howItWorks: "how-numbered-list",
    transformations: "transformations-compare-slider",
    testimonials: "testimonial-story-cards",
    packages: "pricing-jimmentor",
    faq: "faq-yogava",
    cta: "cta-fluid-background",
    footer: "footer-jimmentor",
  }),
  globalStyles: {
    primaryColor: "#00d4ff",
    backgroundColor: "#000814",
    textColor: "#ffffff",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "lg",
  },
};

// ─────────────────────────────────────────────────────────────
// 6. Online Eğitmen — eğitim/kurs odaklı, content-heavy
// ─────────────────────────────────────────────────────────────
const ONLINE_INSTRUCTOR: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-goalz",
    hero: "hero-animated-immersion",
    about: "about-curtis",
    stats: "stats-scroll-stage",
    features: "feature-sticky-reveal",
    howItWorks: "how-simple-grid",
    transformations: "transformations-stat-card",
    testimonials: "testimonial-dual-marquee",
    packages: "pricing-peak",
    faq: "faq-yogava",
    cta: "cta-progrex",
    footer: "footer-athlex",
  }),
  globalStyles: {
    primaryColor: "#7c3aed",
    backgroundColor: "#0f0717",
    textColor: "#ffffff",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md",
  },
};

// ─────────────────────────────────────────────────────────────
// 7. Vahşi Spor Salonu — brutalist, kırmızı-siyah, agresif
// ─────────────────────────────────────────────────────────────
const RAW_GYM: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-gympro",
    hero: "hero-display-bold",
    about: "about-fightness",
    stats: "stats-gradient-bold",
    features: "feature-image-bento",
    howItWorks: "how-stacked-steps",
    transformations: "transformations-cinematic-strip",
    testimonials: "testimonial-stack-scroll",
    packages: "pricing-sportix",
    faq: "faq-outpace",
    cta: "cta-brutalist",
    footer: "footer-gymix",
  }),
  globalStyles: {
    primaryColor: "#ff3322",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    fontFamilyHeading: "Anton, Impact, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "none",
  },
};

// ─────────────────────────────────────────────────────────────
// 8. Yoga & Pilates — koyu şarap zemin + toz pembe vurgu + krem metin
// (Krem zeminli versiyon, blokların hardcoded açık-renk metinleriyle
//  zayıf kontrast yaratıyordu — koyu zemin zarafeti koruyor.)
// ─────────────────────────────────────────────────────────────
const YOGA_PILATES: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-danzia",
    hero: "hero-italic-cinema",
    about: "about-gymix",
    stats: "stats-scroll-stage",
    features: "feature-stacked-cards",
    howItWorks: "how-tabbed-steps",
    transformations: "transformations-story-carousel",
    testimonials: "testimonial-spotlight-slider",
    packages: "pricing-curtis",
    faq: "faq-sensoria",
    cta: "cta-goalz",
    footer: "footer-yogus",
  }),
  globalStyles: {
    primaryColor: "#c98a8e",
    backgroundColor: "#1a0f12",
    textColor: "#f5e6d8",
    fontFamilyHeading: "Cormorant Garamond, serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "lg",
  },
};

// ─────────────────────────────────────────────────────────────
// 9. CrossFit Patlama — sarı/siyah, yüksek enerji
// ─────────────────────────────────────────────────────────────
const CROSSFIT: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-transform",
    hero: "hero-animated-immersion",
    about: "about-fightness",
    stats: "stats-gradient-bold",
    features: "feature-image-bento",
    howItWorks: "how-stacked-steps",
    transformations: "transformations-cinematic-strip",
    testimonials: "testimonial-dual-marquee",
    packages: "pricing-jimmentor",
    faq: "faq-outpace",
    cta: "cta-brutalist",
    footer: "footer-jimmentor",
  }),
  globalStyles: {
    primaryColor: "#ffe600",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    fontFamilyHeading: "Bebas Neue, Impact, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "none",
  },
};

// ─────────────────────────────────────────────────────────────
// 10. Kişisel Antrenör — mavi profesyonel, kurumsal
// ─────────────────────────────────────────────────────────────
const PERSONAL_TRAINER: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-fithu",
    hero: "hero-split-accent",
    about: "about-progrex",
    stats: "stats-scroll-stage",
    features: "feature-stacked-cards",
    howItWorks: "how-tabbed-steps",
    transformations: "transformations-stat-card",
    testimonials: "testimonial-story-cards",
    packages: "pricing-goalz",
    faq: "faq-fitflow",
    cta: "cta-curtis",
    footer: "footer-athlex",
  }),
  globalStyles: {
    primaryColor: "#2563eb",
    backgroundColor: "#f4f4f5",
    textColor: "#18181b",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md",
  },
};

// ─────────────────────────────────────────────────────────────
// 11. Koşu & Maraton — yeşil enerji, outdoor, çevik
// ─────────────────────────────────────────────────────────────
const RUNNING: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-goalz",
    hero: "hero-display-bold",
    about: "about-fitence",
    stats: "stats-flowing-strip",
    features: "feature-flip-cards",
    howItWorks: "how-colorful-cards",
    transformations: "transformations-scratch-reveal",
    testimonials: "testimonial-spotlight-slider",
    packages: "pricing-sportix",
    faq: "faq-yogava",
    cta: "cta-fluid-background",
    footer: "footer-peak",
  }),
  globalStyles: {
    primaryColor: "#10b981",
    backgroundColor: "#020617",
    textColor: "#ffffff",
    fontFamilyHeading: "Oswald, Impact, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md",
  },
};

// ─────────────────────────────────────────────────────────────
// 12. Sağlık & Wellness Koçu — turkuaz, sıcak, güven verici
// ─────────────────────────────────────────────────────────────
const WELLNESS: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-sensoria",
    hero: "hero-italic-cinema",
    about: "about-progrex",
    stats: "stats-simple-card",
    features: "feature-sticky-reveal",
    howItWorks: "how-numbered-list",
    transformations: "transformations-story-carousel",
    testimonials: "testimonial-big-card",
    packages: "pricing-peak",
    faq: "faq-sensoria",
    cta: "cta-progrex",
    footer: "footer-yogus",
  }),
  globalStyles: {
    primaryColor: "#06b6d4",
    backgroundColor: "#f0fdfa",
    textColor: "#0a3a3a",
    fontFamilyHeading: "Lora, Georgia, serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "lg",
  },
};

// ─────────────────────────────────────────────────────────────
// 13. Veteran Sporcu — klasik kırmızı, koyu, prestij
// ─────────────────────────────────────────────────────────────
const VETERAN_ATHLETE: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-gympro",
    hero: "hero-cinematic",
    about: "about-fightness",
    stats: "stats-motivational",
    features: "feature-stacked-cards",
    howItWorks: "how-numbered-list",
    transformations: "transformations-compare-slider",
    testimonials: "testimonial-story-cards",
    packages: "pricing-jimmentor",
    faq: "faq-outpace",
    cta: "cta-curtis",
    footer: "footer-gymix",
  }),
  globalStyles: {
    primaryColor: "#b91c1c",
    backgroundColor: "#1c1917",
    textColor: "#fafaf9",
    fontFamilyHeading: "Playfair Display, serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md",
  },
};

// ─────────────────────────────────────────────────────────────
// 14. Genç Influencer — pop pembe, sosyal-medya tarzı
// ─────────────────────────────────────────────────────────────
const YOUNG_INFLUENCER: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-goalz",
    hero: "hero-animated-immersion",
    about: "about-curtis",
    stats: "stats-scroll-stage",
    features: "feature-image-bento",
    howItWorks: "how-colorful-cards",
    transformations: "transformations-stat-card",
    testimonials: "testimonial-dual-marquee",
    packages: "pricing-goalz",
    faq: "faq-fitflow",
    cta: "cta-brutalist",
    footer: "footer-athlex",
  }),
  globalStyles: {
    primaryColor: "#ec4899",
    backgroundColor: "#18181b",
    textColor: "#ffffff",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "lg",
  },
};

// ─────────────────────────────────────────────────────────────
// 15. Zihin & Beden — lavanta pastel, mindful, dengeli
// ─────────────────────────────────────────────────────────────
const MIND_BODY: EliteLandingConfig = {
  sections: buildSections({
    navbar: "navbar-sensoria",
    hero: "hero-italic-cinema",
    about: "about-gymix",
    stats: "stats-motivational",
    features: "feature-split-showcase",
    howItWorks: "how-tabbed-steps",
    transformations: "transformations-story-carousel",
    testimonials: "testimonial-big-card",
    packages: "pricing-curtis",
    faq: "faq-sensoria",
    cta: "cta-goalz",
    footer: "footer-peak",
  }),
  globalStyles: {
    primaryColor: "#a78bfa",
    backgroundColor: "#1e1b4b",
    textColor: "#f5f3ff",
    fontFamilyHeading: "DM Serif Display, serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "lg",
  },
};

export const BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: "classic-sports",
    name: "Klasik Spor Koçu",
    description: "Sade, güçlü ve satış odaklı bir yapı. Yeni başlayanlar için ideal başlangıç noktası.",
    previewHeroBlockId: "hero-cinematic",
    config: CLASSIC_SPORTS,
  },
  {
    id: "nutrition",
    name: "Beslenme Uzmanı",
    description: "Zarif, organik tonlar ve sıcak palet. Diyetisyen ve beslenme koçları için.",
    previewHeroBlockId: "hero-italic-cinema",
    config: NUTRITION,
  },
  {
    id: "premium-lux",
    name: "Premium Lüks",
    description: "Koyu, editöryal ve tipografi ağırlıklı. Üst segment koçluk için prestijli görünüm.",
    previewHeroBlockId: "hero-cinematic",
    config: PREMIUM_LUX,
  },
  {
    id: "minimal-modern",
    name: "Minimal Modern",
    description: "Açık alan, sade tasarım, profesyonel his. İçerik odaklı koçluğa uygun.",
    previewHeroBlockId: "hero-display-bold",
    config: MINIMAL_MODERN,
  },
  {
    id: "transformation-focus",
    name: "Transformation Odaklı",
    description: "Öğrenci sonuçlarını öne çıkaran kanıt-yönelimli yapı. Görsel transformation'a sahip koçlar için.",
    previewHeroBlockId: "hero-split-accent",
    config: TRANSFORMATION_FOCUS,
  },
  {
    id: "online-instructor",
    name: "Online Eğitmen",
    description: "Eğitim ve kurs odaklı, içerik açıklamalarına alan veren yapı.",
    previewHeroBlockId: "hero-animated-immersion",
    config: ONLINE_INSTRUCTOR,
  },
  {
    id: "raw-gym",
    name: "Vahşi Spor Salonu",
    description: "Brutalist, kırmızı-siyah ve agresif. Powerlifting / strength koçları için sokak tarzı.",
    previewHeroBlockId: "hero-display-bold",
    config: RAW_GYM,
  },
  {
    id: "yoga-pilates",
    name: "Yoga & Pilates",
    description: "Toz pembe ve krem tonlarında zarif, dingin bir yapı. Yoga ve pilates eğitmenleri için.",
    previewHeroBlockId: "hero-italic-cinema",
    config: YOGA_PILATES,
  },
  {
    id: "crossfit",
    name: "CrossFit Patlama",
    description: "Sarı-siyah, yüksek enerji, kondisyon antrenörleri ve CrossFit box'ları için.",
    previewHeroBlockId: "hero-animated-immersion",
    config: CROSSFIT,
  },
  {
    id: "personal-trainer",
    name: "Kişisel Antrenör",
    description: "Mavi-gri profesyonel ton, kurumsal his. Birebir özel ders veren PT'ler için.",
    previewHeroBlockId: "hero-split-accent",
    config: PERSONAL_TRAINER,
  },
  {
    id: "running",
    name: "Koşu & Maraton",
    description: "Yeşil enerji, outdoor hissi. Koşu, triatlon ve dayanıklılık koçları için.",
    previewHeroBlockId: "hero-display-bold",
    config: RUNNING,
  },
  {
    id: "wellness",
    name: "Sağlık & Wellness",
    description: "Turkuaz, sıcak ve güven verici. Wellness, sağlıklı yaşam ve life coach'ları için.",
    previewHeroBlockId: "hero-italic-cinema",
    config: WELLNESS,
  },
  {
    id: "veteran-athlete",
    name: "Veteran Sporcu",
    description: "Klasik kırmızı, koyu ton, prestijli yapı. Tecrübeli antrenörler ve hocalar için.",
    previewHeroBlockId: "hero-cinematic",
    config: VETERAN_ATHLETE,
  },
  {
    id: "young-influencer",
    name: "Genç Influencer",
    description: "Pop pembe, sosyal medya tarzı, hareketli. Genç koçlar ve fitness influencer'ları için.",
    previewHeroBlockId: "hero-animated-immersion",
    config: YOUNG_INFLUENCER,
  },
  {
    id: "mind-body",
    name: "Zihin & Beden",
    description: "Lavanta pastel ton, mindful ve dengeli. Holistik koçlar ve mind-body uzmanları için.",
    previewHeroBlockId: "hero-italic-cinema",
    config: MIND_BODY,
  },
];

export function getTemplate(id: string): BuilderTemplate | undefined {
  return BUILDER_TEMPLATES.find((t) => t.id === id);
}

/**
 * Şablon yüklerken her bölüme yeni id ver — orijinal template'i kirletme.
 */
export function instantiateTemplate(template: BuilderTemplate): EliteLandingConfig {
  return {
    sections: template.config.sections.map((s) => ({
      ...s,
      id: `${s.category}-${Math.random().toString(36).slice(2, 9)}`,
    })),
    globalStyles: { ...template.config.globalStyles! },
  };
}
