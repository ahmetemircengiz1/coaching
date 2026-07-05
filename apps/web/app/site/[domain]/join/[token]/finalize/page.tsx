import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/server";
import { finalizeStudentInvite } from "../actions";

export default async function FinalizeInvitePage({
  params,
}: {
  params: Promise<{ domain: string; token: string }>;
}) {
  const { domain, token } = await params;

  const user = await getAuthUser();
  if (!user) {
    redirect(`/site/${domain}/auth?next=/site/${domain}/join/${token}`);
  }

  const result = await finalizeStudentInvite(domain, token);

  if ("success" in result && result.success) {
    redirect(`/site/${domain}/student`);
  }

  const errorMsg = "error" in result ? result.error : "Kayıt tamamlanamadı.";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3">Kayıt tamamlanamadı</h1>
        <p className="text-white/60 text-sm mb-8">{errorMsg}</p>
        <Link
          href={`/site/${domain}`}
          className="inline-block h-12 px-6 rounded-xl bg-white text-black font-semibold flex items-center justify-center hover:bg-white/90 transition"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
