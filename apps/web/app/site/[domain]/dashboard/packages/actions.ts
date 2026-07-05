"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { revalidateCoachCache } from "@/lib/coach-cache";

// Paketleri getir
export async function getCoachPackages(domain: string) {
  const coach = await getCoachAuth(domain);

  const packages = await prisma.coachPackage.findMany({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "asc" },
    include: {
      _count: { select: { students: true } },
    },
  });

  return packages.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

// Paket oluştur
export async function createCoachPackage(
  domain: string,
  data: {
    name: string;
    description: string;
    duration: number;
    price: number;
    currency?: string;
    features: string[];
  }
) {
  const coach = await getCoachAuth(domain);

  const lastPkg = await prisma.coachPackage.findFirst({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "desc" },
  });

  const pkg = await prisma.coachPackage.create({
    data: {
      coachId: coach.id,
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      currency: data.currency || "TRY",
      features: data.features,
      orderIndex: (lastPkg?.orderIndex || 0) + 1,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
  return { success: true, packageId: pkg.id };
}

// Paket güncelle
export async function updateCoachPackage(
  domain: string,
  packageId: string,
  data: {
    name: string;
    description: string;
    duration: number;
    price: number;
    currency?: string;
    features: string[];
    isActive: boolean;
  }
) {
  const coach = await getCoachAuth(domain);

  const pkg = await prisma.coachPackage.findUnique({
    where: { id: packageId },
  });

  if (!pkg || pkg.coachId !== coach.id) {
    return { success: false, error: "Paket bulunamadı" };
  }

  await prisma.coachPackage.update({
    where: { id: packageId },
    data: {
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      currency: data.currency || pkg.currency,
      features: data.features,
      isActive: data.isActive,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
  return { success: true };
}

// Paket sil
export async function deleteCoachPackage(domain: string, packageId: string) {
  const coach = await getCoachAuth(domain);

  const pkg = await prisma.coachPackage.findUnique({
    where: { id: packageId },
    include: { _count: { select: { students: true } } },
  });

  if (!pkg || pkg.coachId !== coach.id) {
    return { success: false, error: "Paket bulunamadı" };
  }

  if (pkg._count.students > 0) {
    return {
      success: false,
      error: `Bu pakette ${pkg._count.students} öğrenci var. Önce öğrencilerin paketini değiştirin.`,
    };
  }

  await prisma.coachPackage.delete({ where: { id: packageId } });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
  return { success: true };
}
