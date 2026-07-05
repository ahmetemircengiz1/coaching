"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const STORAGE_KEY = "coach-os-cookie-consent";

// Analitik onayını client-side okur, banner kararı değişince yeniden değerlendirir.
function useAnalyticsConsent() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setAllowed(localStorage.getItem(STORAGE_KEY) === "accepted");
      } catch {
        setAllowed(false);
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  return allowed;
}

export function GoogleAnalytics() {
  const consent = useAnalyticsConsent();
  if (!GA_ID || !consent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
