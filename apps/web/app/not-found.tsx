import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-7xl md:text-8xl font-heading font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white/70 to-[#ccff00] bg-clip-text text-transparent">
          404
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">
          Aradığın sayfa burada değil
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Belki link eski, belki sayfa taşındı. Ana sayfadan tekrar
          başlayabilir veya bize ulaşabilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-full bg-[#ccff00] px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition"
          >
            Ana sayfaya dön
          </Link>
          <Link
            href="/faq"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 hover:bg-white/5 transition"
          >
            S.S.S.
          </Link>
        </div>
      </div>
    </div>
  );
}
