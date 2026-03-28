import Link from "next/link";
import type { TemplateProps } from "@/lib/templates/types";

export function LandingModernTeal({ brandName, bio, logo, email, secondaryColor, packages, transformations, studentCount, authUrl }: TemplateProps) {
  const teal = "#14b8a6";
  return (
    <div className="min-h-screen scroll-smooth bg-[#111827] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#111827]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo && <img src={logo} alt={brandName} className="w-9 h-9 rounded-full object-cover" />}
            <span className="text-lg font-bold tracking-wider uppercase">{brandName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-white/50 hover:text-white transition">Ana Sayfa</a>
            {packages.length > 0 && <a href="#packages" className="text-sm text-white/50 hover:text-white transition">Paketler</a>}
            {transformations.length > 0 && <a href="#transformations" className="text-sm text-white/50 hover:text-white transition">Dönüşümler</a>}
            <Link href={authUrl}><button className="px-5 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: teal }}>Giriş Yap</button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Potansiyelini<br /><span style={{ color: teal }}>ortaya Çıkart</span>
            </h1>
            {bio && <p className="text-white/50 text-lg mb-8 max-w-lg leading-relaxed">{bio}</p>}
            <div className="flex gap-4 flex-wrap">
              {packages.length > 0 ? (
                <a href="#packages"><button className="px-8 py-3.5 rounded-lg font-bold text-black transition hover:opacity-90" style={{ backgroundColor: teal }}>Paketleri İncele</button></a>
              ) : (
                <Link href={authUrl}><button className="px-8 py-3.5 rounded-lg font-bold text-black transition hover:opacity-90" style={{ backgroundColor: teal }}>Başla</button></Link>
              )}
              <a href={`https://wa.me/`}><button className="px-8 py-3.5 rounded-lg font-bold border border-white/20 hover:bg-white/5 transition">WhatsApp&apos;tan Yaz</button></a>
            </div>
            {/* Stats */}
            {(studentCount > 0 || packages.length > 0) && (
              <div className="flex gap-10 mt-12">
                {studentCount > 0 && <div><p className="text-3xl font-bold" style={{ color: teal }}>+{studentCount}</p><p className="text-xs text-white/40 mt-1">Danışan</p></div>}
                {transformations.length > 0 && <div><p className="text-3xl font-bold" style={{ color: teal }}>{transformations.length}+</p><p className="text-xs text-white/40 mt-1">Dönüşüm</p></div>}
              </div>
            )}
          </div>
          {logo && (
            <div className="hidden md:block flex-shrink-0">
              <div className="w-72 h-80 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src={logo} alt={brandName} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Packages */}
      {packages.length > 0 && (
        <section id="packages" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">PAKETLER</h2>
            <p className="text-center text-white/40 mb-14">Hedeflerinize uygun paketi seçin</p>
            <div className={`grid gap-6 ${packages.length === 1 ? "max-w-md mx-auto" : packages.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl p-7 text-[#111827] flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <p className="text-sm text-gray-500 mb-1">{pkg.duration} Haftalık Değişim</p>
                  <h3 className="text-xl font-bold mb-3">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold" style={{ color: teal }}>₺{pkg.price.toLocaleString("tr-TR")}</span>
                    <span className="text-gray-400 text-sm">/ay</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-5">{pkg.description}</p>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-0.5" style={{ color: teal }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`${authUrl}?package=${pkg.id}`}>
                    <button className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90" style={{ backgroundColor: teal }}>Şimdi Satın Al</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Transformations */}
      {transformations.length > 0 && (
        <section id="transformations" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold mb-14">Dönüşümler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t) => (
                <div key={t.id} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <div className="grid grid-cols-2">
                    <div className="aspect-[3/4] relative"><img src={t.beforePhoto} alt="Önce" className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px]">Önce</span></div>
                    <div className="aspect-[3/4] relative"><img src={t.afterPhoto} alt="Sonra" className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] text-black" style={{ backgroundColor: teal }}>Sonra</span></div>
                  </div>
                  <div className="p-4"><p className="font-semibold text-sm">{t.clientName}</p>{t.duration && <p className="text-xs text-white/40 mt-1">{t.duration}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Başlamak İçin Hazır Mısın?</h2>
          <p className="text-white/40 mb-8">Ücretsiz danışmanlık al</p>
          <a href={`mailto:${email}`}><button className="px-10 py-4 rounded-lg font-bold text-black transition hover:opacity-90" style={{ backgroundColor: teal }}>Hemen Katıl</button></a>
        </div>
      </section>

      <footer className="py-6 px-6 border-t border-white/5 text-center text-white/20 text-xs">
        <div className="flex justify-center gap-6 mb-3">
          <a href={`mailto:${email}`} className="hover:text-white/50 transition">E-posta</a>
          <Link href={authUrl} className="hover:text-white/50 transition">Giriş Yap</Link>
        </div>
        &copy; {new Date().getFullYear()} {brandName}. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
