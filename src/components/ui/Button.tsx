import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl select-none";

    const variantStyles = {
      primary:
        "bg-warm-primary text-white hover:bg-warm-primary-hover focus:ring-warm-primary shadow-sm hover:shadow-warm",
      secondary:
        "bg-warm-surface text-warm-dark hover:bg-warm-border/50 focus:ring-warm-muted border border-warm-border",
      outline:
        "border-2 border-warm-border bg-transparent text-warm-dark hover:bg-warm-surface hover:border-warm-muted/40 focus:ring-warm-primary",
      ghost:
        "bg-transparent text-warm-dark hover:bg-warm-surface hover:text-warm-primary focus:ring-warm-primary",
      danger:
        "bg-warm-crimson text-white hover:bg-red-700 focus:ring-warm-crimson shadow-sm",
      amber:
        "bg-warm-amber text-white hover:bg-amber-600 focus:ring-warm-amber shadow-sm",
    };

    const sizeStyles = {
      sm: "min-h-[38px] px-3.5 text-xs gap-1.5",
      md: "min-h-[48px] px-5 text-sm gap-2", // 48px meets Fitts's Law touch targets
      lg: "min-h-[54px] px-6 text-base gap-2.5 font-semibold",
      icon: "min-h-[44px] min-w-[44px] p-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
