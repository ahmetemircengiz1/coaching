export default function NutritionLogLoading() {
  return (
    <div className="space-y-4 py-6 animate-pulse">
      <div className="h-4 w-24 bg-white/5 rounded" />
      <div className="h-7 w-40 bg-white/10 rounded-lg" />

      {/* Öğün kartları */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-28 bg-white/10 rounded" />
            <div className="h-8 w-20 bg-white/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="aspect-square bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
