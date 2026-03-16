# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the leaderboard page at `/leaderboard` with backend tRPC integration, showing 20 results ordered by lowest score first.

**Architecture:** Server/Client component split following homepage pattern. tRPC backend fetches 20 entries, frontend renders collapsible rows with syntax-highlighted code.

**Tech Stack:** Next.js 16, tRPC, Drizzle ORM, Tailwind CSS v4

---

## File Structure

- **Modify:** `src/server/trpc/routers/metrics.ts` - Add `getFullLeaderboard` procedure
- **Create:** `src/components/leaderboard-server.tsx` - Server component that fetches data
- **Create:** `src/components/leaderboard-client.tsx` - Client component with collapsible rows
- **Create:** `src/components/leaderboard-skeleton.tsx` - Loading skeleton
- **Modify:** `src/app/leaderboard/page.tsx` - Update to use server component with Suspense

---

## Chunk 1: Backend tRPC Procedure

### Task 1: Add getFullLeaderboard to metrics router

**Files:**
- Modify: `src/server/trpc/routers/metrics.ts`

- [ ] **Step 1: Read existing metrics.ts file**

```typescript
// src/server/trpc/routers/metrics.ts
// Check current structure before editing
```

- [ ] **Step 2: Add getFullLeaderboard procedure**

Add this procedure to the metricsRouter, after getShameLeaderboard:

```typescript
getFullLeaderboard: baseProcedure.query(async () => {
  const results = await db
    .select({
      id: roasts.id,
      score: roasts.score,
      code: submissions.code,
      language: submissions.language,
    })
    .from(roasts)
    .innerJoin(submissions, sql`${roasts.submissionId} = ${submissions.id}`)
    .orderBy(roasts.score)
    .limit(20);

  return results.map((row, index) => ({
    id: row.id,
    rank: `#${index + 1}`,
    score: (row.score / 10).toFixed(1),
    code: row.code,
    codePreview: row.code.slice(0, 50) + (row.code.length > 50 ? "..." : ""),
    language: row.language,
  }));
}),
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/server/trpc/routers/metrics.ts
git commit -m "feat: add getFullLeaderboard tRPC procedure"
```

---

## Chunk 2: Frontend Components

### Task 2: Create LeaderboardServer component

**Files:**
- Create: `src/components/leaderboard-server.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { trpcCaller } from "@/lib/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

export async function LeaderboardServer() {
  const [leaderboard, stats] = await Promise.all([
    trpcCaller.metrics.getFullLeaderboard(),
    trpcCaller.metrics.getStats(),
  ]);

  return <LeaderboardClient leaderboard={leaderboard} stats={stats} />;
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: Error - LeaderboardClient doesn't exist yet (expected)

- [ ] **Step 3: Commit**

```bash
git add src/components/leaderboard-server.tsx
git commit -m "feat: add LeaderboardServer component"
```

### Task 3: Create LeaderboardClient component

**Files:**
- Create: `src/components/leaderboard-client.tsx`

- [ ] **Step 1: Write the component**

```typescript
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
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/leaderboard-client.tsx
git commit -m "feat: add LeaderboardClient component"
```

### Task 4: Create LeaderboardSkeleton component

**Files:**
- Create: `src/components/leaderboard-skeleton.tsx`

- [ ] **Step 1: Write the skeleton component**

```typescript
export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 animate-pulse rounded bg-border" />
        <div className="h-4 w-4 animate-pulse rounded bg-border" />
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
      </div>

      <div className="flex flex-col gap-0 rounded-none border border-border">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border px-5 py-4 last:border-b-0"
          >
            <div className="w-10 h-4 animate-pulse rounded bg-border" />
            <div className="w-[60px] h-4 animate-pulse rounded bg-border" />
            <div className="flex-1 h-4 animate-pulse rounded bg-border" />
            <div className="w-[100px] h-4 animate-pulse rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/leaderboard-skeleton.tsx
git commit -m "feat: add LeaderboardSkeleton component"
```

---

## Chunk 3: Page Integration

### Task 5: Update leaderboard page

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Read existing page.tsx**

```typescript
// src/app/leaderboard/page.tsx
// Current structure uses static mock data
```

- [ ] **Step 2: Replace with server component pattern**

Replace the file content with:

```typescript
import { Suspense } from "react";
import { LeaderboardServer } from "@/components/leaderboard-server";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";

const TOTAL_SUBMISSIONS = 2847;
const AVG_SCORE = "4.2";

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
        <div className="flex items-center gap-2">
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            {TOTAL_SUBMISSIONS.toLocaleString()} submissions
          </span>
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            ·
          </span>
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            avg score: {AVG_SCORE}/10
          </span>
        </div>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardServer />
      </Suspense>
    </div>
  );
}
```

**Note:** We keep the static header but now fetch dynamic stats in the LeaderboardClient. The static numbers can be removed in a future iteration when we also update the Stats display in the client component.

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run lint**

Run: `npx biome lint src/app/leaderboard/page.tsx`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: integrate leaderboard with tRPC backend"
```

---

## Chunk 4: Verification

### Task 6: Verify implementation

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

- [ ] **Step 2: Test manually**

Navigate to `http://localhost:3000/leaderboard`
- Page should load without errors
- Should show loading skeleton initially
- After loading, should show 20 entries (or whatever is in DB)
- Clicking a row should expand to show full code with syntax highlighting

- [ ] **Step 3: Run full type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run lint on all changed files**

Run: `npx biome lint`
Expected: No errors

- [ ] **Step 5: Final commit**

```bash
git status
git add -A
git commit -m "feat: implement leaderboard page with tRPC integration"
```
