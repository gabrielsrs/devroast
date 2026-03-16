"use client";

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
  avgScore: number;
}

interface LeaderboardClientProps {
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}

export function LeaderboardClient({
  leaderboard,
  stats,
}: LeaderboardClientProps) {
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
          {stats.totalRoasts.toLocaleString()} submissions
        </span>
        <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
          ·
        </span>
        <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
          avg score: {stats.avgScore}/10
        </span>
      </div>

      <div className="flex flex-col gap-0 rounded-none border border-border">
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
    </div>
  );
}
