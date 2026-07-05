"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * HeroAnimatedImmersion — Athlex esinli (özel animasyonlu).
 *
 * Diğer hero'lardan farkı: zengin animasyon stack'i:
 * - Cursor-follow parallax on bg foto (subtle premium hissi)
 * - Letter-by-letter reveal on headline (stagger)
 * - Floating testimonial card with hover lift
 * - Scroll-driven slow zoom on bg
 * - Lime accent CTA glow on hover
 *
 * Layout:
 * - Full-bg cinematic foto
 * - Top'ta 2 pill badge
 * - Bottom-left: headline + subtitle + dual CTA (lime + ghost)
 * - Bottom-right: floating testimonial card
 *
 * inspiredBy:
 * - https://athlex.framer.website/ (full-bg + top pills + bottom-right testimonial + animasyon polish)
 */
export function HeroAnimatedImmersion({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const accent = config?.textColor || "#ccff00";

  const headline = texts?.heroHeadline || "Yağ Yak ve Hızlıca Güç Kazan";
  const subtitle =
    texts?.heroSubtitle ||
    "Kolay egzersizler ve planlarla daha güçlü, formda ve enerjik hissetmene yardımcı oluyoruz.";
  const ctaPrimary = texts?.ctaPrimaryText || "İletişime Geç";
  const ctaSecondary = texts?.ctaSecondaryText || "Tanıtım Videosu";

  const heroImage = content.heroImageDesktopUrl || content.heroImageOriginalUrl || null;
  const heroVideo = content.heroVideoUrl || null;

  // Testimonial: ilk transformation'dan al, yoksa default
  const testimonialName = content.transformations[0]?.clientName || "Ahmet K.";
  const testimonialQuote =
    content.transformations[0]?.description ||
    "Kolay antrenmanlarla hızlıca formuma kavuştum, kendimi daha güçlü hissediyorum.";

  // Cursor-follow parallax
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const bgX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [-1, 1], [-15, 15]);
  const cardRotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const cardRotateY = useTransform(smoothX, [-1, 1], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  };

  // Letter reveal stagger
  const letterContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.3 },
    },
  };
  const letterItem = {
    hidden: { opacity: 0, y: 40, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number] },
    },
  };
  const headlineWords = headline.split(/\s+/);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] overflow-hidden bg-zinc-950 flex items-end"
    >
      {/* Background: cursor-follow parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ x: bgX, y: bgY, scale: 1.08 }}
      >
        {heroVideo ? (
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: `${content.heroFocalX ?? 50}% ${content.heroFocalY ?? 35}%` }}
          />
        ) : heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: `${content.heroFocalX ?? 50}% ${content.heroFocalY ?? 35}%` }}
          />
        ) : (
          /* Foto'suz fallback: motion gradient */
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${primary}30 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${accent}25 0%, transparent 50%), #0a0a0a`,
            }}
          />
        )}
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
      </motion.div>

      {/* Top pill badges */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-24 left-6 lg:left-12 z-20 flex gap-2 flex-wrap"
      >
        <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md border border-white/20 rounded">
          [ Öne Çıkan ]
        </span>
        <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md border border-white/20 rounded">
          Fitness & Koçluk
        </span>
      </motion.div>

      {/* Main content — bottom-left + bottom-right */}
      <div className="relative z-10 w-full pb-16 lg:pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-end">
          {/* Bottom-left: headline + subtitle + CTA */}
          <div>
            {/* Letter-reveal headline */}
            <motion.h1
              variants={letterContainer}
              initial="hidden"
              animate="visible"
              className="font-black uppercase text-white leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                fontFamily: content.headingFont || "inherit",
                perspective: "1000px",
              }}
            >
              {headlineWords.map((word, wi) => (
                <span key={wi} className="inline-block mr-[0.25em]">
                  {word.split("").map((char, ci) => (
                    <motion.span
                      key={ci}
                      variants={letterItem}
                      className="inline-block"
                      style={{ transformOrigin: "bottom center" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-6 text-base lg:text-lg text-white/75 max-w-xl leading-relaxed"
              style={{ fontFamily: content.bodyFont || "inherit" }}
            >
              {subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-8 flex gap-3 flex-wrap"
            >
              <motion.a
                href={content.authUrl}
                whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${primary}99` }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-bold text-sm transition-shadow"
                style={{ backgroundColor: primary, color: "#000" }}
              >
                {ctaPrimary}
              </motion.a>
              {ctaSecondary && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-white/30 text-white font-medium backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {ctaSecondary}
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Bottom-right: floating testimonial card with 3D hover */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformStyle: "preserve-3d",
              perspective: "1200px",
            }}
            className="lg:justify-self-end"
          >
            <div
              className="w-full max-w-sm p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
              style={{ transform: "translateZ(20px)" }}
            >
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex" aria-label="5 yıldız">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5" fill="#fbbf24" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-white/70 font-medium">4.9/5</span>
              </div>

              {/* Quote */}
              <p className="text-sm text-white leading-relaxed mb-4">
                &quot;{testimonialQuote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                >
                  {testimonialName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{testimonialName}</p>
                  <p className="text-[11px] text-white/60 leading-none mt-1">Mutlu Öğrenci</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
