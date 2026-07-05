// Section Builder — Block manifest METADATA (server-safe, no component imports)
//
// Bu dosya ID, kategori, isim, planTier gibi sadece metadata'yı içerir.
// Server action'lar (validation, plan gating) BUNUN üzerinden çalışır;
// böylece build sırasında client component'leri server bundle'a girmez.
//
// Component'lere ihtiyaç duyulan yerlerde (renderer, picker UI) `manifest.ts`
// import edilir — o dosya buradaki metadata'yı component eşlemesi ile birleştirir.

export type BlockCategory =
  | "navbar"
  | "hero"
  | "stats"
  | "features"
  | "howItWorks"
  | "transformations"
  | "testimonials"
  | "packages"
  | "faq"
  | "cta"
  | "about"
  | "footer";

export type PlanTier = "starter" | "pro" | "elite";

export interface BlockMeta {
  id: string;
  category: BlockCategory;
  name: string;
  description?: string;
  thumbnailUrl: string;
  planTier: PlanTier;
  deprecated?: boolean;
  aliases?: string[];
  /** Faz 2: blok'a ilham veren referans site URL'leri (telif kaydı). */
  inspiredBy?: string[];
}

const t = (id: string) => `/blocks/${id}.png`;

export const BLOCK_META: BlockMeta[] = [
  // ── NAVBAR ──
  // Faz 2 yenilemesi: eski 7 navbar silindi; 6 Framer-ilhamlı yeni navbar eklendi.
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "navbar-fithu", category: "navbar", name: "Yüzer Menü", description: "Ortada yüzen pill; menü tuşuna basınca dikey sekme kartı açılır", thumbnailUrl: t("navbar-fithu"), planTier: "elite", aliases: ["navbar-floating-pill", "navbar-centered"], inspiredBy: ["https://fithu.framer.website/"] },
  { id: "navbar-transform", category: "navbar", name: "Köşeli Bar", description: "Tam genişlik bar, yatay sekmeler, eğik neon CTA", thumbnailUrl: t("navbar-transform"), planTier: "elite", aliases: ["navbar-mega-menu"], inspiredBy: ["https://transformfitness.framer.website/"] },
  { id: "navbar-sensoria", category: "navbar", name: "Tam Ekran Menü", description: "Sade üst bar; menü tuşu tam ekran büyük sekme overlay'i açar", thumbnailUrl: t("navbar-sensoria"), planTier: "elite", aliases: ["navbar-minimal-dark"], inspiredBy: ["https://sensoria.framer.website/"] },
  { id: "navbar-goalz", category: "navbar", name: "Kutulu Sekmeler", description: "Her sekme kendi kenarlıklı kutusunda; dış çizgili CTA", thumbnailUrl: t("navbar-goalz"), planTier: "elite", aliases: ["navbar-split-app"], inspiredBy: ["https://goalz-template.framer.website/"] },
  { id: "navbar-danzia", category: "navbar", name: "Yüzer Cam Çubuk", description: "Yüzen yarı saydam buzlu cam çubuk; renkli marka, pill CTA", thumbnailUrl: t("navbar-danzia"), planTier: "elite", aliases: ["navbar-glass", "navbar-modern-glass"], inspiredBy: ["https://danzia.framer.website/"] },
  { id: "navbar-gympro", category: "navbar", name: "Açık Bar", description: "Şeffaf bar; sekmeler kutusuz, aktif sekme vurgulu, dolu CTA", thumbnailUrl: t("navbar-gympro"), planTier: "elite", aliases: ["navbar-brutalist"], inspiredBy: ["https://gympro.framer.website/"] },

  // ── HERO ──
  // Faz 2 yenilemesi: Sinematik korunuyor; eski 7 hero silindi; 4 yeni Framer-ilhamlı hero eklendi.
  {
    id: "hero-cinematic",
    category: "hero",
    name: "Sinematik",
    description: "Geniş arka plan, büyük başlık, sinematik atmosfer",
    thumbnailUrl: t("hero-cinematic"),
    planTier: "elite",
    aliases: ["hero-modern-dark"],
  },
  {
    id: "hero-display-bold",
    category: "hero",
    name: "Big Display",
    description: "Devasa tipografi, üst trust strip, yan media card",
    thumbnailUrl: t("hero-display-bold"),
    planTier: "elite",
    inspiredBy: [
      "https://fightness.framer.website/",
      "https://goalz-template.framer.website/",
    ],
    // Eski hero'lardan migrate gelmiş config'leri yeni varyanta yönlendir
    aliases: ["hero-fitflow", "hero-strongx"],
  },
  {
    id: "hero-italic-cinema",
    category: "hero",
    name: "Sinema İtalik",
    description: "Sinematik foto + italic+sans karışım başlık + avatar stack",
    thumbnailUrl: t("hero-italic-cinema"),
    planTier: "elite",
    inspiredBy: ["https://hermes-template.framer.website/"],
    aliases: ["hero-aluna-glass", "hero-fithu-center"],
  },
  {
    id: "hero-split-accent",
    category: "hero",
    name: "Yan Foto Split",
    description: "50/50 split, vurgu kelimeli başlık, dekoratif accent shapes",
    thumbnailUrl: t("hero-split-accent"),
    planTier: "elite",
    inspiredBy: ["https://gymone.framer.website/"],
    aliases: ["hero-transform-split"],
  },
  {
    id: "hero-animated-immersion",
    category: "hero",
    name: "Animasyonlu Sürükleyici",
    description: "Cursor parallax + letter reveal + floating testimonial card",
    thumbnailUrl: t("hero-animated-immersion"),
    planTier: "elite",
    inspiredBy: ["https://athlex.framer.website/"],
    aliases: ["hero-empower-app", "hero-elite-demo"],
  },

  // ── STATS ──
  // Faz 2 yenilemesi: eski 7 value-* bloğu silindi; 5 Framer-ilhamlı yeni stats.
  // Eski blockId'ler aliases ile yeni bloklara migrate edilir (no breaking change).
  {
    id: "stats-flowing-strip",
    category: "stats",
    name: "Akan Şerit",
    description: "Yavaşça akan sonsuz şerit — istatistik + foto kartları dönüşümlü",
    thumbnailUrl: t("stats-flowing-strip"),
    planTier: "elite",
    inspiredBy: ["https://rep-republic-gym.framer.website/"],
    aliases: ["value-ticker", "value-image-split"],
  },
  {
    id: "stats-scroll-stage",
    category: "stats",
    name: "Kaydırmalı Sahne",
    description: "Sticky sahne — kaydırdıkça dev istatistikler tek tek belirir",
    thumbnailUrl: t("stats-scroll-stage"),
    planTier: "elite",
    inspiredBy: ["https://rimz.framer.website/"],
    aliases: ["value-big-numbers", "stats-minimal-row"],
  },
  {
    id: "stats-gradient-bold",
    category: "stats",
    name: "Renkli Büyük Sayılar",
    description: "Dev tipografi + renkli gradient sayılar, soluk arka plan kelimesi",
    thumbnailUrl: t("stats-gradient-bold"),
    planTier: "elite",
    inspiredBy: ["https://fitflow-template.framer.website/"],
    aliases: ["value-typography"],
  },
  {
    id: "stats-motivational",
    category: "stats",
    name: "Motivasyon Sahnesi",
    description: "Tam ekran motive edici başlık + dikey ayraçlı istatistik satırı",
    thumbnailUrl: t("stats-motivational"),
    planTier: "elite",
    inspiredBy: ["https://outpace.framer.media/"],
    aliases: ["value-progress"],
  },
  {
    id: "stats-simple-card",
    category: "stats",
    name: "Sade Kart",
    description: "Kapalı kart içinde 4'lü minimal istatistik satırı",
    thumbnailUrl: t("stats-simple-card"),
    planTier: "elite",
    inspiredBy: ["https://peakfitness.framer.website/"],
    aliases: ["value-grid", "value-hexagon-grid"],
  },

  // ── FEATURES ──
  // Faz 2 yenilemesi: eski 7 feature bloğu silindi; 5 Framer-ilhamlı yeni feature.
  // Eski blockId'ler aliases ile yeni bloklara migrate edilir (no breaking change).
  {
    id: "feature-split-showcase",
    category: "features",
    name: "Yan Panel & Özellikler",
    description: "Sol metin + 2x2 ikonlu özellik ızgarası, sağ accent panel",
    thumbnailUrl: t("feature-split-showcase"),
    planTier: "elite",
    inspiredBy: ["https://transformfitness.framer.website/"],
    aliases: ["feature-zigzag", "feature-minimal-list"],
  },
  {
    id: "feature-image-bento",
    category: "features",
    name: "Bento Kartlar",
    description: "Ortalanmış başlık + büyük bento kart ızgarası (biri accent renkli)",
    thumbnailUrl: t("feature-image-bento"),
    planTier: "elite",
    inspiredBy: ["https://curtis.framer.media/"],
    aliases: ["feature-bento-grid"],
  },
  {
    id: "feature-sticky-reveal",
    category: "features",
    name: "Sabit Panel & Sıralı Geliş",
    description: "Sol panel sabit, kaydırdıkça sağda özellikler tek tek belirir",
    thumbnailUrl: t("feature-sticky-reveal"),
    planTier: "elite",
    inspiredBy: ["https://outpace.framer.media/"],
    aliases: ["feature-sticky-images", "feature-interactive-tabs"],
  },
  {
    id: "feature-flip-cards",
    category: "features",
    name: "Tıkla-Aç Kartlar",
    description: "Sade kartlar; tıklandığında açıklamalı hale genişler",
    thumbnailUrl: t("feature-flip-cards"),
    planTier: "elite",
    inspiredBy: ["https://gymone.framer.website/"],
    aliases: ["feature-hover-cards"],
  },
  {
    id: "feature-stacked-cards",
    category: "features",
    name: "İstiflenen Kartlar",
    description: "Sol panel sabit, kaydırdıkça kartlar cüzdan gibi üst üste istiflenir",
    thumbnailUrl: t("feature-stacked-cards"),
    planTier: "elite",
    inspiredBy: ["https://peakfitness.framer.website/"],
    aliases: ["feature-carousel"],
  },

  // ── HOW IT WORKS ──
  // Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok.
  // Eski blockId'ler aliases ile yeni bloklara migrate edilir (no breaking change).
  {
    id: "how-tabbed-steps",
    category: "howItWorks",
    name: "Sekmeli Adımlar",
    description: "Yan yana 3 sekme; sekmeye dokununca o adımın içeriği belirir",
    thumbnailUrl: t("how-tabbed-steps"),
    planTier: "elite",
    inspiredBy: ["https://progrex.framer.website/"],
    aliases: ["how-interactive-path", "how-video-steps"],
  },
  {
    id: "how-stacked-steps",
    category: "howItWorks",
    name: "İstiflenen Adımlar",
    description: "Sol panel sabit, kaydırdıkça adım kartları üst üste istiflenir",
    thumbnailUrl: t("how-stacked-steps"),
    planTier: "elite",
    inspiredBy: ["https://fightness.framer.website/"],
    aliases: ["how-sticky-scroll"],
  },
  {
    id: "how-simple-grid",
    category: "howItWorks",
    name: "Sade Izgara",
    description: "Ortalanmış başlık + yan yana 4 sade adım kartı",
    thumbnailUrl: t("how-simple-grid"),
    planTier: "elite",
    inspiredBy: ["https://athlex.framer.website/"],
    aliases: ["how-horizontal-cards"],
  },
  {
    id: "how-numbered-list",
    category: "howItWorks",
    name: "Numaralı Liste",
    description: "Sol metin + görsel + CTA, sağda numaralı (01-05) adım listesi",
    thumbnailUrl: t("how-numbered-list"),
    planTier: "elite",
    inspiredBy: ["https://rachel-pt.framer.website/"],
    aliases: ["how-timeline-steps", "how-zigzag-connectors"],
  },
  {
    id: "how-colorful-cards",
    category: "howItWorks",
    name: "Renkli Kartlar",
    description: "2x2 canlı renkli gradient kartlar + süzülen dambıl animasyonu",
    thumbnailUrl: t("how-colorful-cards"),
    planTier: "elite",
    inspiredBy: ["https://fitflow-template.framer.website/"],
    aliases: ["how-glowing-list"],
  },

  // ── TRANSFORMATIONS ──
  // Faz 2 yenilemesi: eski 7 dönüşüm bloğu silindi; 5 yeni Framer-ilhamlı blok eklendi.
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "transformations-cinematic-strip", category: "transformations", name: "Sinematik Şerit", thumbnailUrl: t("transformations-cinematic-strip"), planTier: "elite", aliases: ["transformations-slider", "transformations-carousel", "transformations-fade-in-out"], inspiredBy: ["https://fightness.framer.website/"] },
  { id: "transformations-stat-card", category: "transformations", name: "İstatistik Kartı", thumbnailUrl: t("transformations-stat-card"), planTier: "elite", aliases: ["transformations-text-heavy"], inspiredBy: ["https://fitnix.framer.website/"] },
  { id: "transformations-story-carousel", category: "transformations", name: "Hikaye Carousel", thumbnailUrl: t("transformations-story-carousel"), planTier: "elite", aliases: ["transformations-focus"], inspiredBy: ["https://curtis.framer.media/"] },
  { id: "transformations-compare-slider", category: "transformations", name: "Karşılaştırma Sürgüsü", thumbnailUrl: t("transformations-compare-slider"), planTier: "elite", aliases: ["transformations-masonry"], inspiredBy: ["https://fitflow-template.framer.website/"] },
  { id: "transformations-scratch-reveal", category: "transformations", name: "Kazı-Çıkar", thumbnailUrl: t("transformations-scratch-reveal"), planTier: "elite", aliases: ["transformations-bento", "transformations-interactive-hover"], inspiredBy: ["https://progrex.framer.website/"] },

  // ── TESTIMONIALS ──
  // Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok eklendi.
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "testimonial-stack-scroll", category: "testimonials", name: "Kayan İstif", description: "Bölüm sabitlenir; kaydırdıkça yorum kartları alttan gelip dağınık istiflenir", thumbnailUrl: t("testimonial-stack-scroll"), planTier: "elite", aliases: ["testimonial-masonry", "testimonial-trust-banner"], inspiredBy: ["https://fitence.framer.website/"] },
  { id: "testimonial-spotlight-slider", category: "testimonials", name: "Spot Işığı Sürgü", description: "Solda sabit başlık + oklar, sağda foto + yorum kartı", thumbnailUrl: t("testimonial-spotlight-slider"), planTier: "elite", aliases: ["testimonial-video-gallery"], inspiredBy: ["https://evotrack.framer.website/"] },
  { id: "testimonial-story-cards", category: "testimonials", name: "Hikaye Kartları", description: "Yan yana yorum kartları — alıntı ikonu, avatar, ok + nokta gezinme", thumbnailUrl: t("testimonial-story-cards"), planTier: "elite", aliases: ["testimonial-avatar-ring", "testimonial-carousel-cards"], inspiredBy: ["https://curtis.framer.media/"] },
  { id: "testimonial-big-card", category: "testimonials", name: "Büyük Kart", description: "Tek seferde büyük geniş kart — foto + yıldız + büyük alıntı", thumbnailUrl: t("testimonial-big-card"), planTier: "elite", aliases: ["testimonial-big-quote"], inspiredBy: ["https://outpace.framer.media/"] },
  { id: "testimonial-dual-marquee", category: "testimonials", name: "Çift Yönlü Akış", description: "Çerçeve içinde solda sabit metin, sağda zıt yönlü iki sütun akan cam kartlar", thumbnailUrl: t("testimonial-dual-marquee"), planTier: "elite", aliases: ["testimonial-marquee"], inspiredBy: ["https://hermes-template.framer.website/"] },

  // ── PACKAGES ──
  // Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok eklendi.
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "pricing-sportix", category: "packages", name: "Açık Kartlar", description: "Açık temalı, üst kenara taşan etiketli, tikli özellik listeli kartlar", thumbnailUrl: t("pricing-sportix"), planTier: "elite", aliases: ["pricing-glass-cards", "pricing-glassmorphism"], inspiredBy: ["https://sportix.framer.website/"] },
  { id: "pricing-peak", category: "packages", name: "Popüler Vurgulu", description: "Koyu kartlar; ortadaki kart kenarlık + Popüler etiketiyle öne çıkar", thumbnailUrl: t("pricing-peak"), planTier: "elite", aliases: ["pricing-highlight", "pricing-toggle"], inspiredBy: ["https://peakfitness.framer.website/"] },
  { id: "pricing-goalz", category: "packages", name: "Sıkışık Tipografi", description: "Arkada dev soluk kelime, sıkışık fontlu kartlar, pill buton", thumbnailUrl: t("pricing-goalz"), planTier: "elite", aliases: ["pricing-minimal-table"], inspiredBy: ["https://goalz-template.framer.website/"] },
  { id: "pricing-jimmentor", category: "packages", name: "Ağır Başlık", description: "İki tonlu ağır başlık; dev fiyatlı kartlar, ortadaki vurgulu", thumbnailUrl: t("pricing-jimmentor"), planTier: "elite", aliases: ["pricing-dark-neon", "pricing-tiered-list"], inspiredBy: ["https://jimmentor.framer.website/"] },
  { id: "pricing-curtis", category: "packages", name: "Kart + Liste", description: "Yükseltilmiş kart kutusu, altında ayrı özellik listesi; öne çıkan etiketli", thumbnailUrl: t("pricing-curtis"), planTier: "elite", aliases: ["pricing-bento-cards"], inspiredBy: ["https://curtis.framer.media/"] },

  // ── FAQ ──
  // Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok eklendi.
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "faq-outpace", category: "faq", name: "Ortalanmış Akordeon", description: "Ortalanmış tek sütun akordeon, vurgu renkli kare +/− butonları", thumbnailUrl: t("faq-outpace"), planTier: "elite", aliases: ["faq-clean-accordion", "faq-dark-neon"], inspiredBy: ["https://outpace.framer.media/"] },
  { id: "faq-fightness", category: "faq", name: "Görsel + Akordeon", description: "Devasa başlık; solda görsel + paragraf, sağda beyaz akordeon", thumbnailUrl: t("faq-fightness"), planTier: "elite", aliases: ["faq-two-column"], inspiredBy: ["https://fightness.framer.website/"] },
  { id: "faq-fitflow", category: "faq", name: "Yan Görsel & Soru", description: "Solda büyük görsel, sağda iki tonlu başlık + beyaz akordeon", thumbnailUrl: t("faq-fitflow"), planTier: "elite", aliases: ["faq-grid-cards"], inspiredBy: ["https://fitflow-template.framer.website/"] },
  { id: "faq-yogava", category: "faq", name: "Numaralı Liste", description: "Solda başlık + CTA, sağda numaralı kenarlıklı liste maddeleri", thumbnailUrl: t("faq-yogava"), planTier: "elite", aliases: ["faq-floating-boxes", "faq-searchable"], inspiredBy: ["https://yogava.framer.website/"] },
  { id: "faq-sensoria", category: "faq", name: "İletişim Kartı & Akordeon", description: "Solda 'Bize ulaşın' iletişim kartı, sağda koyu akordeon", thumbnailUrl: t("faq-sensoria"), planTier: "elite", aliases: ["faq-sticky-sidebar"], inspiredBy: ["https://sensoria.framer.website/"] },

  // ── CTA ──
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "cta-fluid-background", category: "cta", name: "Akışkan Arkaplan", thumbnailUrl: t("cta-fluid-background"), planTier: "elite" },
  { id: "cta-brutalist", category: "cta", name: "Brütalist Banner", thumbnailUrl: t("cta-brutalist"), planTier: "elite" },
  { id: "cta-video-background", category: "cta", name: "Video Arkaplanlı", thumbnailUrl: t("cta-video-background"), planTier: "elite" },
  { id: "cta-curtis", category: "cta", name: "Ortalanmış Görsel", description: "Tam ekran arkaplan görseli üzerinde ortalanmış başlık + pill buton", thumbnailUrl: t("cta-curtis"), planTier: "elite", aliases: ["cta-glass-box", "cta-lead-form", "cta-lead-multi-step"], inspiredBy: ["https://curtis.framer.media/"] },
  { id: "cta-goalz", category: "cta", name: "Dev Tipografi", description: "Tam ekran arkaplan üzerinde dev büyük-harf başlık, etiket + alt alıntılar", thumbnailUrl: t("cta-goalz"), planTier: "elite", aliases: ["cta-floating-island", "cta-lead-popup", "cta-countdown"], inspiredBy: ["https://goalz-template.framer.website/"] },
  { id: "cta-progrex", category: "cta", name: "Köşe Yerleşim", description: "Minimalist — sol üstte dev başlık, sol altta buton, geniş görsel alanı", thumbnailUrl: t("cta-progrex"), planTier: "elite", aliases: ["cta-split-dark", "cta-lead-sticky-bar"], inspiredBy: ["https://progrex.framer.website/"] },

  // ── ABOUT ──
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "about-fightness", category: "about", name: "Dev İsim & Foto", description: "Solda dev marka adı + bio, sağda kare portre + 3 istatistik", thumbnailUrl: t("about-fightness"), planTier: "elite", aliases: ["about-typography"], inspiredBy: ["https://fightness.framer.website/"] },
  { id: "about-progrex", category: "about", name: "Alıntı Kartı", description: "Açık zemin: foto + beyaz alıntı kartı + 3 istatistik kutusu", thumbnailUrl: t("about-progrex"), planTier: "elite", aliases: ["about-classic-split"], inspiredBy: ["https://progrex.framer.website/"] },
  { id: "about-curtis", category: "about", name: "Rozet & Lokasyon", description: "Solda rozet+lokasyon kartları, ortada portre, sağda bio + sosyal", thumbnailUrl: t("about-curtis"), planTier: "elite", aliases: ["about-neon-card"], inspiredBy: ["https://curtis.framer.media/"] },
  { id: "about-gymix", category: "about", name: "Dev Tipografi & Çift Foto", description: "Koyu: dev 3 satırlık başlık, altta iki portre + ortada büyük istatistik", thumbnailUrl: t("about-gymix"), planTier: "elite", aliases: ["about-interactive"], inspiredBy: ["https://gymix.framer.website/"] },
  { id: "about-fitence", category: "about", name: "İkili İstatistik", description: "Dev başlık (soluk + parlak), 2 büyük istatistik + iki portre", thumbnailUrl: t("about-fitence"), planTier: "elite", aliases: ["about-behind-the-scenes"], inspiredBy: ["https://fitence.framer.website/"] },

  // ── FOOTER / İLETİŞİM ──
  // Eski ID'ler aliases olarak korunuyor (mevcut koç sitelerinde kırılma olmaması için).
  { id: "footer-yogus", category: "footer", name: "Başlıklı 4 Sütun", description: "Üstte dev başlık + tanıtım, altta menü / iletişim / keşfet / sosyal", thumbnailUrl: t("footer-yogus"), planTier: "elite", aliases: ["footer-multi-column", "footer-minimal"], inspiredBy: ["https://yogus.framer.website/"] },
  { id: "footer-gymix", category: "footer", name: "Görsel & Dev Tipografi", description: "Solda görsel, büyük büyük-harf menü + iletişim, altta marka filigranı", thumbnailUrl: t("footer-gymix"), planTier: "elite", aliases: ["footer-big-logo", "footer-grid-app"], inspiredBy: ["https://gymix.framer.website/"] },
  { id: "footer-athlex", category: "footer", name: "Logo & Üç Sütun", description: "Solda logo + açıklama + sosyal ikonlar, sağda üç bağlantı sütunu", thumbnailUrl: t("footer-athlex"), planTier: "elite", aliases: ["footer-social-focused"], inspiredBy: ["https://athlex.framer.website/"] },
  { id: "footer-jimmentor", category: "footer", name: "Bülten & Kanallar", description: "İki menü sütunu, ortada bülten kutusu, sağda dikey iletişim kanalları", thumbnailUrl: t("footer-jimmentor"), planTier: "elite", aliases: ["footer-newsletter-mega"], inspiredBy: ["https://jimmentor.framer.website/"] },
  { id: "footer-peak", category: "footer", name: "İletişim Kartı", description: "Solda marka + CTA + linkler, sağda kenarlıklı iletişim kartı", thumbnailUrl: t("footer-peak"), planTier: "elite", aliases: ["footer-wave-dark"], inspiredBy: ["https://peakfitness.framer.website/"] },
];

const META_BY_ID: Map<string, BlockMeta> = (() => {
  const m = new Map<string, BlockMeta>();
  for (const b of BLOCK_META) {
    m.set(b.id, b);
    if (b.aliases) for (const a of b.aliases) m.set(a, b);
  }
  return m;
})();

export function getBlockMeta(id: string): BlockMeta | undefined {
  return META_BY_ID.get(id);
}

export function validateBlockIdMeta(id: string): boolean {
  return META_BY_ID.has(id);
}

export const ALL_CATEGORIES: BlockCategory[] = [
  "navbar",
  "hero",
  "stats",
  "features",
  "howItWorks",
  "transformations",
  "testimonials",
  "packages",
  "faq",
  "cta",
  "about",
  "footer",
];

export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  navbar: "Üst Menü",
  hero: "Hero",
  stats: "İstatistikler",
  features: "Özellikler",
  howItWorks: "Nasıl Çalışır",
  transformations: "Dönüşümler",
  testimonials: "Yorumlar",
  packages: "Paketler",
  faq: "SSS",
  cta: "CTA Banner",
  about: "Hakkımda",
  footer: "Footer",
};

export const CATEGORY_COLORS: Record<BlockCategory, { bg: string; accent: string }> = {
  navbar: { bg: "#1a1a2e", accent: "#7c3aed" },
  hero: { bg: "#0f172a", accent: "#06b6d4" },
  stats: { bg: "#1e1b4b", accent: "#f59e0b" },
  features: { bg: "#0c1e2e", accent: "#10b981" },
  howItWorks: { bg: "#1a1a2e", accent: "#3b82f6" },
  transformations: { bg: "#181818", accent: "#ec4899" },
  testimonials: { bg: "#1f2937", accent: "#fbbf24" },
  packages: { bg: "#0f0f0f", accent: "#ccff00" },
  faq: { bg: "#111827", accent: "#a78bfa" },
  cta: { bg: "#0c0a09", accent: "#ef4444" },
  about: { bg: "#1a1a1a", accent: "#fb923c" },
  footer: { bg: "#0a0a0a", accent: "#94a3b8" },
};

export function getCategoryColor(category: BlockCategory): { bg: string; accent: string } {
  return CATEGORY_COLORS[category] ?? { bg: "#1a1a1a", accent: "#7c3aed" };
}
