"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uygulama hatası:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <p className="text-xl text-gray-600 mb-4">
          Bir şeyler ters gitti.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Lütfen daha sonra tekrar deneyin.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
