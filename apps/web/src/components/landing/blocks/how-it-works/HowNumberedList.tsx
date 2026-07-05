import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ArrowRight, Compass } from "lucide-react";

/**
 * HowNumberedList — rachel esinli.
 * Sol: eyebrow + başlık + açıklama + CTA + görsel. Sağ: numaralı (01-05)
 * adım listesi (numara + başlık + açıklama).
 * Sol görsel koçun kendi içeriğinden gelir; yoksa accent gradient placeholder.
 *
 * inspiredBy: https://rachel-pt.framer.website/
 */
export function HowNumberedList({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const bg = config?.backgroundColor || "#0a0a0a";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const heading = texts?.systemTitle || "Kalıcı Sonuçlara Giden Yolun";
  const sub =
    texts?.systemSubtitle ||
    "Her dönüşüm bir yapıyla başlar. Hedefleri adım adım gerçek ilerlemeye nasıl dönüştürdüğümüzü gör.";

  const t = texts as Record<string, string | undefined> | undefined;
  const steps = [
    {
      title: texts?.system1Title || "Tanışma Görüşmesi",
      desc:
        texts?.system1Description ||
        "Hedeflerini, zorluklarını ve yaşam tarzını keşfederek doğru yaklaşımı belirliyoruz.",
      image: t?.system1Image,
    },
    {
      title: texts?.system2Title || "Kişisel Plan",
      desc:
        texts?.system2Description ||
        "Yaşam tarzına göre uyarlanmış, gerçekçi ve sürdürülebilir antrenman ile beslenme planı.",
      image: t?.system2Image,
    },
    {
      title: texts?.system3Title || "Haftalık Koçluk",
      desc:
        texts?.system3Description ||
        "Her hafta birlikte ilerliyor, sorularını yanıtlıyor ve seni yolda tutuyoruz.",
      image: t?.system3Image,
    },
    {
      title: "Yaşam Tarzına Entegrasyon",
      desc: "Programını; takvimine, ihtiyaçlarına ve değişen koşullarına göre uyarlıyoruz.",
      image: undefined as string | undefined,
    },
    {
      title: "Uzun Vadeli Denge",
      desc: "İlerleme burada bitmez — birlikte geliştirir, kutlar ve inşa etmeye devam ederiz.",
      image: undefined as string | undefined,
    },
  ];

  const photo = content.heroImage || content.transformations?.[0]?.afterPhoto || null;

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20">
        {/* Sol — metin + CTA + görsel */}
        <div>
          <span
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: primary }}
          >
            Nasıl Çalışır
          </span>
          <h2
            className="mt-4 font-black uppercase text-white"
            style={{ fontFamily: headingFont, fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)", lineHeight: 1.02 }}
          >
            {heading}
          </h2>
          <p className="mt-5 max-w-md text-white/55 leading-relaxed text-[15px] sm:text-base">
            {sub}
          </p>
          {/* "Ücretsiz Görüşme Ayır" — koçun WhatsApp'ı varsa direkt mesajlaşmaya bağlanır,
              yoksa kayıt sayfasına düşer. Yeni sekmede açılır. */}
          <a
            href={content.whatsappUrl || content.authUrl || "#"}
            target={content.whatsappUrl ? "_blank" : undefined}
            rel={content.whatsappUrl ? "noopener noreferrer" : undefined}
            className="mt-7 inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide text-black transition-transform hover:scale-[1.03]"
            style={{ background: primary, fontFamily: headingFont }}
          >
            Ücretsiz Görüşme Ayırt
            <span className="inline-flex w-6 h-6 rounded-full bg-black/15 items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </a>

          <div className="mt-9 relative rounded-[2rem] overflow-hidden h-72 sm:h-80">
            {photo ? (
              <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: `linear-gradient(150deg, ${primary}, ${primary}0a)` }}
              >
                <Compass className="w-20 h-20 text-black/20" strokeWidth={1.1} />
              </div>
            )}
          </div>
        </div>

        {/* Sağ — numaralı adım listesi (foto verilen adımlar foto-bg karta dönüşür) */}
        <div className="space-y-4">
          {steps.map((s, i) => {
            if (s.image) {
              // Foto-bg adım kartı
              return (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-[1.5rem] border border-white/12 p-6 sm:p-7 min-h-[180px] flex flex-col justify-between"
                  style={{ backgroundColor: "#0a0a0a" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 0.5 }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.9) 100%)",
                    }}
                  />
                  <span
                    className="relative font-black leading-none drop-shadow"
                    style={{ fontFamily: headingFont, fontSize: "1.5rem", color: primary }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-white drop-shadow"
                      style={{ fontFamily: headingFont }}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] text-white/85 leading-relaxed max-w-md">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            }
            // Foto yoksa orijinal çizgi-ayraçlı sade liste maddesi
            return (
              <div
                key={i}
                className={`py-7 ${i > 0 ? "border-t border-white/10" : ""}`}
              >
                <span
                  className="font-black leading-none"
                  style={{ fontFamily: headingFont, fontSize: "1.5rem", color: primary }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mt-2 text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: headingFont }}
                >
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[15px] text-white/55 leading-relaxed max-w-md">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
