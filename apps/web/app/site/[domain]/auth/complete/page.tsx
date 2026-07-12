"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { finalizeStudentSignup } from "../register-actions";

/**
 * E-posta doğrulama linkinin indiği ara sayfa.
 * Callback route code'u session'a çevirip buraya yönlendirir; burada
 * finalizeStudentSignup Student satırını oluşturur ve öğrenci paneline geçilir.
 */
export default function CompleteSignupPage() {
  const router = useRouter();
  const params = useParams();
  const domain = params.domain as string;
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // StrictMode/yeniden render'da çift çağrıyı önle
    ran.current = true;
    finalizeStudentSignup(domain).then((result) => {
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.replace(`/site/${domain}/student`);
    });
  }, [domain, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#111111" }}
    >
      <div className="w-full max-w-md text-center space-y-5">
        {error ? (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Kayıt tamamlanamadı</h1>
            <p className="text-sm text-white/60 leading-relaxed">{error}</p>
            <a
              href={`/site/${domain}/auth`}
              className="inline-block mt-2 px-6 h-11 leading-[44px] rounded-xl bg-white/10 border border-white/15 text-sm font-semibold text-white hover:bg-white/15 transition"
            >
              Giriş sayfasına dön
            </a>
          </>
        ) : (
          <>
            <div className="mx-auto w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            <h1 className="text-lg font-semibold text-white">E-postan doğrulandı</h1>
            <p className="text-sm text-white/60">Hesabın hazırlanıyor, birazdan panele yönlendirileceksin...</p>
          </>
        )}
      </div>
    </div>
  );
}
