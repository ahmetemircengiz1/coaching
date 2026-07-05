import { notFound } from "next/navigation";
import { getCachedCoachByDomain } from "@/lib/coach-cache";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const coach = await getCachedCoachByDomain(domain);

  if (!coach) {
    return { title: "Sayfa Bulunamadı" };
  }

  const description = coach.bio || `${coach.brandName} ile profesyonel online fitness koçluğu.`;
  const ogImage = coach.logo || undefined;

  return {
    title: `${coach.brandName} - Online Coaching`,
    description,
    openGraph: {
      title: `${coach.brandName} - Online Coaching`,
      description,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage, alt: coach.brandName }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${coach.brandName} - Online Coaching`,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function CoachSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const coach = await getCachedCoachByDomain(domain);

  if (!coach || coach.subscriptionStatus !== "active") {
    notFound();
  }

  return (
    <div
      data-theme="coach"
      style={
        {
          "--coach-primary-color": coach.primaryColor,
          "--coach-secondary-color": coach.secondaryColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
