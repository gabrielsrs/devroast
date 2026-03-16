# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate OpenGraph images for roast sharing using Takumi

**Architecture:** Create an API route `/api/og/[id]` that renders JSX to image using `@takumi-rs/image-response`, integrate with existing metadata generation

**Tech Stack:** Next.js 16 App Router, @takumi-rs/image-response, Drizzle ORM

---

## Chunk 1: Setup & OG API Route

### Task 1: Install Takumi dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add Takumi dependency**

Run: `npm install @takumi-rs/image-response`

Or manually add to package.json dependencies:
```json
"@takumi-rs/image-response": "^0.73.1"
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @takumi-rs/image-response for OG generation"
```

### Task 2: Create OG Image API Route

**Files:**
- Create: `src/app/api/og/[id]/route.ts`

- [ ] **Step 1: Create the API route**

Create `src/app/api/og/[id]/route.ts`:

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";

const verdictColors: Record<string, string> = {
  decent_code: "#10B981",
  needs_work: "#F59E0B",
  needs_improvement: "#F97316",
  needs_serious_help: "#EF4444",
};

function getVerdict(score: number): string {
  if (score >= 8) return "decent_code";
  if (score >= 6) return "needs_work";
  if (score >= 4) return "needs_improvement";
  return "needs_serious_help";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await db
    .select({
      id: roasts.id,
      score: roasts.score,
      roastContent: roasts.roastContent,
      code: submissions.code,
      language: submissions.language,
    })
    .from(roasts)
    .innerJoin(submissions, sql`${roasts.submissionId} = ${submissions.id}`)
    .where(eq(roasts.id, id))
    .limit(1);

  if (result.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const row = result[0];
  const score = row.score / 10;
  const verdict = getVerdict(row.score);
  const verdictColor = verdictColors[verdict];
  const lines = row.code.split("\n").length;
  const displayContent =
    row.roastContent.length > 200
      ? row.roastContent.slice(0, 200) + "..."
      : row.roastContent;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#0C0C0C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 64,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
            {">"}
          </span>
          <span
            style={{
              color: "#FAFAFA",
              fontSize: 20,
              fontFamily: "JetBrains Mono",
            }}
          >
            devroast
          </span>
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <span
            style={{
              color: "#F59E0B",
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {score.toFixed(1)}
          </span>
          <span
            style={{
              color: "#737373",
              fontSize: 56,
              lineHeight: 1,
            }}
          >
            /10
          </span>
        </div>

        {/* Verdict */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: verdictColor,
            }}
          />
          <span style={{ color: verdictColor, fontSize: 20 }}>{verdict}</span>
        </div>

        {/* Language info */}
        <span
          style={{
            color: "#737373",
            fontSize: 16,
            fontFamily: "JetBrains Mono",
          }}
        >
          lang: {row.language} · {lines} lines
        </span>

        {/* Roast quote */}
        <p
          style={{
            color: "#FAFAFA",
            fontSize: 22,
            textAlign: "center",
            fontFamily: "IBM Plex Mono",
            lineHeight: 1.5,
            maxWidth: 1000,
            margin: 0,
          }}
        >
          "{displayContent}"
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      format: "png",
    }
  );

  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/og/[id]/route.ts
git commit -m "feat: add OG image generation API route"
```

---

## Chunk 2: Share Button & Metadata

### Task 3: Enable Share Button

**Files:**
- Modify: `src/app/roast/[id]/page.tsx:144-148`

- [ ] **Step 1: Enable share button with click handler**

Replace the disabled share button:

```typescript
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    navigator.clipboard.writeText(window.location.href);
  }}
>
  <span>$</span>
  <span>share_roast</span>
</Button>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: enable share button with clipboard copy"
```

### Task 4: Update Metadata with OG Image

**Files:**
- Modify: `src/app/roast/[id]/page.tsx:78-83`

- [ ] **Step 1: Update generateMetadata function**

Replace the existing `generateMetadata` function:

```typescript
export async function generateMetadata({ params }: RoastResultPageProps) {
  const { id } = await params;
  let roast: Awaited<ReturnType<typeof trpcCaller.metrics.getRoastById>> | null = null;
  
  try {
    roast = await trpcCaller.metrics.getRoastById({ id });
  } catch {
    return {
      title: "Roast Not Found | devroast",
      description: "This roast doesn't exist or was deleted",
    };
  }

  return {
    title: `${roast.score.toFixed(1)}/10 - ${roast.roastContent.slice(0, 50)}... | devroast`,
    description: roast.roastContent,
    openGraph: {
      title: `My code got roasted: ${roast.score.toFixed(1)}/10`,
      description: roast.roastContent,
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: add OG metadata to roast result page"
```

---

## Chunk 3: Verification

### Task 5: Test OG Image Generation

**Files:**
- Test: Manual browser testing

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Create a test roast**

Navigate to `/`, submit some code, get a roast ID

- [ ] **Step 3: Test OG endpoint**

Visit: `http://localhost:3000/api/og/[roast-id]`

Expected: PNG image showing score, verdict, language, and roast content

- [ ] **Step 4: Test share button**

Click share button, verify URL is copied to clipboard

- [ ] **Step 5: Test metadata**

Check page source or use a social media debugger to verify og:image tag is present

- [ ] **Step 6: Commit final**

```bash
git add -A
git commit -m "feat: complete OG image generation for roast sharing"
```

---

## Summary

| Task | File Changes |
|------|---------------|
| Install Takumi | package.json |
| OG API Route | src/app/api/og/[id]/route.ts |
| Share Button | src/app/roast/[id]/page.tsx |
| Metadata | src/app/roast/[id]/page.tsx |

**Total commits:** 5
