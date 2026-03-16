import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-jetbrains",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      needs_serious_help: "text-accent-red",
      needs_improvement: "text-accent-amber",
      needs_work: "text-accent-amber",
      decent_code: "text-accent-green",
    },
    size: {
      default: "text-[12px]",
      sm: "text-[10px]",
      lg: "text-[14px]",
    },
  },
  defaultVariants: {
    variant: "critical",
    size: "default",
  },
});

const dotVariants = tv({
  base: "rounded-full",
  variants: {
    variant: {
      critical: "bg-accent-red",
      warning: "bg-accent-amber",
      good: "bg-accent-green",
      needs_serious_help: "bg-accent-red",
      needs_improvement: "bg-accent-amber",
      needs_work: "bg-accent-amber",
      decent_code: "bg-accent-green",
    },
    size: {
      default: "h-2 w-2",
      sm: "h-1.5 w-1.5",
      lg: "h-2.5 w-2.5",
    },
  },
  defaultVariants: {
    variant: "critical",
    size: "default",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, showDot = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {showDot && <span className={dotVariants({ variant, size })} />}
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
