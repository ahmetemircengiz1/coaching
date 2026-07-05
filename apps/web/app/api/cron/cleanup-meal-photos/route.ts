import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@coach-os/database";
import { deleteFile, STORAGE_BUCKETS } from "@/lib/supabase/storage";

/**
 * Vercel Cron — haftada bir, 1 yıldan eski yemek fotolarını temizler.
 * Hem Supabase Storage'tan dosyayı, hem DB kaydını siler.
 *
 * Auth: Vercel Cron `Authorization: Bearer ${CRON_SECRET}` header'ı yollar.
 * Local test için manuel olarak aynı header ile POST/GET edilebilir.
 *
 * Schedule: vercel.json — "0 3 * * 0" (her pazar UTC 03:00).
 */

type MealEntryRow = { id: string; photoUrl: string };
type MealModel = {
  findMany: (args: unknown) => Promise<MealEntryRow[]>;
  deleteMany: (args: unknown) => Promise<{ count: number }>;
};
const prisma = prismaClient as unknown as typeof prismaClient & {
  mealEntry: MealModel;
};

const RETENTION_DAYS = 365;
const BATCH_SIZE = 200;

function parseStoragePath(publicUrl: string, bucket: string): string | null {
  // https://{ref}.supabase.co/storage/v1/object/public/{bucket}/{path...}
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}

async function runCleanup(): Promise<{ deleted: number; storageErrors: number; cutoff: string }> {
  const cutoff = new Date();
  cutoff.setUTCHours(0, 0, 0, 0);
  cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);

  const oldEntries = await prisma.mealEntry.findMany({
    where: { date: { lt: cutoff } },
    select: { id: true, photoUrl: true },
    take: BATCH_SIZE,
  });

  if (oldEntries.length === 0) {
    return { deleted: 0, storageErrors: 0, cutoff: cutoff.toISOString() };
  }

  // Storage'tan dosyaları sil (sırayla — Supabase deleteFile zaten array kabul edebilir
  // ama hata izolasyonu için tek tek)
  let storageErrors = 0;
  for (const entry of oldEntries) {
    const path = parseStoragePath(entry.photoUrl, STORAGE_BUCKETS.meals);
    if (!path) continue;
    try {
      await deleteFile(STORAGE_BUCKETS.meals, path);
    } catch {
      storageErrors++;
    }
  }

  // DB kayıtları batch olarak sil
  const result = await prisma.mealEntry.deleteMany({
    where: { id: { in: oldEntries.map((e) => e.id) } },
  });

  return { deleted: result.count, storageErrors, cutoff: cutoff.toISOString() };
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Production'da CRON_SECRET olmadan cron çalışmasın
    return process.env.NODE_ENV !== "production";
  }
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runCleanup();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    // Hata detayı sadece sunucu loglarına yazılır; istemciye sızdırılmaz.
    console.error("[cron/cleanup-meal-photos]", err);
    return NextResponse.json(
      { ok: false, error: "Cleanup başarısız" },
      { status: 500 }
    );
  }
}

// Vercel Cron sadece GET ile çağırır; POST'u manuel test için bırakıyorum.
export const POST = GET;
