import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Check, Dumbbell, ArrowUpRight, Zap } from "lucide-react";
import {
  priceParts,
  packageHref,
  durationLabel,
  highlightIndex,
} from "./pricing-helpers";

/**
 * PricingCurtis — curtis esinli.
 *
 * Kimlik: 2'li düzen. Her paket yükseltilmiş bir kart kutusu: ikon + ad,
 * açıklama, fiyat, dairesel oklu pill buton ve tikli özellik listesi —
 * hepsi kartın İÇİNDE. Kartlar zıt renkli (biri açık biri koyu); öne çıkan
 * koyu kart "En Etkili" etiketi taşır. İmleçle kutu yukarı kalkar.
 *
 * inspiredBy: https://curtis.framer.media/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function PricingCurtis({ content, config }: Props) {
  const packages = content.packages || [];
  if (packages.length === 0) return null;

  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#a3e635";
  const bg = config?.backgroundColor || "#0a0a0a";
  const headingColor = config?.textColor || "#ffffff";
  const hi = highlightIndex(packages.length);

  const title = texts?.packagesTitle || "Planını Seç";
  const parts = title.trim().split(/\s+/);
  const head = parts.length > 1 ? parts.slice(0, -1).join(" ") : "";
  const accent = parts.length > 1 ? parts[parts.length - 1] : title;

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span
            className="inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: `${headingColor}26`, color: `${headingColor}cc` }}
          >
            Paketler
          </span>
          <h2 className="mt-5 font-bold" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.06 }}>
            {head && <span style={{ color: headingColor }}>{head} </span>}
            <span style={{ color: primary }}>{accent}</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: `${headingColor}80` }}>
            {texts?.packagesSubtitle ||
              "Sana en uygun paketi seç — her biri hedeflerine ulaşman için kişisel destek sunar."}
          </p>
        </div>

        <div className="grid items-stretch gap-8 md:grid-cols-2">
          {packages.map((pkg, idx) => {
            const on = idx === hi;
            const pr = priceParts(pkg);
            // Öne çıkan kart koyu, diğeri açık — zıt kimlik
            const boxBg = on ? "#0f0f13" : "#f4f4f2";
            const ink = on ? "#ffffff" : "#15161a";
            const inkMuted = on ? "rgba(255,255,255,0.62)" : "rgba(21,22,26,0.6)";
            const line = on ? "rgba(255,255,255,0.12)" : "rgba(21,22,26,0.1)";
            return (
              <div
                key={pkg.id}
                className={`group relative flex flex-col rounded-[26px] p-8 transition-all duration-300 will-change-transform hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.55)] ${on ? "lg:scale-[1.03]" : ""}`}
                style={{ background: boxBg, border: on ? `1px solid ${primary}` : "1px solid rgba(0,0,0,0.06)" }}
              >
                {on && (
                  <span
                    className="absolute -top-3 right-7 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: primary, color: "#0a0a0a" }}
                  >
                    <Zap className="h-3 w-3" fill="#0a0a0a" strokeWidth={0} />
                    En Etkili
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${primary}26`, color: on ? primary : "#15161a" }}
                  >
                    <Dumbbell className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold" style={{ color: ink }}>
                    {pkg.name}
                  </h3>
                </div>

                {pkg.description && (
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: inkMuted }}>
                    {pkg.description}
                  </p>
                )}

                <div className="mt-6 flex items-end gap-1.5">
                  <span
                    className="font-extrabold tracking-tight"
                    style={{ color: ink, fontSize: "clamp(2.2rem, 3.6vw, 3rem)", lineHeight: 1 }}
                  >
                    {pr.before ? pr.symbol : ""}
                    {pr.amount}
                    {pr.before ? "" : ` ${pr.symbol}`}
                  </span>
                  {durationLabel(pkg) && (
                    <span className="pb-1 text-sm" style={{ color: inkMuted }}>
                      / {durationLabel(pkg)}
                    </span>
                  )}
                </div>

                <a
                  href={packageHref(content, pkg)}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full py-2 pl-5 pr-2 text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: primary, color: "#0a0a0a" }}
                >
                  Hemen Başla
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: "#0a0a0a", color: primary }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>

                {/* Özellikler — kartın içinde */}
                {pkg.features.length > 0 && (
                  <ul
                    className="mt-7 flex flex-1 flex-col gap-3 border-t pt-6"
                    style={{ borderColor: line }}
                  >
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: `${ink}cc` }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} style={{ color: primary }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
