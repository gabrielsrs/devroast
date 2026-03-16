import { cacheLife } from "next/cache";
import { cache } from "react";
import { trpcCaller } from "@/lib/trpc/server";
import { ShameLeaderboardClient } from "./shame-leaderboard-client";

const getShameLeaderboardData = cache(async () => {
  "use cache";
  cacheLife({ stale: 3600 });

  const [leaderboard, stats] = await Promise.all([
    trpcCaller.metrics.getShameLeaderboard(),
    trpcCaller.metrics.getStats(),
  ]);

  return { leaderboard, stats };
});

export async function ShameLeaderboardServer() {
  const { leaderboard, stats } = await getShameLeaderboardData();

  return <ShameLeaderboardClient leaderboard={leaderboard} stats={stats} />;
}
