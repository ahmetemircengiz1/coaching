export default function ProgressLoading() {
  return (
    <div className="space-y-4 py-6 animate-pulse">
      <div className="h-6 w-28 bg-white/5 rounded-lg" />
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <div className="h-48 w-full bg-white/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
            <div className="h-6 w-12 bg-white/10 rounded mx-auto mb-2" />
            <div className="h-3 w-16 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
