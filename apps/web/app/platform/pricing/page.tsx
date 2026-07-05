import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { PlatformFooter } from "@/src/components/platform/PlatformFooter";

const SIGNUP_HREF = "/platform/auth?mode=signup&tier=3";

// Şu an tüm özellikler herkese ücretsiz açık. İleride premium paketler eklenince
// bu liste planlara bölünecek; bugün hepsi tek "Ücretsiz" planın altında.
const allFeatures = [
  "Kendi markanla profesyonel tanıtım sitesi",
  "Tüm premium temalara erişim",
  "Sınırsız öğrenci yönetimi",
  "Antrenman programı oluşturma ve atama",
  "Beslenme & makro planı oluşturma",
  "Haftalık check-in ve ilerleme fotoğrafları",
  "İlerleme grafikleri ve detaylı analiz",
  "Öğrenciler için mobil panel (PWA)",
  "WhatsApp ile doğrudan iletişim",
  "Kendi alan adını (domain) bağlama",
  "Öğrenci ödemelerinden sıfır komisyon",
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#111111] text-white selection:bg-[#ccff00] selection:text-black">
      {/* Arka plan ışıkları */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[-20%] h-[60%] w-[40%] rounded-full bg-[#ccff00]/5 blur-[150px]" />
      </div>

      {/* Navigasyon */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#111111]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/platform" className="font-heading text-2xl font-bold tracking-widest">
            SHRED<span className="text-[#ccff00]">.</span>
          </Link>
          <div className="hidden items-center gap-8 rounded-full border border-white/5 bg-white/5 px-6 py-2 backdrop-blur-md md:flex">
            <Link href="/platform" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Ana Sayfa
            </Link>
            <Link href="/platform/pricing" className="text-sm font-medium text-white transition-colors">
              Ücretlendirme
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/platform/auth" className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:block">
              Giriş Yap
            </Link>
            <Link href={SIGNUP_HREF}>
              <Button className="rounded-full bg-[#ccff00] px-6 font-semibold text-black transition-all duration-300 hover:bg-[#b8e600]">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6 pt-40 pb-32">
        <div className="container mx-auto max-w-5xl">
          <div className="animate-fade-in-up mb-16 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A] px-3 py-1">
              <Sparkles className="h-4 w-4 text-[#ccff00]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                Lansman dönemi
              </span>
            </div>
            <h1 className="font-heading mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Şu an her şey <br className="md:hidden" />
              <span className="bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                ücretsiz.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
              Tüm özellikleri herkese açtık. Bugün kayıt olduğunda hiçbir özellik kilitli değil,
              gizli ücret yok. İleride premium paketler ekleyeceğiz; o zaman da seni önceden
              haberdar edeceğiz.
            </p>
          </div>

          {/* Tek ücretsiz plan kartı */}
          <div className="mx-auto max-w-2xl">
            <div className="relative rounded-[2.5rem] border border-[#ccff00]/30 bg-gradient-to-b from-[#1C1C1E] to-[#111111] p-10 shadow-[0_0_40px_rgba(204,255,0,0.1)] md:p-12">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#ccff00] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                Tüm özellikler açık
              </div>

              <div className="mb-8 text-center">
                <h3 className="font-heading text-2xl font-bold">Ücretsiz</h3>
                <div className="mt-4 flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold tracking-tight">₺0</span>
                  <span className="font-medium tracking-wide text-white/40">/ ay</span>
                </div>
                <p className="mt-3 text-sm font-medium text-white/50">
                  Sınırsız öğrenci · Sürpriz ücret yok
                </p>
              </div>

              <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <ul className="mb-10 grid gap-4 sm:grid-cols-2">
                {allFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ccff00]/20 text-[#ccff00]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-light leading-relaxed tracking-wide text-white/70">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={SIGNUP_HREF} className="block w-full">
                <Button className="group h-14 w-full rounded-full bg-[#ccff00] text-base font-bold text-black shadow-[0_0_20px_rgba(204,255,0,0.1)] transition-all duration-300 hover:bg-[#b8e600] hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                  Ücretsiz Hesabını Oluştur
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Şeffaflık notu */}
          <div className="mx-auto mt-24 max-w-3xl border-t border-white/5 pt-16 text-center">
            <h3 className="font-heading mb-4 text-2xl font-bold">Peki ya ileride?</h3>
            <p className="mb-8 text-base leading-relaxed text-white/50">
              İlerleyen dönemde bazı gelişmiş özellikleri premium paketlere taşıyabiliriz. Ama söz
              veriyoruz: bugün ücretsiz kullandığın temel özellikler için seni habersiz bir ödeme
              ekranıyla karşılaştırmayacağız. Her değişikliği önceden duyuracağız.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Anında kurulum</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Sıfır komisyon</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> İstediğin zaman vazgeç</span>
            </div>
          </div>
        </div>
      </div>

      <PlatformFooter />
    </div>
  );
}
