import { trpcCaller } from "@/lib/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

export async function LeaderboardServer() {
  const [leaderboard, stats] = await Promise.all([
    trpcCaller.metrics.getFullLeaderboard(),
    trpcCaller.metrics.getStats(),
  ]);

  return <LeaderboardClient leaderboard={leaderboard} stats={stats} />;
}
