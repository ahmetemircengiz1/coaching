export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse max-w-2xl">
      <div className="h-8 w-24 bg-white/5 rounded-lg" />
      <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 bg-white/5 rounded mb-2" />
            <div className="h-10 w-full bg-white/10 rounded-lg" />
          </div>
        ))}
        <div className="h-10 w-28 bg-white/10 rounded-lg mt-4" />
      </div>
    </div>
  );
}
