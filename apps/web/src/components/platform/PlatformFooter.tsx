import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const ACCENT = "#3d6fd1";

const LEGAL_LINKS = [
  { slug: "gizlilik", label: "Gizlilik Politikası" },
  { slug: "kvkk", label: "KVKK Aydınlatma Metni" },
  { slug: "kullanim", label: "Kullanım Koşulları" },
  { slug: "mesafeli", label: "Mesafeli Satış Sözleşmesi" },
  { slug: "iade", label: "İade ve İptal Politikası" },
  { slug: "cerez", label: "Çerez Politikası" },
];

const QUICK_LINKS = [
  { href: "/platform", label: "Anasayfa" },
  { href: "/platform/pricing", label: "Ücretlendirme" },
  { href: "/platform/auth", label: "Giriş Yap" },
  { href: "/platform/onboarding", label: "Hemen Başla" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/45">
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
      {children}
    </h4>
  );
}

export function PlatformFooter() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "destek@reppanel.com";
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "";
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "";

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]/60 text-white/60 backdrop-blur-md">
      {/* Üstte yumuşak çizgi + lime parıltı (gövdeyle dikişsiz geçiş) */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[120px]"
        style={{ backgroundColor: ACCENT }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marka */}
          <div className="space-y-4">
            <Link href="/platform" className="inline-flex items-center text-2xl font-extrabold tracking-tighter text-white">
              SHRED
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/45">
              Profesyonel koçlar için yeni nesil dijital platform. Markanı dakikalar içinde
              ayağa kaldır, danışanlarına özel deneyim sun.
            </p>
          </div>

          {/* Hızlı Erişim */}
          <div>
            <ColumnHeading>Hızlı Erişim</ColumnHeading>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <ColumnHeading>Yasal</ColumnHeading>
            <ul className="space-y-3 text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/platform/legal/${link.slug}`}
                    className="text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <ColumnHeading>İletişim</ColumnHeading>
            <ul className="space-y-3 text-sm">
              {supportEmail && (
                <li className="flex items-start gap-2.5 text-white/55">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                  <a href={`mailto:${supportEmail}`} className="break-all transition-colors hover:text-white">
                    {supportEmail}
                  </a>
                </li>
              )}
              {supportPhone && (
                <li className="flex items-start gap-2.5 text-white/55">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                  <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                    {supportPhone}
                  </a>
                </li>
              )}
              {businessAddress && (
                <li className="flex items-start gap-2.5 text-white/55">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                  <span>{businessAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Shred. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}
