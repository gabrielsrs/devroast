export function ShameLeaderboardSkeleton() {
  return (
    <div className="mt-4 flex w-[960px] max-w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-jetbrains text-[14px] font-[700]">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">shame_leaderboard</span>
        </div>
        <div className="h-[26px] w-[100px] animate-pulse rounded border border-border bg-border" />
      </div>

      <p className="font-ibm-plex-mono text-[13px] text-text-tertiary">
        {"//"} the worst code on the internet, ranked by shame
      </p>

      <div className="flex h-10 items-center border-b border-border bg-bg-surface px-5">
        <div className="w-[50px] font-jetbrains text-[12px] text-text-tertiary">
          rank
        </div>
        <div className="w-[70px] font-jetbrains text-[12px] text-text-tertiary">
          score
        </div>
        <div className="flex-1 font-jetbrains text-[12px] text-text-tertiary">
          code
        </div>
        <div className="w-[100px] font-jetbrains text-[12px] text-text-tertiary">
          language
        </div>
      </div>

      <div className="overflow-hidden rounded-none border border-border bg-bg-surface">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border px-5 py-4"
          >
            <div className="w-10 h-4 animate-pulse rounded bg-border" />
            <div className="w-[60px] h-4 animate-pulse rounded bg-border" />
            <div className="flex-1 h-4 animate-pulse rounded bg-border" />
            <div className="w-[100px] h-4 animate-pulse rounded bg-border" />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 px-4 py-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}
