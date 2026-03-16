# Roast Creation Feature Design

**Date:** 2026-03-16  
**Status:** Draft

## Overview

Implement the roast creation feature that allows users to submit code snippets and receive AI analysis. The feature includes a form on both the homepage and a dedicated page.

## User Flow

1. User navigates to `/` or `/roast/new`
2. User pastes code into textarea
3. User selects language from dropdown
4. User toggles between Sarcastic / Helpful roast mode
5. User clicks "roast_it" button
6. Form submits, data saved to database
7. User redirected to `/roast/[id]` with result

## Architecture

```
Homepage (/page.tsx)
    ↓
RoastFormServer (server component)
    ↓
RoastFormClient (client form with state)
    ↓ (server action)
submitRoast (action)
    ↓
/roast/[id] (result page)
```

## Components

### 1. RoastFormClient

**File:** `src/components/roast-form-client.tsx`

- "use client" directive
- State: code (string), language (string), roastMode (sarcastic/helpful), isLoading (boolean)
- Props: onSubmit (async function)
- UI Elements:
  - Textarea for code input
  - Language dropdown selector
  - Toggle for roast mode (Sarcastic / Helpful)
  - Submit button "roast_it"
  - Loading state while submitting

### 2. RoastFormServer

**File:** `src/components/roast-form-server.tsx`

- Server component
- Contains Server Action `submitRoast`
- Renders RoastFormClient
- Handles form submission and redirect

### 3. Server Action

**File:** `src/components/roast-form-server.tsx`

```typescript
"use server";

export async function submitRoast(formData: FormData) {
  const code = formData.get("code") as string;
  const language = formData.get("language") as string;
  const roastMode = formData.get("roastMode") as "sarcastic" | "helpful";

  // Save to database
  // Generate roast (mock for now)
  // Return redirect path
}
```

### 4. New Page

**File:** `src/app/roast/new/page.tsx`

- Server page
- Renders RoastFormServer
- Terminal-style header

### 5. Homepage Update

**File:** `src/app/page.tsx`

- Add RoastFormServer component below existing content

## Database Schema

Already defined in `src/db/schema.ts`:
- `submissions` table: id, code, language, roastMode, createdAt
- `roasts` table: id, submissionId, roastContent, score, roastMode, createdAt

## Backend (tRPC)

Add procedure to fetch roast by ID for result page:

```typescript
getRoastById: baseProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    // Query roast with submission
    // Return full roast data
  }),
```

## Data Types

```typescript
interface RoastResult {
  id: string;
  score: number;
  verdict: string;
  roastTitle: string;
  language: string;
  lines: number;
  code: string;
  issues: Array<{
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }>;
  suggestedFix: string;
}
```

## Acceptance Criteria

1. ✅ Homepage shows roast form
2. ✅ /roast/new page shows roast form
3. ✅ Form has code textarea input
4. ✅ Form has language dropdown selector
5. ✅ Form has toggle for Sarcastic / Helpful mode
6. ✅ Submitting form saves to database
7. ✅ User redirected to /roast/[id] with result
8. ✅ Result page displays roast analysis
9. ✅ Share button placeholder (not implemented)
