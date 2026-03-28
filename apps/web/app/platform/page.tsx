import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, BarChart3, Users, Zap, Calendar, Smartphone, LayoutDashboard, Globe } from "lucide-react";

export default function PlatformHomePage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-[#ccff00] selection:text-black mt-0 pt-0 overflow-x-hidden">

      {/* Abstract Glowing Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#ccff00]/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#111111]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold tracking-widest flex items-center gap-2">
            COACH<span className="text-[#ccff00]">OS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 bg-white/5 rounded-full px-6 py-2 border border-white/5 backdrop-blur-md">
            <a href="#tanitim" className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300">
              Platform
            </a>
            <a href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300">
              Özellikler
            </a>
            <Link href="/platform/pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300">
              Paketler
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/platform/auth" className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 hidden sm:block">
              Koç Girişi
            </Link>
            <Link href="/platform/pricing">
              <Button className="bg-white text-black hover:bg-[#ccff00] hover:text-black font-semibold rounded-full px-6 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                Platformu Kur
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="container mx-auto text-center max-w-5xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-[#ccff00] animate-pulse"></span>
            <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Yeni Nesil Koçluk Ekosistemi</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Vizyonunuzu Yönetin.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
              Sınırları Kaldırın.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '200ms' }}>
            Aylar süren maliyetli yazılım geliştirme süreçlerini ardınızda bırakın. Kusursuz mimariyle donatılmış, yalnızca markanızın kimliğini yansıtan bağımsız platformunuzla öğrencilerinize hemen benzersiz bir deneyim sunmaya başlayın.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/platform/pricing">
              <Button
                size="lg"
                className="bg-[#ccff00] text-black hover:bg-[#b8e600] font-bold text-lg px-8 rounded-full h-14 group transition-all duration-300 hover:scale-105"
              >
                Hemen Başlayın
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#tanitim">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-[#1A1A1A] font-semibold text-lg px-8 rounded-full h-14 transition-all duration-300"
              >
                Mimarimizi İnceleyin
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Product Showcase - Dashboard */}
      <section id="tanitim" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-[#1A1A1A] border border-white/10 items-center justify-center">
                <LayoutDashboard className="text-[#ccff00] h-6 w-6" />
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Merkezi Yönetim,<br /> <span className="text-white/40">Kusursuz Operasyon.</span>
              </h2>
              <p className="text-lg text-white/60 font-light leading-relaxed">
                Platformunuzun yönetim paneli (Dashboard), yüzlerce öğrencinizin antrenman planlarını, beslenme makrolarını ve haftalık uyum süreçlerini aynı anda, tek bir ekrandan yönetmeniz için tasarlandı. Karmaşık Excel tablolarına veda edin, veri odaklı koçluğa merhaba deyin.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-[#ccff00]/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#ccff00]" />
                  </div>
                  <span><strong className="text-white font-medium">Holistik İlerleme:</strong> Öğrenci check-in fotoğrafları, ağırlık hedefleri ve kalori takipleri tek bir havuzda.</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span><strong className="text-white font-medium">Dinamik Planlar:</strong> Saniyeler içinde esnek diyet ve egzersiz rutinleri oluşturun.</span>
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform lg:-rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ccff00]/10 to-transparent mix-blend-overlay pointer-events-none"></div>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="Coach OS Dashboard Preview"
                  className="w-full h-auto object-cover opacity-90"
                />
                {/* Fake UI Header */}
                <div className="absolute top-0 w-full h-8 bg-[#1A1A1A] border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                  <div className="mx-auto text-[10px] text-white/30 font-medium tracking-widest uppercase">Coach Dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase - Landing Page */}
      <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">

            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                  alt="Coach OS Custom Landing Page"
                  className="w-full h-auto object-cover opacity-90 sepia-[.2] hue-rotate-180"
                />
                {/* Fake UI Header */}
                <div className="absolute top-0 w-full h-8 bg-[#1A1A1A] border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                  <div className="mx-auto text-[10px] text-white/30 font-medium tracking-widest uppercase">Student Landing Page</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-[#1A1A1A] border border-white/10 items-center justify-center">
                <Globe className="text-white h-6 w-6" />
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Sizin İmzanız,<br /> <span className="text-white/40">Sizin Vitriniz.</span>
              </h2>
              <p className="text-lg text-white/60 font-light leading-relaxed">
                Coach OS algoritması size ve markanıza ait özel bir tanıtım sitesi (Landing Page) tahsis eder. Kapsamlı üyelik sistemleri, seçebildiğiniz özel estetik temalar, modern dizayn prensipleri ve bizzat kendi logo/marka paletinizle danışanları karşılayın.
              </p>
              <p className="text-lg text-white/60 font-light leading-relaxed">
                İkinci bir web geliştiricisine ihtiyaç duymadan "Ana Sayfa", "Servis Paketleri" ve "Kayıt" ekranlarını profesyonel bir ekosisteme uygun olarak yayınlayın.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-32 px-6 relative z-10 bg-[#111111]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Her Mimaride,<br /><span className="text-white/40">Prestij ve Performans.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">

            {/* Large Feature Card 1 */}
            <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-gradient-to-br from-[#1C1C1E] to-[#111111] border border-white/5 p-10 flex flex-col justify-between group overflow-hidden relative dashboard-card-hover">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ccff00]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-[#111111] flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                  <Activity className="text-white h-6 w-6" />
                </div>
                <h3 className="font-heading text-3xl font-bold mb-4">Elite Öğrenci Portalı</h3>
                <p className="text-white/60 text-lg max-w-md">Profesyonelliği merkeze oturtan, öğrencilerin sadece antrenman verilerine odaklanmasını sağlayan hiper modern minimalist paneller.</p>
              </div>
              <div className="relative z-10 w-full h-[60%] mt-8 bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
                {/* Mockup UI representation */}
                <div className="flex gap-4 p-6 h-full">
                  <div className="w-24 h-full space-y-3">
                    <div className="w-full h-8 bg-white/5 rounded-md"></div>
                    <div className="w-full h-8 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-md"></div>
                    <div className="w-full h-8 bg-white/5 rounded-md"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="w-1/2 h-8 bg-gradient-to-r from-white/10 to-transparent rounded-md"></div>
                    <div className="w-full h-40 bg-[#141414] border border-white/5 rounded-xl flex items-end p-4 gap-2">
                      <div className="w-1/6 bg-white/10 rounded-t-md h-12"></div>
                      <div className="w-1/6 bg-white/10 rounded-t-md h-20"></div>
                      <div className="w-1/6 bg-[#ccff00] rounded-t-md h-32"></div>
                      <div className="w-1/6 bg-white/10 rounded-t-md h-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Square Feature Card 1 */}
            <div className="rounded-[2rem] bg-gradient-to-br from-[#1C1C1E] to-[#111111] border border-white/5 p-8 flex flex-col relative overflow-hidden dashboard-card-hover">
              <div className="h-12 w-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center mb-6 border border-[#ccff00]/20 shadow-lg">
                <Smartphone className="text-[#ccff00] h-6 w-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">Mobil Senkronizasyon</h3>
              <p className="text-white/50 text-base flex-1">
                Her cihaza tam uyumlu PWA altyapısı sayesinde, işletmeniz Apple veya Android ayrımı gözetmeksizin kullanıcıların cebinde.
              </p>
            </div>

            {/* Square Feature Card 2 */}
            <div className="rounded-[2rem] bg-gradient-to-br from-[#1C1C1E] to-[#111111] border border-white/5 p-8 flex flex-col relative overflow-hidden dashboard-card-hover">
              <div className="h-12 w-12 rounded-2xl bg-[#111111] flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                <BarChart3 className="text-white h-6 w-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">Analitik & İstatistik</h3>
              <p className="text-white/50 text-base flex-1">
                Hedefe yönelik grafiklemeler. Öğrencilerinizin kilo düşüşlerini veya vücut istatistiklerini milimetrik olarak izleyin.
              </p>
            </div>

            {/* Wide Feature Card */}
            <div className="md:col-span-3 rounded-[2rem] bg-gradient-to-br from-[#1C1C1E] to-[#111111] border border-white/5 p-10 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative dashboard-card-hover group">
              <div className="w-full md:w-1/2 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-[#111111] flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                  <Zap className="text-white h-6 w-6" />
                </div>
                <h3 className="font-heading text-3xl font-bold mb-4">Sıfır Komisyon.</h3>
                <p className="text-white/60 text-lg mb-8">
                  Üyelerden veya paket satışlarından komisyon ödemeyin. Belirlediğiniz fiyatların %100'ü doğrudan gelir hanenize işlensin. Finansal kontrol sizde.
                </p>
                <Link href="/platform/pricing" className="inline-flex items-center text-white hover:text-[#ccff00] font-semibold transition-colors">
                  Fiyatlandırma Sistemimiz <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="w-full md:w-1/2 h-[300px] relative z-10 hidden md:flex items-center justify-center">
                <div className="relative w-full max-w-[350px] h-[75%] border border-white/10 bg-[#0a0a0a] rounded-xl flex items-center p-6 shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full space-y-4">
                    <div className="w-full h-14 bg-[#141414] rounded-lg flex items-center px-4 justify-between border border-white/5">
                      <span className="text-white/50 font-medium text-sm">Aylık Kazanç:</span>
                      <span className="text-[#ccff00] font-bold text-lg">₺18,500</span>
                    </div>
                    <div className="w-full h-14 bg-[#141414] rounded-lg flex items-center px-4 justify-between border border-white/5 opacity-70">
                      <span className="text-white/30 font-medium text-sm">Coach OS Kesintisi:</span>
                      <span className="text-white/30 font-bold text-lg">₺0,00</span>
                    </div>
                    <div className="w-full h-1 h-px bg-white/10 my-2 block rounded-full"></div>
                    <div className="w-full h-14 bg-gradient-to-r from-[#ccff00]/10 to-transparent border border-[#ccff00]/20 rounded-lg flex items-center px-4 justify-between">
                      <span className="text-white font-medium text-sm">Net Kar:</span>
                      <span className="text-white font-bold text-xl">₺18,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-24 px-6 bg-[#0a0a0d] border-y border-white/5">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-heading font-bold text-white mb-2">5+</div>
            <div className="text-sm text-white/50 uppercase tracking-wider font-semibold">Premium Estetik Tema</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold text-white mb-2">%100</div>
            <div className="text-sm text-white/50 uppercase tracking-wider font-semibold">Kusursuz Reaktivasyon</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold text-white mb-2">0</div>
            <div className="text-sm text-white/50 uppercase tracking-wider font-semibold">Gizli Komisyon</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold text-white mb-2">7/24</div>
            <div className="text-sm text-white/50 uppercase tracking-wider font-semibold">Bulut Erişimi</div>
          </div>
        </div>
      </section>

      {/* Minimal CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#111111]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] to-[#111111] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-[#ccff00]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-8 tracking-tight">
            Şimdi Vites Yükseltme Zamanı.
          </h2>
          <p className="text-white/50 text-xl md:text-2xl mb-12 font-light">
            Eski yöntemleri bir kenara bırakın. Dünyanın en elit koçluk mimarisi ile markanızı yarın sabah ayağa kaldırın.
          </p>
          <Link href="/platform/pricing">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-[#ccff00] font-bold text-lg px-12 h-16 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
            >
              Hemen Başvurunu Yap
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#0a0a0d]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-heading text-xl font-bold tracking-widest text-white/40">
            COACH<span className="text-white/20">OS</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Platform Hakkında</Link>
            <Link href="#" className="hover:text-white transition-colors">Gizlilik & Güvenlik</Link>
            <Link href="#" className="hover:text-white transition-colors">Kurumsal İletişim</Link>
          </div>
          <p className="text-white/30 text-xs text-center md:text-right">
            &copy; {new Date().getFullYear()} Coach OS. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
