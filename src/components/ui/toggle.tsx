import { type ReactNode, forwardRef } from "react";
import * as TogglePrimitive from "@base-ui/react/toggle";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const toggleVariants = tv({
  base: "group inline-flex items-center gap-3 cursor-pointer",
  variants: {
    variant: {
      default: "",
      outline:
        "border border-border px-3 py-1.5 text-text-secondary hover:text-foreground hover:border-foreground transition-colors",
    },
    size: {
      default: "",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const trackVariants = tv({
  base: "relative h-[22px] w-[40px] rounded-[11px] p-[3px] transition-colors",
  variants: {
    checked: {
      true: "bg-accent-green",
      false: "bg-border",
    },
  },
});

const knobVariants = tv({
  base: "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
  variants: {
    checked: {
      true: "translate-x-[18px]",
      false: "translate-x-0",
    },
  },
});

const labelVariants = tv({
  base: "font-[500] text-[12px] font-jetbrains transition-colors",
  variants: {
    checked: {
      true: "text-accent-green",
      false: "text-text-secondary",
    },
  },
});

export interface ToggleProps extends VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      variant,
      size,
      pressed,
      children,
      onPressedChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <TogglePrimitive.Toggle
        ref={ref}
        pressed={pressed}
        disabled={disabled}
        onPressedChange={onPressedChange}
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
      >
        <div className={trackVariants({ checked: pressed })}>
          <div className={knobVariants({ checked: pressed })} />
        </div>
        {children && (
          <span className={labelVariants({ checked: pressed })}>
            {children}
          </span>
        )}
      </TogglePrimitive.Toggle>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
