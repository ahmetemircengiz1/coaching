import Link from "next/link";

export default function CoachSiteNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          Bu sayfa bulunamadı.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Koç sitesi mevcut değil veya aktif değil.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
