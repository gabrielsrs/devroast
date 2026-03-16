"use client";

import { CodeBlockWithToggle } from "./code-block-with-toggle";

interface LeaderboardEntry {
  id: string;
  rank: string;
  score: string;
  code: string;
  codePreview: string;
  language: string | null;
  lineCount: number;
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
  return (
    <div className="flex flex-col gap-3">
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

      <div className="flex flex-col gap-0 rounded-none">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-0 rounded-none border border-border"
            >
              <div className="flex items-center justify-between border-b border-border bg-bg-surface px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-red/20 font-jetbrains text-[14px] font-[700] text-accent-red">
                    {entry.rank}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-jetbrains text-[12px] text-text-tertiary">
                    {entry.language ?? "other"}
                  </span>
                  <span className="font-jetbrains text-[14px] font-[700] text-accent-red">
                    {entry.score}/10
                  </span>
                  <span className="font-jetbrains text-[12px] text-text-tertiary">
                    {entry.lineCount} lines
                  </span>
                </div>
              </div>
              <div className="bg-bg-surface">
                <CodeBlockWithToggle code={entry.code} defaultLines={5} />
              </div>
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
