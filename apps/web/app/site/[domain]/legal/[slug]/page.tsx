import prisma from "@coach-os/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const LEGAL_LABELS: Record<string, string> = {
  gizlilik: "Gizlilik Politikası",
  kvkk: "KVKK Aydınlatma Metni",
  kullanim: "Kullanım Koşulları",
  mesafeli: "Mesafeli Satış Sözleşmesi",
  iade: "İade ve İptal Politikası",
  cerez: "Çerez Politikası",
};

const VALID_SLUGS = Object.keys(LEGAL_LABELS);

export default async function CoachLegalPage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;
  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const coach = await prisma.coach.findFirst({
    where: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    select: { brandName: true, legalTexts: true, legalFullName: true, contactPhone: true, email: true, businessAddress: true, taxId: true },
  });

  if (!coach) notFound();

  const legalTexts = (coach.legalTexts ?? {}) as Record<string, string>;
  const content = (typeof legalTexts[slug] === "string" ? legalTexts[slug] : "").trim();
  const title = LEGAL_LABELS[slug];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-4 py-12 sm:py-20">
      <article className="max-w-3xl mx-auto">
        <Link
          href={`/site/${domain}`}
          className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Anasayfaya Dön
        </Link>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">{coach.brandName}</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        </div>

        {content ? (
          <div
            className="prose prose-zinc max-w-none whitespace-pre-wrap leading-relaxed"
            style={{ fontSize: "15px" }}
          >
            {content}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h3 className="font-semibold text-base mb-2">Bu metin henüz hazırlanmadı</h3>
            <p className="text-sm leading-relaxed">
              Koç bu sayfa için henüz bir metin hazırlamadı. Metninizi yönetim panelinden{" "}
              <em>Ayarlar → İletişim &amp; Yasal Bilgiler</em> bölümünde düzenleyebilirsiniz.
            </p>
          </div>
        )}

        {/* İletişim bilgileri yasal sayfaların altında zorunludur */}
        {(coach.legalFullName || coach.email || coach.contactPhone || coach.businessAddress || coach.taxId) && (
          <div className="mt-12 pt-8 border-t border-zinc-200 text-sm text-zinc-600 space-y-1">
            <h4 className="text-zinc-900 font-semibold mb-2">İletişim Bilgileri</h4>
            {coach.legalFullName && <p><strong>Unvan:</strong> {coach.legalFullName}</p>}
            {coach.taxId && <p><strong>Vergi No:</strong> {coach.taxId}</p>}
            {coach.businessAddress && <p><strong>Adres:</strong> {coach.businessAddress}</p>}
            {coach.email && <p><strong>E-posta:</strong> <a href={`mailto:${coach.email}`} className="underline">{coach.email}</a></p>}
            {coach.contactPhone && <p><strong>Telefon:</strong> <a href={`tel:${coach.contactPhone.replace(/\s/g, "")}`} className="underline">{coach.contactPhone}</a></p>}
          </div>
        )}
      </article>
    </div>
  );
}
