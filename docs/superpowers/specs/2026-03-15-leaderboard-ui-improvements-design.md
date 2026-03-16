# Leaderboard Page UI Improvements Design

**Date:** 2026-03-15  
**Status:** Draft

## Scope

**IMPORTANT:** These changes apply ONLY to the leaderboard page (`/leaderboard`). The homepage (`/`) should remain unchanged with its current collapsible toggle behavior.

## Overview

Improve the leaderboard page with new collapse behavior, visual enhancements, and layout changes.

## Changes

### 1. Scroll Fix

Change scroll behavior when clicking a row:
- Currently: Scrolls to the code block (`expandedRef` on the div containing CodeBlock)
- Change to: Scroll to the row header position

Implementation:
- Remove `expandedRef` from code block div
- No click handler needed - all rows are expanded by default
- Remove scrollIntoView behavior entirely (not needed since all rows expanded)

### 2. All Rows Expanded by Default

- Remove collapsible toggle behavior (`expandedId` state)
- All rows display code block by default
- Multiple code blocks can be visible simultaneously
- No more click-to-expand - code is always visible

### 3. Code Block with "Show More" Footer

Create new behavior within each code block:

- **Default state**: Show first 5 lines of code
- **Edge case**: If code has ≤5 lines, hide the "Show more" footer entirely
- **Footer**: Add clickable "Show more (+X lines)" / "Show less" toggle
- **State**: Each code block has its own `isExpanded` state (local to the CodeBlock wrapper)
- **Multiple open**: Multiple code blocks can be expanded simultaneously

New interface for code block:
```typescript
interface CodeBlockWithToggleProps {
  code: string;
  language?: string;
  defaultLines?: number; // default: 5
  showLineNumbers?: boolean;
  showHeader?: boolean;
}
```

### 4. Visual Gap Between Rows

- Currently: `gap-0` (no gap)
- Change to: `gap-3` between row items

### 5. Border Scope Change

- Currently: Border on outer container (`border border-border`)
- Change to: Border on each individual row item
- Remove border from outer container

### 6. Layout Changes

Current layout (left to right): rank | score | codePreview | language

New layout: rank | codePreview | language | score | lineCount

- Move score to the right side (after language)
- Add line count display: shows total lines in the code (e.g., "24 lines")
- Remove `onClick` handler from button since rows are always expanded (no toggle behavior)

## Component Changes

**Note:** These component changes apply only to leaderboard page components. The homepage components (`ShameLeaderboardClient`, `ShameLeaderboardServer`, `ShameLeaderboardSkeleton`) remain unchanged.

### LeaderboardClient (`src/components/leaderboard-client.tsx`)

1. Remove `expandedId` state and `handleToggle` function
2. Remove `scrollIntoView` effect entirely
3. Remove click handler from button (no toggle behavior)
4. Add `gap-3` to container
5. Remove border from outer container
6. Add border to individual row items
7. Wrap each code block in a local `isExpanded` state component

### CodeBlock with Toggle (new or extended)

Create a wrapper component or extend CodeBlock:
- Show only first N lines by default
- Add "Show more" / "Show less" footer
- Track expanded state locally

### TableRow Updates (`src/components/ui/table-row.tsx`)

1. Move score to right side
2. Add lineCount prop
3. Display line count after score

## Data Types

```typescript
interface LeaderboardEntry {
  id: string;
  rank: string;
  score: string;
  code: string;
  codePreview: string;
  language: string | null;
  lineCount: number; // new: total lines in code
}
```

## Backend Changes

Update `getFullLeaderboard` in `metrics.ts` to include lineCount:

```typescript
getFullLeaderboard: baseProcedure.query(async () => {
  // ... existing query
  return results.map((row, index) => ({
    // ... existing fields
    lineCount: row.code.split("\n").length,
  }));
})
```

## Acceptance Criteria

**Note:** These criteria apply only to the leaderboard page. The homepage remains unchanged.

1. ✅ All rows expanded by default (no collapsible toggle between rows) - leaderboard only
2. ✅ Code blocks show 5 lines by default with "Show more" footer
3. ✅ "Show more" footer hidden if code has ≤5 lines
4. ✅ "Show more" footer reveals all lines, toggles to "Show less"
5. ✅ Multiple code blocks can be expanded simultaneously
6. ✅ Gap between rows (`gap-3`) - leaderboard only
7. ✅ Border on individual rows, not outer container - leaderboard only
8. ✅ Score displayed on right side - leaderboard only
9. ✅ Line count displayed on right side (after score) - leaderboard only
