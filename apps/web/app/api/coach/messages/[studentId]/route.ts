import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  const domain = request.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Domain required" }, { status: 400 });
  }

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Coach kontrolü
  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
  });

  if (!coach || coach.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Student bu coach'un mu?
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.coachId !== coach.id) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // Mesajları getir
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

  return NextResponse.json({
    messages: messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}
