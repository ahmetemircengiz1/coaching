import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Check } from "lucide-react";
import { priceParts, packageHref, durationLabel } from "./pricing-helpers";

/**
 * PricingSportix — sportix esinli.
 *
 * Kimlik: AÇIK kartlar (beyaz üst / gri alt iki tonlu), üst kenara taşan
 * paket-adı etiketi, sola hizalı dev fiyat, altta tam-genişlik koyu buton.
 * Temiz/yumuşak sans tipografi. İmleçle kart yukarı kalkar.
 *
 * inspiredBy: https://sportix.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function PricingSportix({ content, config }: Props) {
  const packages = content.packages || [];
  if (packages.length === 0) return null;

  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#2f6b34";
  const bg = config?.backgroundColor || "#eef0ec";
  const headingColor = config?.textColor || "#15161a";

  // Sportix kimliği: kartlar her zaman açık renkli (koyu yazılı)
  const cardTop = "#ffffff";
  const cardBottom = "#f0f1ee";
  const ink = "#15161a";
  const inkMuted = "rgba(21,22,26,0.62)";
  const line = "rgba(21,22,26,0.10)";

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold" style={{ color: primary }}>
            Üyelik
          </span>
          <h2
            className="mx-auto mt-3 max-w-3xl font-bold"
            style={{ color: headingColor, fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 1.12 }}
          >
            {texts?.packagesTitle || "Zirve performansa giden yolun"}
          </h2>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const pr = priceParts(pkg);
            return (
              <div
                key={pkg.id}
                className="relative flex flex-col rounded-3xl border transition-all duration-300 will-change-transform hover:-translate-y-2.5 hover:shadow-[0_26px_52px_-18px_rgba(0,0,0,0.24)]"
                style={{ background: cardBottom, borderColor: line }}
              >
                {/* Üst kenara taşan etiket */}
                <span
                  className="absolute -top-3.5 left-7 rounded-full px-4 py-1.5 text-xs font-bold"
                  style={{ background: primary, color: "#ffffff" }}
                >
                  {pkg.name}
                </span>

                {/* Beyaz üst bölüm */}
                <div className="rounded-t-3xl px-8 pb-8 pt-11" style={{ background: cardTop }}>
                  <div className="flex items-end gap-1.5">
                    <span
                      className="font-extrabold tracking-tight"
                      style={{ color: ink, fontSize: "clamp(2.6rem, 4vw, 3.6rem)", lineHeight: 0.95 }}
                    >
                      {pr.before ? pr.symbol : ""}
                      {pr.amount}
                      {pr.before ? "" : ` ${pr.symbol}`}
                    </span>
                    {durationLabel(pkg) && (
                      <span className="pb-1.5 text-sm" style={{ color: inkMuted }}>
                        / {durationLabel(pkg)}
                      </span>
                    )}
                  </div>
                  {pkg.description && (
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: inkMuted }}>
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Gri alt bölüm */}
                <div className="flex flex-1 flex-col px-8 pb-8 pt-7">
                  {pkg.features.length > 0 && (
                    <ul className="flex flex-col gap-3.5">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm" style={{ color: ink }}>
                          <span
                            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                            style={{ background: `${primary}1f` }}
                          >
                            <Check className="h-3 w-3" strokeWidth={3.5} style={{ color: primary }} />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={packageHref(content, pkg)}
                    className="mt-8 flex items-center justify-center rounded-xl py-4 text-sm font-bold transition-transform hover:scale-[1.02]"
                    style={{ background: primary, color: "#ffffff" }}
                  >
                    Hemen Katıl
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
