import { LandingTheme1 } from "./themes/LandingTheme1";
import { LandingTheme2 } from "./themes/LandingTheme2";
import { LandingTheme3 } from "./themes/LandingTheme3";
import { LandingTheme4 } from "./themes/LandingTheme4";
import { LandingTheme5 } from "./themes/LandingTheme5";
import { LandingTheme6 } from "./themes/LandingTheme6";
import { DynamicLandingRenderer } from "./DynamicLandingRenderer";
import type { LandingThemeComponentProps } from "./types";

export function LandingRenderer(props: LandingThemeComponentProps) {
  // landingConfig varsa dinamik renderer kullan (bölüm sırası, açma/kapama, varyant)
  if (props.content.landingConfig) {
    return (
      <DynamicLandingRenderer
        themeId={props.themeId}
        content={props.content}
        landingConfig={props.content.landingConfig}
      />
    );
  }

  // Yoksa mevcut monolitik temalar (geriye uyumlu)
  switch (props.themeId) {
    case "theme-2":
      return <LandingTheme2 {...props} />;
    case "theme-3":
      return <LandingTheme3 {...props} />;
    case "theme-4":
      return <LandingTheme4 {...props} />;
    case "theme-5":
      return <LandingTheme5 {...props} />;
    case "theme-6":
      return <LandingTheme6 {...props} />;
    case "theme-1":
    default:
      return <LandingTheme1 {...props} />;
  }
}
