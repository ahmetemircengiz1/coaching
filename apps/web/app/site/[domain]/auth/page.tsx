"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { linkStudentToAuth, determineUserRole } from "../dashboard/students/actions";
import { getPublicCoachPackages } from "./actions";

type CoachPackagePublic = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  features: string[];
};

type Tab = "coach" | "student";

/* ─── Theme color definitions matching landing themes ─── */
const THEME_COLORS: Record<number, {
  bg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  inputBg: string;
  inputBorder: string;
  tabInactiveBg: string;
  tabInactiveText: string;
  fontFamily?: string;
}> = {
  1: {
    bg: "#060608",
    cardBg: "rgba(26,24,19,0.8)",
    cardBorder: "rgba(212,175,55,0.2)",
    text: "#EFEFEF",
    muted: "rgba(239,239,239,0.5)",
    accent: "#D4AF37",
    accentText: "#060608",
    inputBg: "rgba(212,175,55,0.05)",
    inputBorder: "rgba(212,175,55,0.2)",
    tabInactiveBg: "rgba(212,175,55,0.05)",
    tabInactiveText: "rgba(239,239,239,0.5)",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  2: {
    bg: "#060B14",
    cardBg: "rgba(10,18,32,0.6)",
    cardBorder: "rgba(0,229,255,0.2)",
    text: "#E0F2FE",
    muted: "rgba(148,163,184,0.6)",
    accent: "#00E5FF",
    accentText: "#060B14",
    inputBg: "rgba(0,229,255,0.05)",
    inputBorder: "rgba(0,229,255,0.2)",
    tabInactiveBg: "rgba(0,229,255,0.05)",
    tabInactiveText: "rgba(148,163,184,0.6)",
  },
  3: {
    bg: "#F5F6FB",
    cardBg: "rgba(255,255,255,0.9)",
    cardBorder: "rgba(30,183,180,0.15)",
    text: "#262A33",
    muted: "#5A6577",
    accent: "#1EB7B4",
    accentText: "#ffffff",
    inputBg: "rgba(30,183,180,0.05)",
    inputBorder: "rgba(30,183,180,0.2)",
    tabInactiveBg: "rgba(30,183,180,0.06)",
    tabInactiveText: "#5A6577",
  },
  4: {
    bg: "#FAF8F5",
    cardBg: "rgba(255,255,255,0.9)",
    cardBorder: "rgba(62,47,40,0.08)",
    text: "#3E2F28",
    muted: "rgba(62,47,40,0.5)",
    accent: "#C75B39",
    accentText: "#ffffff",
    inputBg: "rgba(199,91,57,0.05)",
    inputBorder: "rgba(199,91,57,0.2)",
    tabInactiveBg: "rgba(199,91,57,0.04)",
    tabInactiveText: "rgba(62,47,40,0.5)",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  5: {
    bg: "#111111",
    cardBg: "rgba(26,26,26,0.8)",
    cardBorder: "rgba(46,200,216,0.15)",
    text: "#ffffff",
    muted: "rgba(184,196,216,0.5)",
    accent: "#2EC8D8",
    accentText: "#0A0D14",
    inputBg: "rgba(46,200,216,0.06)",
    inputBorder: "rgba(46,200,216,0.2)",
    tabInactiveBg: "rgba(46,200,216,0.05)",
    tabInactiveText: "rgba(184,196,216,0.5)",
  },
  6: {
    bg: "#050505",
    cardBg: "rgba(15,15,15,0.85)",
    cardBorder: "rgba(255,255,255,0.1)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    accent: "#ffffff",
    accentText: "#000000",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    tabInactiveBg: "rgba(255,255,255,0.05)",
    tabInactiveText: "rgba(255,255,255,0.5)",
  },
};

const DEFAULT_THEME = THEME_COLORS[1];

export default function CoachSiteAuthPage() {
  const [tab, setTab] = useState<Tab>("student");
  const [studentMode, setStudentMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<CoachPackagePublic[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [coachBrand, setCoachBrand] = useState("");
  const [themeId, setThemeId] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const domain = params.domain as string;
  const preselectedPackage = searchParams.get("package");

  const t = useMemo(() => THEME_COLORS[themeId] || DEFAULT_THEME, [themeId]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "coach") {
      setTab("coach");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const data = await getPublicCoachPackages(domain);
      if (data) {
        setPackages(data.packages);
        setCoachBrand(data.brandName);
        if (data.landingThemeId && data.landingThemeId >= 1 && data.landingThemeId <= 6) {
          setThemeId(data.landingThemeId);
        }
        if (preselectedPackage) {
          setSelectedPackageId(preselectedPackage);
          setTab("student");
          setStudentMode("register");
        }
      }
      setIsReady(true);
    }
    loadData();
  }, [domain, preselectedPackage]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setError("");
  };

  // --- Koç Girişi ---
  const handleCoachLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı"
          : authError.message
      );
      setLoading(false);
      return;
    }

    const { role } = await determineUserRole(domain);

    if (role === "coach") {
      router.push(`/site/${domain}/dashboard`);
    } else {
      setError("Bu hesap bu sitede koç olarak kayıtlı değil.");
      await supabase.auth.signOut();
      setLoading(false);
    }
  };

  // --- Öğrenci Giriş/Kayıt ---
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    if (studentMode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "E-posta veya şifre hatalı"
            : authError.message
        );
        setLoading(false);
        return;
      }

      const { role } = await determineUserRole(domain);

      if (role === "student") {
        router.push(`/site/${domain}/student`);
      } else if (role === "coach") {
        setError("Bu bir koç hesabı. Lütfen 'Koç Girişi' sekmesini kullanın.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      } else {
        const pkgId = selectedPackageId && selectedPackageId !== "skip" ? selectedPackageId : undefined;
        const linkResult = await linkStudentToAuth(domain, pkgId);
        if (linkResult.error) {
          setError(linkResult.error);
          setLoading(false);
          return;
        }
        router.push(`/site/${domain}/student`);
      }
    } else {
      // Kayıt
      if (!name.trim()) {
        setError("Ad soyad gerekli");
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            role: "student",
            coach_domain: domain,
          },
        },
      });

      if (authError) {
        if (authError.message === "User already registered") {
          setError("Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      const pkgId = selectedPackageId && selectedPackageId !== "skip" ? selectedPackageId : undefined;
      const linkResult = await linkStudentToAuth(domain, pkgId);
      if (linkResult.error) {
        setError(linkResult.error);
        setLoading(false);
        return;
      }

      router.push(`/site/${domain}/student`);
    }

    setLoading(false);
  };

  const selectedPkg = packages.find((p) => p.id === selectedPackageId);

  const inputClassName = "h-11 text-sm placeholder:opacity-40";

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#111111" }}>
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: t.bg, fontFamily: t.fontFamily || "var(--font-inter), Inter, sans-serif" }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: t.text, fontFamily: t.fontFamily }}
          >
            {coachBrand || "Coach"}
          </h1>
        </div>

        {/* Tab Seçici */}
        <div
          className="flex rounded-xl overflow-hidden border"
          style={{ borderColor: t.cardBorder }}
        >
          <button
            onClick={() => { setTab("coach"); resetForm(); }}
            className="flex-1 py-3 text-sm font-semibold transition"
            style={
              tab === "coach"
                ? { backgroundColor: t.accent, color: t.accentText }
                : { backgroundColor: t.tabInactiveBg, color: t.tabInactiveText }
            }
          >
            Koç Girişi
          </button>
          <button
            onClick={() => { setTab("student"); resetForm(); }}
            className="flex-1 py-3 text-sm font-semibold transition"
            style={
              tab === "student"
                ? { backgroundColor: t.accent, color: t.accentText }
                : { backgroundColor: t.tabInactiveBg, color: t.tabInactiveText }
            }
          >
            Öğrenci Girişi
          </button>
        </div>

        {/* ===== KOÇ GİRİŞİ ===== */}
        {tab === "coach" && (
          <Card style={{ backgroundColor: t.cardBg, borderColor: t.cardBorder }}>
            <CardContent className="pt-6">
              <p className="text-sm text-center mb-4" style={{ color: t.muted }}>
                Koç paneline erişmek için giriş yapın
              </p>
              <form onSubmit={handleCoachLogin} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>E-posta Adresi</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                    style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "---tw-ring-color": t.accent } as React.CSSProperties}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block px-1 flex justify-between" style={{ color: t.muted }}>
                    <span>Şifre</span>
                    <a href="#" className="text-xs hover:underline" style={{ color: t.accent }}>Şifremi Unuttum</a>
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                    style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "---tw-ring-color": t.accent } as React.CSSProperties}
                    required
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-semibold text-base transition hover:opacity-90"
                  style={{ backgroundColor: t.accent, color: t.accentText }}
                >
                  {loading ? "Giriş yapılıyor..." : "Koç Girişi"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ===== ÖĞRENCİ GİRİŞİ / KAYIT ===== */}
        {tab === "student" && (
          <>
            {/* Seçilen Paket Bilgisi */}
            {studentMode === "register" && selectedPkg && (
              <div
                className="rounded-xl p-4 border"
                style={{ borderColor: t.accent, backgroundColor: `color-mix(in srgb, ${t.accent} 5%, transparent)` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: t.muted }}>Seçilen paket</p>
                    <p className="font-semibold" style={{ color: t.text }}>{selectedPkg.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: t.accent }}>
                      {selectedPkg.price.toLocaleString("tr-TR")} {selectedPkg.currency}
                    </p>
                    <p className="text-xs" style={{ color: t.muted }}>{selectedPkg.duration} hafta</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPackageId(null)}
                  className="text-xs mt-2 transition hover:opacity-80"
                  style={{ color: t.muted }}
                >
                  Paketi kaldır
                </button>
              </div>
            )}

            {/* Paket Seçimi */}
            {studentMode === "register" && !selectedPackageId && packages.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-center" style={{ color: t.muted }}>Bir paket seçin (opsiyonel)</p>
                <div className="space-y-2">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className="w-full text-left rounded-xl p-4 border transition hover:opacity-80"
                      style={{ borderColor: t.cardBorder, backgroundColor: t.cardBg }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm" style={{ color: t.text }}>{pkg.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: t.muted }}>{pkg.duration} hafta</p>
                        </div>
                        <p className="font-bold" style={{ color: t.accent }}>
                          {pkg.price.toLocaleString("tr-TR")} {pkg.currency}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedPackageId("skip")}
                    className="w-full text-center text-xs py-2 transition hover:opacity-80"
                    style={{ color: t.muted }}
                  >
                    Paketsiz devam et
                  </button>
                </div>
              </div>
            )}

            <Card style={{ backgroundColor: t.cardBg, borderColor: t.cardBorder }}>
              <CardContent className="pt-6">
                <p className="text-sm text-center mb-4" style={{ color: t.muted }}>
                  {studentMode === "login" ? "Hesabına giriş yap" : "Yeni hesap oluştur"}
                </p>
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {studentMode === "register" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>Ad Soyad</label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Orn: Caner Yılmaz"
                          className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                          style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "---tw-ring-color": t.accent } as React.CSSProperties}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>
                          Telefon <span style={{ opacity: 0.5 }}>(opsiyonel)</span>
                        </label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05XX XXX XX XX"
                          className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                          style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "---tw-ring-color": t.accent } as React.CSSProperties}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>E-posta Adresi</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                      style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "---tw-ring-color": t.accent } as React.CSSProperties}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block px-1 flex justify-between" style={{ color: t.muted }}>
                      <span>Şifre</span>
                      {studentMode === "login" && <a href="#" className="text-xs hover:underline" style={{ color: t.accent }}>Şifremi Unuttum</a>}
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                      style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "---tw-ring-color": t.accent } as React.CSSProperties}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 font-semibold text-base transition hover:opacity-90"
                    style={{ backgroundColor: t.accent, color: t.accentText }}
                  >
                    {loading
                      ? "Yükleniyor..."
                      : studentMode === "login"
                        ? "Giriş Yap"
                        : "Kayıt Ol"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setStudentMode(studentMode === "login" ? "register" : "login");
                      setError("");
                    }}
                    className="text-sm transition hover:opacity-80"
                    style={{ color: t.muted }}
                  >
                    {studentMode === "login"
                      ? "Hesabın yok mu? Kayıt ol"
                      : "Zaten hesabın var mı? Giriş yap"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: t.muted, opacity: 0.4 }}>
          Coach OS ile oluşturuldu
        </p>
      </div>
    </div>
  );
}
