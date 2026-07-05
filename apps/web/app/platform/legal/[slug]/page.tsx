import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PlatformFooter } from "@/src/components/platform/PlatformFooter";
import { PLATFORM_LEGAL_TEMPLATES, type LegalSlug } from "./templates";

const VALID_SLUGS = Object.keys(PLATFORM_LEGAL_TEMPLATES) as LegalSlug[];

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function PlatformLegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as LegalSlug)) notFound();

  const template = PLATFORM_LEGAL_TEMPLATES[slug as LegalSlug];

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <nav className="fixed top-0 w-full z-50 bg-[#111111]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/platform" className="font-heading text-2xl font-bold tracking-widest flex items-center gap-2">
            SHRED<span className="text-[#ccff00]">.</span>
          </Link>
          <Link
            href="/platform"
            className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Anasayfa
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-[#ccff00] mb-2">SHRED</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">{template.title}</h1>
          <p className="text-sm text-white/40 mt-3">
            Son güncelleme: {template.lastUpdated}
          </p>
        </div>

        <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-white/70 text-[15px]">
          {template.body}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50 space-y-1">
          <p className="text-white font-semibold mb-2">Sorularınız için iletişim:</p>
          <p>E-posta: <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "destek@shred.com.tr"}`} className="text-[#ccff00] hover:underline">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "destek@shred.com.tr"}</a></p>
        </div>
      </article>

      <PlatformFooter />
    </div>
  );
}
