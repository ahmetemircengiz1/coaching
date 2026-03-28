import { cn } from "@/lib/utils";
import { applyLandingTheme } from "@/src/theme/applyLandingTheme";
import { getLandingTheme } from "@/src/theme/landingThemes";
import { getFontFamilyCSS } from "@/src/theme/fonts";
import { GoogleFontsLoader } from "./GoogleFontsLoader";

export function LandingThemeProvider({
  themeId,
  children,
  className,
  headingFont,
  bodyFont,
}: {
  themeId: string;
  children: React.ReactNode;
  className?: string;
  headingFont?: string | null;
  bodyFont?: string | null;
}) {
  const theme = getLandingTheme(themeId);
  const themeStyle = applyLandingTheme(theme);

  // Font CSS değişkenleri ekle
  const fontStyle: Record<string, string> = {};
  if (headingFont) {
    fontStyle["--font-heading"] = getFontFamilyCSS(headingFont);
  }
  if (bodyFont) {
    fontStyle["--font-body"] = getFontFamilyCSS(bodyFont);
  }

  return (
    <div
      data-landing-theme={theme.id}
      className={cn("min-h-screen", className)}
      style={{ ...themeStyle, ...fontStyle }}
    >
      <GoogleFontsLoader headingFont={headingFont} bodyFont={bodyFont} />
      {children}
    </div>
  );
}
