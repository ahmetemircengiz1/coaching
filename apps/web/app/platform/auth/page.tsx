"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onboardingUrl = tier
    ? `/platform/onboarding?tier=${tier}`
    : "/platform/onboarding";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    if (isLogin) {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı"
          : authError.message);
        setLoading(false);
        return;
      }

      // Coach kaydı var mı kontrol et
      const { data: coach } = await supabase
        .from("Coach")
        .select("subdomain")
        .eq("userId", data.user!.id)
        .single();

      if (coach?.subdomain) {
        router.push(`/site/${coach.subdomain}/dashboard`);
      } else {
        router.push(onboardingUrl);
      }
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "coach",
          },
        },
      });

      if (authError) {
        setError(
          authError.message === "User already registered"
            ? "Bu e-posta zaten kayıtlı"
            : authError.message
        );
        setLoading(false);
        return;
      }

      router.push(onboardingUrl);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6 relative selection:bg-[#ccff00] selection:text-black overflow-hidden">

      {/* Abstract Glowing Backgrounds */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-[#ccff00]/5 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-4xl font-bold tracking-widest inline-block hover:scale-105 transition-transform duration-300">
            COACH<span className="text-[#ccff00]">OS</span>
          </Link>
          {tier && (
            <p className="text-white/40 text-sm mt-3 font-medium">
              <span className="text-[#ccff00]">{tier === "1" ? "Başlangıç" : tier === "2" ? "Profesyonel" : "Premium"}</span> paketi ile geleceği inşa ediyorsunuz.
            </p>
          )}
        </div>

        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* subtle inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold mb-2">
              {isLogin ? "Tekrar Hoş Geldiniz" : "Yolculuk Başlıyor"}
            </h2>
            <p className="text-white/40 text-sm">
              {isLogin ? "Platformunuza giriş yaparak öğrencilerinizi yönetmeye devam edin." : "Kendi koçluk platformunuzu dakikalar içinde kurun."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/70 block px-1">
                  Ad Soyad
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Orn: Caner Yılmaz"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 block px-1">
                E-posta Adresi
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 block px-1 flex justify-between">
                <span>Şifre</span>
                {isLogin && <a href="#" className="text-xs text-[#ccff00] hover:underline">Şifremi Unuttum</a>}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] transition-all"
                required
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#ccff00] text-black hover:bg-[#b8e600] font-bold text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
              >
                {loading
                  ? "İşlem yapılıyor..."
                  : isLogin
                    ? "Giriş Yap"
                    : "Ücretsiz Hesabını Oluştur"}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {isLogin
                ? (<span>Hesabınız yok mu? <span className="text-[#ccff00] font-medium">Kayıt Olun</span></span>)
                : (<span>Zaten bir hesabınız var mı? <span className="text-[#ccff00] font-medium">Giriş Yapın</span></span>)}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center px-4">
          <p className="text-xs text-white/30 leading-relaxed">
            Devam ederek, Coach OS <a href="#" className="underline hover:text-white">Kullanım Koşulları</a> ve <a href="#" className="underline hover:text-white">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
