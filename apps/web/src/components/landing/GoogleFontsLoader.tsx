import { getGoogleFontsUrl } from "@/src/theme/fonts";

interface GoogleFontsLoaderProps {
  headingFont?: string | null;
  bodyFont?: string | null;
}

export function GoogleFontsLoader({ headingFont, bodyFont }: GoogleFontsLoaderProps) {
  const url = getGoogleFontsUrl(headingFont || "inter", bodyFont || "inter");
  if (!url) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={url} />
    </>
  );
}
