import { LandingThemeProvider } from "@/src/components/landing/LandingThemeProvider";
import { LandingRenderer } from "@/src/components/landing/LandingRenderer";
import type { LandingThemeContent } from "@/src/components/landing/types";
import {
  LANDING_THEME_LIST,
  type LandingThemeId,
} from "@/src/theme/landingThemes";

const SAMPLE_CONTENT: LandingThemeContent = {
  domain: "preview",
  brandName: "FitKur",
  bio: "Kisiye ozel antrenman ve beslenme sistemi. Bilimsel takip ile olculebilir sonuc.",
  logo: null,
  heroImage: "/designs/landing/theme-1.png",
  heroImageDesktopUrl: "/designs/landing/theme-1.png",
  heroImageMobileUrl: "/designs/landing/theme-1.png",
  heroFocalX: 50,
  heroFocalY: 35,
  heroMode: "photo",
  email: "coach@example.com",
  authUrl: "/platform/auth",
  whatsappUrl:
    "https://wa.me/?text=Merhaba%2C%20kocluk%20hizmeti%20hakkinda%20bilgi%20almak%20istiyorum.",
  studentCount: 1180,
  transformationCount: 15,
  programCount: 8,
  packages: [
    {
      id: "starter",
      name: "Baslangic",
      description: "Kisisel antrenman programi",
      duration: 12,
      price: 1990,
      currency: "TRY",
      features: [
        "Kisisel antrenman programi",
        "Kisiye ozel beslenme plani",
        "Haftalik revize",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      description: "Daha yogun takip ve revize",
      duration: 24,
      price: 2490,
      currency: "TRY",
      features: [
        "Kisisel antrenman programi",
        "Kisiye ozel beslenme plani",
        "Haftalik check-in",
        "Video analiz",
      ],
    },
    {
      id: "elite",
      name: "Elite",
      description: "Maksimum birebir destek",
      duration: 12,
      price: 3490,
      currency: "TRY",
      features: [
        "Kisisel antrenman programi",
        "Kisiye ozel beslenme plani",
        "Gelismis takip sistemi",
        "Hergun mesaj destegi",
      ],
    },
  ],
  transformations: [
    {
      id: "t1",
      clientName: "Can",
      beforePhoto: "/designs/landing/theme-2.png",
      afterPhoto: "/designs/landing/theme-3.png",
      duration: "12 hafta",
      description: "Yag kaybi ve guc artisi",
    },
    {
      id: "t2",
      clientName: "Selin",
      beforePhoto: "/designs/landing/theme-4.png",
      afterPhoto: "/designs/landing/theme-5.png",
      duration: "10 hafta",
      description: "Disiplinli takip ile donusum",
    },
    {
      id: "t3",
      clientName: "Mert",
      beforePhoto: "/designs/landing/theme-2.png",
      afterPhoto: "/designs/landing/theme-1.png",
      duration: "8 hafta",
      description: "Kas kutlesi artisi",
    },
  ],
};

function renderTheme(themeId: LandingThemeId) {
  return (
    <LandingThemeProvider themeId={themeId}>
      <LandingRenderer themeId={themeId} content={SAMPLE_CONTENT} />
    </LandingThemeProvider>
  );
}

export default function LandingPreviewPage() {
  return (
    <div className="bg-[#05070d] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-4xl tracking-wide">Landing Preview</h1>
          <p className="text-sm text-white/60">
            Tum landing temalari ayni sample data ile gosterilir.
          </p>
        </header>

        {LANDING_THEME_LIST.map((theme) => (
          <section key={theme.id} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
              {theme.name}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {renderTheme(theme.id)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
