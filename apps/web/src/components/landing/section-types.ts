import type { ReactNode } from "react";
import type { LandingThemeContent } from "./types";
import type { SectionId } from "./config";

export interface SectionRendererProps {
  content: LandingThemeContent;
  variant: number;
}

export interface ThemeLayout {
  Wrapper: (props: { children: ReactNode }) => ReactNode;
  Navbar: (props: { content: LandingThemeContent }) => ReactNode;
  sections: Record<SectionId, (props: SectionRendererProps) => ReactNode>;
}
