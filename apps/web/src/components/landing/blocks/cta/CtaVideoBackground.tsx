import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

export function CtaVideoBackground({ content, config }: { content: LandingThemeContent; config?: EliteGlobalStyles }) {
  const primary = config?.primaryColor || "#ffffff";
  const texts = content.landingTexts;

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background (simulated with image for now) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48" className="w-full h-full object-cover grayscale opacity-50" alt="CTA Background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-8">
          Harekete Geçme Zamanı
        </h2>
        <button 
          className="px-12 py-5 text-black font-black uppercase tracking-widest text-lg hover:scale-105 transition-transform"
          style={{ backgroundColor: primary, clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
        >
          {texts?.ctaPrimaryText || "Bana Katıl"}
        </button>
      </div>
    </section>
  );
}
