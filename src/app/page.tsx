import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";
import { MetricsServer } from "@/components/metrics-server";
import { MetricsSkeleton } from "@/components/metrics-skeleton";
import { RoastFormServer } from "@/components/roast-form-server";
import { ShameLeaderboardServer } from "@/components/shame-leaderboard-server";
import { ShameLeaderboardSkeleton } from "@/components/shame-leaderboard-skeleton";

export default function Home() {
  return (
    <div className="flex w-full max-w-[960px] flex-col items-center gap-8 py-16">
      <HomeClient />

      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsServer />
      </Suspense>

      <Suspense fallback={<ShameLeaderboardSkeleton />}>
        <ShameLeaderboardServer />
      </Suspense>

      <RoastFormServer />
    </div>
  );
}
