import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@coach-os/database";
import { getAuthUser } from "@/lib/supabase/server";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";
import { ClaimInviteForm } from "./ClaimInviteForm";

export default async function JoinInvitePage({
  params,
}: {
  params: Promise<{ domain: string; token: string }>;
}) {
  const { domain, token } = await params;

  const invite = await prisma.studentInvite.findUnique({
    where: { token },
    include: {
      coach: {
        select: {
          id: true,
          subdomain: true,
          brandName: true,
          whatsappNumber: true,
          email: true,
        },
      },
      coachPackage: {
        select: { name: true, duration: true, price: true, currency: true },
      },
    },
  });

  // Token geçerliliği + koç eşleşmesi
  const now = new Date();
  const invalidReason = !invite
    ? "not_found"
    : invite.coach.subdomain !== domain
      ? "not_found"
      : invite.claimedAt
        ? "used"
        : invite.revokedAt
          ? "revoked"
          : invite.expiresAt < now
            ? "expired"
            : null;

  if (invalidReason || !invite) {
    return <InvalidInviteScreen reason={invalidReason || "not_found"} domain={domain} />;
  }

  // Zaten giriş yapmış bir user varsa
  const user = await getAuthUser();
  if (user) {
    // Eğer bu user zaten bu koçun öğrencisiyse direkt student dashboard'a
    const existingStudent = await prisma.student.findUnique({
      where: { userId: user.id },
      select: { coachId: true, status: true },
    });

    if (existingStudent && existingStudent.coachId === invite.coach.id) {
      if (existingStudent.status === "active") {
        redirect(`/site/${domain}/student`);
      }
      redirect(`/site/${domain}/account-suspended`);
    }

    // Email eşleşiyor mu — eşleşmiyorsa çıkış yapmadan claim edilemez
    const userEmailLower = (user.email || "").toLowerCase();
    if (userEmailLower !== invite.email.toLowerCase()) {
      return (
        <WrongAccountScreen
          currentEmail={user.email || ""}
          inviteEmail={invite.email}
          domain={domain}
          token={token}
        />
      );
    }

    // Email eşleşiyor ama Student kaydı yok → finalize akışı
    redirect(`/site/${domain}/join/${token}/finalize`);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Koç daveti</p>
          <h1 className="font-heading text-3xl font-bold">{invite.coach.brandName}</h1>
          <p className="text-white/50 text-sm mt-2">Hesabınızı oluşturun ve başlayın.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-5">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Davet bilgileri</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-white/50">Ad Soyad</span>
              <span className="font-medium text-right">{invite.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/50">E-posta</span>
              <span className="font-medium text-right break-all">{invite.email}</span>
            </div>
            {invite.coachPackage && (
              <div className="flex justify-between gap-4 pt-2 border-t border-white/5 mt-2">
                <span className="text-white/50">Paket</span>
                <span className="font-medium text-right">
                  {invite.coachPackage.name}
                  <span className="block text-xs text-white/40">{invite.coachPackage.duration} hafta</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <ClaimInviteForm domain={domain} token={token} />

        <p className="text-center text-xs text-white/30 mt-6">
          Bu davet {new Date(invite.expiresAt).toLocaleDateString("tr-TR")} tarihine kadar geçerlidir.
        </p>
      </div>
    </div>
  );
}

function InvalidInviteScreen({
  reason,
  domain,
}: {
  reason: "not_found" | "used" | "revoked" | "expired";
  domain: string;
}) {
  const messages = {
    not_found: {
      title: "Bu davet linki geçerli değil",
      body: "Link hatalı veya silinmiş olabilir. Koçunuzdan yeni bir davet isteyin.",
    },
    used: {
      title: "Bu davet daha önce kullanılmış",
      body: "Hesabınız zaten oluşturulmuş olabilir. Giriş yapmayı deneyin.",
    },
    revoked: {
      title: "Bu davet iptal edilmiş",
      body: "Koçunuz daveti iptal etti. Yeni bir davet için koçunuzla iletişime geçin.",
    },
    expired: {
      title: "Bu davetin süresi dolmuş",
      body: "Koçunuzdan yeni bir davet linki isteyin.",
    },
  };

  const m = messages[reason];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3">{m.title}</h1>
        <p className="text-white/60 text-sm mb-8">{m.body}</p>
        <div className="space-y-2">
          {reason === "used" && (
            <Link
              href={`/site/${domain}/auth`}
              className="block w-full h-12 rounded-xl bg-white text-black font-semibold flex items-center justify-center hover:bg-white/90 transition"
            >
              Giriş Yap
            </Link>
          )}
          <Link
            href={`/site/${domain}`}
            className="block w-full h-12 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 font-medium flex items-center justify-center transition"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function WrongAccountScreen({
  currentEmail,
  inviteEmail,
  domain,
}: {
  currentEmail: string;
  inviteEmail: string;
  domain: string;
  token: string;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
          <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3">Farklı hesap açık</h1>
        <p className="text-white/60 text-sm mb-2">
          Bu davet <span className="font-medium text-white">{inviteEmail}</span> için.
        </p>
        <p className="text-white/60 text-sm mb-8">
          Şu an <span className="font-medium text-white">{currentEmail}</span> ile giriş yapmışsınız.
          Doğru hesabı kullanmak için önce çıkış yapın, ardından bu davet linkini yeniden açın.
        </p>
        <form action={logoutAction.bind(null, domain)}>
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Çıkış yap
          </button>
        </form>
      </div>
    </div>
  );
}
