import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Check, ArrowRight } from "lucide-react";
import { priceParts, packageHref, durationLabel } from "./pricing-helpers";

/**
 * PricingGoalz — goalz esinli.
 *
 * Kimlik: KOYU kartlar, sola hizalı, ağır sıkışık (condensed) BÜYÜK-HARF
 * tipografi. Arkada dev soluk kelime. Buton kartın ORTASINDA (fiyat ile
 * özellikler arasında), tam genişlik pill. Özellikler büyük-harf, ayraç
 * üstünde. İmleçle kart yukarı kalkar.
 *
 * inspiredBy: https://goalz-template.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function PricingGoalz({ content, config }: Props) {
  const packages = content.packages || [];
  if (packages.length === 0) return null;

  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#1f8f5f";
  const bg = config?.backgroundColor || "#101010";
  const headingColor = config?.textColor || "#ffffff";
  const condensed = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const card = "#191919";
  const ink = "#ffffff";
  const line = "rgba(255,255,255,0.12)";

  return (
    <section className="overflow-hidden px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Başlık — arkada dev soluk kelime */}
        <div className="relative mb-16 flex items-center justify-center">
          <span
            aria-hidden
            className="select-none font-extrabold uppercase"
            style={{
              color: `${headingColor}0d`,
              fontFamily: condensed,
              fontSize: "clamp(5rem, 17vw, 14rem)",
              lineHeight: 0.78,
            }}
          >
            Paketler
          </span>
          <span
            className="absolute text-sm font-bold uppercase tracking-[0.32em]"
            style={{ color: headingColor }}
          >
            {texts?.packagesTitle || "Her Sporcuya Uygun Planlar"}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const pr = priceParts(pkg);
            return (
              <div
                key={pkg.id}
                className="flex flex-col rounded-2xl border p-7 transition-all duration-300 will-change-transform hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.7)]"
                style={{ background: card, borderColor: line }}
              >
                <h3
                  className="text-2xl font-bold uppercase"
                  style={{ color: ink, fontFamily: condensed, letterSpacing: "0.02em" }}
                >
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: `${ink}99` }}>
                    {pkg.description}
                  </p>
                )}

                <div className="mt-7 flex items-end gap-2">
                  <span
                    className="font-extrabold uppercase"
                    style={{ color: ink, fontFamily: condensed, fontSize: "clamp(3rem, 5.5vw, 4.4rem)", lineHeight: 0.85 }}
                  >
                    {pr.before ? pr.symbol : ""}
                    {pr.amount}
                    {pr.before ? "" : ` ${pr.symbol}`}
                  </span>
                  {durationLabel(pkg) && (
                    <span className="pb-1.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: `${ink}66` }}>
                      / {durationLabel(pkg)}
                    </span>
                  )}
                </div>

                {/* Buton — kartın ortasında */}
                <a
                  href={packageHref(content, pkg)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.02]"
                  style={{ background: primary, color: "#ffffff" }}
                >
                  Bu Planı Seç
                  <ArrowRight className="h-4 w-4" />
                </a>

                {pkg.features.length > 0 && (
                  <ul
                    className="mt-7 flex flex-col gap-3 border-t pt-6"
                    style={{ borderColor: line }}
                  >
                    {pkg.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[12.5px] font-semibold uppercase tracking-wide"
                        style={{ color: `${ink}b3` }}
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={3.5} style={{ color: primary }} />
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
