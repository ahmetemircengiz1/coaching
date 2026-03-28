"use server";

import prisma from "@coach-os/database";

// Public: Auth gerektirmeden koç paketlerini getir (landing page + auth sayfası için)
export async function getPublicCoachPackages(domain: string) {
  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    select: {
      brandName: true,
      logo: true,
      primaryColor: true,
      secondaryColor: true,
      landingThemeId: true,
      templateId: true,
      coachPackages: {
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          duration: true,
          price: true,
          currency: true,
          features: true,
        },
      },
    },
  });

  if (!coach) {
    // Custom domain ile dene
    const coachByDomain = await prisma.coach.findUnique({
      where: { customDomain: domain },
      select: {
        brandName: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        landingThemeId: true,
        templateId: true,
        coachPackages: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
            currency: true,
            features: true,
          },
        },
      },
    });

    if (!coachByDomain) return null;

    return {
      brandName: coachByDomain.brandName,
      logo: coachByDomain.logo,
      landingThemeId: coachByDomain.landingThemeId,
      packages: coachByDomain.coachPackages.map((p) => ({
        ...p,
        price: Number(p.price),
        features: (p.features as string[]) || [],
      })),
    };
  }

  return {
    brandName: coach.brandName,
    logo: coach.logo,
    landingThemeId: coach.landingThemeId,
    packages: coach.coachPackages.map((p) => ({
      ...p,
      price: Number(p.price),
      features: (p.features as string[]) || [],
    })),
  };
}
