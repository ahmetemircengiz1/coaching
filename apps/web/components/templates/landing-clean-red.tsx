import Link from "next/link";
import type { TemplateProps } from "@/lib/templates/types";

export function LandingCleanRed({ brandName, bio, logo, email, packages, transformations, studentCount, authUrl }: TemplateProps) {
  const red = "#ef4444";
  const highlightIndex = packages.length >= 3 ? 1 : -1;

  return (
    <div className="min-h-screen scroll-smooth bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo && <img src={logo} alt={brandName} className="w-9 h-9 rounded-full object-cover" />}
            <span className="text-lg font-bold tracking-wide">{brandName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-gray-500 hover:text-gray-900 transition">Ana Sayfa</a>
            {packages.length > 0 && <a href="#packages" className="text-sm text-gray-500 hover:text-gray-900 transition">Paketler</a>}
            {transformations.length > 0 && <a href="#transformations" className="text-sm text-gray-500 hover:text-gray-900 transition">Dönüşümler</a>}
            <a href="#contact" className="text-sm text-gray-500 hover:text-gray-900 transition">İletişim</a>
          </div>
          <div className="hidden md:block">
            <Link href={authUrl}>
              <button className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: red }}>Giriş Yap</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="pt-32 pb-20 px-6 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Hedefine Ulaşmanın<br /><span style={{ color: red }}>Tam Zamanı</span>
            </h1>
            {bio && <p className="text-gray-500 text-lg mb-8 max-w-lg leading-relaxed">{bio}</p>}
            <div className="flex gap-4 flex-wrap">
              {packages.length > 0 ? (
                <a href="#packages">
                  <button className="px-8 py-3.5 rounded-lg font-bold text-white transition hover:opacity-90" style={{ backgroundColor: red }}>Hemen Başla</button>
                </a>
              ) : (
                <Link href={authUrl}>
                  <button className="px-8 py-3.5 rounded-lg font-bold text-white transition hover:opacity-90" style={{ backgroundColor: red }}>Başla</button>
                </Link>
              )}
              <a href={`https://wa.me/`}>
                <button className="px-8 py-3.5 rounded-lg font-bold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition">WhatsApp&apos;tan Yaz</button>
              </a>
            </div>
          </div>
          {logo && (
            <div className="hidden md:block flex-shrink-0">
              <div className="w-72 h-80 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                <img src={logo} alt={brandName} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      {(studentCount > 0 || packages.length > 0 || transformations.length > 0) && (
        <section className="py-10 px-6 bg-white border-y border-gray-100">
          <div className="container mx-auto max-w-6xl flex justify-center gap-16 flex-wrap">
            {studentCount > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: red }}>+{studentCount}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Danışan</p>
              </div>
            )}
            {transformations.length > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: red }}>{transformations.length}+</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Dönüşüm</p>
              </div>
            )}
            {packages.length > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: red }}>{packages.length}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Paket</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <section id="packages" className="py-20 px-6 bg-[#fafafa]">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-3">Paketler</h2>
            <p className="text-center text-gray-400 mb-14">Hedeflerinize uygun paketi seçin</p>
            <div className={`grid gap-6 ${packages.length === 1 ? "max-w-md mx-auto" : packages.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {packages.map((pkg, index) => {
                const isHighlighted = index === highlightIndex;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl p-7 flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                      isHighlighted
                        ? "bg-white border-2 shadow-lg relative"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                    style={isHighlighted ? { borderColor: red } : undefined}
                  >
                    {isHighlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: red }}>
                        Popüler
                      </span>
                    )}
                    <p className="text-sm text-gray-400 mb-1">{pkg.duration} Haftalık Program</p>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{pkg.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold" style={{ color: red }}>₺{pkg.price.toLocaleString("tr-TR")}</span>
                      <span className="text-gray-400 text-sm"> /ay</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-5">{pkg.description}</p>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 font-bold" style={{ color: red }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Link href={`${authUrl}?package=${pkg.id}`}>
                      <button
                        className={`w-full py-3 rounded-lg font-bold transition hover:opacity-90 ${
                          isHighlighted ? "text-white" : "text-white"
                        }`}
                        style={{ backgroundColor: red }}
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

      {/* Transformations */}
      {transformations.length > 0 && (
        <section id="transformations" className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-3">Dönüşümler</h2>
            <p className="text-center text-gray-400 mb-14">Gerçek sonuçlar, gerçek insanlar</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t) => (
                <div key={t.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="grid grid-cols-2">
                    <div className="aspect-[3/4] relative">
                      <img src={t.beforePhoto} alt="Önce" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px]">Önce</span>
                    </div>
                    <div className="aspect-[3/4] relative">
                      <img src={t.afterPhoto} alt="Sonra" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] text-white" style={{ backgroundColor: red }}>Sonra</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm text-gray-900">{t.clientName}</p>
                    {t.duration && <p className="text-xs text-gray-400 mt-1">{t.duration}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="contact" className="py-20 px-6 bg-[#fafafa] border-t border-gray-100">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Başlamak İçin Hazır Mısın?</h2>
          <p className="text-gray-400 mb-8">Hedeflerine ulaşmak için ilk adımı at</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={`mailto:${email}`}>
              <button className="px-10 py-4 rounded-lg font-bold text-white transition hover:opacity-90" style={{ backgroundColor: red }}>Hemen Katıl</button>
            </a>
            <a href={`https://wa.me/`}>
              <button className="px-10 py-4 rounded-lg font-bold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition">WhatsApp</button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 bg-white border-t border-gray-100 text-center text-gray-400 text-xs">
        <div className="flex justify-center gap-6 mb-3">
          <a href={`mailto:${email}`} className="hover:text-gray-600 transition">E-posta</a>
          <Link href={authUrl} className="hover:text-gray-600 transition">Giriş Yap</Link>
        </div>
        &copy; {new Date().getFullYear()} {brandName}. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
