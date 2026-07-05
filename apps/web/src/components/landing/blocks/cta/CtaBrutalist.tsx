import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function CtaBrutalist({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const bg = config?.backgroundColor || "#000000";

  return (
    <section className="py-40 px-6 border-y-8" style={{ backgroundColor: bg, borderColor: primary }}>
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.9] mb-12 hover:skew-x-[-10deg] transition-transform duration-500">
          {texts?.heroHeadline || "DÖNÜŞÜM BAŞLASIN"}
        </h2>
        <button 
          className="text-2xl md:text-4xl font-bold border-4 px-12 py-6 uppercase tracking-widest hover:text-[#000] hover:scale-110 transition-all duration-300"
          style={{ 
            borderColor: primary, 
            color: primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primary;
            e.currentTarget.style.color = "#000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = primary;
          }}
        >
          {texts?.ctaPrimaryText || "KAYDINI OLUŞTUR"}
        </button>
      </div>
    </section>
  );
}
