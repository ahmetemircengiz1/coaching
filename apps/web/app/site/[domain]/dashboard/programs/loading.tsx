export default function ProgramsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-white/5 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-white/10 rounded-lg" />
          <div className="h-10 w-36 bg-white/10 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="h-5 w-40 bg-white/5 rounded mb-3" />
            <div className="h-3 w-64 bg-white/5 rounded mb-2" />
            <div className="h-3 w-48 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
