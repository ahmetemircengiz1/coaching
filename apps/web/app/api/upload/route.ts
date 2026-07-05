import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, BucketName, STORAGE_BUCKETS } from "@/lib/supabase/storage";
import { signPhotoUrl } from "@/lib/supabase/signed-url";
import { checkRateLimitAsync, rateLimitResponse, getClientKey, UPLOAD_LIMIT } from "@/lib/rate-limit";

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

    // Rate limit — per user, 20 uploads per 10 min
    const rl = await checkRateLimitAsync(getClientKey(request, user.id), UPLOAD_LIMIT);
    const blocked = rateLimitResponse(rl);
    if (blocked) return blocked;

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

    // Uzantıyı istemcinin dosya adından DEĞİL, doğrulanmış MIME tipinden türet
    // (dosya adı kurcalanabilir; path/uzantı enjeksiyonunu engeller).
    const ext =
      file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${user.id}/${randomUUID()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const url = await uploadFile(
      bucket as BucketName,
      fileName,
      buffer,
      file.type
    );

    // `url`: DB'de saklanacak kalıcı referans (private bucket'ta public-URL
    // formatı korunur; okuma anında imzalanır). `signedUrl`: yükleme sonrası
    // anlık önizleme için süreli URL (private bucket'ta public URL açılmaz).
    const signedUrl = (await signPhotoUrl(url)) ?? url;

    return NextResponse.json({ url, signedUrl });
  } catch {
    return NextResponse.json(
      { error: "Dosya yuklenirken bir hata olustu. Lutfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
