import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, BucketName, STORAGE_BUCKETS } from "@/lib/supabase/storage";

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Yetkisiz - giriş yapın" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    if (!bucket || !Object.values(STORAGE_BUCKETS).includes(bucket as BucketName)) {
      return NextResponse.json({ error: "Geçersiz bucket" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan büyük olamaz" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG ve WebP dosyaları yüklenebilir" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${user.id}/${randomUUID()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const url = await uploadFile(
      bucket as BucketName,
      fileName,
      buffer,
      file.type
    );

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Upload error:", message);
    return NextResponse.json(
      { error: `Dosya yüklenirken hata: ${message}` },
      { status: 500 }
    );
  }
}
