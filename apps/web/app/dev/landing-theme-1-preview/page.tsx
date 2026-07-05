"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { LandingRenderer } from "@/src/components/landing/LandingRenderer";
import { LandingThemeProvider } from "@/src/components/landing/LandingThemeProvider";
import type { LandingThemeContent } from "@/src/components/landing/types";

const SAMPLE_CONTENT: LandingThemeContent = {
  domain: "preview",
  brandName: "Hikmet Elgin",
  bio: "Kisiye ozel antrenman, beslenme ve haftalik birebir takip.",
  logo: null,
  heroImage: "/designs/landing/theme-1.png",
  heroImageDesktopUrl: "/designs/landing/theme-1.png",
  heroImageMobileUrl: "/designs/landing/theme-1.png",
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
      id: "private-12",
      name: "PRIVATE 12",
      description: "Kisiye ozel program",
      duration: 12,
      price: 5990,
      currency: "TRY",
      features: [
        "Kisiye ozel program",
        "Haftalik birebir check-in",
        "Ozel WhatsApp destegi",
      ],
    },
    {
      id: "private-24",
      name: "PRIVATE 24",
      description: "Kisiye ozel program",
      duration: 24,
      price: 9900,
      currency: "TRY",
      features: [
        "Kisiye ozel program",
        "Haftalik birebir check-in",
        "Ozel WhatsApp destegi",
      ],
    },
    {
      id: "vip-12",
      name: "VIP 12",
      description: "Oncelikli destek",
      duration: 12,
      price: 7990,
      currency: "TRY",
      features: [
        "Kisiye ozel program",
        "Haftalik birebir check-in",
        "Ozel WhatsApp destegi",
        "Oncelikli destek",
      ],
    },
  ],
  transformations: [],
  testimonials: [],
};

export default function LandingTheme1PreviewPage() {
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
            THEME-1 VISUAL QA PREVIEW
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
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setMode("mobile")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                mode === "mobile" ? "bg-white text-black" : "text-white/75",
              )}
            >
              Mobile
            </button>
          </div>
        </div>

        <p className="mb-4 text-sm text-white/70">
          Adjust px values until the rendered UI matches the screenshot
        </p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_480px]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className={cn("mx-auto w-full overflow-hidden rounded-2xl", previewWidthClass)}>
              <LandingThemeProvider themeId="theme-1">
                <LandingRenderer themeId="theme-1" content={SAMPLE_CONTENT} />
              </LandingThemeProvider>
            </div>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <img
              src="/designs/landing/theme-1.png"
              alt="Theme 1 reference screenshot"
              className="h-auto w-full rounded-xl"
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
