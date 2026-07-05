"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { requestPasswordReset } from "../register-actions";
import { getPublicCoachPackages } from "../actions";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const params = useParams();
  const domain = params.domain as string;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [coachBrand, setCoachBrand] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await getPublicCoachPackages(domain);
      if (data) setCoachBrand(data.brandName);
    }
    loadData();
  }, [domain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await requestPasswordReset(domain, email.trim());
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {coachBrand || "Coach"}
          </h1>
        </div>

        <Card style={{ backgroundColor: "rgba(20,20,20,0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Link
                href={`/site/${domain}/auth`}
                className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80 mb-3"
              >
                <ArrowLeft className="w-3 h-3" />
                Giriş sayfasına dön
              </Link>
              <h2 className="text-xl font-bold text-white">Şifremi Unuttum</h2>
              <p className="text-sm text-white/60 mt-1">
                Kayıtlı e-posta adresinizi girin; size şifre sıfırlama linki gönderelim.
              </p>
            </div>

            {sent ? (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                  E-postanız sistemde kayıtlıysa şifre sıfırlama linki kısa süre içinde gelir. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
                </div>
                <Button
                  type="button"
                  onClick={() => { setSent(false); setEmail(""); }}
                  variant="outline"
                  className="w-full"
                >
                  Farklı bir adresle dene
                </Button>
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
                    E-posta Adresi
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-12 font-semibold bg-white text-black hover:bg-white/90"
                >
                  {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
