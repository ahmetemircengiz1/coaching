"use client";

import type { LandingThemeId } from "@/src/theme/landingThemes";
import type { LandingThemeContent } from "./types";
import type { LandingConfig, SectionId } from "./config";
import { DEFAULT_LANDING_CONFIG } from "./config";
import type { ThemeLayout } from "./section-types";

import { theme1Layout } from "./themes/LandingTheme1";
import { theme2Layout } from "./themes/LandingTheme2";
import { theme3Layout } from "./themes/LandingTheme3";
import { theme4Layout } from "./themes/LandingTheme4";
import { theme5Layout } from "./themes/LandingTheme5";
import { theme6Layout } from "./themes/LandingTheme6";

const layouts: Record<string, ThemeLayout> = {
  "theme-1": theme1Layout,
  "theme-2": theme2Layout,
  "theme-3": theme3Layout,
  "theme-4": theme4Layout,
  "theme-5": theme5Layout,
  "theme-6": theme6Layout,
};

interface DynamicLandingRendererProps {
  themeId: LandingThemeId;
  content: LandingThemeContent;
  landingConfig: LandingConfig;
}

export function DynamicLandingRenderer({ themeId, content, landingConfig }: DynamicLandingRendererProps) {
  const layout = layouts[themeId] || layouts["theme-1"];
  const config = landingConfig || DEFAULT_LANDING_CONFIG;

  // Sections that require data to render
  const skipIfEmpty: Partial<Record<SectionId, boolean>> = {
    transformations: content.transformations.length === 0,
  };

  return (
    <layout.Wrapper>
      <layout.Navbar content={content} />
      {config.sections
        .filter((s) => s.enabled)
        .filter((s) => !skipIfEmpty[s.id])
        .map((s) => {
          const Section = layout.sections[s.id];
          if (!Section) return null;
          return <Section key={s.id} content={content} variant={s.variant} />;
        })}
    </layout.Wrapper>
  );
}
