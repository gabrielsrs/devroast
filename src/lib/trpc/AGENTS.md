# tRPC Pattern Guide

This document outlines the pattern for implementing tRPC in the project.

## Overview

tRPC provides end-to-end type safety between backend procedures and frontend components, integrated with Next.js App Router Server Components using TanStack Query.

## Dependencies

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod server-only client-only
npm install @number-flow/react
```

## File Structure

```
src/
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts          # API route handler
├── server/
│   └── trpc/
│       ├── router.ts                 # Main app router
│       └── routers/
│           └── {feature}.ts         # Feature routers
└── lib/
    └── trpc/
        ├── init.ts                  # tRPC initialization
        ├── query-client.ts          # QueryClient factory for SSR
        ├── server.tsx               # Server caller for RSC
        ├── client.tsx               # Client provider
        └── utils.ts                 # Shared utilities (TRPCProvider)
```

## Pattern Implementation

### 1. Initialization (`init.ts`)

```typescript
import { initTRPC } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  return {
    // Add context here (headers, auth, etc.)
  };
});

const t = initTRPC.create();

export const router = t.router;
export const baseProcedure = t.procedure;
```

### 2. Query Client Factory (`query-client.ts`)

```typescript
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: defaultShouldDehydrateQuery,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
```

### 3. Server Caller (`server.tsx`)

For direct server-side procedure calls (no HTTP):

```typescript
import "server-only";
import { appRouter } from "@/server/trpc/router";
import { createTRPCContext } from "./init";

export const trpcCaller = appRouter.createCaller(createTRPCContext());
```

### 4. Client Provider (`client.tsx`)

Wrap the app with tRPC provider:

```typescript
"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import type { AppRouter } from "@/server/trpc/router";
import { getQueryClient } from "./query-client";
import { TRPCProvider } from "./utils";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  );
}
```

### 5. Utilities (`utils.ts`)

```typescript
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/trpc/router";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
```

### 6. API Route Handler (`app/api/trpc/[trpc]/route.ts`)

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/lib/trpc/init";
import { appRouter } from "@/server/trpc/router";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 7. Router (`server/trpc/router.ts`)

```typescript
import { router } from "@/lib/trpc/init";
import { metricsRouter } from "./routers/metrics";

export const appRouter = router({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
```

### 8. Feature Procedure (`server/trpc/routers/{feature}.ts`)

```typescript
import { router, baseProcedure } from "@/lib/trpc/init";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { sql } from "drizzle-orm";

export const metricsRouter = router({
  getStats: baseProcedure.query(async () => {
    // Query logic here
    return { totalRoasts: 100, avgScore: 4.5 };
  }),
});
```

## Usage Patterns

### Server Components (Direct Caller)

For Server Components, use `trpcCaller` directly:

```typescript
import { trpcCaller } from "@/lib/trpc/server";

export async function ServerComponent() {
  const data = await trpcCaller.metrics.getStats();
  return <div>{data.totalRoasts}</div>;
}
```

### Client Components (useQuery)

For Client Components, use TanStack Query with tRPC hooks:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/utils";
import { MetricsCounter } from "./metrics-counter";

export function MetricsSection() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.metrics.getStats.queryOptions());

  return <div>{data?.totalRoasts}</div>;
}
```

### Animation with NumberFlow

For animated numbers, use NumberFlow with initial value:

```typescript
"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

export function MetricsCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return <NumberFlow value={displayValue} />;
}
```

## Rules

1. **Server files must use `server-only`** - Prevents client imports
2. **Client files must have `"use client"`** - Required directive
3. **Use caller for RSC** - Direct procedure calls in Server Components
4. **Use useQuery for CSR** - TanStack Query hooks in Client Components
5. **Named exports only** - No default exports
6. **Initialize context with cache** - Use React's cache for context creation
7. **Wrap app with provider** - Add TRPCReactProvider in layout.tsx

## Commands

```bash
npm run dev          # Start dev server
npx biome format    # Format code
npx biome lint      # Lint code
npx tsc --noEmit    # Type check
```
