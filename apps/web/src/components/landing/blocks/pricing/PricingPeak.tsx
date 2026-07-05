import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { CheckCircle2 } from "lucide-react";
import {
  priceParts,
  packageHref,
  durationLabel,
  highlightIndex,
} from "./pricing-helpers";

/**
 * PricingPeak — peak fitness esinli.
 *
 * Kimlik: KOYU kartlar, ortalanmış içerik. Öne çıkan kart tepesinde tam
 * genişlik beyaz "Popüler" şeridi taşır ve büyütülmüş durur. Vurgu renkli
 * dev fiyat, fiyatın altında ince ayraç çizgi, alt tam-genişlik buton.
 * Başlık ağır sıkışık (condensed). İmleçle kart yukarı kalkar.
 *
 * inspiredBy: https://peakfitness.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function PricingPeak({ content, config }: Props) {
  const packages = content.packages || [];
  if (packages.length === 0) return null;

  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#d6f23a";
  const bg = config?.backgroundColor || "#08080a";
  const headingColor = config?.textColor || "#ffffff";
  const condensed = 'var(--font-oswald), "Arial Narrow", sans-serif';
  const hi = highlightIndex(packages.length);

  const card = "#131316";
  const ink = "#ffffff";
  const inkMuted = "rgba(255,255,255,0.6)";
  const line = "rgba(255,255,255,0.1)";

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: primary }}>
            Planlar
          </span>
          <h2
            className="mt-3 font-extrabold uppercase"
            style={{ color: headingColor, fontFamily: condensed, fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", lineHeight: 0.98 }}
          >
            {texts?.packagesTitle || "Zirve Potansiyeline Giden Yolu Seç"}
          </h2>
          <p className="mt-4 text-base" style={{ color: `${headingColor}80` }}>
            {texts?.packagesSubtitle ||
              "Hedeflerine uygun esnek planlar arasından sana en çok yakışanı seç."}
          </p>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-3">
          {packages.map((pkg, idx) => {
            const on = idx === hi;
            const pr = priceParts(pkg);
            return (
              <div
                key={pkg.id}
                className={`group relative flex flex-col rounded-2xl transition-all duration-300 will-change-transform hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.7)] ${on ? "lg:scale-[1.05]" : ""}`}
                style={{ background: card, border: `1.5px solid ${on ? primary : line}` }}
              >
                {/* Popüler şeridi */}
                {on && (
                  <div
                    className="rounded-t-2xl py-2.5 text-center text-sm font-bold"
                    style={{ background: "#ffffff", color: "#0a0a0a" }}
                  >
                    Popüler
                  </div>
                )}
                <div className="flex flex-1 flex-col p-8">
                  <h3 className="text-center text-lg font-semibold" style={{ color: ink }}>
                    {pkg.name}
                  </h3>
                  <div
                    className="mt-3 text-center font-extrabold"
                    style={{ color: primary, fontFamily: condensed, fontSize: "clamp(2.8rem, 4.4vw, 4rem)", lineHeight: 0.9 }}
                  >
                    {pr.before ? pr.symbol : ""}
                    {pr.amount}
                    {pr.before ? "" : ` ${pr.symbol}`}
                  </div>
                  {durationLabel(pkg) && (
                    <p className="mt-2 text-center text-xs uppercase tracking-widest" style={{ color: inkMuted }}>
                      {durationLabel(pkg)}
                    </p>
                  )}

                  <div className="my-7 h-px w-full" style={{ background: line }} />

                  {pkg.description && (
                    <p className="text-sm leading-relaxed" style={{ color: `${ink}b3` }}>
                      {pkg.description}
                    </p>
                  )}
                  {pkg.features.length > 0 && (
                    <ul className="mt-5 flex flex-1 flex-col gap-3">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: `${ink}cc` }}>
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={packageHref(content, pkg)}
                    className="mt-8 flex items-center justify-center rounded-xl py-4 text-sm font-bold transition-transform hover:scale-[1.02]"
                    style={{ background: primary, color: "#0a0a0a" }}
                  >
                    Hemen Başla
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
