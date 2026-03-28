"use client";

import Image from "next/image";
import type { LandingThemeContent } from "./types";

/**
 * Check if coach has a hero image uploaded
 */
export function hasHeroImage(content: LandingThemeContent): boolean {
  return (
    content.heroMode === "photo" &&
    !!(content.heroImageDesktopUrl || content.heroImage)
  );
}

function getHeroSrcs(content: LandingThemeContent) {
  const desktopSrc = content.heroImageDesktopUrl || content.heroImage || "";
  const mobileSrc = content.heroImageMobileUrl || desktopSrc;
  const cutoutSrc = content.heroImageCutoutUrl || null;
  const focalX = content.heroFocalX ?? 50;
  const focalY = content.heroFocalY ?? 35;
  const blurProps = content.heroImageBlurDataUrl
    ? { placeholder: "blur" as const, blurDataURL: content.heroImageBlurDataUrl }
    : {};
  return { desktopSrc, mobileSrc, cutoutSrc, focalX, focalY, blurProps };
}

interface HeroDesktopImageProps {
  content: LandingThemeContent;
  /** Theme background color, used for edge fades and cutout glow */
  themeBg?: string;
  /** Theme accent color, used for cutout glow effect */
  accentColor?: string;
}

/**
 * Desktop hero image — two modes:
 * 1. Cutout exists: transparent person image with subtle glow, no background
 * 2. No cutout: full photo with edge fades blending into theme
 */
export function HeroDesktopImage({ content, themeBg, accentColor }: HeroDesktopImageProps) {
  if (!hasHeroImage(content)) return null;
  const { desktopSrc, cutoutSrc, focalX, focalY, blurProps } = getHeroSrcs(content);
  const bg = themeBg || "transparent";

  // Mode 1: Cutout — transparent person, floating on theme bg
  if (cutoutSrc) {
    return (
      <div className="relative w-full h-full flex items-end justify-center">
        {/* Subtle glow behind the person */}
        <div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full blur-[80px] opacity-30"
          style={{ background: accentColor || "rgba(255,255,255,0.15)" }}
        />
        <Image
          src={cutoutSrc}
          alt={content.brandName || "Coach"}
          fill
          priority
          quality={92}
          sizes="50vw"
          className="object-contain object-bottom drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
        />
      </div>
    );
  }

  // Mode 2: Full photo with edge fades
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={desktopSrc}
        alt={content.brandName || "Coach"}
        fill
        priority
        quality={92}
        sizes="50vw"
        className="object-cover"
        style={{ objectPosition: `${focalX}% ${focalY}%` }}
        {...blurProps}
      />
      {/* Left edge — strong fade into theme bg */}
      <div
        className="absolute inset-y-0 left-0 w-[40%] pointer-events-none z-[1]"
        style={{ background: `linear-gradient(to right, ${bg} 0%, ${bg}dd 20%, ${bg}88 50%, transparent 100%)` }}
      />
      {/* Top edge fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[1]"
        style={{ background: `linear-gradient(to bottom, ${bg}, transparent)` }}
      />
      {/* Bottom edge fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[1]"
        style={{ background: `linear-gradient(to top, ${bg}, transparent)` }}
      />
      {/* Right edge — subtle fade */}
      <div
        className="absolute inset-y-0 right-0 w-16 pointer-events-none z-[1]"
        style={{ background: `linear-gradient(to left, ${bg}66, transparent)` }}
      />
    </div>
  );
}

interface HeroMobileImageProps {
  content: LandingThemeContent;
}

/**
 * Mobile hero image — renders as absolute full-screen background.
 * Place as a direct child of the hero section (which must be relative).
 * Only visible below md breakpoint. No overlay — photo displays as-is.
 */
export function HeroMobileImage({ content }: HeroMobileImageProps) {
  if (!hasHeroImage(content)) return null;
  const { mobileSrc, focalX, focalY, blurProps } = getHeroSrcs(content);

  return (
    <div className="md:hidden absolute inset-0 z-0 overflow-hidden">
      <Image
        src={mobileSrc}
        alt={content.brandName || "Coach"}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: `${focalX}% ${focalY}%` }}
        {...blurProps}
      />
    </div>
  );
}
