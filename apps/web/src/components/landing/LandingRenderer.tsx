import { LandingTheme1 } from "./themes/LandingTheme1";
import { LandingTheme2 } from "./themes/LandingTheme2";
import { LandingTheme3 } from "./themes/LandingTheme3";
import { LandingTheme4 } from "./themes/LandingTheme4";
import { LandingTheme5 } from "./themes/LandingTheme5";
import { LandingTheme6 } from "./themes/LandingTheme6";
import { EliteLandingRenderer } from "./themes/EliteLandingRenderer";
import { DynamicLandingRenderer } from "./DynamicLandingRenderer";
import { FloatingWhatsApp } from "./shared/FloatingWhatsApp";
import type { LandingThemeComponentProps } from "./types";

function renderTheme(props: LandingThemeComponentProps) {
  if (props.themeId === "theme-elite") {
    return <EliteLandingRenderer content={props.content} />;
  }

  if (props.content.landingConfig) {
    return (
      <DynamicLandingRenderer
        themeId={props.themeId}
        content={props.content}
        landingConfig={props.content.landingConfig}
      />
    );
  }

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

export function LandingRenderer(props: LandingThemeComponentProps) {
  return (
    <>
      {renderTheme(props)}
      <FloatingWhatsApp
        whatsappUrl={props.content.whatsappUrl}
        whatsappNumber={props.content.whatsappNumber}
      />
    </>
  );
}
