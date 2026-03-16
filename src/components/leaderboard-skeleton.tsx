export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 animate-pulse rounded bg-border" />
        <div className="h-4 w-4 animate-pulse rounded bg-border" />
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
      </div>

      <div className="flex flex-col gap-0 rounded-none border border-border">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border px-5 py-4 last:border-b-0"
          >
            <div className="w-10 h-4 animate-pulse rounded bg-border" />
            <div className="w-[60px] h-4 animate-pulse rounded bg-border" />
            <div className="flex-1 h-4 animate-pulse rounded bg-border" />
            <div className="w-[100px] h-4 animate-pulse rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
