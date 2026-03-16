# Metrics Components Pattern

This document outlines the pattern for creating metrics display components.

## Overview

Metrics components display data fetched via tRPC with animated number transitions using NumberFlow.

## File Structure

```
src/components/metrics/
├── metrics-section.tsx      # Main component with data fetching
├── metrics-counter.tsx      # Animated number display
├── metrics-display.tsx      # Server-side display (optional)
└── metrics-skeleton.tsx     # Loading skeleton (optional)
```

## Pattern Implementation

### Main Component (`metrics-section.tsx`)

For client-side fetching with loading animation:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/utils";
import { MetricsCounter } from "./metrics-counter";

export function MetricsSection() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.metrics.getStats.queryOptions());

  const totalRoasts = data?.totalRoasts ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px] text-text-tertiary">
      <MetricsCounter value={totalRoasts} suffix="codes roasted" />
      <span>·</span>
      <span>
        avg score: <MetricsCounter value={avgScore} suffix="/10" decimals={1} />
      </span>
    </div>
  );
}
```

### Animated Counter (`metrics-counter.tsx`)

Initial value with NumberFlow animation:

```typescript
"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

interface MetricsCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

export function MetricsCounter({
  value,
  suffix,
  decimals = 0,
}: MetricsCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <>
      <NumberFlow
        value={displayValue}
        format={{
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          notation: decimals === 0 ? "compact" : "standard",
        }}
        className="text-text-tertiary"
      />
      {suffix && <span>{suffix}</span>}
    </>
  );
}
```

### Loading Skeleton (`metrics-skeleton.tsx`)

Optional skeleton for SSR:

```typescript
export function MetricsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px]">
      <div className="h-4 w-16 animate-pulse rounded bg-border" />
      <span className="text-text-tertiary">codes roasted</span>
      <span>·</span>
      <span className="text-text-tertiary">
        avg score: <div className="ml-1 mr-1 inline-block h-4 w-12 animate-pulse rounded bg-border" />/10
      </span>
    </div>
  );
}
```

## Rules

1. **Use useQuery for client fetching** - Fetch data on client side
2. **Initialize with 0** - Set initial state to 0 for animation effect
3. **Use useEffect to update** - Trigger animation on data load
4. **NumberFlow handles animation** - Smooth transition from 0 to actual value
5. **Handle undefined/null** - Use ?? 0 for fallback values
6. **Configure decimals** - Set minimum/maximum fraction digits for formatting
