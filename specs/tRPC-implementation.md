# tRPC Implementation Spec

## 1. Overview

This spec outlines the implementation of tRPC as the API/backend layer for the DevRoast project. tRPC provides end-to-end type safety between the backend procedures and frontend components, integrating seamlessly with Next.js App Router's Server Components (RSC) using TanStack Query.

## 2. Research/Analysis

### Technology Alternatives
- **REST API**: Traditional approach, requires manual type definitions
- **GraphQL**: Flexible, but requires schema definition and additional complexity
- **tRPC**: Type-safe RPC with zero schema, native TypeScript inference

### Why tRPC for This Project
- Zero schema duplication - types are inferred automatically
- Native integration with Next.js App Router and Server Components
- Works seamlessly with TanStack Query (already planned for data fetching)
- Zod integration for runtime validation
- Server-side prefetching support for RSC hydration

### Key Resources
- [tRPC with Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [tRPC TanStack Query Setup](https://trpc.io/docs/client/tanstack-react-query/setup)

## 3. Implementation Requirements

### Feature List
- [ ] Install tRPC and dependencies
- [ ] Create tRPC initialization and context
- [ ] Set up Query Client factory for SSR
- [ ] Create tRPC router with base procedures
- [ ] Implement API route handler
- [ ] Create tRPC client for Server Components (caller)
- [ ] Create tRPC provider for Client Components
- [ ] Wrap app with tRPC provider in layout
- [ ] Create example procedures for testing

### Technical Requirements
- tRPC v11 (required for native RSC support)
- TanStack Query v5 (latest)
- Zod for input validation
- `server-only` and `client-only` packages for security
- Superjson for serialization (optional but recommended)

## 4. Technical Implementation Details

### File Structure
```
src/
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   └── layout.tsx
├── server/
│   └── trpc/
│       ├── init.ts          # tRPC initialization
│       ├── router.ts        # Main app router
│       └── routers/         # Feature routers
│           └── _app.ts
└── lib/
    └── trpc/
        ├── query-client.ts  # QueryClient factory
        ├── client.tsx       # Client provider (RSC)
        ├── server.tsx       # Server caller (RSC)
        └── utils.ts         # Shared utilities
```

### Dependencies
```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod server-only client-only superjson
```

### Implementation Steps

#### Step 1: tRPC Initialization (`src/lib/trpc/init.ts`)
```typescript
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(() => {
  return {
    // Add context here (headers, auth, etc.)
  };
});

const t = initTRPC.create();

export const router = t.router;
export const baseProcedure = t.procedure;
```

#### Step 2: Query Client Factory (`src/lib/trpc/query-client.ts`)
```typescript
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';

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
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  return browserQueryClient ??= makeQueryClient();
}
```

#### Step 3: Server Caller (`src/lib/trpc/server.tsx`)
```typescript
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from '@/server/trpc/router';

export const getQueryClient = cache(makeQueryClient);
export const serverTrpc = cache(() => 
  createTRPCOptionsProxy({
    router: appRouter,
    createContext: createTRPCContext,
    queryClient: getQueryClient(),
  })
);
```

#### Step 4: Client Provider (`src/lib/trpc/client.tsx`)
```typescript
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { getQueryClient, trpc } from './utils';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

#### Step 5: API Route Handler (`src/app/api/trpc/[trpc]/route.ts`)
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/lib/trpc/init';
import { appRouter } from '@/server/trpc/router';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

#### Step 6: Main Router (`src/server/trpc/router.ts`)
```typescript
import { router } from '@/lib/trpc/init';
import { helloRouter } from './routers/hello';

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
```

### Usage Patterns

#### Server Components (Prefetching)
```typescript
import { serverTrpc } from '@/lib/trpc/server';

export default async function Page() {
  const data = await serverTrpc.hello.query({ text: 'world' });
  return <div>{data.greeting}</div>;
}
```

#### Client Components (Hooks)
```typescript
'use client';
import { trpc } from '@/lib/trpc/utils';

export function HelloButton() {
  const hello = trpc.hello.useQuery({ text: 'client' });
  return <div>{hello.data?.greeting}</div>;
}
```

#### Mutations
```typescript
const mutation = trpc.example.create.useMutation();

mutation.mutate({ title: 'New Post' });
```

## 5. TODO

- [ ] Install dependencies
- [ ] Create tRPC initialization (`init.ts`)
- [ ] Create query client factory
- [ ] Create server caller for RSC
- [ ] Create client provider for CSR
- [ ] Set up API route handler
- [ ] Create main router and procedures
- [ ] Wrap app with TRPCProvider in layout
- [ ] Test with example procedure
- [ ] Run lint and typecheck

## Notes

- All server-side files must use `server-only` package to prevent client imports
- Client-side files must use `server-only` directive at top
- Use `superjson` transformer if handling complex types (Date, Map, etc.)
- Follow the project's color system and Tailwind CSS v4 conventions for any UI
