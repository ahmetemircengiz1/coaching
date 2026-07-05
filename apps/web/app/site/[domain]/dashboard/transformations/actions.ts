"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { revalidateCoachCache } from "@/lib/coach-cache";

export async function getTransformations(domain: string) {
  const coach = await getCoachAuth(domain);

  return prisma.transformation.findMany({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "asc" },
  });
}

// Dönüşüm bloklarının okuduğu opsiyonel ölçüm alanları
export interface TransformationMetrics {
  age?: string;
  role?: string;
  weightBefore?: string;
  weightAfter?: string;
  bodyFatBefore?: string;
  bodyFatAfter?: string;
  /** Koçun tanımladığı özel istatistikler — örn. [{ label: "Squat 1RM", value: "120kg → 165kg" }] */
  customStats?: { label: string; value: string }[];
}

function sanitizeCustomStats(
  list?: { label: string; value: string }[] | null
): { label: string; value: string }[] | null {
  if (!list || !Array.isArray(list)) return null;
  const cleaned = list
    .map((s) => ({ label: (s?.label || "").trim(), value: (s?.value || "").trim() }))
    .filter((s) => s.label && s.value)
    .slice(0, 10); // max 10 — abuse koruması
  return cleaned.length > 0 ? cleaned : null;
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
  } & TransformationMetrics
) {
  const coach = await getCoachAuth(domain);

  const last = await prisma.transformation.findFirst({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "desc" },
  });

  const sanitized = sanitizeCustomStats(data.customStats);
  await prisma.transformation.create({
    data: {
      coachId: coach.id,
      clientName: data.clientName,
      description: data.description || null,
      beforePhoto: data.beforePhoto,
      afterPhoto: data.afterPhoto,
      duration: data.duration || null,
      age: data.age || null,
      role: data.role || null,
      weightBefore: data.weightBefore || null,
      weightAfter: data.weightAfter || null,
      bodyFatBefore: data.bodyFatBefore || null,
      bodyFatAfter: data.bodyFatAfter || null,
      customStats: sanitized ?? undefined,
      isPublished: data.isPublished,
      orderIndex: (last?.orderIndex || 0) + 1,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
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
  } & TransformationMetrics
) {
  const coach = await getCoachAuth(domain);

  const t = await prisma.transformation.findUnique({ where: { id } });
  if (!t || t.coachId !== coach.id) {
    return { success: false, error: "Bulunamadı" };
  }

  const sanitized = sanitizeCustomStats(data.customStats);
  await prisma.transformation.update({
    where: { id },
    data: {
      clientName: data.clientName,
      description: data.description || null,
      beforePhoto: data.beforePhoto,
      afterPhoto: data.afterPhoto,
      duration: data.duration || null,
      age: data.age || null,
      role: data.role || null,
      weightBefore: data.weightBefore || null,
      weightAfter: data.weightAfter || null,
      bodyFatBefore: data.bodyFatBefore || null,
      bodyFatAfter: data.bodyFatAfter || null,
      customStats: sanitized === null ? Prisma.JsonNull : sanitized,
      isPublished: data.isPublished,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
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
  await revalidateCoachCache(domain);
  return { success: true };
}
