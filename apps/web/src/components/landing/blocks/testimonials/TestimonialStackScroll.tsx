"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent, LandingTestimonial } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Quote, Dumbbell } from "lucide-react";

/**
 * TestimonialStackScroll — fitence esinli.
 *
 * Bölüme gelindiğinde sayfa sabitlenir (sticky) ve kaydırdıkça danışan
 * yorum kartları alttan sırayla gelir, hafif dönük açılarla dağınık bir
 * istif oluşturur. Her kart: solda danışan fotoğrafı, sağda büyük alıntı
 * + isim + rol.
 *
 * inspiredBy: https://fitence.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

const ROT = [-5, 4, -3, 6, -2, 5, -4, 3];

function StackCard({
  t,
  primary,
  text,
}: {
  t: LandingTestimonial;
  primary: string;
  text: string;
}) {
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';
  return (
    <div
      className="flex flex-col gap-4 overflow-hidden rounded-[28px] border p-3 sm:flex-row sm:gap-5 sm:p-4"
      style={{ background: `${text}0a`, borderColor: `${text}1f`, backdropFilter: "blur(6px)" }}
    >
      {/* Fotoğraf */}
      <div
        className="relative shrink-0 overflow-hidden rounded-2xl sm:w-[40%]"
        style={{ aspectRatio: "4 / 5", background: `${primary}22` }}
      >
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.avatar} alt={t.clientName} className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-6xl font-extrabold"
            style={{ color: primary, fontFamily: headingFont }}
          >
            {t.clientName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {/* İçerik */}
      <div className="flex flex-1 flex-col justify-center p-3 sm:p-5">
        <Quote className="h-9 w-9" strokeWidth={0} fill={primary} />
        <p
          className="mt-3 font-bold uppercase"
          style={{
            color: text,
            fontFamily: headingFont,
            fontSize: "clamp(1.05rem, 1.7vw, 1.7rem)",
            lineHeight: 1.22,
          }}
        >
          {t.quote}
        </p>
        <div className="mt-5">
          <p className="text-lg font-bold" style={{ color: text }}>
            {t.clientName}
          </p>
          {t.role && (
            <p className="text-sm" style={{ color: `${text}80` }}>
              {t.role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialStackScroll({ content, config }: Props) {
  const items = content.testimonials || [];
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const prog = total > 0 ? -rect.top / total : 0;
      setP(Math.max(0, Math.min(1, prog)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (items.length === 0) return null;

  const primary = config?.primaryColor || "#ff6a1a";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';
  const n = items.length;
  const title = content.landingTexts?.testimonialsTitle || "Gerçek Üye Sonuçları";

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: bg, height: `${90 + n * 55}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Başlık */}
        <div className="px-6 pt-14 text-center sm:pt-20">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.24em]"
            style={{ color: primary }}
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Başarı Hikayeleri
          </span>
          <h2
            className="mt-3 font-extrabold uppercase"
            style={{
              color: text,
              fontFamily: headingFont,
              fontSize: "clamp(1.9rem, 4.6vw, 4rem)",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
        </div>

        {/* Kart sahnesi */}
        <div className="relative flex-1">
          {items.map((t, i) => {
            // Kartlar p=0.86'da tamamlanır; kalan %14 son kartı okumak için "bekleme"
            const seg = 0.86 / n;
            const cp = reduce
              ? 1
              : Math.max(0, Math.min(1, (p - i * seg) / seg));
            const ty = (1 - cp) * 116;
            const rot = cp * ROT[i % ROT.length];
            return (
              <div
                key={t.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: "min(92vw, 880px)",
                  transform: `translate(-50%, -50%) translateY(${ty}%) rotate(${rot}deg) scale(${0.92 + cp * 0.08})`,
                  opacity: reduce || cp > 0.02 ? 1 : 0,
                  zIndex: i,
                }}
              >
                <StackCard t={t} primary={primary} text={text} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
