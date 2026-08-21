import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = "text", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs md:text-sm font-semibold text-warm-dark tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full min-h-[48px] px-4 rounded-xl border border-warm-border bg-white text-warm-dark placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary transition-all duration-150 disabled:opacity-50 disabled:bg-stone-50",
            error && "border-warm-crimson focus:ring-warm-crimson/30 focus:border-warm-crimson",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-warm-crimson animate-fade-in">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-warm-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
