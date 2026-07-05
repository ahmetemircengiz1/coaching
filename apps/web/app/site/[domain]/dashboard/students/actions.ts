"use server";

import { headers } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { redirect } from "next/navigation";
import { checkRateLimitAsync, ACTION_LIMIT } from "@/lib/rate-limit";
import { createStudentInviteSchema, createRegistrationCodeSchema } from "@/lib/validation/schemas";
import { generateInviteToken, buildInviteUrl } from "@/lib/invites/tokens";
import { randomBytes } from "crypto";

function generateRegistrationCode(): string {
  // 8-char human-friendly code (no 0/O/1/I confusion)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) code += alphabet[bytes[i] % alphabet.length];
  return code;
}

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

// ─── Davet oluştur ───
export async function createStudentInvite(
  domain: string,
  data: { email: string; name: string; packageId?: string; expiresInDays?: number }
) {
  const coach = await getAuthenticatedCoach(domain);

  // Rate limit — coach başına dakikada 10 davet
  const rl = await checkRateLimitAsync(`invite:create:${coach.id}`, ACTION_LIMIT);
  if (!rl.success) {
    return { error: "Çok hızlı davet oluşturuyorsunuz. Lütfen biraz bekleyin." };
  }

  const parsed = createStudentInviteSchema.safeParse({
    email: data.email,
    name: data.name,
    packageId: data.packageId,
    expiresInDays: data.expiresInDays,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz veri." };
  }

  const input = parsed.data;
  const emailLower = input.email.toLowerCase();

  // Bu email zaten bu koçun öğrencisi mi?
  const existingStudent = await prisma.student.findFirst({
    where: { email: emailLower, coachId: coach.id },
    select: { id: true, status: true },
  });

  if (existingStudent) {
    return { error: "Bu e-posta zaten öğrenciniz olarak kayıtlı." };
  }

  // Öğrenci limit kontrolü — aktif + kullanılmamış davet
  const now = new Date();
  const activeInviteCount = await prisma.studentInvite.count({
    where: {
      coachId: coach.id,
      claimedAt: null,
      revokedAt: null,
      expiresAt: { gt: now },
    },
  });
  const totalSeatUsage = coach._count.students + activeInviteCount;

  if (totalSeatUsage >= coach.package.maxStudents) {
    return {
      error: `Öğrenci limitinize ulaştınız (${coach.package.maxStudents}). Aktif öğrenci veya bekleyen davet sayısını azaltın ya da paketinizi yükseltin.`,
    };
  }

  // Paket doğrulama
  let validPackageId: string | null = null;
  if (input.packageId) {
    const pkg = await prisma.coachPackage.findFirst({
      where: { id: input.packageId, coachId: coach.id },
      select: { id: true },
    });
    if (!pkg) {
      return { error: "Seçtiğiniz paket bulunamadı." };
    }
    validPackageId = pkg.id;
  }

  // Aynı email için aktif davet var mı?
  const existingInvite = await prisma.studentInvite.findFirst({
    where: {
      coachId: coach.id,
      email: emailLower,
      claimedAt: null,
      revokedAt: null,
      expiresAt: { gt: now },
    },
    select: { id: true, token: true },
  });

  const hdrs = await headers();
  const host = hdrs.get("host") || "";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  if (existingInvite) {
    return {
      success: true,
      duplicate: true,
      inviteId: existingInvite.id,
      inviteUrl: buildInviteUrl(domain, existingInvite.token, baseUrl),
    };
  }

  const token = generateInviteToken();
  const expiresInDays = input.expiresInDays ?? 7;
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);

  const invite = await prisma.studentInvite.create({
    data: {
      coachId: coach.id,
      token,
      email: emailLower,
      name: input.name,
      coachPackageId: validPackageId,
      expiresAt,
    },
  });

  console.log(JSON.stringify({
    type: "INVITE_CREATED",
    coachId: coach.id,
    inviteId: invite.id,
    email: emailLower,
    packageId: validPackageId,
    expiresAt: expiresAt.toISOString(),
  }));

  return {
    success: true,
    inviteId: invite.id,
    inviteUrl: buildInviteUrl(domain, token, baseUrl),
  };
}

// ─── Davetleri listele ───
export async function listStudentInvites(domain: string) {
  const coach = await getAuthenticatedCoach(domain);

  const invites = await prisma.studentInvite.findMany({
    where: { coachId: coach.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      coachPackage: { select: { id: true, name: true } },
    },
  });

  const hdrs = await headers();
  const host = hdrs.get("host") || "";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  const now = new Date();
  return invites.map((inv) => {
    let status: "active" | "claimed" | "expired" | "revoked" = "active";
    if (inv.claimedAt) status = "claimed";
    else if (inv.revokedAt) status = "revoked";
    else if (inv.expiresAt < now) status = "expired";

    return {
      id: inv.id,
      email: inv.email,
      name: inv.name,
      packageName: inv.coachPackage?.name || null,
      packageId: inv.coachPackage?.id || null,
      status,
      expiresAt: inv.expiresAt.toISOString(),
      claimedAt: inv.claimedAt?.toISOString() || null,
      revokedAt: inv.revokedAt?.toISOString() || null,
      createdAt: inv.createdAt.toISOString(),
      inviteUrl: status === "active" ? buildInviteUrl(domain, inv.token, baseUrl) : null,
    };
  });
}

// ─── Davet iptal ───
export async function revokeStudentInvite(domain: string, inviteId: string) {
  const coach = await getAuthenticatedCoach(domain);

  const invite = await prisma.studentInvite.findUnique({
    where: { id: inviteId },
    select: { coachId: true, claimedAt: true, revokedAt: true },
  });

  if (!invite || invite.coachId !== coach.id) {
    return { error: "Davet bulunamadı." };
  }

  if (invite.claimedAt) {
    return { error: "Bu davet zaten kullanılmış, iptal edilemez." };
  }

  if (invite.revokedAt) {
    return { success: true };
  }

  await prisma.studentInvite.update({
    where: { id: inviteId },
    data: { revokedAt: new Date() },
  });

  console.log(JSON.stringify({
    type: "INVITE_REVOKED",
    coachId: coach.id,
    inviteId,
  }));

  return { success: true };
}

// ─── Kayıt Kodu üret ───
export async function createRegistrationCode(
  domain: string,
  data: { label?: string; packageId?: string; expiresInDays?: number }
) {
  const coach = await getAuthenticatedCoach(domain);

  const rl = await checkRateLimitAsync(`regcode:create:${coach.id}`, ACTION_LIMIT);
  if (!rl.success) {
    return { error: "Çok hızlı kod oluşturuyorsunuz. Lütfen biraz bekleyin." };
  }

  const parsed = createRegistrationCodeSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz veri." };
  }
  const input = parsed.data;

  // Seat kontrolü: aktif öğrenci + kullanılmamış kod sayısı
  const now = new Date();
  const unusedCodeCount = await prisma.coachRegistrationCode.count({
    where: {
      coachId: coach.id,
      usedAt: null,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
  });
  if (coach._count.students + unusedCodeCount >= coach.package.maxStudents) {
    return {
      error: `Öğrenci limitinize ulaştınız (${coach.package.maxStudents}). Aktif öğrenci veya kullanılmamış kod sayısını azaltın ya da paketinizi yükseltin.`,
    };
  }

  let validPackageId: string | null = null;
  if (input.packageId) {
    const pkg = await prisma.coachPackage.findFirst({
      where: { id: input.packageId, coachId: coach.id },
      select: { id: true },
    });
    if (!pkg) return { error: "Seçtiğiniz paket bulunamadı." };
    validPackageId = pkg.id;
  }

  const expiresAt = input.expiresInDays
    ? new Date(now.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  // Çarpışma ihtimali düşük ama güvence için retry
  let code = generateRegistrationCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const clash = await prisma.coachRegistrationCode.findUnique({ where: { code }, select: { id: true } });
    if (!clash) break;
    code = generateRegistrationCode();
  }

  const row = await prisma.coachRegistrationCode.create({
    data: {
      coachId: coach.id,
      code,
      label: input.label?.trim() || null,
      coachPackageId: validPackageId,
      expiresAt,
    },
  });

  console.log(JSON.stringify({
    type: "REGCODE_CREATED",
    coachId: coach.id,
    codeId: row.id,
    packageId: validPackageId,
  }));

  return { success: true, code, codeId: row.id };
}

// ─── Kayıt Kodlarını listele ───
export async function listRegistrationCodes(domain: string) {
  const coach = await getAuthenticatedCoach(domain);

  const codes = await prisma.coachRegistrationCode.findMany({
    where: { coachId: coach.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      coachPackage: { select: { id: true, name: true } },
    },
  });

  const now = new Date();
  return codes.map((c) => {
    let status: "active" | "used" | "expired" | "revoked" = "active";
    if (c.usedAt) status = "used";
    else if (c.revokedAt) status = "revoked";
    else if (c.expiresAt && c.expiresAt < now) status = "expired";

    return {
      id: c.id,
      code: c.code,
      label: c.label,
      packageName: c.coachPackage?.name || null,
      packageId: c.coachPackage?.id || null,
      status,
      expiresAt: c.expiresAt?.toISOString() || null,
      usedAt: c.usedAt?.toISOString() || null,
      usedByStudentId: c.usedByStudentId,
      revokedAt: c.revokedAt?.toISOString() || null,
      createdAt: c.createdAt.toISOString(),
    };
  });
}

// ─── Kayıt Kodunu iptal et ───
export async function revokeRegistrationCode(domain: string, codeId: string) {
  const coach = await getAuthenticatedCoach(domain);

  const row = await prisma.coachRegistrationCode.findUnique({
    where: { id: codeId },
    select: { coachId: true, usedAt: true, revokedAt: true },
  });
  if (!row || row.coachId !== coach.id) {
    return { error: "Kod bulunamadı." };
  }
  if (row.usedAt) {
    return { error: "Bu kod zaten kullanılmış." };
  }
  if (row.revokedAt) {
    return { success: true };
  }

  await prisma.coachRegistrationCode.update({
    where: { id: codeId },
    data: { revokedAt: new Date() },
  });

  return { success: true };
}

// ─── Kullanıcı rolünü belirle ───
export async function determineUserRole(domain: string) {
  const user = await getAuthUser();

  if (!user) {
    return { role: null as string | null };
  }

  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    select: { userId: true },
  });

  if (coach && coach.userId === user.id) {
    return { role: "coach" as const };
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { coachId: true, coach: { select: { subdomain: true } } },
  });

  if (student && student.coach.subdomain === domain) {
    return { role: "student" as const };
  }

  return { role: null as string | null };
}

// ─── Öğrenci durumunu güncelle ───
export async function updateStudentStatus(
  domain: string,
  studentId: string,
  status: "active" | "paused"
) {
  const coach = await getAuthenticatedCoach(domain);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { coachId: true },
  });

  if (!student || student.coachId !== coach.id) {
    return { error: "Öğrenci bulunamadı." };
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { status },
  });

  return { success: true };
}

// ─── Öğrenciyi sil ───
export async function removeStudent(domain: string, studentId: string) {
  const coach = await getAuthenticatedCoach(domain);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { coachId: true },
  });

  if (!student || student.coachId !== coach.id) {
    return { error: "Öğrenci bulunamadı." };
  }

  await prisma.student.delete({
    where: { id: studentId },
  });

  return { success: true };
}
