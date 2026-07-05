"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll'a kilitli yıldız alanı — "uzayda ileri yolculuk" hissi.
 * - Hareket YALNIZCA scroll ile olur: aşağı = öne uçuş, yukarı = geri sarma (aynı yol).
 * - Scroll durunca yumuşakça yavaşlar ve kare donar (mevcut sabit arka plan gibi).
 * - reduced-motion: hareket yok, sabit alan.
 * Tüm sayfanın arkasında sabit (fixed) durur; içeriğin arkasında (z-0) kalır.
 */
export function StarfieldJourney() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = 1;
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let focal = 1;

    const STAR_COUNT = 240;
    const Z_NEAR = 0.25;
    const Z_FAR = 1.25;
    const Z_SPAN = Z_FAR - Z_NEAR;
    const PX_PER_UNIT = 1000; // her ~1000px scroll ≈ 1 derinlik birimi (yolculuk hızı)

    type Star = { dx: number; dy: number; phase: number; size: number };
    let stars: Star[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        // ekran-yönü vektörü (köşelere ulaşsın diye geniş aralık)
        stars.push({
          dx: rand(-1.4, 1.4),
          dy: rand(-1.4, 1.4),
          phase: Math.random(), // 0..1 derinlik fazı
          size: rand(0.5, 1.5),
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
      focal = Math.min(w, h) * 0.62;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let targetTravel = 0;
    let travel = 0;

    function readScroll() {
      targetTravel = window.scrollY / PX_PER_UNIT;
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        // ileri yolculuk: travel arttıkça faz azalır (yıldız yaklaşır), mod ile sonsuz alan
        let p = s.phase - travel;
        p -= Math.floor(p); // [0,1)
        const z = Z_NEAR + p * Z_SPAN;
        const k = focal / z;
        const sx = cx + s.dx * k;
        const sy = cy + s.dy * k;
        if (sx < -30 || sx > w + 30 || sy < -30 || sy > h + 30) continue;

        const depth = (Z_FAR - z) / Z_SPAN; // 0 (uzak) .. 1 (yakın)
        const r = s.size * (0.35 + depth * 2.1);
        // hem uzakta hem çok yakında yumuşak sönüm (pop önlenir)
        const fade = Math.sin(p * Math.PI); // uçlarda 0, ortada 1
        const alpha = (0.12 + depth * 0.8) * (0.35 + 0.65 * fade);

        ctx!.beginPath();
        ctx!.arc(sx, sy, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx!.fill();
      }
    }

    let rafId = 0;
    let running = false;

    function loop() {
      const diff = targetTravel - travel;
      if (Math.abs(diff) < 0.00006) {
        travel = targetTravel;
        draw();
        running = false;
        rafId = 0;
        return; // dur → kare donar
      }
      travel += diff * 0.1; // yumuşak yavaşlama
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function kick() {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    function onScroll() {
      readScroll();
      if (reduce) {
        travel = targetTravel;
        draw();
        return;
      }
      kick();
    }

    function onResize() {
      resize();
      draw();
    }

    function onVisibility() {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        running = false;
      }
    }

    initStars();
    resize();
    readScroll();
    travel = targetTravel;
    draw();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
