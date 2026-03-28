import Link from "next/link";
import type { TemplateProps } from "@/lib/templates/types";

export function LandingSportDark({
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
  const neon = "#22d3ee";

  return (
    <div
      className="min-h-screen scroll-smooth text-white"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", backgroundColor: "#0f172a" }}
    >
      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(16px)" }}>
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={brandName} className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-400" />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: neon, color: "#0f172a" }}
              >
                {brandName.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold tracking-tight">{brandName}</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {packages.length > 0 && (
              <a href="#packages" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                Paketler
              </a>
            )}
            {transformations.length > 0 && (
              <a href="#transformations" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                Dönüşümler
              </a>
            )}
            <a href="#contact" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              İletişim
            </a>
            <Link href={authUrl} className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Giriş Yap
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {packages.length > 0 ? (
              <a href="#packages">
                <button
                  className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: neon,
                    color: "#0f172a",
                    boxShadow: `0 0 20px ${neon}40, 0 0 40px ${neon}20`,
                  }}
                >
                  Hemen Başla
                </button>
              </a>
            ) : (
              <Link href={authUrl}>
                <button
                  className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: neon,
                    color: "#0f172a",
                    boxShadow: `0 0 20px ${neon}40, 0 0 40px ${neon}20`,
                  }}
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
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: neon, color: "#0f172a" }}
              >
                Giriş
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Diagonal background element */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(135deg, ${neon} 25%, transparent 25%, transparent 50%, ${neon} 50%, ${neon} 75%, transparent 75%)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Neon glow orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[150px]"
          style={{ backgroundColor: neon }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[120px]"
          style={{ backgroundColor: "#6366f1" }}
        />
        {/* Diagonal divider at bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-32"
          style={{
            background: `linear-gradient(to top right, #0b1120 50%, transparent 50%)`,
          }}
        />

        <div className="relative text-center max-w-5xl mx-auto pt-20">
          {/* Neon accent line */}
          <div
            className="w-20 h-1 rounded-full mx-auto mb-8"
            style={{ backgroundColor: neon, boxShadow: `0 0 12px ${neon}80` }}
          />

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter mb-6">
            Limitlerini{" "}
            <span
              style={{
                color: neon,
                textShadow: `0 0 40px ${neon}60`,
              }}
            >
              Kır.
            </span>
            <br />
            <span className="text-white/90">Dönüşümüne Başla.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
            {bio || `${brandName} ile hedeflerine ulaş. Kişiye özel antrenman programları, beslenme planları ve birebir koçluk desteği.`}
          </p>

          {/* Stats integrated into hero */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black" style={{ color: neon }}>
                +{studentCount > 0 ? studentCount : 1200}
              </p>
              <p className="text-xs text-white/30 mt-1 uppercase tracking-wider">Danışan</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-3xl md:text-4xl font-black" style={{ color: neon }}>
                5+
              </p>
              <p className="text-xs text-white/30 mt-1 uppercase tracking-wider">Yıl Deneyim</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black" style={{ color: neon }}>
                %94
              </p>
              <p className="text-xs text-white/30 mt-1 uppercase tracking-wider">Başarı</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {packages.length > 0 && (
              <a href="#packages">
                <button
                  className="px-10 py-4 rounded-xl text-base font-black uppercase tracking-wider transition-all duration-200 hover:scale-105 min-w-[220px]"
                  style={{
                    backgroundColor: neon,
                    color: "#0f172a",
                    boxShadow: `0 0 30px ${neon}50, 0 4px 20px ${neon}30`,
                  }}
                >
                  Başla
                </button>
              </a>
            )}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Merhaba, ${brandName} koçluk hizmeti hakkında bilgi almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="px-10 py-4 rounded-xl text-base font-bold border transition-all duration-200 hover:bg-white/5 min-w-[220px]"
                style={{ borderColor: `${neon}50`, color: neon }}
              >
                WhatsApp&apos;tan Yaz
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Packages Section ── */}
      {packages.length > 0 && (
        <section id="packages" className="relative py-28 px-6 overflow-hidden" style={{ backgroundColor: "#0b1120" }}>
          {/* Geometric background shapes */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]"
            style={{
              background: `linear-gradient(135deg, ${neon}, transparent)`,
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-72 opacity-[0.03]"
            style={{
              background: `linear-gradient(315deg, ${neon}, transparent)`,
              clipPath: "polygon(0 100%, 0 0, 100% 100%)",
            }}
          />

          <div className="relative container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p
                className="text-sm font-black tracking-[0.25em] uppercase mb-3"
                style={{ color: neon }}
              >
                Paketler
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Sana Uygun Planı{" "}
                <span style={{ color: neon }}>Seç</span>
              </h2>
              <p className="text-white/35 mt-4 max-w-lg mx-auto">
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
                    className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:scale-[1.03] group ${
                      isPopular ? "" : "border-white/[0.06] hover:border-white/10"
                    }`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(12px)",
                      borderColor: isPopular ? neon : undefined,
                      boxShadow: isPopular ? `0 0 30px ${neon}15, inset 0 1px 0 ${neon}20` : undefined,
                    }}
                  >
                    {/* Hover neon border glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${neon}30, 0 0 20px ${neon}10`,
                      }}
                    />

                    {isPopular && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                        style={{
                          backgroundColor: neon,
                          color: "#0f172a",
                          boxShadow: `0 0 20px ${neon}50`,
                        }}
                      >
                        Popüler
                      </div>
                    )}

                    <p className="text-sm text-white/35 mb-1">{pkg.duration} Hafta</p>
                    <h3 className="text-xl font-bold mb-4">{pkg.name}</h3>

                    <div className="mb-6">
                      <span
                        className="text-4xl font-black"
                        style={{ color: neon, textShadow: `0 0 20px ${neon}30` }}
                      >
                        {pkg.price.toLocaleString("tr-TR")}
                      </span>
                      <span className="text-white/25 text-sm ml-2">{pkg.currency}</span>
                    </div>

                    <p className="text-sm text-white/35 mb-6 leading-relaxed">{pkg.description}</p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <svg
                            className="w-5 h-5 shrink-0 mt-0.5"
                            style={{ color: neon }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white/50">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`${authUrl}?package=${pkg.id}`}>
                      <button
                        className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] ${
                          isPopular ? "" : ""
                        }`}
                        style={
                          isPopular
                            ? {
                                backgroundColor: neon,
                                color: "#0f172a",
                                boxShadow: `0 0 20px ${neon}40`,
                              }
                            : {
                                border: `1px solid ${neon}40`,
                                color: neon,
                                backgroundColor: `${neon}08`,
                              }
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
        <section id="transformations" className="relative py-28 px-6 overflow-hidden" style={{ backgroundColor: "#0f172a" }}>
          {/* Diagonal divider at top */}
          <div
            className="absolute top-0 left-0 w-full h-24"
            style={{
              background: `linear-gradient(to bottom left, #0b1120 50%, transparent 50%)`,
            }}
          />

          <div className="relative container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p
                className="text-sm font-black tracking-[0.25em] uppercase mb-3"
                style={{ color: neon }}
              >
                Dönüşümler
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Gerçek{" "}
                <span style={{ color: neon }}>Sonuçlar</span>
              </h2>
              <p className="text-white/35 mt-4 max-w-lg mx-auto">
                Danışanlarımızın ilham veren dönüşüm hikayeleri.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/10 transition-all duration-300 group"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
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
                        className="absolute bottom-2 left-2 px-2.5 py-1 rounded text-[10px] font-black tracking-wider uppercase"
                        style={{
                          backgroundColor: neon,
                          color: "#0f172a",
                          boxShadow: `0 0 10px ${neon}50`,
                        }}
                      >
                        Sonra
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{t.clientName}</p>
                      {t.duration && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${neon}15`, color: neon }}
                        >
                          {t.duration}
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-sm text-white/35 mt-2 leading-relaxed">{t.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Strong CTA Section ── */}
      <section id="contact" className="relative py-28 px-6 overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, #0c1a3a 40%, #0f172a 100%)`,
          }}
        />
        {/* Neon glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[150px]"
          style={{ backgroundColor: neon }}
        />
        {/* Geometric accent */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${neon} 0, ${neon} 1px, transparent 0, transparent 50%)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative container mx-auto max-w-2xl text-center">
          <div
            className="w-20 h-1 rounded-full mx-auto mb-8"
            style={{ backgroundColor: neon, boxShadow: `0 0 12px ${neon}80` }}
          />
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Hazırsan{" "}
            <span style={{ color: neon, textShadow: `0 0 30px ${neon}50` }}>
              Başlayalım.
            </span>
          </h2>
          <p className="text-white/35 mb-10 text-lg max-w-md mx-auto">
            Dönüşümün ilk adımı burada. Seni de aramızda görmek istiyoruz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={authUrl}>
              <button
                className="px-12 py-4 rounded-xl text-base font-black uppercase tracking-wider transition-all duration-200 hover:scale-105 min-w-[220px]"
                style={{
                  backgroundColor: neon,
                  color: "#0f172a",
                  boxShadow: `0 0 30px ${neon}50, 0 4px 20px ${neon}30`,
                }}
              >
                Hemen Katıl
              </button>
            </Link>
            <a
              href={`mailto:${email}`}
              className="px-8 py-4 rounded-xl text-base font-bold border transition-all duration-200 hover:bg-white/5 min-w-[220px] inline-block"
              style={{ borderColor: `${neon}40`, color: neon }}
            >
              E-posta Gönder
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-10 px-6" style={{ borderColor: `${neon}10`, backgroundColor: "#0a0f1f" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              {logo ? (
                <img src={logo} alt={brandName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: neon, color: "#0f172a" }}
                >
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="text-sm font-bold">{brandName}</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${email}`}
                className="text-sm transition-colors duration-200"
                style={{ color: `${neon}60` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = neon)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${neon}60`)}
              >
                E-posta
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Merhaba, ${brandName} hakkında bilgi almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-200"
                style={{ color: `${neon}60` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = neon)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${neon}60`)}
              >
                WhatsApp
              </a>
              <Link
                href={authUrl}
                className="text-sm transition-colors duration-200"
                style={{ color: `${neon}60` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = neon)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${neon}60`)}
              >
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
