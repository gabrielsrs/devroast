"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";

interface CodeBlockWithToggleProps {
  code: string;
  defaultLines?: number;
}

export function CodeBlockWithToggle({
  code,
  defaultLines = 5,
}: CodeBlockWithToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split("\n");
  const totalLines = lines.length;
  const hasMoreThanDefault = totalLines > defaultLines;

  const displayCode = isExpanded
    ? code
    : lines.slice(0, defaultLines).join("\n");
  const hiddenLines = totalLines - defaultLines;

  return (
    <div className="flex flex-col">
      <CodeBlock
        code={displayCode}
        showLineNumbers={true}
        showHeader={false}
        className="rounded-none border-none"
      />
      {hasMoreThanDefault && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-center border-t border-border bg-bg-surface px-4 py-2 font-jetbrains text-[12px] text-text-tertiary hover:bg-border/50"
        >
          {isExpanded ? "Show less" : `Show more (+${hiddenLines} lines)`}
        </button>
      )}
    </div>
  );
}
