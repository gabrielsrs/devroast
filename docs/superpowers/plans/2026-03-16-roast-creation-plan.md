# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the roast creation feature - form on homepage and /roast/new page, submission saves to DB, redirects to result page.

**Architecture:** Server Action handles form submission, saves to database, generates mock roast, redirects to result page.

**Tech Stack:** Next.js 16, React, Server Actions, tRPC, Drizzle ORM

---

## File Structure

- **Create:** `src/components/roast-form-client.tsx` - Client form component
- **Create:** `src/components/roast-form-server.tsx` - Server component with Server Action
- **Create:** `src/app/roast/new/page.tsx` - New roast page
- **Modify:** `src/app/page.tsx` - Add form to homepage
- **Modify:** `src/server/trpc/routers/metrics.ts` - Add getRoastById procedure

---

## Chunk 1: Backend - getRoastById Procedure

### Task 1: Add getRoastById to metrics router

**Files:**
- Modify: `src/server/trpc/routers/metrics.ts`

- [ ] **Step 1: Read current metrics.ts**

- [ ] **Step 2: Add getRoastById procedure**

Add this procedure to the metricsRouter:

```typescript
getRoastById: baseProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const roast = await db.query.roasts.findFirst({
      where: eq(roasts.id, input.id),
      with: {
        submission: true,
      },
    });

    if (!roast) {
      throw new Error("Roast not found");
    }

    return {
      id: roast.id,
      score: roast.score / 10,
      roastContent: roast.roastContent,
      roastMode: roast.roastMode,
      code: roast.submission.code,
      language: roast.submission.language,
      createdAt: roast.createdAt,
    };
  }),
```

Note: Import `z` from zod and `eq` from drizzle-orm.

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/server/trpc/routers/metrics.ts
git commit -m "feat: add getRoastById tRPC procedure"
```

---

## Chunk 2: RoastFormServer with Server Action

### Task 2: Create RoastFormServer component

**Files:**
- Create: `src/components/roast-form-server.tsx`

- [ ] **Step 1: Write the component with Server Action**

```typescript
"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { RoastFormClient } from "./roast-form-client";

export async function submitRoast(prevState: unknown, formData: FormData) {
  const code = formData.get("code") as string;
  const language = formData.get("language") as string;
  const roastMode = (formData.get("roastMode") as string) || "sarcastic";

  if (!code || code.trim().length === 0) {
    return { error: "Code is required" };
  }

  // Insert submission
  const [submission] = await db
    .insert(submissions)
    .values({
      code,
      language: language as (typeof submissions.language.enumValues)[number],
      roastMode: roastMode as (typeof submissions.roastMode.enumValues)[number],
    })
    .returning();

  // Generate mock roast content (AI integration later)
  const mockRoastContent = generateMockRoast(code, roastMode);
  const mockScore = Math.floor(Math.random() * 10);

  // Insert roast
  const [roast] = await db
    .insert(roasts)
    .values({
      submissionId: submission.id,
      roastContent: mockRoastContent,
      score: mockScore,
      roastMode: roastMode as (typeof roasts.roastMode.enumValues)[number],
    })
    .returning();

  redirect(`/roast/${roast.id}`);
}

function generateMockRoast(code: string, mode: string): string {
  if (mode === "helpful") {
    return "Here's a helpful analysis of your code...";
  }
  return "Oh wow, I've seen better code written by a cat walking on a keyboard...";
}

export async function RoastFormServer() {
  return <RoastFormClient action={submitRoast} />;
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors (may need to create RoastFormClient first)

- [ ] **Step 3: Commit**

```bash
git add src/components/roast-form-server.tsx
git commit -m "feat: add RoastFormServer with Server Action"
```

---

## Chunk 3: RoastFormClient Component

### Task 3: Create RoastFormClient component

**Files:**
- Create: `src/components/roast-form-client.tsx`

- [ ] **Step 1: Write the component**

```typescript
"use client";

import { useFormStatus } from "react";
import { useFormState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Toggle } from "@/components/ui/toggle";

interface RoastFormClientProps {
  action: (prevState: unknown, formData: FormData) => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="default">
      <span>$</span>
      <span>{pending ? "roasting..." : "roast_it"}</span>
    </Button>
  );
}

export function RoastFormClient({ action }: RoastFormClientProps) {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="flex w-full max-w-[600px] flex-col gap-4">
      {state?.error && (
        <div className="font-jetbrains text-[12px] text-accent-red">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-jetbrains text-[12px] text-text-secondary">
          paste_your_code
        </label>
        <textarea
          name="code"
          placeholder="// paste your terrible code here..."
          className="min-h-[200px] w-full resize-none rounded-none border border-border bg-bg-surface p-4 font-jetbrains text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-accent-green focus:outline-none"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex w-[180px] flex-col gap-2">
          <label className="font-jetbrains text-[12px] text-text-secondary">
            language
          </label>
          <LanguageSelector name="language" value="javascript" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-jetbrains text-[12px] text-text-secondary">
            roast_mode
          </label>
          <input type="hidden" name="roastMode" value="sarcastic" />
          <Toggle
            name="roastModeToggle"
            pressed={true}
            onPressedChange={(pressed) => {
              const input = document.querySelector(
                'input[name="roastMode"]',
              ) as HTMLInputElement;
              if (input) {
                input.value = pressed ? "sarcastic" : "helpful";
              }
            }}
          >
            sarcastic
          </Toggle>
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/roast-form-client.tsx
git commit -m "feat: add RoastFormClient component"
```

---

## Chunk 4: Roast Page and Homepage Integration

### Task 4: Create /roast/new page

**Files:**
- Create: `src/app/roast/new/page.tsx`

- [ ] **Step 1: Write the page**

```typescript
import { RoastFormServer } from "@/components/roast-form-server";

export const metadata = {
  title: "Roast Your Code | devroast",
  description: "Submit your code and get brutally roasted",
};

export default function RoastPage() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-jetbrains text-[32px] font-[700] text-accent-green">
            {">"}
          </span>
          <h1 className="font-jetbrains text-[28px] font-[700] text-text-primary">
            new_roast
          </h1>
        </div>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          {"//"} submit your code for analysis
        </p>
      </div>

      <RoastFormServer />
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/new/page.tsx
git commit -m "feat: add /roast/new page"
```

### Task 5: Update homepage to include form

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current homepage**

- [ ] **Step 2: Add RoastFormServer to homepage**

Add import and render below existing content:

```typescript
import { RoastFormServer } from "@/components/roast-form-server";

// In the return, after ShameLeaderboardServer:
<RoastFormServer />
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add roast form to homepage"
```

---

## Chunk 5: Result Page Update

### Task 6: Update roast result page to fetch from DB

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Read current result page**

- [ ] **Step 2: Update to fetch from database**

Replace mock data with database fetch:

```typescript
import { trpcCaller } from "@/lib/trpc/server";

export default async function RoastResultPage({ params }: RoastResultPageProps) {
  const { id } = await params;
  
  let roast;
  try {
    roast = await trpcCaller.metrics.getRoastById({ id });
  } catch {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 pb-16 pt-10">
        <h1 className="font-jetbrains text-[20px] text-accent-red">
          roast_not_found
        </h1>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          this roast doesn't exist or was deleted
        </p>
      </div>
    );
  }

  // Generate issues from roast content (mock for now)
  const issues = generateIssuesFromRoast(roast.roastContent);

  return (
    // ... existing UI with roast data
  );
}

function generateIssuesFromRoast(content: string) {
  // Mock issue generation
  return [
    {
      severity: "warning" as const,
      title: "code review",
      description: content,
    },
  ];
}
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat: update roast result page to fetch from database"
```

---

## Chunk 6: Verification

### Task 7: Verify implementation

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run lint**

Run: `npx biome lint`
Expected: No errors

- [ ] **Step 3: Test manually**

Navigate to:
- `http://localhost:3000/` - Should show roast form
- `http://localhost:3000/roast/new` - Should show roast form
- Submit form - Should redirect to /roast/[id] with result

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: implement roast creation feature"
```
