# Project Overview

DevRoast is a code review web application that provides brutally honest (or sarcastic) feedback on your code. Users paste their code, and the app "roasts" it with feedback.

# Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Linting/Formatting**: Biome
- **UI Components**: Custom + base-ui primitives
- **Syntax Highlighting**: Shiki (vesper theme)

# Global Patterns

## UI Components (`src/components/ui/`)

All UI components follow this pattern:

```tsx
import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const componentVariants = tv({
  base: "base-styles...",
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div className={cn(componentVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Component.displayName = "Component";

export { Component, componentVariants };
```

## Rules

1. Named exports only (no default exports)
2. Extend native HTML props
3. Use `forwardRef` for ref forwarding
4. Use `tailwind-variants` for variants
5. Use `cn()` from `@/lib/utils` for className merging

## Server/Client Component Split Pattern

When a page needs both server-side data fetching and client-side interactivity, split into:

- `page.tsx` - Server Component that imports and renders client component
- `{component}-client.tsx` - Client Component with `"use client"` directive

```typescript
// src/app/page.tsx (Server Component)
import { HomeClient } from "@/components/home-client";

export default function Home() {
  return <HomeClient />;
}
```

```typescript
// src/components/home-client.tsx (Client Component)
"use client";

import { useState } from "react";
// Client-side logic, hooks, interactivity here

export function HomeClient() {
  const [state, setState] = useState("");
  // ...
  return <div>...</div>;
}
```

## Color System

Colors defined in `src/app/globals.css` @theme block:
- `--color-accent-green`: #10b981
- `--color-accent-red`: #ef4444
- `--color-accent-amber`: #f59e0b
- `--color-text-primary`: #fafafa
- `--color-text-secondary`: #a3a3a3
- `--color-text-tertiary`: #737373
- `--color-bg-surface`: #0f0f0f
- `--color-bg-page`: #0c0c0c
- `--color-border`: #2a2a2a

## Fonts

- JetBrains Mono (`--font-jetbrains`)
- IBM Plex Mono (`--font-ibm-plex-mono`)

# Commands

```bash
npm run dev      # Start dev server
npx biome format # Format code
npx biome lint   # Lint code
npx tsc --noEmit # Type check
```

# Additional Patterns

See the following documents for specific patterns:

- [UI Components](src/components/ui/AGENTS.md) - Component creation pattern
- [tRPC](src/lib/trpc/AGENTS.md) - Backend API layer pattern
- [Metrics](src/components/metrics/AGENTS.md) - Metrics display pattern
