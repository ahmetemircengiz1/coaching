import { NextResponse } from "next/server";
import { BLOCK_META } from "@/src/components/landing/blocks/manifest-meta";

export const dynamic = "force-dynamic";

/**
 * Sadece dev ortamı — Puppeteer thumbnail capture script bu listeyi tüketir.
 * Production'da kapalı.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev only" }, { status: 404 });
  }
  return NextResponse.json({
    blocks: BLOCK_META.filter((b) => !b.deprecated).map((b) => ({
      id: b.id,
      category: b.category,
      name: b.name,
    })),
  });
}
