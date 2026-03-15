import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const cardVariants = tv({
  base: "w-full border border-border bg-card p-5",
  variants: {
    variant: {
      default: "",
      critical: "border-l-2 border-l-accent-red",
      warning: "border-l-2 border-l-accent-amber",
      good: "border-l-2 border-l-accent-green",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  status?: "critical" | "warning" | "good" | "default";
  statusLabel?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, status, statusLabel, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant: status || variant, className }))}
        {...props}
      >
        {statusLabel && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                status === "critical" && "bg-accent-red",
                status === "warning" && "bg-accent-amber",
                status === "good" && "bg-accent-green",
              )}
            />
            <span
              className={cn(
                "font-jetbrains text-[12px]",
                status === "critical" && "text-accent-red",
                status === "warning" && "text-accent-amber",
                status === "good" && "text-accent-green",
              )}
            >
              {statusLabel}
            </span>
          </div>
        )}
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, cardVariants };
