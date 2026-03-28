"use server";

import { getAuthUser, createClient } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { redirect } from "next/navigation";

async function getAuthenticatedCoach(domain: string) {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/site/${domain}/auth`);
  }

  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    include: {
      package: true,
      _count: { select: { students: { where: { status: "active" } } } },
    },
  });

  if (!coach || coach.userId !== user.id) {
    redirect(`/site/${domain}/auth`);
  }

  return coach;
}

// Öğrenci davet et (e-posta ile)
export async function inviteStudent(
  domain: string,
  data: { email: string; name: string; packageId?: string }
) {
  const coach = await getAuthenticatedCoach(domain);

  // Öğrenci limit kontrolü
  if (coach._count.students >= coach.package.maxStudents) {
    return {
      error: `Öğrenci limitinize ulaştınız (${coach.package.maxStudents}). Paketinizi yükseltin.`,
    };
  }

  // Bu e-posta zaten bu koçun öğrencisi mi?
  const existingStudent = await prisma.student.findFirst({
    where: { email: data.email, coachId: coach.id },
  });

  if (existingStudent) {
    return { error: "Bu e-posta zaten öğrenciniz olarak kayıtlı." };
  }

  // Supabase Auth'da bu kullanıcı var mı?
  const supabase = await createClient();

  // Öğrenciyi ön-kayıt olarak oluştur (userId olmadan, kayıt olunca bağlanacak)
  const student = await prisma.student.create({
    data: {
      userId: `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email: data.email,
      name: data.name,
      coachId: coach.id,
      coachPackageId: data.packageId || null,
      status: "pending",
    },
  });

  return {
    success: true,
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      status: student.status,
    },
    inviteUrl: `/site/${domain}/auth`,
  };
}

// Öğrenci kaydını Supabase Auth kullanıcısına bağla
export async function linkStudentToAuth(domain: string, packageId?: string) {
  const user = await getAuthUser();

  if (!user) {
    return { error: "Giriş yapmanız gerekiyor" };
  }

  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
  });

  if (!coach) {
    return { error: "Koç bulunamadı" };
  }

  // Zaten bağlı bir Student kaydı var mı?
  const existingLinked = await prisma.student.findUnique({
    where: { userId: user.id },
  });

  if (existingLinked) {
    // Paket atanmamışsa ve packageId geldiyse güncelle
    if (packageId && !existingLinked.coachPackageId) {
      const pkg = await prisma.coachPackage.findFirst({
        where: { id: packageId, coachId: coach.id },
      });
      if (pkg) {
        await prisma.student.update({
          where: { id: existingLinked.id },
          data: { coachPackageId: pkg.id },
        });
      }
    }
    return { success: true, studentId: existingLinked.id };
  }

  // Pending davet var mı bu e-posta için?
  const pendingStudent = await prisma.student.findFirst({
    where: {
      email: user.email!,
      coachId: coach.id,
      status: "pending",
    },
  });

  if (pendingStudent) {
    // packageId geçerliliğini kontrol et
    let pendingValidPkgId = pendingStudent.coachPackageId;
    if (packageId) {
      const pkg = await prisma.coachPackage.findFirst({
        where: { id: packageId, coachId: coach.id },
      });
      pendingValidPkgId = pkg ? pkg.id : pendingStudent.coachPackageId;
    }

    // Pending kaydı bağla ve aktif et
    const updated = await prisma.student.update({
      where: { id: pendingStudent.id },
      data: {
        userId: user.id,
        name: user.user_metadata?.name || pendingStudent.name,
        status: "active",
        startDate: new Date(),
        coachPackageId: pendingValidPkgId,
      },
    });
    return { success: true, studentId: updated.id };
  }

  // Davet yoksa, doğrudan kayıt (limit kontrolü ile)
  const activeCount = await prisma.student.count({
    where: { coachId: coach.id, status: "active" },
  });

  const coachWithPackage = await prisma.coach.findUnique({
    where: { id: coach.id },
    include: { package: true },
  });

  if (coachWithPackage && activeCount >= coachWithPackage.package.maxStudents) {
    return { error: "Bu koçun öğrenci limiti dolmuş." };
  }

  // packageId geçerliliğini kontrol et
  let validPackageId: string | null = null;
  if (packageId) {
    const pkg = await prisma.coachPackage.findFirst({
      where: { id: packageId, coachId: coach.id },
    });
    if (pkg) validPackageId = pkg.id;
  }

  // Yeni student oluştur
  const student = await prisma.student.create({
    data: {
      userId: user.id,
      email: user.email!,
      name: user.user_metadata?.name || "İsimsiz Öğrenci",
      coachId: coach.id,
      coachPackageId: validPackageId,
      status: "active",
    },
  });

  return { success: true, studentId: student.id };
}

// Giriş yapan kullanıcının rolünü belirle (coach mu student mı?)
export async function determineUserRole(domain: string) {
  const user = await getAuthUser();

  if (!user) {
    return { role: null as string | null };
  }

  // Bu domain'in koçu mu?
  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    select: { userId: true },
  });

  if (coach && coach.userId === user.id) {
    return { role: "coach" as const };
  }

  // Bu domain'in öğrencisi mi?
  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { coachId: true, coach: { select: { subdomain: true } } },
  });

  if (student && student.coach.subdomain === domain) {
    return { role: "student" as const };
  }

  return { role: null as string | null };
}

// Öğrenci durumunu güncelle (aktif/pasif)
export async function updateStudentStatus(
  domain: string,
  studentId: string,
  status: "active" | "paused"
) {
  const coach = await getAuthenticatedCoach(domain);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.coachId !== coach.id) {
    return { error: "Öğrenci bulunamadı" };
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { status },
  });

  return { success: true };
}

// Öğrenciyi sil
export async function removeStudent(domain: string, studentId: string) {
  const coach = await getAuthenticatedCoach(domain);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.coachId !== coach.id) {
    return { error: "Öğrenci bulunamadı" };
  }

  await prisma.student.delete({
    where: { id: studentId },
  });

  return { success: true };
}
