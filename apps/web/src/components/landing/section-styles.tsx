import type { TextEffect, TextAlign } from "./types";
import { getFontFamilyCSS } from "@/src/theme/fonts";

export type SectionId = "hero" | "stats" | "transformations" | "system" | "packages" | "faq" | "contact";

export const SECTION_IDS: SectionId[] = [
  "hero",
  "stats",
  "transformations",
  "system",
  "packages",
  "faq",
  "contact",
];

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero",
  stats: "İstatistikler",
  transformations: "Dönüşümler",
  system: "Sistem Nasıl İşler",
  packages: "Paketler",
  faq: "SSS",
  contact: "İletişim / Footer",
};

function effectCSS(effect: TextEffect, color: string): string {
  switch (effect) {
    case "neon":
      return `text-shadow: 0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color};`;
    case "glow":
      return `text-shadow: 0 0 12px rgba(255,255,255,0.55), 0 0 24px rgba(255,255,255,0.3);`;
    case "shadow":
      return `text-shadow: 2px 2px 6px rgba(0,0,0,0.55);`;
    case "outline":
      return `-webkit-text-stroke: 1px currentColor; text-shadow: none;`;
    default:
      return "";
  }
}

function weightCSS(weight: string): string {
  switch (weight) {
    case "normal":
      return "font-weight: 400 !important;";
    case "medium":
      return "font-weight: 500 !important;";
    case "semibold":
      return "font-weight: 600 !important;";
    case "bold":
      return "font-weight: 700 !important;";
    case "black":
      return "font-weight: 900 !important;";
    default:
      return "";
  }
}

function alignCSS(align: TextAlign): string {
  return `text-align: ${align} !important;`;
}

interface SectionStyleInput {
  color?: string;
  effect?: TextEffect;
  align?: TextAlign;
  scale?: number;
  weight?: string;
}

function readSection(texts: Record<string, string> | null | undefined, id: SectionId): SectionStyleInput {
  if (!texts) return {};
  const color = texts[`${id}TextColor`];
  const effect = (texts[`${id}TextEffect`] as TextEffect | undefined) || undefined;
  const align = (texts[`${id}TextAlign`] as TextAlign | undefined) || undefined;
  const scaleRaw = texts[`${id}TextScale`];
  const scale = scaleRaw ? Number(scaleRaw) : undefined;
  const weight = texts[`${id}TextWeight`];
  return { color, effect, align, scale: Number.isFinite(scale) ? scale : undefined, weight };
}

function flexJustifyFor(align: TextAlign): string {
  switch (align) {
    case "left":
      return "flex-start";
    case "right":
      return "flex-end";
    default:
      return "center";
  }
}

function buildRulesFor(id: SectionId, s: SectionStyleInput): string {
  // Hero already renders its own inline styling in theme components — skip to avoid !important fights.
  if (id === "hero") return "";

  const scope = `[data-landing-section="${id}"]`;
  const scopeTitle = `${scope} :is(h1,h2,h3,h4,[data-section-heading])`;
  const scopeText = `${scope} :is(p,[data-section-subtitle])`;
  const scopeHeadingBlock = `${scope} [data-section-heading]`;

  const titleDecls: string[] = [];
  const textDecls: string[] = [];
  const rootDecls: string[] = [];
  const headingBlockDecls: string[] = [];

  if (s.color) {
    titleDecls.push(`color: ${s.color} !important;`);
    if (s.effect && s.effect !== "none") {
      titleDecls.push(effectCSS(s.effect, s.color));
    }
  } else if (s.effect && s.effect !== "none") {
    titleDecls.push(effectCSS(s.effect, "#ffffff"));
  }

  if (s.weight) titleDecls.push(weightCSS(s.weight));

  if (s.align) {
    rootDecls.push(alignCSS(s.align));
    titleDecls.push(alignCSS(s.align));
    textDecls.push(alignCSS(s.align));
    const justify = flexJustifyFor(s.align);
    headingBlockDecls.push(alignCSS(s.align));
    headingBlockDecls.push(`justify-content: ${justify} !important;`);
    headingBlockDecls.push(`align-items: ${justify} !important;`);
    if (s.align === "center") {
      headingBlockDecls.push("margin-left: auto !important;", "margin-right: auto !important;");
    } else if (s.align === "right") {
      headingBlockDecls.push("margin-left: auto !important;", "margin-right: 0 !important;");
    } else {
      headingBlockDecls.push("margin-left: 0 !important;", "margin-right: auto !important;");
    }
  }

  if (s.scale && s.scale !== 1) {
    titleDecls.push(`font-size: calc(1em * ${s.scale}) !important;`);
  }

  const rules: string[] = [];
  if (rootDecls.length) rules.push(`${scope} { ${rootDecls.join(" ")} }`);
  if (titleDecls.length) rules.push(`${scopeTitle} { ${titleDecls.join(" ")} }`);
  if (textDecls.length) rules.push(`${scopeText} { ${textDecls.join(" ")} }`);
  if (headingBlockDecls.length) rules.push(`${scopeHeadingBlock} { ${headingBlockDecls.join(" ")} }`);
  return rules.join("\n");
}

function buildPackagesFontRules(landingTexts: Record<string, string>): string {
  const titleFont = landingTexts.packagesTitleFont;
  const cardFont = landingTexts.packagesCardFont;
  const rules: string[] = [];
  if (cardFont) {
    rules.push(
      `[data-landing-section="packages"] { font-family: ${getFontFamilyCSS(cardFont)} !important; }`
    );
  }
  if (titleFont) {
    rules.push(
      `[data-landing-section="packages"] :is(h1,h2,h3,[data-section-heading]) { font-family: ${getFontFamilyCSS(titleFont)} !important; }`
    );
  }
  return rules.join("\n");
}

export function buildSectionStylesCSS(landingTexts: Record<string, string> | null | undefined): string {
  if (!landingTexts) return "";
  const blocks: string[] = [];
  for (const id of SECTION_IDS) {
    const s = readSection(landingTexts, id);
    if (!s.color && !s.effect && !s.align && !s.scale && !s.weight) continue;
    const css = buildRulesFor(id, s);
    if (css) blocks.push(css);
  }
  const packagesFonts = buildPackagesFontRules(landingTexts);
  if (packagesFonts) blocks.push(packagesFonts);
  return blocks.join("\n");
}

export function LandingSectionStyles({
  landingTexts,
}: {
  landingTexts: Record<string, string> | null | undefined;
}) {
  const css = buildSectionStylesCSS(landingTexts);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
