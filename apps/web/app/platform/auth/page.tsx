"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail, KeyRound, User, ChevronRight } from "lucide-react";
import { signUp, signIn, resendConfirmation, requestPasswordReset } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "signin" | "signup" | "forgot";

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="animate-pulse text-white/40">Yükleniyor...</div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");
  const urlError = searchParams.get("error");
  const initialMode: Mode =
    searchParams.get("mode") === "signup" ? "signup" :
    searchParams.get("mode") === "forgot" ? "forgot" : "signin";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState<string>(
    urlError === "confirmation-failed" ? "E-posta onay linki geçersiz veya süresi dolmuş." :
    urlError === "invalid-link" ? "Bu link geçersiz." : ""
  );
  const [notice, setNotice] = useState<string>("");
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  // Supabase aynı adrese ~60 sn'de bir e-posta gönderilmesine izin verir;
  // butonu geri sayımla kilitleyip kullanıcının boşa denemesini önlüyoruz.
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSignIn = async (formData: FormData) => {
    if (isPending) return;
    setError("");
    setNotice("");
    setIsPending(true);
    try {
      const result = await signIn(formData);
      if (result && "unconfirmedEmail" in result && result.unconfirmedEmail) {
        // Doğrulanmamış hesapla giriş denemesi → doğrulama ekranını aç
        setEmailSentTo(result.unconfirmedEmail);
        setNotice("Hesabın henüz doğrulanmamış. Gerekirse aşağıdan onay e-postasını tekrar gönderebilirsin.");
        setIsPending(false);
      } else if (result && "error" in result) {
        setError(result.error || "Bir hata oluştu.");
        setIsPending(false);
      }
      // Success → server redirected, page navigates; keep isPending true until unmount
    } catch (err) {
      console.error("[handleSignIn]", err);
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      setIsPending(false);
    }
  };

  const handleSignUp = async (formData: FormData) => {
    if (isPending) return;
    setError("");
    setNotice("");
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    // Lansman döneminde herkes tüm özelliklere açık (tier 3) kaydolur.
    formData.set("tier", tier || "3");
    setIsPending(true);
    try {
      const result = await signUp(formData);
      if (result && "error" in result && result.error) {
        setError(result.error || "Bir hata oluştu.");
        setIsPending(false);
      } else if (result && "emailSent" in result && result.emailSent) {
        setEmailSentTo(result.email || null);
        setResendCooldown(60); // az önce bir e-posta gönderildi
        setIsPending(false);
      }
    } catch (err) {
      console.error("[handleSignUp]", err);
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      setIsPending(false);
    }
  };

  const handleResend = async () => {
    if (!emailSentTo || isPending || resendCooldown > 0) return;
    setError("");
    setNotice("");
    setIsPending(true);
    try {
      const fd = new FormData();
      fd.set("email", emailSentTo);
      const result = await resendConfirmation(fd);
      if (result && "error" in result) {
        setError(result.error || "Bir hata oluştu.");
        if ("retryAfter" in result && typeof result.retryAfter === "number") {
          setResendCooldown(result.retryAfter);
        }
      } else {
        setNotice("Onay e-postası tekrar gönderildi. Gelen kutunu (ve spam klasörünü) kontrol et.");
        setResendCooldown(60);
      }
    } catch (err) {
      console.error("[handleResend]", err);
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsPending(false);
    }
  };

  const handleForgot = async (formData: FormData) => {
    if (isPending) return;
    setError("");
    setNotice("");
    setIsPending(true);
    try {
      const result = await requestPasswordReset(formData);
      if (result && "error" in result) {
        setError(result.error || "Bir hata oluştu.");
      } else {
        setForgotSent(true);
      }
    } catch (err) {
      console.error("[handleForgot]", err);
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsPending(false);
    }
  };

  // ─── Email gönderildi ekranı ───
  if (emailSentTo) {
    return (
      <AuthShell tier={tier}>
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#3d6fd1]/10 border border-[#3d6fd1]/20 flex items-center justify-center shadow-[0_0_15px_rgba(61,111,209,0.1)]">
            <svg className="w-8 h-8 text-[#3d6fd1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">E-postanı kontrol et</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            <span className="text-white font-semibold">{emailSentTo}</span> adresine bir doğrulama linki gönderdik.
            Hesabını doğrulamak ve site kurulumuna geçmek için e-postandaki linke tıkla.
          </p>
          <p className="text-white/35 text-xs max-w-sm mx-auto">
            E-posta birkaç dakika içinde gelmezse spam / gereksiz klasörünü kontrol et.
          </p>
          {notice && (
            <div className="p-3.5 rounded-2xl bg-[#3d6fd1]/5 border border-[#3d6fd1]/20 text-[#3d6fd1] text-sm font-medium">
              {notice}
            </div>
          )}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          <div className="pt-4 space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isPending || resendCooldown > 0}
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm text-[#3d6fd1] font-semibold transition-all hover:bg-white/[0.08] disabled:opacity-50"
            >
              {isPending
                ? "Gönderiliyor..."
                : resendCooldown > 0
                  ? `Tekrar gönderebilmek için ${resendCooldown} sn`
                  : "E-postayı tekrar gönder"}
            </button>
            <div>
              <button
                type="button"
                onClick={() => { setEmailSentTo(null); setMode("signin"); setNotice(""); setError(""); }}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Farklı hesap kullan
              </button>
            </div>
          </div>
        </div>
      </AuthShell>
    );
  }

  // ─── Şifre sıfırlama gönderildi ekranı ───
  if (mode === "forgot" && forgotSent) {
    return (
      <AuthShell tier={tier}>
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#3d6fd1]/10 border border-[#3d6fd1]/20 flex items-center justify-center shadow-[0_0_15px_rgba(61,111,209,0.1)]">
            <svg className="w-8 h-8 text-[#3d6fd1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-heading text-3xl font-bold tracking-tight">Sıfırlama linki gönderildi</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            Eğer bu e-posta sistemimizde kayıtlıysa, şifre sıfırlama linkini kısa süre içinde alacaksınız.
          </p>
          
          <button
            type="button"
            onClick={() => { setMode("signin"); setForgotSent(false); }}
            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]"
          >
            Girişe dön
          </button>
        </div>
      </AuthShell>
    );
  }

  const title =
    mode === "signin" ? "Tekrar Hoş Geldiniz" :
    mode === "signup" ? "Yolculuk Başlıyor" : "Şifreni sıfırla";
  const subtitle =
    mode === "signin" ? "Platformunuza giriş yaparak öğrencilerinizi yönetmeye devam edin." :
    mode === "signup" ? "Kendi koçluk platformunuzu dakikalar içinde kurun." :
    "E-posta adresini gir, sıfırlama linki gönderelim.";

  return (
    <AuthShell tier={tier}>
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-extrabold mb-3 tracking-tight text-white">{title}</h2>
        <p className="text-white/40 text-sm leading-relaxed">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === "signin" && (
          <motion.form 
            key="signin"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            action={handleSignIn} 
            className="space-y-5"
          >
            <input type="hidden" name="tier" value={tier || ""} />
            <Field label="E-posta Adresi" name="email" type="email" placeholder="ornek@email.com" required icon={Mail} />
            <div className="space-y-2">
              <div className="flex justify-between px-1">
                <label className="text-sm font-semibold text-white/70">Şifre</label>
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(""); }}
                  className="text-xs font-semibold text-[#3d6fd1] hover:underline"
                >
                  Şifremi Unuttum
                </button>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#3d6fd1] transition-colors">
                  <KeyRound className="h-4.5 w-4.5" />
                </span>
                <Input
                  name="password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  required
                  minLength={1}
                  className="bg-white/[0.02] border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 pl-11 pr-4 focus:ring-1 focus:ring-[#3d6fd1] focus:border-[#3d6fd1] focus:bg-[#050505] hover:border-white/20 transition-all shadow-inner"
                />
              </div>
            </div>
            <SubmitButton pending={isPending} label="Giriş Yap" pendingLabel="Giriş yapılıyor..." />
            <ModeSwitch
              text="Hesabınız yok mu?"
              linkText="Kayıt Olun"
              onClick={() => { setMode("signup"); setError(""); }}
            />
          </motion.form>
        )}

        {mode === "signup" && (
          <motion.form 
            key="signup"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            action={handleSignUp} 
            className="space-y-5"
          >
            <Field label="Ad Soyad" name="name" type="text" placeholder="Örn: Caner Yılmaz" required minLength={2} maxLength={100} icon={User} />
            <Field label="E-posta Adresi" name="email" type="email" placeholder="ornek@email.com" required icon={Mail} />
            <Field label="Şifre" name="password" type="password" placeholder="En az 8 karakter" required minLength={8} icon={KeyRound} autoComplete="new-password" />
            <Field label="Şifre (Tekrar)" name="confirmPassword" type="password" placeholder="Şifreni tekrar gir" required minLength={8} icon={KeyRound} autoComplete="new-password" />
            <SubmitButton pending={isPending} label="Ücretsiz Hesabını Oluştur" pendingLabel="Hesap oluşturuluyor..." />
            <ModeSwitch
              text="Zaten bir hesabınız var mı?"
              linkText="Giriş Yapın"
              onClick={() => { setMode("signin"); setError(""); }}
            />
          </motion.form>
        )}

        {mode === "forgot" && (
          <motion.form 
            key="forgot"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            action={handleForgot} 
            className="space-y-5"
          >
            <Field label="E-posta Adresi" name="email" type="email" placeholder="ornek@email.com" required icon={Mail} />
            <SubmitButton pending={isPending} label="Sıfırlama Linki Gönder" pendingLabel="Gönderiliyor..." />
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(""); }}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                Girişe dön
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}

// ─── Ortak layout (Double-Column Split Screen) ───
function AuthShell({ tier, children }: { tier: string | null; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex relative selection:bg-[#3d6fd1]/30 selection:text-white overflow-hidden">
      {/* Visual panel on the Left - visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative flex-col justify-between p-16 overflow-hidden border-r border-white/[0.04]">
        {/* Background Grid and Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] h-[350px] w-[350px] rounded-full bg-[#3d6fd1]/[0.03] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#3d6fd1]/[0.02] blur-[120px] pointer-events-none" />

        {/* Branding header */}
        <div className="relative z-10 animate-fade-in">
          <Link href="/platform" className="font-heading text-3xl font-bold tracking-widest inline-block hover:scale-105 transition-transform text-white">
            SHRED<span className="text-[#3d6fd1]">.</span>
          </Link>
        </div>

        {/* Marketing Info */}
        <div className="relative z-10 my-auto max-w-md space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d6fd1]">Lansmana Özel</span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white select-none">
              Kendi markanla online koçluğunu büyüt.
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              Excel tabloları, WhatsApp mesaj yığınları ve farklı ödeme kanalları arasında kaybolma. Shred ile hepsi bir arada profesyonel paneline geçiş yap.
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-5">
            {[
              "Saniyeler içinde açılan tamamen kişisel web siten",
              "Antrenman kütüphanesi, beslenme makroları ve gelişim grafikleri",
              "Komisyonsuz, doğrudan ödeme alma özgürlüğü",
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6fd1]/10 border border-[#3d6fd1]/20 mt-0.5 shadow-[0_0_10px_rgba(61,111,209,0.1)]">
                  <Check className="h-3.5 w-3.5 text-[#3d6fd1]" strokeWidth={3} />
                </span>
                <p className="text-sm font-medium text-white/80 leading-relaxed select-none">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/30 border-t border-white/[0.04] pt-6 select-none">
          <p>Shred. Antrenör ve Öğrenci Takip Platformu</p>
          <p>shred.com.tr</p>
        </div>
      </div>

      {/* Form panel on the Right - centered on mobile, right side on desktop */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 relative">
        {/* Background glow for mobile */}
        <div className="lg:hidden absolute top-[10%] left-[10%] w-[50%] h-[30%] bg-[#3d6fd1]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="lg:hidden absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          {/* Logo only on mobile */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/platform" className="font-heading text-4xl font-bold tracking-widest inline-block hover:scale-105 transition-transform text-white">
              SHRED<span className="text-[#3d6fd1]">.</span>
            </Link>
          </div>

          <div className="bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/[0.07] rounded-[2.5rem] p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Top border shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3d6fd1]/30 to-transparent" />
            {children}
          </div>

          {tier && (
            <p className="text-white/40 text-xs text-center mt-6 font-medium">
              <span className="text-[#3d6fd1] font-bold">Tüm özellikler ücretsiz</span> — markanı dakikalar içinde kur.
            </p>
          )}

          <div className="mt-8 text-center px-4">
            <p className="text-[11px] text-white/20 leading-relaxed select-none">
              Devam ederek, Shred <a href="#" className="underline hover:text-white/50 transition-colors">Kullanım Koşulları</a> ve <a href="#" className="underline hover:text-white/50 transition-colors">Gizlilik Politikası</a>&apos;nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder, required, minLength, maxLength, icon: Icon, autoComplete }: {
  label: string; name: string; type: string; placeholder: string;
  required?: boolean; minLength?: number; maxLength?: number;
  icon?: React.ComponentType<{ className?: string }>;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-white/70 block px-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#3d6fd1] transition-colors">
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete ?? (type === "password" ? (name === "password" ? "current-password" : "new-password") : type === "email" ? "email" : undefined)}
          className={`bg-white/[0.02] border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 pr-4 focus:ring-1 focus:ring-[#3d6fd1] focus:border-[#3d6fd1] focus:bg-[#050505] hover:border-white/20 transition-all shadow-inner ${Icon ? 'pl-11' : 'pl-4'}`}
        />
      </div>
    </div>
  );
}

function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <div className="pt-2">
      <Button
        type="submit"
        disabled={pending}
        style={{ backgroundImage: "linear-gradient(180deg, #4d7ddb 0%, #2f57b8 100%)" }}
        className="w-full h-13 rounded-xl text-white ring-1 ring-white/15 font-extrabold text-base transition-all duration-300 hover:shadow-[0_0_25px_rgba(61,111,209,0.45)] hover:scale-[1.01] disabled:opacity-50 disabled:hover:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {pendingLabel}
          </>
        ) : (
          <>
            {label}
            <ChevronRight className="h-4.5 w-4.5" />
          </>
        )}
      </Button>
    </div>
  );
}

function ModeSwitch({ text, linkText, onClick }: { text: string; linkText: string; onClick: () => void }) {
  return (
    <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
      <button type="button" onClick={onClick} className="text-xs text-white/45 hover:text-white transition-colors">
        {text} <span className="text-[#3d6fd1] font-bold ml-1">{linkText}</span>
      </button>
    </div>
  );
}
