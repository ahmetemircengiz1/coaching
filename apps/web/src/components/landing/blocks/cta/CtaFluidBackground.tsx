import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function CtaFluidBackground({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const bg = config?.backgroundColor || "#121212";
  
  return (
    <section className="py-32 px-6 overflow-hidden relative" style={{ backgroundColor: bg }}>
      {/* Fluid Mesh Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[100%] blur-[120px] rounded-[100%] mix-blend-screen animate-slow-spin" style={{ backgroundColor: primary }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[120%] blur-[150px] rounded-[100%] mix-blend-screen animate-slow-spin-reverse" style={{ backgroundColor: `${primary}80` }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
          {texts?.heroHeadline || "Hayatınızı Değiştirmeye Hazır Mısınız?"}
        </h2>
        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl leading-relaxed">
          {texts?.heroSubtitle || "Mazeretleri geride bırakın. Bilimsel metotlarla kanıtlanmış sonuçlara hemen bugün ulaşın."}
        </p>
        <button 
          className="px-12 py-5 text-black font-extrabold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          style={{ backgroundColor: primary }}
        >
          {texts?.ctaPrimaryText || "Serüvene Başla"}
        </button>
      </div>
    </section>
  );
}
