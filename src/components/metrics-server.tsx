import { trpcCaller } from "@/lib/trpc/server";

export async function MetricsServer() {
  const stats = await trpcCaller.metrics.getStats();

  return (
    <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
      <span>{stats.totalRoasts.toLocaleString()} codes roasted</span>
      <span>·</span>
      <span>avg score: {stats.avgScore.toFixed(1)}/10</span>
    </div>
  );
}
