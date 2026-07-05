"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { claimStudentInvite } from "./actions";

export function ClaimInviteForm({ domain, token }: { domain: string; token: string }) {
  const [error, setError] = useState("");
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError("");
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    startTransition(async () => {
      const result = await claimStudentInvite(domain, token, formData);

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      if ("emailSent" in result && result.emailSent) {
        setEmailSentTo(result.email);
        return;
      }

      if ("success" in result && result.success) {
        window.location.href = `/site/${domain}/student`;
      }
    });
  };

  if (emailSentTo) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ccff00]/20">
          <svg className="h-7 w-7 text-[#ccff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold mb-2">E-posta gönderildi</h2>
        <p className="text-white/60 text-sm">
          <span className="font-medium text-white">{emailSentTo}</span> adresine bir onay linki gönderdik.
          Linke tıklayarak hesabınızı aktive edin.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white/70 block px-1">Şifre</label>
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="En az 8 karakter"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-white focus:border-white"
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
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-white focus:border-white"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white/70 block px-1">
          Telefon <span className="text-white/30 font-normal">(opsiyonel)</span>
        </label>
        <Input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+90 5xx xxx xx xx"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 px-4 focus:ring-1 focus:ring-white focus:border-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-14 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base disabled:opacity-50"
      >
        {isPending ? "Kaydediliyor..." : "Hesabımı oluştur"}
      </Button>
    </form>
  );
}
