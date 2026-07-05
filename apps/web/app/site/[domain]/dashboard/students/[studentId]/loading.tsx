export default function StudentDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Geri linki */}
      <div className="h-4 w-24 bg-white/5 rounded" />

      {/* Öğrenci başlık kartı */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/10 rounded-full" />
        <div className="flex-1">
          <div className="h-5 w-40 bg-white/10 rounded mb-2" />
          <div className="h-3 w-28 bg-white/5 rounded" />
        </div>
        <div className="h-9 w-24 bg-white/10 rounded-lg" />
      </div>

      {/* İstatistik şeridi */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="h-3 w-16 bg-white/5 rounded mb-3" />
            <div className="h-7 w-12 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* Akordeon bölümleri */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
          <div className="h-5 w-44 bg-white/10 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-12 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
