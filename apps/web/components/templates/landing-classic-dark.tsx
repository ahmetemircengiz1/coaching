import Link from "next/link";
import type { TemplateProps } from "@/lib/templates/types";

export function LandingClassicDark({
  domain,
  brandName,
  bio,
  logo,
  email,
  primaryColor,
  secondaryColor,
  packages,
  transformations,
  studentCount,
  authUrl,
}: TemplateProps) {
  const gold = secondaryColor;

  return (
    <div className="min-h-screen scroll-smooth bg-black text-white" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={brandName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg" style={{ backgroundColor: gold }}>
                {brandName.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold tracking-tight">{brandName}</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {packages.length > 0 && (
              <a href="#packages" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                Paketler
              </a>
            )}
            {transformations.length > 0 && (
              <a href="#transformations" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                Dönüşümler
              </a>
            )}
            <Link href={authUrl} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
              Giriş Yap
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {packages.length > 0 ? (
              <a href="#packages">
                <button
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-200 hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: gold }}
                >
                  Hemen Başla
                </button>
              </a>
            ) : (
              <Link href={authUrl}>
                <button
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-200 hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: gold }}
                >
                  Hemen Başla
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href={authUrl}>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-black"
                style={{ backgroundColor: gold }}
              >
                Giriş
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ backgroundColor: gold }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
        />

        <div className="relative text-center max-w-4xl mx-auto pt-20">
          {/* Decorative top accent */}
          <div className="w-12 h-1 rounded-full mx-auto mb-8" style={{ backgroundColor: gold }} />

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Private Coaching.{" "}
            <span style={{ color: gold }}>Gerçek Dönüşüm.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            {bio || `${brandName} ile hedeflerine ulaş. Kişiye özel antrenman programları, beslenme planları ve birebir koçluk desteği.`}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {packages.length > 0 && (
              <a href="#packages">
                <button
                  className="px-8 py-4 rounded-xl text-base font-bold text-black transition-all duration-200 hover:opacity-90 hover:scale-105 min-w-[200px]"
                  style={{ backgroundColor: gold }}
                >
                  Paketleri İncele
                </button>
              </a>
            )}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Merhaba, ${brandName} koçluk hizmeti hakkında bilgi almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-4 rounded-xl text-base font-semibold border transition-all duration-200 hover:bg-white/5 min-w-[200px]" style={{ borderColor: `${gold}60`, color: gold }}>
                WhatsApp&apos;tan Yaz
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="py-16 px-6 border-y border-white/5" style={{ backgroundColor: "#060606" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: gold }}>
                +{studentCount > 0 ? studentCount : 1200}
              </p>
              <p className="text-sm text-white/40 tracking-wide uppercase">Danışan</p>
            </div>
            <div className="sm:border-x border-white/5">
              <p className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: gold }}>
                5 Yıl
              </p>
              <p className="text-sm text-white/40 tracking-wide uppercase">Deneyim</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: gold }}>
                %94
              </p>
              <p className="text-sm text-white/40 tracking-wide uppercase">Başarı Oranı</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Packages Section ── */}
      {packages.length > 0 && (
        <section id="packages" className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: gold }}>
                Paketler
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Sana Uygun Planı Seç
              </h2>
              <p className="text-white/40 mt-4 max-w-lg mx-auto">
                Hedeflerine en uygun paketi seç, dönüşümüne hemen başla.
              </p>
            </div>

            <div
              className={`grid gap-6 ${
                packages.length === 1
                  ? "max-w-md mx-auto"
                  : packages.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {packages.map((pkg, index) => {
                const isPopular = packages.length >= 3 && index === 1;
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:scale-[1.02] ${
                      isPopular ? "border-opacity-100" : "border-white/10"
                    }`}
                    style={{
                      backgroundColor: "#0a0a0a",
                      borderColor: isPopular ? gold : undefined,
                    }}
                  >
                    {isPopular && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black uppercase tracking-wider"
                        style={{ backgroundColor: gold }}
                      >
                        Popüler
                      </div>
                    )}

                    <p className="text-sm text-white/40 mb-1">{pkg.duration} Hafta</p>
                    <h3 className="text-xl font-bold mb-4">{pkg.name}</h3>

                    <div className="mb-6">
                      <span className="text-4xl font-extrabold" style={{ color: gold }}>
                        {pkg.price.toLocaleString("tr-TR")}
                      </span>
                      <span className="text-white/30 text-sm ml-2">{pkg.currency}</span>
                    </div>

                    <p className="text-sm text-white/40 mb-6 leading-relaxed">{pkg.description}</p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <svg
                            className="w-5 h-5 shrink-0 mt-0.5"
                            style={{ color: gold }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white/60">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`${authUrl}?package=${pkg.id}`}>
                      <button
                        className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 hover:opacity-90 ${
                          isPopular ? "text-black" : ""
                        }`}
                        style={
                          isPopular
                            ? { backgroundColor: gold }
                            : { border: `1px solid ${gold}50`, color: gold }
                        }
                      >
                        Şimdi Satın Al
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Transformations Section ── */}
      {transformations.length > 0 && (
        <section id="transformations" className="py-24 px-6" style={{ backgroundColor: "#060606" }}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: gold }}>
                Dönüşümler
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Gerçek Sonuçlar
              </h2>
              <p className="text-white/40 mt-4 max-w-lg mx-auto">
                Danışanlarımızın ilham veren dönüşüm hikayeleri.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl overflow-hidden border border-white/10 hover:border-opacity-30 transition-all duration-300"
                  style={{ backgroundColor: "#0a0a0a" }}
                >
                  <div className="grid grid-cols-2">
                    <div className="aspect-[3/4] relative">
                      <img src={t.beforePhoto} alt="Önce" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase">
                        Önce
                      </span>
                    </div>
                    <div className="aspect-[3/4] relative">
                      <img src={t.afterPhoto} alt="Sonra" className="w-full h-full object-cover" />
                      <span
                        className="absolute bottom-2 left-2 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-black"
                        style={{ backgroundColor: gold }}
                      >
                        Sonra
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold">{t.clientName}</p>
                    {t.duration && <p className="text-xs text-white/30 mt-1">{t.duration}</p>}
                    {t.description && <p className="text-sm text-white/40 mt-2 leading-relaxed">{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
          style={{ backgroundColor: gold }}
        />

        <div className="relative container mx-auto max-w-2xl text-center">
          <div className="w-12 h-1 rounded-full mx-auto mb-8" style={{ backgroundColor: gold }} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Hazırsan başlayalım.
          </h2>
          <p className="text-white/40 mb-10 text-lg max-w-md mx-auto">
            Dönüşümün ilk adımı burada. Seni de aramızda görmek istiyoruz.
          </p>
          <Link href={authUrl}>
            <button
              className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: gold }}
            >
              Hemen Katıl
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              {logo ? (
                <img src={logo} alt={brandName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm"
                  style={{ backgroundColor: gold }}
                >
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="text-sm font-semibold">{brandName}</span>
            </div>

            {/* Social / Contact Links */}
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${email}`}
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                E-posta
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Merhaba, ${brandName} hakkında bilgi almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                WhatsApp
              </a>
              <Link href={authUrl} className="text-sm text-white/30 hover:text-white/60 transition-colors">
                Giriş Yap
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} {brandName}. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
