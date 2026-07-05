"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { updatePasswordAfterReset } from "../register-actions";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as string;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  // Reset linkinden gelen kullanıcının session'ı olmalı
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setHasSession(!!user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await updatePasswordAfterReset(password);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setDone(true);
    // 2 saniye sonra giriş sayfasına yönlendir
    setTimeout(() => {
      router.push(`/site/${domain}/auth`);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      <div className="w-full max-w-md space-y-6">
        <Card style={{ backgroundColor: "rgba(20,20,20,0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Yeni Şifre Belirle</h2>
              <p className="text-sm text-white/60 mt-1">
                En az 8 karakterli yeni bir şifre belirleyin.
              </p>
            </div>

            {hasSession === false ? (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                Bu link geçersiz veya süresi dolmuş. Lütfen yeniden{" "}
                <a href={`/site/${domain}/auth/forgot-password`} className="underline font-semibold">
                  şifre sıfırlama isteği
                </a>
                {" "}gönderin.
              </div>
            ) : done ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                Şifreniz güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-1.5 block text-white/70">
                    Yeni Şifre
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 8 karakter"
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block text-white/70">
                    Yeni Şifre (Tekrar)
                  </label>
                  <Input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                    required
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full h-12 font-semibold bg-white text-black hover:bg-white/90"
                >
                  {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
