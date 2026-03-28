import type { CSSProperties } from "react";
import type { LandingThemeDefinition } from "./landingThemes";

export type LandingThemeStyle = CSSProperties &
  Record<string, string>;

export function applyLandingTheme(theme: LandingThemeDefinition): LandingThemeStyle {
  return Object.entries(theme.tokens).reduce((style, [token, value]) => {
    (style as Record<string, string>)[token] = value;
    return style;
  }, {} as LandingThemeStyle);
}
