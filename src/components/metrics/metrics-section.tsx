"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/utils";
import { MetricsCounter } from "./metrics-counter";

export function MetricsSection() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.metrics.getStats.queryOptions());

  const totalRoasts = data?.totalRoasts ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
      <MetricsCounter value={totalRoasts} suffix="codes roasted" />
      <span>·</span>
      <span>
        avg score: <MetricsCounter value={avgScore} suffix="/10" decimals={1} />
      </span>
    </div>
  );
}
