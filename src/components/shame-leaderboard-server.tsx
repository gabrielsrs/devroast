import { cacheLife } from "next/cache";
import { trpcCaller } from "@/lib/trpc/server";
import { ShameLeaderboardClient } from "./shame-leaderboard-client";

export async function ShameLeaderboardServer() {
  "use cache";
  cacheLife({ stale: 3600 });

  const [leaderboard, stats] = await Promise.all([
    trpcCaller.metrics.getShameLeaderboard(),
    trpcCaller.metrics.getStats(),
  ]);

  return <ShameLeaderboardClient leaderboard={leaderboard} stats={stats} />;
}
