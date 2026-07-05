import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ClipboardList, Crosshair, Dumbbell, Timer } from "lucide-react";

/**
 * FeatureSplitShowcase — transformfitness esinli (fotosuz varyant).
 * Sol: eyebrow + büyük başlık + kısa açıklama + 2x2 ikonlu özellik ızgarası + CTA'lar.
 * Sağ: fotosuz, tasarlanmış accent panel (accent glow + dev ikon filigranı +
 * vurgu metni). transformfitness'te özellikler kart kutusu içinde DEĞİL —
 * sade ikon+metin blokları; bu sadakat korunuyor.
 *
 * inspiredBy: https://transformfitness.framer.website/
 */
export function FeatureSplitShowcase({
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

  const eyebrow = content.brandName || "Antrenman";
  const title = texts?.systemTitle || "Özelliklerimiz";
  const desc =
    texts?.systemSubtitle ||
    "Antrenman programımız seni kayıttan başarıya taşımak için tasarlandı. Hedeflerine ulaşmak için basit adımları takip et.";

  const t = texts as Record<string, string | undefined> | undefined;
  // Sağ paneldeki büyük "Sonuca Giden Net Bir Yol" kartının bg fotoğrafı.
  // 1. kart fotoğrafı (system1Image) bu panelin arka planına oturur.
  const panelImage = t?.system1Image;
  const features = [
    {
      icon: ClipboardList,
      title: texts?.system1Title || "Kişisel Değerlendirme",
      desc:
        texts?.system1Description ||
        "Fitness seviyeni ve hedeflerini anlamak için detaylı bir değerlendirmeyle başlıyoruz.",
    },
    {
      icon: Crosshair,
      title: texts?.system2Title || "Sana Özel Plan",
      desc:
        texts?.system2Description ||
        "Değerlendirmene dayanarak yalnızca senin için bir antrenman planı oluşturuyoruz.",
    },
    {
      icon: Dumbbell,
      title: texts?.system3Title || "Birebir Antrenman",
      desc:
        texts?.system3Description ||
        "Her seansta doğru yolda olduğundan emin olmak için uzman rehberliği sunuyoruz.",
    },
    {
      icon: Timer,
      title: "Sürekli Gelişim",
      desc:
        "Sonuçlarını takip eder, ilerlemeni hızlandırmak için planını düzenli olarak güncelleriz.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-stretch">
        {/* Sol — metin + özellikler */}
        <div className="flex flex-col">
          <span
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: primary }}
          >
            {eyebrow}
          </span>
          <h2
            className="mt-4 font-black uppercase text-white"
            style={{ fontFamily: headingFont, fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)", lineHeight: 0.98 }}
          >
            {title}
          </h2>
          <p className="mt-6 max-w-md text-white/55 leading-relaxed text-[15px] sm:text-base">
            {desc}
          </p>

          <div className="mt-14 grid sm:grid-cols-2 gap-x-12 gap-y-14">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i}>
                  <span
                    className="inline-flex w-12 h-12 rounded-2xl items-center justify-center"
                    style={{ background: `${primary}1f` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: primary }} strokeWidth={1.85} />
                  </span>
                  <h3
                    className="mt-6 text-2xl font-bold text-white"
                    style={{ fontFamily: headingFont }}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <a
              href={content.authUrl || "#"}
              className="px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide text-black transition-transform hover:scale-[1.03]"
              style={{ background: primary, fontFamily: headingFont }}
            >
              Hemen Başla
            </a>
            <a
              href="#about"
              className="px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide text-white border border-white/25 transition-colors hover:border-white/50"
              style={{ fontFamily: headingFont }}
            >
              Hakkımızda
            </a>
          </div>
        </div>

        {/* Sağ — accent panel; system1Image yüklüyse panelin arka planına oturur */}
        <div
          className="relative min-h-[520px] lg:min-h-0 rounded-[2.25rem] overflow-hidden border border-white/10 flex flex-col items-center justify-center text-center p-12"
          style={{ backgroundColor: panelImage ? "#0a0a0a" : "rgba(255,255,255,0.035)" }}
        >
          {/* Foto verilmişse panelin tam-kaplayan bg'i — metin/ikon gizleneceği için
              gradyana gerek yok; foto net gösterilir. */}
          {panelImage && (
            <img
              src={panelImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden
            />
          )}
          {/* Accent glow halkaları yalnız fotosuz varyantta */}
          {!panelImage && (
            <>
              <div
                className="absolute -top-24 -right-20 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
                style={{ background: primary, opacity: 0.2 }}
              />
              <div
                className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
                style={{ background: primary, opacity: 0.12 }}
              />
            </>
          )}
          {/* Foto yoksa: ikon rozet + büyük başlık + alt metin (default tasarım).
              Foto varsa: panel sadece fotoğraftan ibarettir — ikon/metinler gizli. */}
          {!panelImage && (
            <>
              <Dumbbell
                className="absolute w-[62%] h-[62%] text-white pointer-events-none"
                style={{ opacity: 0.035 }}
                strokeWidth={0.8}
              />
              <span
                className="relative inline-flex w-20 h-20 rounded-3xl items-center justify-center"
                style={{ background: `${primary}1f` }}
              >
                <Dumbbell className="w-9 h-9" style={{ color: primary }} strokeWidth={1.7} />
              </span>
              <p
                className="relative mt-8 font-black uppercase text-white"
                style={{ fontFamily: headingFont, fontSize: "clamp(1.85rem, 2.8vw, 2.85rem)", lineHeight: 1.04 }}
              >
                Sonuca Giden
                <br />
                Net Bir Yol
              </p>
              <p className="relative mt-4 max-w-xs text-[15px] text-white/55">
                Planlı, ölçülü ve sürdürülebilir bir ilerleme yaklaşımı.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
