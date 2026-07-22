"use client";

import { useState } from "react";
import { redeemCodeAsGuest } from "@/app/site/[domain]/auth/register-actions";

/**
 * Misafir modu üst çubuğu — öğrenci panelinin her sayfasında görünür.
 * Koçtan alınan kayıt kodu buraya girilince misafir tam kayıtlı öğrenciye
 * dönüşür ve sayfa yenilenerek tüm özellikler açılır.
 */
export function GuestBar({
  domain,
  whatsappNumber,
  brandName,
}: {
  domain: string;
  whatsappNumber: string | null;
  brandName: string;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    setError("");
    const result = await redeemCodeAsGuest(domain, code);
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSuccess(true);
    // Tam panel için sayfayı yenile — layout artık Student bulur
    window.location.reload();
  };

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Merhaba, ${brandName} sitesini misafir olarak inceledim. Kayıt kodu alabilir miyim?`
      )}`
    : null;

  return (
    <div
      className="rounded-xl border p-4 mb-5"
      style={{
        backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 8%, var(--dashboard-card-bg))",
        borderColor: "color-mix(in srgb, var(--dashboard-accent) 30%, var(--dashboard-card-border))",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text, #000)" }}
        >
          Misafir Modu
        </span>
      </div>
      <p className="text-sm mb-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
        Paneli keşfediyorsun — gördüklerin örnek içerik. Koçundan aldığın kodu girince kendi
        programın ve takibin burada açılır.
      </p>
      <form onSubmit={handleRedeem} className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Koç kodun"
          className="flex-1 min-w-[140px] h-10 px-3 rounded-lg text-sm uppercase tracking-widest font-mono"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            border: "1px solid var(--dashboard-card-border)",
          }}
          maxLength={32}
        />
        <button
          type="submit"
          disabled={loading || success || code.trim().length < 6}
          className="h-10 px-4 rounded-lg text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text, #000)" }}
        >
          {success ? "Açılıyor..." : loading ? "Kontrol ediliyor..." : "Kodu Kullan"}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs mt-3 underline underline-offset-2"
          style={{ color: "var(--dashboard-main-text-muted)" }}
        >
          Kodun yok mu? WhatsApp&apos;tan koçundan iste →
        </a>
      )}
    </div>
  );
}
