export default function NutritionLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-28 bg-white/5 rounded-lg" />
        <div className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-24 bg-white/5 rounded" />
              <div className="h-4 w-20 bg-white/5 rounded" />
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-3 w-full bg-white/5 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
