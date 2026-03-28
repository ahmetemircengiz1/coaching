export default function NutritionLoading() {
  return (
    <div className="space-y-4 py-6 animate-pulse">
      <div className="h-6 w-32 bg-white/5 rounded-lg" />
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <div className="h-4 w-24 bg-white/5 rounded mb-3" />
        <div className="flex gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-7 w-16 bg-white/10 rounded-md" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="h-3 w-full bg-white/5 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
