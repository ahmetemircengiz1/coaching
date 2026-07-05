"use client";

import { useEffect, useState } from "react";
import "./CosmicHeroBackground.css";

/** Rastgele yıldız konumlarını box-shadow listesine çevirir. */
function genStars(count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    out.push(`${x}px ${y}px #fff`);
  }
  return out.join(", ");
}

/**
 * Hero için sade kozmik arka plan.
 * - Üç katmanlı, yavaşça yukarı süzülen yıldızlar (parallax).
 * - Altta parlayan mavi ufuk eğrisi.
 * Yıldızlar client'ta üretilir (hydration uyumu için ilk render boş).
 */
export function CosmicHeroBackground() {
  const [small, setSmall] = useState("");
  const [medium, setMedium] = useState("");
  const [large, setLarge] = useState("");

  useEffect(() => {
    setSmall(genStars(700));
    setMedium(genStars(200));
    setLarge(genStars(100));
  }, []);

  return (
    <div className="cosmic-hero" aria-hidden>
      <div className="stars" style={{ boxShadow: small }} />
      <div className="stars2" style={{ boxShadow: medium }} />
      <div className="stars3" style={{ boxShadow: large }} />
      <div className="earth" />
    </div>
  );
}
