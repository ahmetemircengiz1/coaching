import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const packages = [
  {
    name: "Başlangıç",
    tier: 1,
    price: 499,
    currency: "TRY",
    period: "ay",
    maxStudents: 5,
    popular: false,
    features: [
      "Profesyonel tanıtım sayfası",
      "1 premium kurumsal şablon",
      "5 öğrenci kapasitesi",
      "Antrenman programları atama",
      "Diyet ve makro takibi",
      "Sistematik check-in takibi",
      "Gelişmiş analitik paneli",
      "Platform içi anlık mesajlaşma",
      "PWA Mobil Uygulama Desteği",
    ],
  },
  {
    name: "Profesyonel",
    tier: 2,
    price: 899,
    currency: "TRY",
    period: "ay",
    maxStudents: 10,
    popular: true,
    features: [
      "Başlangıç paketindeki her şey",
      "3 farklı özel tasarım şablonu",
      "10 öğrenci tam kapasite",
      "Dönüşüm hikayeleri vitrini",
      "Makro/Mikro detaylandırılmış analiz",
      "Toplu program şablonları",
      "Öncelikli mühendislik desteği",
    ],
  },
  {
    name: "Premium",
    tier: 3,
    price: 1499,
    currency: "TRY",
    period: "ay",
    maxStudents: "Sınırsız",
    popular: false,
    features: [
      "Profesyonel paketindeki her şey",
      "Vizyoner tasarım arşivinin tamamı",
      "Sınırsız danışan yönetimi",
      "Tümüyle özel Domain desteği",
      "Size özel arayüz personalizasyonu",
      "VIP Veri & Analitik Raporlama",
      "Coach OS ibaresiz beyaz etiket",
      "7/24 dedike hesap uzmanı",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-[#ccff00] selection:text-black overflow-x-hidden relative">

      {/* Abstract Glowing Backgrounds */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-20%] w-[40%] h-[60%] bg-[#ccff00]/5 blur-[150px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#111111]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold tracking-widest flex items-center gap-2">
            COACH<span className="text-[#ccff00]">OS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 bg-white/5 rounded-full px-6 py-2 border border-white/5 backdrop-blur-md">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300">
              Ana Sayfa
            </Link>
            <Link href="/platform/pricing" className="text-sm font-medium text-white transition-colors duration-300">
              Paketler
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/platform/auth">
              <Button className="bg-white/10 text-white hover:bg-[#1A1A1A] font-semibold rounded-full px-6 backdrop-blur-md border border-white/10 transition-all duration-300">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-32 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">

          <div className="text-center mb-24 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
              <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Tüm Modüller Şeffaf ve Net</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Ekosisteminize <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">Yön Verin.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              Her planda tamamen kendi kontrolünüzde olan profesyonel bir koçluk ekosistemi sizi bekliyor. Sürpriz ek maliyetler veya danışan gelirinizden kesilen haksız komisyonlar olmadan işletmenizi özgürce ölçeklendirin.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {packages.map((pkg, i) => (
              <div
                key={pkg.tier}
                className={`flex flex-col relative rounded-[2.5rem] p-10 transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up ${pkg.popular
                  ? "bg-gradient-to-b from-[#1C1C1E] to-[#111111] border border-[#ccff00]/30 shadow-[0_0_40px_rgba(204,255,0,0.1)]"
                  : "bg-gradient-to-b from-[#1C1C1E] to-[#111111] border border-white/5 hover:border-white/10"
                  }`}
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#ccff00] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                    Trend Tercih
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="font-heading text-2xl font-bold mb-4">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold tracking-tight">{pkg.price.toLocaleString("tr-TR")}</span>
                    <span className="text-white/40 font-medium tracking-wide">{pkg.currency} / {pkg.period}</span>
                  </div>
                  <p className="text-sm text-white/50 font-medium">
                    Merkezi Ölçek: <span className="text-white font-semibold">{pkg.maxStudents} Danışan</span>
                  </p>
                </div>

                <div className="flex-1">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <ul className="space-y-4 mb-10">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`mt-0.5 shrink-0 flex items-center justify-center h-5 w-5 rounded-full shadow-inner ${pkg.popular ? "bg-[#ccff00]/20 text-[#ccff00]" : "bg-white/10 text-white"}`}>
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <span className="text-white/70 text-sm leading-relaxed tracking-wide font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link href={`/platform/auth?tier=${pkg.tier}`} className="block w-full">
                    <Button
                      className={`w-full h-14 rounded-full text-base font-bold transition-all duration-300 ${pkg.popular

                        ? "bg-[#ccff00] text-black hover:bg-[#b8e600] shadow-[0_0_20px_rgba(204,255,0,0.1)] group-hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                        }`}
                    >
                      Planı Seç
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Deep FAQ or Trust Footer inside grid */}
          <div className="mt-32 max-w-4xl mx-auto text-center border-t border-white/5 pt-16">
            <h3 className="text-2xl font-heading font-bold mb-4">Sıkça Sorulan Sorular</h3>
            <p className="text-white/50 text-base mb-8">Platform kullanımında ödeme altyapısını iyzico/Stripe ile siz kuruyorsunuz. Kendi panelinizden doğrudan banka hesabınıza %0 komisyonla ödeme alın.</p>
            <div className="inline-flex items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Anında Kurulum</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Ücretsiz Destek</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4" /> İptal Garantisi</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
