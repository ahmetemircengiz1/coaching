export default function ExercisesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-white/5 rounded-lg" />
        <div className="h-10 w-36 bg-white/10 rounded-lg" />
      </div>
      {/* Tabs */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 w-28 bg-white/5 rounded-lg" />
        ))}
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="h-4 w-32 bg-white/5 rounded mb-2" />
            <div className="h-3 w-20 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
