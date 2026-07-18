"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { determineUserRole } from "../dashboard/students/actions";
import { getPublicCoachPackages } from "./actions";
import { signUpStudentWithCode, resendStudentConfirmation, finalizeStudentSignup } from "./register-actions";

type Tab = "coach" | "student";
type StudentMode = "login" | "register";

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
  7: {
    bg: "#000000",
    cardBg: "rgba(10,10,10,0.85)",
    cardBorder: "rgba(204,255,0,0.15)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    accent: "#ccff00",
    accentText: "#000000",
    inputBg: "rgba(204,255,0,0.05)",
    inputBorder: "rgba(204,255,0,0.2)",
    tabInactiveBg: "rgba(204,255,0,0.05)",
    tabInactiveText: "rgba(255,255,255,0.5)",
  },
};

const DEFAULT_THEME = THEME_COLORS[1];

export default function CoachSiteAuthPage() {
  const [tab, setTab] = useState<Tab>("student");
  const [studentMode, setStudentMode] = useState<StudentMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState("");
  // Supabase aynı adrese ~60 sn'de bir e-posta gönderilmesine izin verir;
  // butonu geri sayımla kilitleyip boşa denemeyi önlüyoruz.
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);
  const [coachBrand, setCoachBrand] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [themeId, setThemeId] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const domain = params.domain as string;

  const t = useMemo(() => THEME_COLORS[themeId] || DEFAULT_THEME, [themeId]);

  // Doğrulama linkine tıklandığında (başka sekmede bile olsa) oturum çerezleri
  // bu tarayıcıya yazılır; burada algılayıp kaydı BU sekmede tamamlıyoruz.
  useEffect(() => {
    if (!pendingEmail) return;
    const supabase = createClient();
    const timer = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email_confirmed_at) {
        clearInterval(timer);
        const result = await finalizeStudentSignup(domain);
        if ("error" in result) {
          setPendingEmail(null);
          setError(result.error);
          return;
        }
        window.location.href = `/site/${domain}/student`;
      }
    }, 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingEmail, domain]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "coach") {
      setTab("coach");
    } else if (tabParam === "register") {
      setTab("student");
      setStudentMode("register");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const data = await getPublicCoachPackages(domain);
      if (data) {
        setCoachBrand(data.brandName);
        setWhatsappNumber(data.whatsappNumber || null);
        if (data.landingThemeId && data.landingThemeId >= 1 && data.landingThemeId <= 7) {
          setThemeId(data.landingThemeId);
        }
      }
      setIsReady(true);
    }
    loadData();
  }, [domain]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setPhone("");
    setCode("");
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
          ? "E-posta veya şifre hatalı."
          : authError.message === "Email not confirmed"
            ? "E-postanız henüz doğrulanmadı. Lütfen e-postanızı kontrol edin."
            : "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin."
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

  // --- Öğrenci Girişi / Kayıt ---
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (studentMode === "register") {
      if (password !== confirmPassword) {
        setError("Şifreler eşleşmiyor.");
        setLoading(false);
        return;
      }
      const result = await signUpStudentWithCode(domain, {
        email: email.trim(),
        password,
        confirmPassword,
        name: name.trim(),
        phone: phone.trim() || undefined,
        code: code.trim().toUpperCase(),
      });
      if ("error" in result) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if (result.needsConfirmation) {
        // E-posta doğrulama açık → linke tıklanana kadar hesap askıda
        setPendingEmail(result.email);
        setResendCooldown(60); // az önce bir e-posta gönderildi
        setLoading(false);
        return;
      }
      // Doğrulama kapalıysa (autoconfirm) eski davranış: otomatik giriş
      const supabase = createClient();
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: result.email,
        password,
      });
      if (signInErr) {
        setError("Kayıt tamamlandı, ancak giriş yapılamadı. Lütfen giriş sekmesinden deneyin.");
        setStudentMode("login");
        setLoading(false);
        return;
      }
      router.push(`/site/${domain}/student`);
      return;
    }

    // Login
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message === "Email not confirmed") {
        // Doğrulanmamış hesap → doğrulama panelini aç (tekrar gönder butonuyla)
        setPendingEmail(email.trim().toLowerCase());
        setLoading(false);
        return;
      }
      setError(
        authError.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı."
          : "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
      setLoading(false);
      return;
    }

    const { role } = await determineUserRole(domain);

    if (role === "student") {
      router.push(`/site/${domain}/student`);
      return;
    }

    if (role === "coach") {
      setError("Bu bir koç hesabı. Lütfen 'Koç Girişi' sekmesini kullanın.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Doğrulanmış ama Student satırı oluşmamış (finalize yarım kalmış) olabilir — tamamla
    const finalized = await finalizeStudentSignup(domain);
    if ("success" in finalized) {
      router.push(`/site/${domain}/student`);
      return;
    }

    setError("Bu site için kaydınız bulunmuyor. Koçunuzdan bir kayıt kodu alın.");
    await supabase.auth.signOut();
    setLoading(false);
  };

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
                    style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>
                    Şifre
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                    style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                    required
                    minLength={6}
                  />
                  <div className="flex justify-end px-1 mt-1.5">
                    <a href={`/site/${domain}/auth/forgot-password`} className="text-xs hover:underline" style={{ color: t.accent }}>Şifremi Unuttum</a>
                  </div>
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

        {/* ===== ÖĞRENCİ: E-POSTA DOĞRULAMA BEKLENİYOR ===== */}
        {tab === "student" && pendingEmail && (
          <Card style={{ backgroundColor: t.cardBg, borderColor: t.cardBorder }}>
            <CardContent className="pt-6 text-center space-y-4">
              <div
                className="mx-auto w-14 h-14 rounded-full flex items-center justify-center border"
                style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder }}
              >
                <svg className="w-7 h-7" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold" style={{ color: t.text }}>E-postanı kontrol et</h2>
              <p className="text-sm leading-relaxed" style={{ color: t.muted }}>
                <strong style={{ color: t.text }}>{pendingEmail}</strong> adresine bir doğrulama
                linki gönderdik. Kaydını tamamlamak için e-postandaki linke tıkla.
              </p>
              <p className="text-xs" style={{ color: t.muted, opacity: 0.7 }}>
                E-posta birkaç dakika içinde gelmezse spam / gereksiz klasörünü kontrol et.
              </p>
              <p className="text-xs font-medium" style={{ color: t.accent }}>
                Linke tıkladığında bu ekran otomatik olarak paneline geçer — burada bekleyebilirsin.
              </p>
              {resendNotice && (
                <div className="p-3 rounded-lg text-sm border" style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.accent }}>
                  {resendNotice}
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <Button
                type="button"
                disabled={loading || resendCooldown > 0}
                onClick={async () => {
                  if (!pendingEmail || loading || resendCooldown > 0) return;
                  setLoading(true);
                  setError("");
                  setResendNotice("");
                  const r = await resendStudentConfirmation(domain, pendingEmail);
                  if ("error" in r) {
                    setError(r.error);
                    if (typeof r.retryAfter === "number") setResendCooldown(r.retryAfter);
                  } else {
                    setResendNotice("Doğrulama e-postası tekrar gönderildi. Gelen kutunu (ve spam klasörünü) kontrol et.");
                    setResendCooldown(60);
                  }
                  setLoading(false);
                }}
                className="w-full h-11 font-semibold transition hover:opacity-90"
                style={{ backgroundColor: t.accent, color: t.accentText }}
              >
                {loading
                  ? "Gönderiliyor..."
                  : resendCooldown > 0
                    ? `Tekrar gönderebilmek için ${resendCooldown} sn`
                    : "E-postayı tekrar gönder"}
              </Button>
              <button
                type="button"
                onClick={() => { setPendingEmail(null); setResendNotice(""); resetForm(); setStudentMode("login"); }}
                className="text-xs hover:underline"
                style={{ color: t.muted }}
              >
                Farklı bir hesapla devam et
              </button>
            </CardContent>
          </Card>
        )}

        {/* ===== ÖĞRENCİ GİRİŞİ / KAYIT ===== */}
        {tab === "student" && !pendingEmail && (
          <>
            <Card style={{ backgroundColor: t.cardBg, borderColor: t.cardBorder }}>
              <CardContent className="pt-6">
                {/* Login/Register sub-toggle */}
                <div
                  className="flex rounded-lg overflow-hidden border mb-5"
                  style={{ borderColor: t.cardBorder }}
                >
                  <button
                    type="button"
                    onClick={() => { setStudentMode("login"); resetForm(); }}
                    className="flex-1 py-2 text-xs font-semibold transition"
                    style={
                      studentMode === "login"
                        ? { backgroundColor: t.accent, color: t.accentText }
                        : { backgroundColor: t.tabInactiveBg, color: t.tabInactiveText }
                    }
                  >
                    Giriş Yap
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStudentMode("register"); resetForm(); }}
                    className="flex-1 py-2 text-xs font-semibold transition"
                    style={
                      studentMode === "register"
                        ? { backgroundColor: t.accent, color: t.accentText }
                        : { backgroundColor: t.tabInactiveBg, color: t.tabInactiveText }
                    }
                  >
                    Kayıt Ol
                  </button>
                </div>

                <p className="text-sm text-center mb-4" style={{ color: t.muted }}>
                  {studentMode === "login"
                    ? "Hesabınıza giriş yapın"
                    : "Koçunuzdan aldığınız kod ile kayıt olun"}
                </p>
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {studentMode === "register" && (
                    <div>
                      <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>Ad Soyad</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Adınız Soyadınız"
                        className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                        style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                        required
                        minLength={2}
                        maxLength={100}
                      />
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
                      style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                      required
                    />
                  </div>

                  {studentMode === "register" && (
                    <div>
                      <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>Telefon (opsiyonel)</label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 5xx xxx xx xx"
                        className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                        style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>
                      Şifre
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={studentMode === "register" ? "En az 8 karakter" : "Şifreniz"}
                      className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                      style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                      required
                      minLength={8}
                    />
                    {studentMode === "login" && (
                      <div className="flex justify-end px-1 mt-1.5">
                        <a
                          href={`/site/${domain}/auth/forgot-password`}
                          className="text-xs hover:underline"
                          style={{ color: t.accent }}
                        >
                          Şifremi Unuttum
                        </a>
                      </div>
                    )}
                  </div>

                  {studentMode === "register" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>Şifre (Tekrar)</label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Şifrenizi tekrar girin"
                          className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all"
                          style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block px-1" style={{ color: t.muted }}>Koç Kodu</label>
                        <Input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          placeholder="Koçunuzdan aldığınız kod"
                          className="h-12 rounded-xl text-sm px-4 focus:ring-1 transition-all uppercase tracking-widest font-mono"
                          style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text, "--tw-ring-color": t.accent } as React.CSSProperties}
                          required
                          minLength={6}
                          maxLength={32}
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 font-semibold text-base transition hover:opacity-90"
                    style={{ backgroundColor: t.accent, color: t.accentText }}
                  >
                    {loading
                      ? "Yükleniyor..."
                      : studentMode === "register"
                        ? "Kayıt Ol"
                        : "Giriş Yap"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {studentMode === "login" && (
              <div
                className="rounded-xl border p-4 text-sm text-center"
                style={{ borderColor: t.cardBorder, backgroundColor: t.cardBg, color: t.muted }}
              >
                <p className="mb-2">
                  Henüz hesabınız yok mu? Yukarıdaki <strong style={{ color: t.text }}>Kayıt Ol</strong> sekmesinden, koçunuzdan aldığınız kod ile kayıt olabilirsiniz.
                </p>
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Merhaba, ${coachBrand} sitesine kayıt olmak istiyorum. Bana bir kayıt kodu gönderebilir misiniz?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-semibold hover:underline"
                    style={{ color: t.accent }}
                  >
                    Kod almak için koçla iletişime geç
                  </a>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: t.muted, opacity: 0.4 }}>
          Shred ile oluşturuldu
        </p>
      </div>
    </div>
  );
}
