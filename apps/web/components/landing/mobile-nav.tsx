"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingMobileNav({
  authUrl,
  hasPackages,
  hasTransformations,
  secondaryColor,
  primaryColor,
}: {
  authUrl: string;
  hasPackages: boolean;
  hasTransformations: boolean;
  secondaryColor: string;
  primaryColor: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-white p-2"
        aria-label="Menü"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="absolute top-full left-0 w-full border-b border-white/10 py-4 px-6 space-y-4"
          style={{ backgroundColor: primaryColor }}
        >
          {hasPackages && (
            <a
              href="#packages"
              onClick={() => setOpen(false)}
              className="block text-white/70 hover:text-white transition"
            >
              Paketler
            </a>
          )}
          {hasTransformations && (
            <a
              href="#transformations"
              onClick={() => setOpen(false)}
              className="block text-white/70 hover:text-white transition"
            >
              Dönüşümler
            </a>
          )}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block text-white/70 hover:text-white transition"
          >
            İletişim
          </a>
          <Link href={authUrl} onClick={() => setOpen(false)}>
            <button
              className="w-full py-2 rounded-md font-semibold text-sm transition hover:opacity-90"
              style={{ backgroundColor: secondaryColor, color: primaryColor }}
            >
              Giriş Yap
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
