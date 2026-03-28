import prisma from "@coach-os/database";

export interface TenantData {
  id: string;
  subdomain: string;
  customDomain: string | null;
  brandName: string;
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  landingThemeId: number;
  dashboardThemeId: number;
  plan: string;
  templateId: string;
  packageTier: number;
  maxStudents: number;
}

// Hostname'den tenant bilgisini çöz
export async function getTenantByHostname(
  hostname: string
): Promise<TenantData | null> {
  // Port'u kaldır (localhost:3000 -> localhost)
  const cleanHostname = hostname.split(":")[0];

  // Ana platform domain'i mi kontrol et
  const appDomain = (
    process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000"
  ).split(":")[0];

  if (cleanHostname === appDomain || cleanHostname === `www.${appDomain}`) {
    return null; // Ana platform, tenant değil
  }

  // Subdomain kontrolü (ör: coach.coachsite.com)
  let coach = null;

  if (cleanHostname.endsWith(`.${appDomain}`)) {
    const subdomain = cleanHostname.replace(`.${appDomain}`, "");
    coach = await prisma.coach.findUnique({
      where: { subdomain },
      include: { package: true },
    });
  } else {
    // Custom domain kontrolü (ör: coachdomain.com)
    coach = await prisma.coach.findUnique({
      where: { customDomain: cleanHostname },
      include: { package: true },
    });
  }

  if (!coach || coach.subscriptionStatus !== "active") {
    return null;
  }

  return {
    id: coach.id,
    subdomain: coach.subdomain,
    customDomain: coach.customDomain,
    brandName: coach.brandName,
    name: coach.name,
    logo: coach.logo,
    primaryColor: coach.primaryColor,
    secondaryColor: coach.secondaryColor,
    landingThemeId: coach.landingThemeId,
    dashboardThemeId: coach.dashboardThemeId,
    plan: coach.plan,
    templateId: coach.templateId,
    packageTier: coach.package.tier,
    maxStudents: coach.package.maxStudents,
  };
}

// Subdomain'in kullanılabilir olup olmadığını kontrol et
export async function isSubdomainAvailable(
  subdomain: string
): Promise<boolean> {
  const reserved = [
    "www",
    "app",
    "api",
    "admin",
    "dashboard",
    "mail",
    "ftp",
    "blog",
    "help",
    "support",
    "status",
  ];

  if (reserved.includes(subdomain.toLowerCase())) {
    return false;
  }

  const existing = await prisma.coach.findUnique({
    where: { subdomain },
  });

  return !existing;
}
