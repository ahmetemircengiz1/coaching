export default function TransformationsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-white/5 rounded-lg" />
        <div className="h-10 w-36 bg-white/10 rounded-lg" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="aspect-[3/4] bg-white/5" />
              <div className="aspect-[3/4] bg-white/5" />
            </div>
            <div className="p-4">
              <div className="h-4 w-24 bg-white/5 rounded mb-2" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
