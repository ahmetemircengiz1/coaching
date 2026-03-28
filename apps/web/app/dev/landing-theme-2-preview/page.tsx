"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { LandingRenderer } from "@/src/components/landing/LandingRenderer";
import { LandingThemeProvider } from "@/src/components/landing/LandingThemeProvider";
import type { LandingThemeContent } from "@/src/components/landing/types";

const SAMPLE_CONTENT: LandingThemeContent = {
  domain: "preview-theme-2",
  brandName: "Hikmet Elgin",
  bio: "Size ozel fitness ve beslenme programlariyla hedeflerinize ulasin.",
  logo: null,
  heroImage: "/designs/landing/theme-2.png",
  heroImageDesktopUrl: "/designs/landing/theme-2.png",
  heroImageMobileUrl: "/designs/landing/theme-2.png",
  heroImageBlurDataUrl: null,
  heroFocalX: 50,
  heroFocalY: 35,
  heroMode: "photo",
  email: "info@hikmetelgin.com",
  authUrl: "/platform/auth",
  whatsappUrl:
    "https://wa.me/?text=Merhaba%2C%20kocluk%20hizmeti%20hakkinda%20bilgi%20almak%20istiyorum.",
  studentCount: 1200,
  transformationCount: 15,
  programCount: 8,
  packages: [
    {
      id: "pack-12",
      name: "12 Haftalik Degisim",
      description: "Ozellestirilmis plan",
      duration: 12,
      price: 3990,
      currency: "TRY",
      features: [
        "Ozellestirilmis antrenman programi",
        "Kisisellestirilmis beslenme plani",
        "Haftalik check-in + revizeler",
      ],
    },
    {
      id: "pack-24",
      name: "24 Haftalik Degisim",
      description: "Uzun donem takip",
      duration: 24,
      price: 6990,
      currency: "TRY",
      features: [
        "Ozellestirilmis antrenman programi",
        "Kisisellestirilmis beslenme plani",
        "Haftalik check-in + revizeler",
      ],
    },
    {
      id: "pack-pro",
      name: "12 Haftalik PRO",
      description: "Hizlandirilmis destek",
      duration: 12,
      price: 5990,
      currency: "TRY",
      features: [
        "Ozellestirilmis antrenman programi",
        "Kisisellestirilmis beslenme plani",
        "Haftalik check-in + revizeler",
        "Sinirsiz iletisim",
      ],
    },
  ],
  transformations: [
    {
      id: "t2-1",
      clientName: "A",
      beforePhoto: "/designs/landing/theme-2.png",
      afterPhoto: "/designs/landing/theme-2.png",
      duration: "12 hafta",
      description: null,
    },
    {
      id: "t2-2",
      clientName: "B",
      beforePhoto: "/designs/landing/theme-2.png",
      afterPhoto: "/designs/landing/theme-2.png",
      duration: "16 hafta",
      description: null,
    },
    {
      id: "t2-3",
      clientName: "C",
      beforePhoto: "/designs/landing/theme-2.png",
      afterPhoto: "/designs/landing/theme-2.png",
      duration: "10 hafta",
      description: null,
    },
    {
      id: "t2-4",
      clientName: "D",
      beforePhoto: "/designs/landing/theme-2.png",
      afterPhoto: "/designs/landing/theme-2.png",
      duration: "14 hafta",
      description: null,
    },
  ],
};

export default function LandingTheme2PreviewPage() {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const previewWidthClass = useMemo(
    () => (mode === "desktop" ? "max-w-[1200px]" : "max-w-[390px]"),
    [mode],
  );

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6">
      <div className="mx-auto w-full max-w-[1760px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-sm font-semibold tracking-[0.12em] text-white/80">
            THEME-2 VISUAL QA PREVIEW
          </h1>
          <div className="inline-flex rounded-xl border border-white/20 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("desktop")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                mode === "desktop" ? "bg-white text-black" : "text-white/75",
              )}
            >
              Desktop (1200px)
            </button>
            <button
              type="button"
              onClick={() => setMode("mobile")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                mode === "mobile" ? "bg-white text-black" : "text-white/75",
              )}
            >
              Mobile (390px)
            </button>
          </div>
        </div>

        <p className="mb-4 text-sm text-white/70">
          Adjust px values until rendered UI matches the screenshot
        </p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_480px]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className={cn("mx-auto w-full overflow-hidden rounded-2xl", previewWidthClass)}>
              <LandingThemeProvider themeId="theme-2">
                <LandingRenderer themeId="theme-2" content={SAMPLE_CONTENT} />
              </LandingThemeProvider>
            </div>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <img
              src="/designs/landing/theme-2.png"
              alt="Theme 2 reference screenshot"
              className="h-auto w-full rounded-xl"
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
