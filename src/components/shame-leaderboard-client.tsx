"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { TableRow } from "@/components/ui/table-row";

interface LeaderboardEntry {
  id: string;
  rank: string;
  score: string;
  code: string;
  codePreview: string;
  language: string | null;
}

interface Stats {
  totalRoasts: number;
}

interface ShameLeaderboardClientProps {
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}

export function ShameLeaderboardClient({
  leaderboard,
  stats,
}: ShameLeaderboardClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedId && expandedRef.current) {
      expandedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [expandedId]);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-4 flex w-[960px] max-w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-jetbrains text-[14px] font-[700]">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">shame_leaderboard</span>
        </div>
        <Link
          href="/leaderboard"
          className="cursor-pointer rounded border border-border px-3 py-1.5 font-jetbrains text-[12px] text-text-secondary hover:border-text-secondary"
        >
          $ view_all &gt;&gt;
        </Link>
      </div>

      <p className="font-ibm-plex-mono text-[13px] text-text-tertiary">
        {"//"} the worst code on the internet, ranked by shame
      </p>

      <div className="flex h-10 items-center border-b border-border bg-bg-surface px-5">
        <div className="w-[50px] font-jetbrains text-[12px] text-text-tertiary">
          rank
        </div>
        <div className="w-[70px] font-jetbrains text-[12px] text-text-tertiary">
          score
        </div>
        <div className="flex-1 font-jetbrains text-[12px] text-text-tertiary">
          code
        </div>
        <div className="w-[100px] font-jetbrains text-[12px] text-text-tertiary">
          language
        </div>
      </div>

      <div className="overflow-hidden rounded-none border border-border bg-bg-surface">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry) => (
            <div key={entry.id}>
              <button
                type="button"
                className="cursor-pointer w-full text-left"
                onClick={() => handleToggle(entry.id)}
              >
                <TableRow
                  rank={entry.rank}
                  score={entry.score}
                  codePreview={
                    expandedId === entry.id ? entry.code : entry.codePreview
                  }
                  language={entry.language ?? "other"}
                />
              </button>
              {expandedId === entry.id && (
                <div ref={expandedRef} className="border-t border-border">
                  <CodeBlock
                    code={entry.code}
                    showLineNumbers={true}
                    showHeader={false}
                    className="rounded-none border-none"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8 font-ibm-plex-mono text-[13px] text-text-tertiary">
            no roasts yet. be the first!
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 px-4 py-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
        {stats.totalRoasts > 0 ? (
          <>
            <span>showing top 3 of {stats.totalRoasts.toLocaleString()}</span>
            <span>·</span>
            <Link href="/leaderboard" className="hover:underline">
              view full leaderboard &gt;&gt;
            </Link>
          </>
        ) : (
          <span>no roasts yet</span>
        )}
      </div>
    </div>
  );
}
