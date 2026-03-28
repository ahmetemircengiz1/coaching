"use server";

import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { redirect } from "next/navigation";

export async function getConversationMessages(domain: string, studentId: string) {
  const user = await getAuthUser();
  if (!user) redirect(`/site/${domain}/auth`);

  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
  });

  if (!coach || coach.userId !== user.id) {
    redirect(`/site/${domain}/auth`);
  }

  // Student bu coach'un mu?
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, coachId: true },
  });

  if (!student || student.coachId !== coach.id) {
    return { messages: [] };
  }

  const messages = await prisma.message.findMany({
    where: { studentId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderId: true,
      senderRole: true,
      content: true,
      createdAt: true,
      isRead: true,
    },
  });

  // Öğrenci mesajlarını okundu yap
  await prisma.message.updateMany({
    where: {
      studentId,
      senderRole: "student",
      isRead: false,
    },
    data: { isRead: true },
  });

  return {
    messages: messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}
