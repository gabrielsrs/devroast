import { cacheLife } from "next/cache";
import { cache } from "react";
import { trpcCaller } from "@/lib/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

const getLeaderboardData = cache(async () => {
  "use cache";
  cacheLife({ stale: 3600 });

  const [leaderboard, stats] = await Promise.all([
    trpcCaller.metrics.getFullLeaderboard(),
    trpcCaller.metrics.getStats(),
  ]);

  return { leaderboard, stats };
});

export async function LeaderboardServer() {
  const { leaderboard, stats } = await getLeaderboardData();

  return <LeaderboardClient leaderboard={leaderboard} stats={stats} />;
}
