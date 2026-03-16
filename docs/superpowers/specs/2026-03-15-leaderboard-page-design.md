# Leaderboard Page Implementation Design

**Date:** 2026-03-15  
**Status:** Draft

## Overview

Implement the leaderboard page at `/leaderboard` with backend tRPC integration, showing 20 results ordered by lowest score first (shame ranking). Use shared components with the homepage shame leaderboard.

## User Flow

1. User navigates to `/leaderboard`
2. Page displays loading skeleton while fetching data
3. 20 entries shown in collapsible rows
4. Clicking a row expands to show full code with syntax highlighting
5. Stats header shows total submissions and average score

## Architecture

```
src/app/leaderboard/page.tsx (Server Component)
    ↓
LeaderboardServer (fetches data via tRPC)
    ↓
LeaderboardClient (collapsible UI with CodeBlock)
```

## Backend Implementation

### tRPC Procedure

Add `getFullLeaderboard` to `src/server/trpc/routers/metrics.ts`:

```typescript
getFullLeaderboard: baseProcedure.query(async () => {
  const results = await db
    .select({
      id: roasts.id,
      score: roasts.score,
      code: submissions.code,
      language: submissions.language,
      // Note: submissions table doesn't have author field
      // If author tracking is needed, submissions table needs author column
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
})
```

**Note:** The current `submissions` table doesn't have an author field. Author display will be omitted for now. If needed later, a migration would be required to add an `author` column to the submissions table.

**Note:** This returns 20 entries instead of 3, but otherwise identical to `getShameLeaderboard`.

## Frontend Implementation

### 1. LeaderboardServer Component

**File:** `src/components/leaderboard-server.tsx`

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

### 2. LeaderboardClient Component

**File:** `src/components/leaderboard-client.tsx`

- "use client" directive
- Props: `leaderboard: LeaderboardEntry[]`, `stats: Stats`
- State: `expandedId` (string | null) for collapsible rows
- Renders header with stats (total submissions, avg score)
- Renders list of entries using shared `TableRow` component
- Expands to show `CodeBlock` with full code when clicked
- Uses `scrollIntoView` for smooth scrolling on expand

### 3. LeaderboardSkeleton Component

**File:** `src/components/leaderboard-skeleton.tsx`

- Loading state matching LeaderboardClient structure
- 20 skeleton rows
- Header stats skeleton

### 4. Update Page

**File:** `src/app/leaderboard/page.tsx`

- Remove static mock data
- Add Suspense wrapper with LeaderboardSkeleton
- Import and render LeaderboardServer

```typescript
import { Suspense } from "react";
import { LeaderboardServer } from "@/components/leaderboard-server";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";

export default function LeaderboardPage() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      {/* existing header */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardServer />
      </Suspense>
    </div>
  );
}
```

## Data Types

```typescript
interface LeaderboardEntry {
  id: string;
  rank: string;
  score: string;
  code: string;
  codePreview: string;
  language: string | null;
  // author field omitted - submissions table doesn't have author column
}

interface Stats {
  totalRoasts: number;
  avgScore: number;
}
```

## Header Design

The leaderboard page uses the existing header layout from `leaderboard/page.tsx`:
- Title: "shame_leaderboard" with terminal prompt styling
- Subtitle: "// the most roasted code on the internet"
- Stats bar: showing "X submissions · avg score: Y/10"

The header remains static (not fetched), matching the current page design.

## Acceptance Criteria

1. Leaderboard page shows exactly 20 entries
2. Entries ordered by lowest score first (shame ranking)
3. Each row is collapsible with full code visible when expanded
4. Code uses syntax highlighting via CodeBlock component
5. Each row displays: rank (#), language tag, score (/10)
6. Loading state shows skeleton UI while fetching
7. Page follows existing UI patterns from homepage
8. Header displays title "shame_leaderboard" with stats (total submissions, avg score)
