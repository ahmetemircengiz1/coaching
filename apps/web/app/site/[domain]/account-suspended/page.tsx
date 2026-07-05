import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";

export default async function AccountSuspendedPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  const user = await getAuthUser();
  if (!user) {
    redirect(`/site/${domain}/auth`);
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: {
      status: true,
      coach: {
        select: {
          brandName: true,
          subdomain: true,
          whatsappNumber: true,
          email: true,
        },
      },
    },
  });

  // Öğrenci kaydı yoksa veya aktifse burada olmamalı
  if (!student || student.coach.subdomain !== domain) {
    redirect(`/site/${domain}/auth`);
  }

  if (student.status === "active") {
    redirect(`/site/${domain}/student`);
  }

  const whatsappLink = student.coach.whatsappNumber
    ? `https://wa.me/${student.coach.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Merhaba, hesabım askıya alınmış görünüyor. Yardımcı olabilir misiniz?"
      )}`
    : null;

  const mailLink = student.coach.email
    ? `mailto:${student.coach.email}?subject=${encodeURIComponent("Hesap erişim sorunu")}`
    : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
          <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 19.07l14.14-14.14M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-heading text-2xl font-bold mb-3">Hesabınıza şu an erişilemiyor</h1>
        <p className="text-white/60 text-sm mb-8">
          {student.coach.brandName} tarafından hesabınız geçici olarak askıya alındı.
          Daha fazla bilgi için koçunuz ile iletişime geçin.
        </p>

        <div className="space-y-3">
          {whatsappLink && (
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center transition"
            >
              WhatsApp ile iletişime geç
            </Link>
          )}
          {mailLink && (
            <Link
              href={mailLink}
              className="block w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center transition"
            >
              E-posta gönder
            </Link>
          )}
          <form action={logoutAction.bind(null, domain)}>
            <button
              type="submit"
              className="w-full h-11 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 text-sm transition"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
