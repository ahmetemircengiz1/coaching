import prisma from "@coach-os/database";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";

export default async function BrandingSettingsRedirectPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/platform/auth");
  }

  const coach = await prisma.coach.findFirst({
    where: { userId: user.id },
    select: { subdomain: true },
  });

  if (!coach) {
    redirect("/platform");
  }

  redirect(`/site/${coach.subdomain}/dashboard/settings`);
}
