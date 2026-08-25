import React from "react";
import { Card } from "./ui/Card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  colorScheme?: "warm" | "amber" | "sage" | "indigo" | "crimson" | "stone";
  badgeText?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = "warm",
  badgeText,
  onClick,
}: StatCardProps) {
  const schemeStyles = {
    warm: {
      card: "border-warm-border hover:border-warm-primary/50 bg-warm-card",
      iconBg: "bg-warm-primary/10 border-warm-primary/30 text-warm-primary",
      valText: "text-warm-dark",
    },
    amber: {
      card: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 hover:bg-amber-500/15",
      iconBg: "bg-amber-500/15 border-amber-500/40 text-amber-500 dark:text-[#FFCC00]",
      valText: "text-warm-dark",
    },
    sage: {
      card: "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/15",
      iconBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-500 dark:text-[#00E599]",
      valText: "text-warm-dark",
    },
    indigo: {
      card: "border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 hover:bg-indigo-500/15",
      iconBg: "bg-indigo-500/15 border-indigo-500/40 text-indigo-500 dark:text-[#8A7CFF]",
      valText: "text-warm-dark",
    },
    crimson: {
      card: "border-red-500/30 bg-red-500/5 dark:bg-red-500/10 hover:bg-red-500/15",
      iconBg: "bg-red-500/15 border-red-500/40 text-red-500 dark:text-[#FF4D4D]",
      valText: "text-warm-dark",
    },
    stone: {
      card: "border-warm-border bg-warm-card hover:bg-warm-surface",
      iconBg: "bg-warm-surface border-warm-border text-warm-dark",
      valText: "text-warm-dark",
    },
  };

  const scheme = schemeStyles[colorScheme] || schemeStyles.warm;

  return (
    <Card
      className={cn(
        "p-5 rounded-2xl shadow-xs transition-all duration-200",
        scheme.card,
        onClick && "cursor-pointer active:scale-98"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-warm-muted uppercase tracking-wider block">
            {title}
          </span>
          <div className={cn("text-2xl sm:text-3xl font-black mt-1 tracking-tight", scheme.valText)}>
            {value}
          </div>
          {subtitle && (
            <span className="text-[11px] text-warm-muted mt-1 block font-medium">
              {subtitle}
            </span>
          )}
        </div>

        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0", scheme.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {badgeText && (
        <div className="mt-3 pt-2.5 border-t border-warm-border/40 text-[11px] font-bold text-warm-muted flex items-center justify-between">
          <span>{badgeText}</span>
        </div>
      )}
    </Card>
  );
}
