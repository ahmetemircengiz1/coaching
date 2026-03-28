import Link from "next/link";
import type { TemplateProps } from "@/lib/templates/types";

export function LandingFreshLight({ brandName, bio, logo, email, secondaryColor, packages, transformations, studentCount, authUrl }: TemplateProps) {
  const accent = "#f59e0b"; // warm amber/orange
  const accentLight = "#fef3c7";
  return (
    <div className="min-h-screen scroll-smooth bg-[#fffdf7] text-[#1a1a1a]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Abstract paint splashes via CSS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]" style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
        <div className="absolute bottom-20 -left-20 w-[300px] h-[300px] rounded-full opacity-15 blur-[80px]" style={{ background: `radial-gradient(circle, #06b6d4, transparent 70%)` }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            {logo && <img src={logo} alt={brandName} className="w-9 h-9 rounded-full object-cover" />}
            <span className="text-xl font-bold" style={{ color: accent }}>{brandName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {packages.length > 0 && <a href="#packages" className="text-sm text-black/50 hover:text-black transition">Paketler</a>}
            {transformations.length > 0 && <a href="#transformations" className="text-sm text-black/50 hover:text-black transition">Dönüşümler</a>}
            <a href="#contact" className="text-sm text-black/50 hover:text-black transition">İletişim</a>
            <Link href={authUrl}><button className="px-5 py-2 rounded-full text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: accent }}>Giriş Yap</button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Potansiyelinin<br />en iyi haline <span style={{ color: accent }}>ulaş.</span>
            </h1>
            {bio && <p className="text-black/50 text-lg mb-8 max-w-lg">{bio}</p>}
            <div className="flex gap-4 flex-wrap">
              {packages.length > 0 ? (
                <a href="#packages"><button className="px-8 py-3.5 rounded-full font-bold text-white transition hover:opacity-90 shadow-lg" style={{ backgroundColor: accent }}>Paketleri İncele</button></a>
              ) : (
                <Link href={authUrl}><button className="px-8 py-3.5 rounded-full font-bold text-white transition hover:opacity-90 shadow-lg" style={{ backgroundColor: accent }}>Başla</button></Link>
              )}
              <a href={`https://wa.me/`}><button className="px-8 py-3.5 rounded-full font-bold border-2 border-black/10 hover:bg-black/5 transition flex items-center gap-2">▶ WhatsApp&apos;tan Yaz</button></a>
            </div>
            {/* Stats */}
            <div className="flex gap-10 mt-12">
              {studentCount > 0 && <div><p className="text-3xl font-bold" style={{ color: accent }}>+{studentCount}</p><p className="text-xs text-black/40 mt-1">dönüşüm</p></div>}
              <div><p className="text-3xl font-bold" style={{ color: accent }}>5 yıllık</p><p className="text-xs text-black/40 mt-1">deneyim</p></div>
              <div><p className="text-3xl font-bold" style={{ color: accent }}>Haftalık birebir</p><p className="text-xs text-black/40 mt-1">takip</p></div>
            </div>
          </div>
          {logo && (
            <div className="hidden md:block flex-shrink-0">
              <div className="w-72 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img src={logo} alt={brandName} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Packages */}
      {packages.length > 0 && (
        <section id="packages" className="py-20 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold mb-3">Hedefe ulaşmak için <span style={{ color: accent }}>paketini seç</span></h2>
            <p className="text-center text-black/40 mb-14">İhtiyacına uygun programı belirle</p>
            <div className={`grid gap-6 ${packages.length === 1 ? "max-w-md mx-auto" : packages.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {packages.map((pkg, idx) => {
                const isHighlighted = idx === 1 && packages.length >= 3;
                return (
                  <div key={pkg.id} className={`rounded-3xl p-7 flex flex-col hover:-translate-y-1 transition-all duration-300 ${isHighlighted ? "bg-white shadow-2xl ring-2 ring-amber-400 scale-[1.03]" : "bg-white shadow-lg"}`}>
                    {isHighlighted && <span className="inline-block mb-3 px-3 py-1 rounded-full text-[11px] font-bold text-white self-start" style={{ backgroundColor: accent }}>Popüler</span>}
                    <h3 className="text-lg font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-black/40 mb-4">{pkg.duration} Hafta</p>
                    <div className="mb-5">
                      <span className="text-4xl font-extrabold" style={{ color: accent }}>₺{pkg.price.toLocaleString("tr-TR")}</span>
                    </div>
                    <p className="text-sm text-black/50 mb-5">{pkg.description}</p>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm"><span style={{ color: accent }}>✓</span><span className="text-black/60">{f}</span></li>
                      ))}
                    </ul>
                    <Link href={`${authUrl}?package=${pkg.id}`}>
                      <button className={`w-full py-3.5 rounded-full font-bold transition hover:opacity-90 ${isHighlighted ? "text-white" : "bg-black/5 text-black hover:bg-black/10"}`} style={isHighlighted ? { backgroundColor: accent } : {}}>Başla</button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Transformations */}
      {transformations.length > 0 && (
        <section id="transformations" className="py-20 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold mb-14">Dönüşümler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t) => (
                <div key={t.id} className="rounded-3xl overflow-hidden bg-white shadow-lg">
                  <div className="grid grid-cols-2">
                    <div className="aspect-[3/4] relative"><img src={t.beforePhoto} alt="Önce" className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-white/80 px-2 py-0.5 rounded text-[10px]">Önce</span></div>
                    <div className="aspect-[3/4] relative"><img src={t.afterPhoto} alt="Sonra" className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] text-white" style={{ backgroundColor: accent }}>Sonra</span></div>
                  </div>
                  <div className="p-4"><p className="font-semibold text-sm">{t.clientName}</p>{t.duration && <p className="text-xs text-black/40 mt-1">{t.duration}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" className="py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Hazırsan <span style={{ color: accent }}>başlayalım.</span></h2>
          <p className="text-black/40 mb-8">Hemen katıl ve dönüşümüne başla</p>
          <a href={`mailto:${email}`}><button className="px-10 py-4 rounded-full font-bold text-white transition hover:opacity-90 shadow-lg" style={{ backgroundColor: accent }}>Hemen Katıl</button></a>
        </div>
      </section>

      <footer className="py-6 px-6 border-t border-black/5 text-center text-black/30 text-xs relative z-10">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#" className="hover:text-black/60 transition">Instagram</a>
          <a href="#" className="hover:text-black/60 transition">YouTube</a>
          <a href="#" className="hover:text-black/60 transition">WhatsApp</a>
          <Link href={authUrl} className="hover:text-black/60 transition">Giriş Yap</Link>
        </div>
        &copy; {new Date().getFullYear()} {brandName}
      </footer>
    </div>
  );
}
