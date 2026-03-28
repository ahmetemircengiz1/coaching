export default function MessagesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-28 bg-white/5 rounded-lg" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-28 bg-white/5 rounded mb-1" />
              <div className="h-3 w-48 bg-white/5 rounded" />
            </div>
            <div className="h-3 w-12 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
