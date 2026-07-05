"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { revalidateCoachCache } from "@/lib/coach-cache";

export async function getTestimonials(domain: string) {
  const coach = await getCoachAuth(domain);

  return prisma.testimonial.findMany({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "asc" },
  });
}

interface TestimonialInput {
  clientName: string;
  role?: string;
  quote: string;
  rating?: number;
  avatar?: string;
  isPublished: boolean;
}

export async function createTestimonial(domain: string, data: TestimonialInput) {
  const coach = await getCoachAuth(domain);

  const last = await prisma.testimonial.findFirst({
    where: { coachId: coach.id },
    orderBy: { orderIndex: "desc" },
  });

  await prisma.testimonial.create({
    data: {
      coachId: coach.id,
      clientName: data.clientName,
      role: data.role || null,
      quote: data.quote,
      rating: data.rating || null,
      avatar: data.avatar || null,
      isPublished: data.isPublished,
      orderIndex: (last?.orderIndex || 0) + 1,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
  return { success: true };
}

export async function updateTestimonial(
  domain: string,
  id: string,
  data: TestimonialInput
) {
  const coach = await getCoachAuth(domain);

  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t || t.coachId !== coach.id) {
    return { success: false, error: "Bulunamadı" };
  }

  await prisma.testimonial.update({
    where: { id },
    data: {
      clientName: data.clientName,
      role: data.role || null,
      quote: data.quote,
      rating: data.rating || null,
      avatar: data.avatar || null,
      isPublished: data.isPublished,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
  return { success: true };
}

export async function deleteTestimonial(domain: string, id: string) {
  const coach = await getCoachAuth(domain);

  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t || t.coachId !== coach.id) {
    return { success: false, error: "Bulunamadı" };
  }

  await prisma.testimonial.delete({ where: { id } });
  revalidatePath(`/site/${domain}/dashboard`);
  await revalidateCoachCache(domain);
  return { success: true };
}
