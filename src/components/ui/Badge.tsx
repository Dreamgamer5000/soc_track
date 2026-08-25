import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "open" | "in_progress" | "resolved" | "overdue" | "low" | "medium" | "high" | "neutral" | "gold";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    open: "bg-warm-amber-light text-warm-amber-text border-warm-amber-border",
    in_progress: "bg-warm-indigo-light text-warm-indigo-text border-warm-indigo-border",
    resolved: "bg-warm-sage-light text-warm-sage-text border-warm-sage-border",
    overdue: "bg-warm-crimson-light text-warm-crimson-text border-warm-crimson-border font-bold animate-pulse",
    low: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/80 dark:text-stone-300 dark:border-stone-700/60",
    medium: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/35",
    high: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/35 font-semibold",
    neutral: "bg-warm-surface text-warm-dark border-warm-border",
    gold: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-[#FFCC00] dark:border-amber-400/40 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
