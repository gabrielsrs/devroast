import { Suspense } from "react";
import { LeaderboardServer } from "@/components/leaderboard-server";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";

export const metadata = {
  title: "Shame Leaderboard | devroast",
  description: "The most roasted code on the internet",
};

export default function LeaderboardPage() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-jetbrains text-[32px] font-[700] text-accent-green">
            {">"}
          </span>
          <h1 className="font-jetbrains text-[28px] font-[700] text-text-primary">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          {"//"} the most roasted code on the internet
        </p>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardServer />
      </Suspense>
    </div>
  );
}
