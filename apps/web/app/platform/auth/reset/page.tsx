"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "../actions";

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError("");
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result && "error" in result) {
        setError(result.error || "Bir hata oluştu.");
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-[#3d6fd1]/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-4xl font-bold tracking-widest inline-block">
            SHRED<span className="text-[#3d6fd1]">.</span>
          </Link>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#3d6fd1]/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#3d6fd1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold">Şifreniz güncellendi</h2>
              <p className="text-white/60 text-sm">Yeni şifrenizle giriş yapabilirsiniz.</p>
              <Link href="/platform/auth" className="inline-block">
                <Button className="bg-[#3d6fd1] text-white hover:bg-[#2f57b8] font-bold rounded-xl h-12 px-6">
                  Giriş Sayfasına Dön
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="font-heading text-3xl font-bold mb-2">Yeni Şifre Belirle</h2>
                <p className="text-white/40 text-sm">En az 8 karakter.</p>
              </div>

              {error && (
                <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form action={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/70 block px-1">Yeni Şifre</label>
                  <Input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="En az 8 karakter"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#3d6fd1] focus:border-[#3d6fd1]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/70 block px-1">Şifreyi Tekrarla</label>
                  <Input
                    name="confirm"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Aynı şifre"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#3d6fd1] focus:border-[#3d6fd1]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-14 rounded-xl bg-[#3d6fd1] text-white hover:bg-[#2f57b8] font-bold text-base disabled:opacity-50"
                >
                  {isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
