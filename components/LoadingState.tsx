export function LoadingState() {
  return (
    <div className="panel animate-pulse space-y-4 p-6">
      <div className="h-8 w-1/2 rounded bg-white/10" />
      <div className="h-4 w-2/3 rounded bg-white/10" />
      <div className="grid gap-2">
        <div className="h-12 rounded bg-white/10" />
        <div className="h-12 rounded bg-white/10" />
      </div>
    </div>
  );
}
