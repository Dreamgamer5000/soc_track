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
      card: "border-warm-border hover:border-warm-primary/40 bg-white",
      iconBg: "bg-warm-primary/10 border-warm-primary/20 text-warm-primary",
      valText: "text-warm-dark",
    },
    amber: {
      card: "border-amber-200 bg-amber-50/40 hover:bg-amber-50/70",
      iconBg: "bg-amber-100 border-amber-300 text-amber-800",
      valText: "text-amber-950",
    },
    sage: {
      card: "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70",
      iconBg: "bg-emerald-100 border-emerald-300 text-emerald-800",
      valText: "text-emerald-950",
    },
    indigo: {
      card: "border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70",
      iconBg: "bg-indigo-100 border-indigo-300 text-indigo-800",
      valText: "text-indigo-950",
    },
    crimson: {
      card: "border-red-200 bg-red-50/50 hover:bg-red-50/80",
      iconBg: "bg-red-100 border-red-300 text-red-800",
      valText: "text-red-950",
    },
    stone: {
      card: "border-stone-200 bg-stone-50/60 hover:bg-stone-100/60",
      iconBg: "bg-stone-200 border-stone-300 text-stone-700",
      valText: "text-stone-900",
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
