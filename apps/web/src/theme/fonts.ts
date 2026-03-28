// Kademe 2: Küratörlü Google Fonts listesi

export interface FontOption {
  id: string;
  name: string;
  category: "sans-serif" | "serif" | "display";
  weights: number[];
}

export const FONT_OPTIONS: FontOption[] = [
  // Sans-Serif
  { id: "inter", name: "Inter", category: "sans-serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: "poppins", name: "Poppins", category: "sans-serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: "montserrat", name: "Montserrat", category: "sans-serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: "dm-sans", name: "DM Sans", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "space-grotesk", name: "Space Grotesk", category: "sans-serif", weights: [400, 500, 600, 700] },
  { id: "outfit", name: "Outfit", category: "sans-serif", weights: [400, 500, 600, 700, 800] },
  { id: "plus-jakarta-sans", name: "Plus Jakarta Sans", category: "sans-serif", weights: [400, 500, 600, 700, 800] },
  { id: "manrope", name: "Manrope", category: "sans-serif", weights: [400, 500, 600, 700, 800] },
  { id: "raleway", name: "Raleway", category: "sans-serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: "nunito", name: "Nunito", category: "sans-serif", weights: [400, 500, 600, 700, 800, 900] },

  // Serif
  { id: "playfair-display", name: "Playfair Display", category: "serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: "lora", name: "Lora", category: "serif", weights: [400, 500, 600, 700] },
  { id: "merriweather", name: "Merriweather", category: "serif", weights: [400, 700, 900] },
  { id: "crimson-pro", name: "Crimson Pro", category: "serif", weights: [400, 500, 600, 700] },
  { id: "cormorant-garamond", name: "Cormorant Garamond", category: "serif", weights: [400, 500, 600, 700] },

  // Display
  { id: "bebas-neue", name: "Bebas Neue", category: "display", weights: [400] },
  { id: "oswald", name: "Oswald", category: "display", weights: [400, 500, 600, 700] },
  { id: "archivo-black", name: "Archivo Black", category: "display", weights: [400] },
];

export const DEFAULT_HEADING_FONT = "inter";
export const DEFAULT_BODY_FONT = "inter";

export function getFontById(id: string): FontOption | undefined {
  return FONT_OPTIONS.find((f) => f.id === id);
}

export function getFontFamilyCSS(id: string): string {
  const font = getFontById(id);
  if (!font) return "Inter, sans-serif";
  const fallback = font.category === "serif" ? "serif" : "sans-serif";
  return `"${font.name}", ${fallback}`;
}

export function getGoogleFontsUrl(headingFontId: string, bodyFontId: string): string | null {
  const fonts = new Set<string>();

  const heading = getFontById(headingFontId);
  const body = getFontById(bodyFontId);

  if (heading && heading.id !== "inter") {
    const weights = heading.weights.join(";");
    fonts.add(`family=${encodeURIComponent(heading.name)}:wght@${weights}`);
  }
  if (body && body.id !== "inter" && body.id !== headingFontId) {
    const weights = body.weights.join(";");
    fonts.add(`family=${encodeURIComponent(body.name)}:wght@${weights}`);
  }

  if (fonts.size === 0) return null;
  return `https://fonts.googleapis.com/css2?${[...fonts].join("&")}&display=swap`;
}
