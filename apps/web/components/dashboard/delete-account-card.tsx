"use client";

/**
 * Üyelik sonlandırma kartı (tehlikeli bölge) — koç ve öğrenci ayarlarında.
 * İki aşamalı onay ister: modal + "SİL" yazma şartı. Başarıda oturumu kapatıp
 * yönlendirir. Silme kalıcıdır; sunucu tarafı DB + storage + auth'u temizler.
 */

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteCoachAccount,
  deleteStudentAccount,
} from "@/app/site/[domain]/dashboard/settings/account-actions";

export function DeleteAccountCard({
  role,
  domain,
}: {
  role: "coach" | "student";
  domain: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isCoach = role === "coach";

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError("");
    try {
      const result = isCoach
        ? await deleteCoachAccount(domain, confirmText)
        : await deleteStudentAccount(domain, confirmText);
      if ("error" in result) {
        setError(result.error);
        setDeleting(false);
        return;
      }
      // Hesap silindi — çerezleri temizle ve dışarı yönlendir.
      try {
        await createClient().auth.signOut();
      } catch {
        // Kullanıcı zaten silindiği için signOut hata verebilir — önemsiz.
      }
      window.location.href = isCoach ? "/platform" : `/site/${domain}`;
    } catch (err) {
      console.error("[DeleteAccountCard]", err);
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-red-500/30 bg-red-500/[0.04]">
        <div className="p-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={17} className="text-red-400" />
            <p className="text-sm font-semibold text-red-400">Tehlikeli Bölge</p>
          </div>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {isCoach
              ? "Üyeliğini sonlandırdığında siten, tüm öğrencilerin, programların, planların, fotoğrafların ve hesabın kalıcı olarak silinir. Site adresin boşa çıkar. Bu işlem geri alınamaz."
              : "Üyeliğini sonlandırdığında hesabın, check-in'lerin, fotoğrafların ve tüm verilerin kalıcı olarak silinir. Bu işlem geri alınamaz."}
          </p>
          <button
            type="button"
            onClick={() => { setModalOpen(true); setConfirmText(""); setError(""); }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3.5 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={13} />
            Üyeliği Sonlandır
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[9500] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Vazgeç"
            onClick={() => !deleting && setModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderColor: "rgba(239,68,68,0.35)",
              color: "var(--dashboard-main-text)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Üyeliği sonlandırma onayı"
          >
            <button
              type="button"
              onClick={() => !deleting && setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 transition hover:opacity-70"
              style={{ color: "var(--dashboard-main-text-muted)" }}
              aria-label="Kapat"
            >
              <X size={16} />
            </button>

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-center text-lg font-bold">Üyeliğini sonlandırmak üzeresin</h3>
            <p className="mt-2 text-center text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {isCoach
                ? "Siten, site adresin, tüm öğrencilerin ve verilerin kalıcı olarak silinecek. E-postanla dilediğin zaman sıfırdan yeni bir hesap açabilirsin ama bu veriler geri gelmez."
                : "Hesabın ve tüm verilerin kalıcı olarak silinecek. Koçundan yeni bir kayıt kodu alarak dilediğin zaman yeniden kayıt olabilirsin ama bu veriler geri gelmez."}
            </p>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Onaylamak için aşağıya <span className="font-bold text-red-400">SİL</span> yaz
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="SİL"
                autoComplete="off"
                className="h-11 w-full rounded-xl border bg-transparent px-4 text-sm outline-none transition focus:border-red-400"
                style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
              />
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={deleting}
                className="h-11 flex-1 rounded-xl border text-sm font-semibold transition hover:opacity-80 disabled:opacity-50"
                style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || confirmText.trim().toUpperCase() !== "SİL"}
                className="h-11 flex-1 rounded-xl bg-red-500 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-40"
              >
                {deleting ? "Siliniyor..." : "Kalıcı Olarak Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
