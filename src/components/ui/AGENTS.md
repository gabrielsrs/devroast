# Component Creation Pattern

This document outlines the pattern for creating UI components in `src/components/ui/`.

## Prerequisites

Ensure the following utilities are installed:
```bash
npm install clsx tailwind-merge tailwind-variants
```

## Pattern Structure

Each component should follow this structure:

### 1. Utility: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2. Component File: `src/components/ui/{component}.tsx`

```typescript
import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const componentVariants = tv({
  base: "base-styles...",
  variants: {
    variant: {
      default: "variant-default-styles",
      secondary: "variant-secondary-styles",
    },
    size: {
      default: "size-default-styles",
      sm: "size-sm-styles",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";

export { Component, componentVariants };
```

## Rules

1. **Named exports only** - Never use default exports
2. **Extend native props** - Use appropriate HTML attributes (ButtonHTMLAttributes, InputHTMLAttributes, etc.)
3. **Use forwardRef** - For ref forwarding
4. **Display name** - Set displayName for forwardRef components
5. **Variants** - Use tailwind-variants for variant handling
6. **Classes merge** - Use cn() utility for className merging
7. **Tailwind config** - Add custom colors to `src/app/globals.css` @theme block when needed
8. **Biome config** - Ensure `tailwindDirectives: true` is set in biome.json css parser

## Adding Tailwind Colors

Edit `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-custom: #hexcode;
}
```

## Running Lint/Format

```bash
npx biome format --write
npx biome lint
npx tsc --noEmit
```
