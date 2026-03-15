"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

const LEADERBOARD_DATA = [
  {
    rank: "#1",
    score: "2.1",
    code: "function calculateTotal(items) { var total = 0; ...",
    lang: "javascript",
  },
  {
    rank: "#2",
    score: "3.5",
    code: "const addNumbers = (a, b) => a + b;",
    lang: "typescript",
  },
  {
    rank: "#3",
    score: "4.8",
    code: "def hello_world(): print('Hello')",
    lang: "python",
  },
];

export default function Home() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);

  return (
    <div className="flex w-full max-w-[960px] flex-col items-center gap-8 pb-16 pt-20">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex items-center gap-3 font-jetbrains text-[36px] font-[700]">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          {"//"} drop your code below and we&apos;ll rate it — brutally honest
          or full roast mode
        </p>
      </div>

      {/* Code Editor */}
      <CodeEditor
        value={code}
        onChange={setCode}
        onLimitChange={setIsOverLimit}
        placeholder={SAMPLE_CODE}
        className="w-[780px] max-w-full"
      />

      {/* Actions Bar */}
      <div className="flex w-[780px] max-w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Toggle pressed={roastMode} onPressedChange={setRoastMode}>
            roast mode
          </Toggle>
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            {"//"} maximum sarcasm enabled
          </span>
        </div>
        <Button disabled={!code.trim() || isOverLimit}>$ roast_my_code</Button>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
        <span>2,847 codes roasted</span>
        <span>·</span>
        <span>avg score: 4.2/10</span>
      </div>

      {/* Leaderboard Preview */}
      <div className="mt-4 flex w-[960px] max-w-full flex-col gap-4">
        {/* Title */}
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

        {/* Subtitle */}
        <p className="font-ibm-plex-mono text-[13px] text-text-tertiary">
          {"//"} the worst code on the internet, ranked by shame
        </p>

        {/* Table Header */}
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

        {/* Table Rows */}
        <div className="overflow-hidden rounded-none border border-border bg-bg-surface">
          {LEADERBOARD_DATA.map((row) => (
            <TableRow
              key={row.rank}
              rank={row.rank}
              score={row.score}
              codePreview={row.code}
              language={row.lang}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-center px-4 py-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
          <span>showing top 3 of 2,847</span>
          <span>·</span>
          <Link href="#" className="hover:underline">
            view full leaderboard &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
