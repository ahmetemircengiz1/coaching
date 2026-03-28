"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";

export async function getTransformations(domain: string) {
  const coach = await getCoachAuth(domain);

  return prisma.transformation.findMany({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "asc" },
  });
}

export async function createTransformation(
  domain: string,
  data: {
    clientName: string;
    description?: string;
    beforePhoto: string;
    afterPhoto: string;
    duration?: string;
    isPublished: boolean;
  }
) {
  const coach = await getCoachAuth(domain);

  const last = await prisma.transformation.findFirst({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "desc" },
  });

  await prisma.transformation.create({
    data: {
      coachId: coach.id,
      clientName: data.clientName,
      description: data.description || null,
      beforePhoto: data.beforePhoto,
      afterPhoto: data.afterPhoto,
      duration: data.duration || null,
      isPublished: data.isPublished,
      orderIndex: (last?.orderIndex || 0) + 1,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

export async function updateTransformation(
  domain: string,
  id: string,
  data: {
    clientName: string;
    description?: string;
    beforePhoto: string;
    afterPhoto: string;
    duration?: string;
    isPublished: boolean;
  }
) {
  const coach = await getCoachAuth(domain);

  const t = await prisma.transformation.findUnique({ where: { id } });
  if (!t || t.coachId !== coach.id) {
    return { success: false, error: "Bulunamadı" };
  }

  await prisma.transformation.update({
    where: { id },
    data: {
      clientName: data.clientName,
      description: data.description || null,
      beforePhoto: data.beforePhoto,
      afterPhoto: data.afterPhoto,
      duration: data.duration || null,
      isPublished: data.isPublished,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

export async function deleteTransformation(domain: string, id: string) {
  const coach = await getCoachAuth(domain);

  const t = await prisma.transformation.findUnique({ where: { id } });
  if (!t || t.coachId !== coach.id) {
    return { success: false, error: "Bulunamadı" };
  }

  await prisma.transformation.delete({ where: { id } });
  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}
