"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LandingThemeContent } from "../types";
import { DEFAULT_ELITE_CONFIG, EliteLandingConfig, EliteGlobalStyles } from "../elite-config";
import { getBlock } from "../blocks/manifest";

/** Builder iframe'inden geldiğimizde URL'de ?edit=1 query'si vardır. */
function useIsEditMode(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setEnabled(new URLSearchParams(window.location.search).get("edit") === "1");
  }, []);
  return enabled;
}

function hexToRgb(hex: string): string {
  if (!hex || typeof hex !== "string") return "204, 255, 0";
  const normalized = hex.startsWith("#") ? hex : `#${hex}`;
  if (normalized.length !== 7) return "204, 255, 0";
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function getRadius(radius: string | undefined, multiplier = 1): string {
  const base = 16 * multiplier;
  switch (radius) {
    case "none": return "0px";
    case "sm": return `${base * 0.5}px`;
    case "md": return `${base}px`;
    case "lg": return `${base * 1.5}px`;
    case "full": return "9999px";
    default: return "14px";
  }
}

interface EliteLandingRendererProps {
  content: LandingThemeContent;
}

export function EliteLandingRenderer({ content }: EliteLandingRendererProps) {
  // Veritabanından gelen Elite config'i al, yoksa varsayılan boş şablonu yükle
  const config: EliteLandingConfig = content.eliteConfig || DEFAULT_ELITE_CONFIG;
  const sections = Array.isArray(config.sections) ? config.sections : [];
  const globalStyles = config.globalStyles;
  const isEditMode = useIsEditMode();

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === "undefined" || !window.parent) return;
    window.parent.postMessage(
      { type: "builder:select-section", sectionId, tab: "content" },
      "*"
    );
  };

  const getAnimationVariants = (type?: string): Record<string, unknown> => {
    const easeOut = "easeOut" as const;
    switch (type) {
      case "fade-in":
        return { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.6 } };
      case "slide-up":
        return { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.7, ease: easeOut } };
      case "slide-right":
        return { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.7, ease: easeOut } };
      case "zoom-in":
        return { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.7, ease: easeOut } };
      case "none":
      default:
        return {};
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-x-clip"
      style={{
        backgroundColor: globalStyles?.backgroundColor || "#000000",
        color: globalStyles?.textColor || "#ffffff",
        fontFamily: globalStyles?.fontFamilyBody || "inherit",
        // Dinamik CSS Değişkenleri (Global)
        "--landing-accent": globalStyles?.primaryColor || "#ccff00",
        "--landing-accent-rgb": globalStyles?.primaryColor ? hexToRgb(globalStyles.primaryColor) : "204, 255, 0",
        "--landing-bg": globalStyles?.backgroundColor || "#000000",
        "--landing-text": globalStyles?.textColor || "#ffffff",
        "--landing-radius-lg": getRadius(globalStyles?.borderRadius),
        "--landing-radius-md": getRadius(globalStyles?.borderRadius, 0.6),
      } as React.CSSProperties}
    >
      {isEditMode && (
        <style>{`
          .builder-section--editable {
            cursor: pointer;
            outline: 2px dashed transparent;
            outline-offset: -2px;
            transition: outline-color 120ms ease, background-color 120ms ease;
          }
          .builder-section--editable:hover {
            outline-color: var(--landing-accent, #ccff00);
          }
          .builder-section--editable:hover::after {
            content: 'Düzenlemek için tıkla';
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--landing-accent, #ccff00);
            color: #000;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            z-index: 100;
            pointer-events: none;
          }
          .builder-section--editable a, .builder-section--editable button {
            pointer-events: none;
          }
        `}</style>
      )}
      {sections.filter(s => s && s.enabled).map((section) => {
        const blockDef = getBlock(section.blockId);

        if (!blockDef) {
          if (typeof window !== "undefined") {
            // Sadece preview/dev için görünür placeholder
            const isPreview = new URLSearchParams(window.location.search).get("preview") === "1";
            if (!isPreview) {
              console.warn(`[Section Builder] Bilinmeyen blok ${section.blockId} (kategori: ${section.category}) — atlandı`);
              return null;
            }
            return (
              <div key={section.id} className="w-full py-24 flex items-center justify-center border-b border-white/5 opacity-50">
                <p className="text-white/30 font-mono text-sm tracking-widest uppercase">
                  &lt; {section.category} / {section.blockId} bulunamadı &gt;
                </p>
              </div>
            );
          }
          return null;
        }
        const BlockComponent = blockDef.component;

        // Bölüm Bazlı Özelleştirilmiş Renkler ve Config
        let sectionStyles: React.CSSProperties = {};
        let sectionConfig = { ...globalStyles }; // Varsayılan olarak global stiller

        if (section.customColors?.enabled) {
          sectionStyles = {
            backgroundColor: section.customColors.backgroundColor,
            color: section.customColors.textColor,
            "--landing-bg": section.customColors.backgroundColor,
            "--landing-text": section.customColors.textColor,
            "--landing-accent": section.customColors.primaryColor,
            "--landing-accent-rgb": hexToRgb(section.customColors.primaryColor),
          } as React.CSSProperties;

          // Bileşenlerin içindeki config.primaryColor vb. çağrıları için config objesini eziyoruz
          sectionConfig = {
            ...globalStyles,
            backgroundColor: section.customColors.backgroundColor,
            textColor: section.customColors.textColor,
            primaryColor: section.customColors.primaryColor,
          } as EliteGlobalStyles;
        }

        const animProps = getAnimationVariants(section.animationType);

        // Per-section content override: bu bölüm için landingTexts üzerine yazılır
        const effectiveContent = section.contentOverrides
          ? {
              ...content,
              landingTexts: { ...(content.landingTexts || {}), ...section.contentOverrides },
            }
          : content;

        // Per-section spacing (üst+alt iç boşluk)
        const spacingPaddingY: Record<NonNullable<typeof section.spacing>, string> = {
          compact: "0",
          normal: "1rem 0",
          comfortable: "3rem 0",
          spacious: "6rem 0",
        };
        const spacingStyle: React.CSSProperties = section.spacing
          ? { padding: spacingPaddingY[section.spacing] }
          : {};

        // Per-section background (gradient, image overlay)
        const bg = section.background;
        let bgStyle: React.CSSProperties = {};
        if (bg) {
          if (bg.style === "tinted" && bg.gradientFrom) {
            bgStyle = {
              backgroundColor: bg.gradientFrom,
            };
          } else if (bg.style === "gradient" && bg.gradientFrom && bg.gradientTo) {
            const angle = bg.gradientAngle ?? 135;
            bgStyle = {
              backgroundImage: `linear-gradient(${angle}deg, ${bg.gradientFrom}, ${bg.gradientTo})`,
            };
          } else if (bg.style === "image" && bg.imageUrl) {
            const overlay = bg.overlayOpacity ?? 0.5;
            bgStyle = {
              backgroundImage: `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url(${bg.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            };
          }
        }

        // Bölümün efektif arka plan rengi — navbar adaptif renk için kullanılır
        let effectiveBg = globalStyles?.backgroundColor || "#000000";
        if (section.customColors?.enabled) {
          effectiveBg = section.customColors.backgroundColor;
        }
        if (bg) {
          if ((bg.style === "tinted" || bg.style === "gradient") && bg.gradientFrom) {
            effectiveBg = bg.gradientFrom;
          } else if (bg.style === "image") {
            effectiveBg = "#0a0a0a"; // görsel arkaplanlar koyu overlay'li sayılır
          }
        }

        return (
          <motion.section
            key={section.id}
            id={section.id}
            data-section-category={section.category}
            data-section-bg={effectiveBg}
            style={{ ...sectionStyles, ...bgStyle, ...spacingStyle }}
            className={`w-full relative ${isEditMode ? "builder-section--editable" : ""}`}
            onClick={isEditMode ? handleSectionClick(section.id) : undefined}
            {...animProps}
          >
            <BlockComponent
              content={effectiveContent}
              config={sectionConfig}
              {...((section as unknown as { props?: Record<string, unknown> }).props || {})}
            />
          </motion.section>
        );
      })}
    </div>
  );
}
