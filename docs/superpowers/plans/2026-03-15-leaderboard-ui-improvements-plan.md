# Leaderboard Page UI Improvements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement UI improvements for the leaderboard page: new collapse behavior (always expanded with "Show more"), visual gap between rows, border on individual rows, layout changes (score and line count on right).

**Architecture:** Changes to LeaderboardClient component only. No changes to homepage components. New wrapper component for code blocks with "Show more" toggle.

**Tech Stack:** Next.js 16, React, Tailwind CSS v4

---

## File Structure

- **Modify:** `src/server/trpc/routers/metrics.ts` - Add lineCount to query
- **Create:** `src/components/code-block-with-toggle.tsx` - Code block with "Show more" footer
- **Modify:** `src/components/leaderboard-client.tsx` - Update for new behavior

**Note:** TableRow component is NOT modified - it is used by homepage (shame-leaderboard-client.tsx) which should remain unchanged.

---

## Chunk 1: Backend and Data

### Task 1: Add lineCount to tRPC query

**Files:**
- Modify: `src/server/trpc/routers/metrics.ts`

- [ ] **Step 1: Read current metrics.ts**

```typescript
// src/server/trpc/routers/metrics.ts
// Check getFullLeaderboard procedure
```

- [ ] **Step 2: Add lineCount to getFullLeaderboard**

In the return mapping, add:
```typescript
lineCount: row.code.split("\n").length,
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/server/trpc/routers/metrics.ts
git commit -m "feat: add lineCount to getFullLeaderboard query"
```

---

## Chunk 2: Code Block with Toggle Component

### Task 2: Create CodeBlockWithToggle component

**Files:**
- Create: `src/components/code-block-with-toggle.tsx`

- [ ] **Step 1: Write the component**

```typescript
"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";

interface CodeBlockWithToggleProps {
  code: string;
  language?: string;
  defaultLines?: number;
}

export function CodeBlockWithToggle({
  code,
  language,
  defaultLines = 5,
}: CodeBlockWithToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split("\n");
  const totalLines = lines.length;
  const hasMoreThanDefault = totalLines > defaultLines;

  const displayCode = isExpanded ? code : lines.slice(0, defaultLines).join("\n");
  const hiddenLines = totalLines - defaultLines;

  return (
    <div className="flex flex-col">
      <CodeBlock
        code={displayCode}
        language={language}
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
          {isExpanded
            ? "Show less"
            : `Show more (+${hiddenLines} lines)`}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/code-block-with-toggle.tsx
git commit -m "feat: add CodeBlockWithToggle component"
```

---

## Chunk 3: TableRow Updates

**Note:** TableRow component should NOT be modified. It is used by the homepage (shame-leaderboard-client.tsx) which should remain unchanged. The leaderboard page will use inline rendering for the row header instead of TableRow.

---

## Chunk 4: LeaderboardClient Updates

### Task 4: Update LeaderboardClient

**Files:**
- Modify: `src/components/leaderboard-client.tsx`

- [ ] **Step 1: Read current LeaderboardClient**

```typescript
// src/components/leaderboard-client.tsx
// Current implementation uses expandedId state and collapsible toggle
```

- [ ] **Step 2: Update component for new behavior**

Changes needed:
1. Add lineCount to LeaderboardEntry interface
2. Remove expandedId state
3. Remove scrollIntoView effect
4. Remove onClick handler from button (no toggle)
5. Add gap-3 between rows
6. Remove border from outer container
7. Add border to individual row items
8. Replace CodeBlock with CodeBlockWithToggle

Full updated component:
```typescript
"use client";

import { useRef } from "react";
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
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const scrollToRow = (id: string) => {
    const row = rowRefs.current.get(id);
    if (row) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

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
              ref={(el) => {
                if (el) rowRefs.current.set(entry.id, el);
              }}
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
                <CodeBlockWithToggle
                  code={entry.code}
                  language={entry.language ?? undefined}
                  defaultLines={5}
                />
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
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run lint**

Run: `npx biome lint src/components/leaderboard-client.tsx`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/leaderboard-client.tsx
git commit -m "feat: update LeaderboardClient with new collapse behavior and layout"
```

---

## Chunk 5: Verification

### Task 5: Verify implementation

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

- [ ] **Step 2: Test manually**

Navigate to `http://localhost:3000/leaderboard`
- Page should load without errors
- All rows should be expanded by default (show 5 lines + "Show more")
- Clicking "Show more" should reveal all lines
- Gap between rows should be visible
- Border on each individual row
- Score and line count on right side

- [ ] **Step 3: Verify homepage unchanged**

Navigate to `http://localhost:3000/`
- Homepage should still have collapsible toggle behavior
- Should NOT have gap between rows
- Should NOT have new layout

- [ ] **Step 4: Run full type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Run lint**

Run: `npx biome lint`
Expected: No errors

- [ ] **Step 6: Final commit**

```bash
git status
git add -A
git commit -m "feat: implement leaderboard UI improvements"
```
