import React from "react";
import type { LandingThemeContent, LandingTestimonial } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * TestimonialDualMarquee — hermes esinli.
 *
 * Sayfayı dolduran geniş koyu bir çerçeve: solda altta sabit kalan büyük
 * başlık + açıklama; sağda iki sütun hâlinde büyük, şeffaf cam kartlarda
 * danışan yorumları yavaşça akar — bir sütun yukarı, diğeri aşağı yönde,
 * zıt yönlerde sonsuz döngü.
 *
 * inspiredBy: https://hermes-template.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

function buildColumn(col: LandingTestimonial[]): LandingTestimonial[] {
  let base = col;
  while (base.length > 0 && base.length < 3) base = [...base, ...col];
  return [...base, ...base]; // 2 kopya = kusursuz döngü (translateY -50%)
}

export function TestimonialDualMarquee({ content, config }: Props) {
  const items = content.testimonials || [];
  if (items.length === 0) return null;

  const primary = config?.primaryColor || "#e8e3dc";
  const bg = config?.backgroundColor || "#0c0a09";
  const text = config?.textColor || "#ffffff";

  // İki sütuna böl — tek yorum varsa her iki sütun da aynı listeyi kullanır
  const colA = items.length < 2 ? items : items.filter((_, i) => i % 2 === 0);
  const colB = items.length < 2 ? items : items.filter((_, i) => i % 2 === 1);
  const loopA = buildColumn(colA);
  const loopB = buildColumn(colB.length ? colB : colA);
  const durA = Math.max(30, loopA.length * 6);
  const durB = Math.max(30, loopB.length * 6);

  const title = content.landingTexts?.testimonialsTitle || "Gerçek Sonuçlar";

  const Card = ({ t }: { t: LandingTestimonial }) => (
    <div
      className="rounded-3xl border p-6 sm:p-9"
      style={{
        background: `${text}0d`,
        borderColor: `${text}24`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: `0 18px 50px -16px rgba(0,0,0,0.55), inset 0 1px 0 ${text}1a`,
      }}
    >
      <p
        className="leading-relaxed"
        style={{ color: `${text}e6`, fontSize: "clamp(1rem, 1.25vw, 1.32rem)" }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>
      <p className="mt-7 text-lg font-bold" style={{ color: text }}>
        {t.clientName}
      </p>
      {t.role && (
        <p className="text-sm" style={{ color: `${text}80` }}>
          {t.role}
        </p>
      )}
    </div>
  );

  const Column = ({
    loop,
    dur,
    reverse,
  }: {
    loop: LandingTestimonial[];
    dur: number;
    reverse: boolean;
  }) => (
    <div
      className="t-mq-col flex flex-col gap-5 sm:gap-6"
      style={{
        animation: `tmFlow ${dur}s linear infinite${reverse ? " reverse" : ""}`,
      }}
    >
      {loop.map((t, i) => (
        <Card key={`${t.id}-${i}`} t={t} />
      ))}
    </div>
  );

  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20"
      style={{ backgroundColor: bg }}
    >
      <div
        className="mx-auto grid w-full max-w-[1680px] overflow-hidden rounded-[36px] border lg:grid-cols-[1fr_1.65fr]"
        style={{
          borderColor: `${text}1a`,
          background: `radial-gradient(58% 48% at 16% 82%, ${primary}1f, transparent 70%), linear-gradient(135deg, ${text}10, ${text}03)`,
        }}
      >
        {/* Sol: sabit metin (altta) */}
        <div className="flex flex-col justify-end p-9 sm:p-14">
          <h2
            className="font-bold"
            style={{
              color: text,
              fontSize: "clamp(2.6rem, 5vw, 4.6rem)",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
          <p
            className="mt-5 max-w-md text-base leading-relaxed sm:text-lg"
            style={{ color: `${text}99` }}
          >
            Danışanlarımız bedenlerini bir gecede değil; istikrar, bağlılık ve
            gerçekten işe yarayan bir programla dönüştürdü.
          </p>
          <span
            className="mt-7 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: primary }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: primary }} />
            Yorumlar
          </span>
        </div>

        {/* Sağ: zıt yönlü akan iki sütun */}
        <div
          className="relative overflow-hidden p-5 sm:p-8"
          style={{
            height: "clamp(560px, 88vh, 940px)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent, #000 11%, #000 89%, transparent)",
            maskImage:
              "linear-gradient(180deg, transparent, #000 11%, #000 89%, transparent)",
          }}
        >
          <div className="grid grid-cols-2 gap-5 sm:gap-6">
            <Column loop={loopA} dur={durA} reverse />
            <Column loop={loopB} dur={durB} reverse={false} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tmFlow {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-mq-col { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
