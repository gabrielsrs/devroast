import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const scoreRingVariants = tv({
  base: "relative inline-flex items-center justify-center",
  variants: {
    size: {
      default: "h-[180px] w-[180px]",
      sm: "h-[120px] w-[120px]",
      lg: "h-[240px] w-[240px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const scoreTextVariants = tv({
  base: "flex items-center font-jetbrains",
  variants: {
    size: {
      default: "text-[48px]",
      sm: "text-[32px]",
      lg: "text-[64px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ScoreRingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRingVariants> {
  score: number;
  maxScore?: number;
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, size, score, maxScore = 10, ...props }, ref) => {
    const percentage = Math.min(score / maxScore, 1);
    const dashArray = 2 * Math.PI * 45;
    const dashOffset = dashArray * (1 - percentage);

    const gradientId = `score-ring-gradient-${Math.random().toString(36).slice(2)}`;

    return (
      <div
        ref={ref}
        className={cn(scoreRingVariants({ size, className }))}
        {...props}
      >
        <svg
          className="absolute inset-0 -rotate-90"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="36%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col items-center justify-center">
          <span
            className={cn(
              scoreTextVariants({ size }),
              "font-[700] leading-none text-foreground",
            )}
          >
            {score.toFixed(1)}
          </span>
          <span className="text-[16px] leading-none text-text-tertiary">
            /{maxScore}
          </span>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing, scoreRingVariants };
