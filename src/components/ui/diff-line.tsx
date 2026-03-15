import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const diffLineVariants = tv({
  base: "flex gap-2 px-4 py-2 font-jetbrains text-[13px]",
  variants: {
    variant: {
      removed: "bg-[#1A0A0A] text-text-secondary",
      added: "bg-[#0A1A0F] text-foreground",
      context: "text-text-secondary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

const prefixVariants = tv({
  base: "font-[500] w-4",
  variants: {
    variant: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export interface DiffLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  prefix?: "+" | "-" | " ";
}

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, variant, prefix = " ", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(diffLineVariants({ variant, className }))}
        {...props}
      >
        <span className={cn(prefixVariants({ variant }))}>
          {prefix === " " ? "\u00A0" : prefix}
        </span>
        <span className="flex-1">{children}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants };
