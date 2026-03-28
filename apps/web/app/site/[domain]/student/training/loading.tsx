export default function TrainingLoading() {
  return (
    <div className="space-y-4 py-6 animate-pulse">
      <div className="h-6 w-36 bg-white/5 rounded-lg" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="h-4 w-28 bg-white/5 rounded mb-3" />
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
