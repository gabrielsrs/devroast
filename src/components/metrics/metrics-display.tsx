import { trpcCaller } from "@/lib/trpc/server";
import { MetricsCounter } from "./metrics-counter";

export async function MetricsDisplay() {
  const stats = await trpcCaller.metrics.getStats();

  return (
    <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
      <MetricsCounter value={stats.totalRoasts} suffix="codes roasted" />
      <span>·</span>
      <span>
        avg score:{" "}
        <MetricsCounter value={stats.avgScore} suffix="/10" decimals={1} />
      </span>
    </div>
  );
}
