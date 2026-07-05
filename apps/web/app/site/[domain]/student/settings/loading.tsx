export default function StudentSettingsLoading() {
  return (
    <div className="space-y-4 py-6 animate-pulse">
      <div className="h-7 w-32 bg-white/10 rounded-lg" />

      <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 bg-white/5 rounded mb-2" />
            <div className="h-10 w-full bg-white/10 rounded-lg" />
          </div>
        ))}
        <div className="h-11 w-full bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}
