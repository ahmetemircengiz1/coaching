export default function ProgramDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Geri linki */}
      <div className="h-4 w-24 bg-white/5 rounded" />

      {/* Program başlığı */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 bg-white/10 rounded-lg" />
          <div className="h-3 w-32 bg-white/5 rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>

      {/* Hafta/gün sekmeleri */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-20 bg-white/5 rounded-lg" />
        ))}
      </div>

      {/* Egzersiz satırları */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 w-40 bg-white/10 rounded mb-1" />
              <div className="h-3 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-6 w-16 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
