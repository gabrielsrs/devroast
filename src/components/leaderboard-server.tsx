import { cacheLife } from "next/cache";
import { trpcCaller } from "@/lib/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

export async function LeaderboardServer() {
  "use cache";
  cacheLife({ stale: 3600 });

  const [leaderboard, stats] = await Promise.all([
    trpcCaller.metrics.getFullLeaderboard(),
    trpcCaller.metrics.getStats(),
  ]);

  return <LeaderboardClient leaderboard={leaderboard} stats={stats} />;
}
