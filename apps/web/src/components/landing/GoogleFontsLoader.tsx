import { getFontById, getGoogleFontsUrl } from "@/src/theme/fonts";

interface GoogleFontsLoaderProps {
  headingFont?: string | null;
  bodyFont?: string | null;
  extraFontIds?: Array<string | null | undefined>;
}

function buildExtraUrl(extraFontIds: Array<string | null | undefined>, alreadyLoaded: Set<string>): string | null {
  const queries: string[] = [];
  for (const id of extraFontIds) {
    if (!id || alreadyLoaded.has(id)) continue;
    const font = getFontById(id);
    if (!font || font.id === "inter") continue;
    alreadyLoaded.add(id);
    const weights = font.weights.join(";");
    queries.push(`family=${encodeURIComponent(font.name)}:wght@${weights}`);
  }
  if (!queries.length) return null;
  return `https://fonts.googleapis.com/css2?${queries.join("&")}&display=swap`;
}

export function GoogleFontsLoader({ headingFont, bodyFont, extraFontIds }: GoogleFontsLoaderProps) {
  const primaryUrl = getGoogleFontsUrl(headingFont || "inter", bodyFont || "inter");
  const loaded = new Set<string>();
  if (headingFont) loaded.add(headingFont);
  if (bodyFont) loaded.add(bodyFont);

  const extrasUrl = extraFontIds?.length ? buildExtraUrl(extraFontIds, loaded) : null;

  if (!primaryUrl && !extrasUrl) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {primaryUrl && <link rel="stylesheet" href={primaryUrl} />}
      {extrasUrl && <link rel="stylesheet" href={extrasUrl} />}
    </>
  );
}

