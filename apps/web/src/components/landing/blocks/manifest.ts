// Section Builder — Block Manifest (component'ler dahil; client + render bundle)
//
// METADATA için `manifest-meta.ts` (server-safe). Bu dosya component'leri ekler.
// Server action'lar import etmemeli — manifest-meta'yı kullanmalı.

import type { ComponentType } from "react";

// Hero — Faz 2 yenilemesi: Sinematik korundu + 4 Framer-ilhamlı yeni hero
import { HeroCinematic } from "./hero/HeroCinematic";
import { HeroDisplayBold } from "./hero/HeroDisplayBold";
import { HeroItalicCinema } from "./hero/HeroItalicCinema";
import { HeroSplitAccent } from "./hero/HeroSplitAccent";
import { HeroAnimatedImmersion } from "./hero/HeroAnimatedImmersion";

// Features — Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni feature
import { FeatureSplitShowcase } from "./features/FeatureSplitShowcase";
import { FeatureImageBento } from "./features/FeatureImageBento";
import { FeatureStickyReveal } from "./features/FeatureStickyReveal";
import { FeatureFlipCards } from "./features/FeatureFlipCards";
import { FeatureStackedCards } from "./features/FeatureStackedCards";

// Stats — Faz 2 yenilemesi: eski 7 value-* bloğu silindi; 5 Framer-ilhamlı yeni stats
import { StatsFlowingStrip } from "./stats/StatsFlowingStrip";
import { StatsScrollStage } from "./stats/StatsScrollStage";
import { StatsGradientBold } from "./stats/StatsGradientBold";
import { StatsMotivational } from "./stats/StatsMotivational";
import { StatsSimpleCard } from "./stats/StatsSimpleCard";

// How It Works — Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok
import { HowTabbedSteps } from "./how-it-works/HowTabbedSteps";
import { HowStackedSteps } from "./how-it-works/HowStackedSteps";
import { HowSimpleGrid } from "./how-it-works/HowSimpleGrid";
import { HowNumberedList } from "./how-it-works/HowNumberedList";
import { HowColorfulCards } from "./how-it-works/HowColorfulCards";

// Testimonials — Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok.
// Hepsi koç panelinden girilen `content.testimonials` verisini kullanır.
import { TestimonialStackScroll } from "./testimonials/TestimonialStackScroll";
import { TestimonialSpotlightSlider } from "./testimonials/TestimonialSpotlightSlider";
import { TestimonialStoryCards } from "./testimonials/TestimonialStoryCards";
import { TestimonialBigCard } from "./testimonials/TestimonialBigCard";
import { TestimonialDualMarquee } from "./testimonials/TestimonialDualMarquee";

// CTA
import { CtaFluidBackground } from "./cta/CtaFluidBackground";
import { CtaBrutalist } from "./cta/CtaBrutalist";
import { CtaVideoBackground } from "./cta/CtaVideoBackground";
import { CtaCurtis } from "./cta/CtaCurtis";
import { CtaGoalz } from "./cta/CtaGoalz";
import { CtaProgrex } from "./cta/CtaProgrex";

// Pricing — Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok.
// Hepsi koçun ayarlardan girdiği `content.packages` verisini kullanır.
import { PricingSportix } from "./pricing/PricingSportix";
import { PricingPeak } from "./pricing/PricingPeak";
import { PricingGoalz } from "./pricing/PricingGoalz";
import { PricingJimmentor } from "./pricing/PricingJimmentor";
import { PricingCurtis } from "./pricing/PricingCurtis";

// FAQ — Faz 2 yenilemesi: eski 7 blok silindi; 5 Framer-ilhamlı yeni blok.
import { FaqOutpace } from "./faq/FaqOutpace";
import { FaqFightness } from "./faq/FaqFightness";
import { FaqFitFlow } from "./faq/FaqFitFlow";
import { FaqYogava } from "./faq/FaqYogava";
import { FaqSensoria } from "./faq/FaqSensoria";

// Footer
import { FooterYogus } from "./footer/FooterYogus";
import { FooterGymix } from "./footer/FooterGymix";
import { FooterAthlex } from "./footer/FooterAthlex";
import { FooterJimMentor } from "./footer/FooterJimMentor";
import { FooterPeak } from "./footer/FooterPeak";

// Navbar — Faz 2 yenilemesi: eski 7 navbar silindi; 6 Framer-ilhamlı yeni navbar.
// Hepsi nav-helpers ile entegre: sekmeler bölümlere kaydırır, CTA kayıt/iletişime
// gider, yazı renkleri arka plana göre otomatik açık/koyu olur.
import { NavbarFithu } from "./navbar/NavbarFithu";
import { NavbarTransform } from "./navbar/NavbarTransform";
import { NavbarSensoria } from "./navbar/NavbarSensoria";
import { NavbarGoalz } from "./navbar/NavbarGoalz";
import { NavbarDanzia } from "./navbar/NavbarDanzia";
import { NavbarGympro } from "./navbar/NavbarGympro";

// About
import { AboutFightness } from "./about/AboutFightness";
import { AboutProgrex } from "./about/AboutProgrex";
import { AboutCurtis } from "./about/AboutCurtis";
import { AboutGymix } from "./about/AboutGymix";
import { AboutFitence } from "./about/AboutFitence";

// Transformations — Faz 2 yenilemesi (6 Framer-ilhamlı tasarım → 5 yeni blok)
import { TransformationsCinematicStrip } from "./transformations/TransformationsCinematicStrip";
import { TransformationsStatCard } from "./transformations/TransformationsStatCard";
import { TransformationsStoryCarousel } from "./transformations/TransformationsStoryCarousel";
import { TransformationsCompareSlider } from "./transformations/TransformationsCompareSlider";
import { TransformationsScratchReveal } from "./transformations/TransformationsScratchReveal";

import {
  BLOCK_META,
  type BlockMeta,
  type BlockCategory,
  type PlanTier,
} from "./manifest-meta";

export type { BlockCategory, PlanTier } from "./manifest-meta";
export {
  BLOCK_META,
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getCategoryColor,
  getBlockMeta,
  validateBlockIdMeta,
} from "./manifest-meta";

export interface BlockDefinition extends BlockMeta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
}

// id -> Component eşlemesi (sadece bu dosya bilir)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<string, ComponentType<any>> = {
  // Navbar
  "navbar-fithu": NavbarFithu,
  "navbar-transform": NavbarTransform,
  "navbar-sensoria": NavbarSensoria,
  "navbar-goalz": NavbarGoalz,
  "navbar-danzia": NavbarDanzia,
  "navbar-gympro": NavbarGympro,

  // Hero
  "hero-cinematic": HeroCinematic,
  "hero-display-bold": HeroDisplayBold,
  "hero-italic-cinema": HeroItalicCinema,
  "hero-split-accent": HeroSplitAccent,
  "hero-animated-immersion": HeroAnimatedImmersion,

  // Stats
  "stats-flowing-strip": StatsFlowingStrip,
  "stats-scroll-stage": StatsScrollStage,
  "stats-gradient-bold": StatsGradientBold,
  "stats-motivational": StatsMotivational,
  "stats-simple-card": StatsSimpleCard,

  // Features
  "feature-split-showcase": FeatureSplitShowcase,
  "feature-image-bento": FeatureImageBento,
  "feature-sticky-reveal": FeatureStickyReveal,
  "feature-flip-cards": FeatureFlipCards,
  "feature-stacked-cards": FeatureStackedCards,

  // How It Works
  "how-tabbed-steps": HowTabbedSteps,
  "how-stacked-steps": HowStackedSteps,
  "how-simple-grid": HowSimpleGrid,
  "how-numbered-list": HowNumberedList,
  "how-colorful-cards": HowColorfulCards,

  // Transformations
  "transformations-cinematic-strip": TransformationsCinematicStrip,
  "transformations-stat-card": TransformationsStatCard,
  "transformations-story-carousel": TransformationsStoryCarousel,
  "transformations-compare-slider": TransformationsCompareSlider,
  "transformations-scratch-reveal": TransformationsScratchReveal,

  // Testimonials
  "testimonial-stack-scroll": TestimonialStackScroll,
  "testimonial-spotlight-slider": TestimonialSpotlightSlider,
  "testimonial-story-cards": TestimonialStoryCards,
  "testimonial-big-card": TestimonialBigCard,
  "testimonial-dual-marquee": TestimonialDualMarquee,

  // Packages
  "pricing-sportix": PricingSportix,
  "pricing-peak": PricingPeak,
  "pricing-goalz": PricingGoalz,
  "pricing-jimmentor": PricingJimmentor,
  "pricing-curtis": PricingCurtis,

  // FAQ
  "faq-outpace": FaqOutpace,
  "faq-fightness": FaqFightness,
  "faq-fitflow": FaqFitFlow,
  "faq-yogava": FaqYogava,
  "faq-sensoria": FaqSensoria,

  // CTA
  "cta-fluid-background": CtaFluidBackground,
  "cta-brutalist": CtaBrutalist,
  "cta-video-background": CtaVideoBackground,
  "cta-curtis": CtaCurtis,
  "cta-goalz": CtaGoalz,
  "cta-progrex": CtaProgrex,

  // About
  "about-fightness": AboutFightness,
  "about-progrex": AboutProgrex,
  "about-curtis": AboutCurtis,
  "about-gymix": AboutGymix,
  "about-fitence": AboutFitence,

  // Footer
  "footer-yogus": FooterYogus,
  "footer-gymix": FooterGymix,
  "footer-athlex": FooterAthlex,
  "footer-jimmentor": FooterJimMentor,
  "footer-peak": FooterPeak,
};

// Build full BlockDefinition list from META + COMPONENTS
export const BLOCKS: BlockDefinition[] = BLOCK_META.map((m) => ({
  ...m,
  component: COMPONENTS[m.id]!,
}));

const BY_ID: Map<string, BlockDefinition> = (() => {
  const map = new Map<string, BlockDefinition>();
  for (const b of BLOCKS) {
    map.set(b.id, b);
    if (b.aliases) for (const a of b.aliases) map.set(a, b);
  }
  return map;
})();

const BY_CATEGORY: Map<BlockCategory, BlockDefinition[]> = (() => {
  const m = new Map<BlockCategory, BlockDefinition[]>();
  for (const b of BLOCKS) {
    if (b.deprecated) continue;
    if (!m.has(b.category)) m.set(b.category, []);
    m.get(b.category)!.push(b);
  }
  return m;
})();

export function getBlock(id: string): BlockDefinition | undefined {
  return BY_ID.get(id);
}

export function getBlocksByCategory(category: BlockCategory): BlockDefinition[] {
  return BY_CATEGORY.get(category) ?? [];
}

export function validateBlockId(id: string): boolean {
  return BY_ID.has(id);
}

export function resolveBlockId(id: string): string | null {
  const b = BY_ID.get(id);
  return b ? b.id : null;
}
