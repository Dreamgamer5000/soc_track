import React from "react";
import { Wrench, Zap, Building, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

interface CategoryStat {
  category: string;
  total: number;
  open: number;
  resolved: number;
  percentage: number;
}

const categoryLabels: Record<
  string,
  { label: string; icon: React.ElementType; color: string; barColor: string }
> = {
  PLUMBING: { label: "Plumbing", icon: Wrench, color: "text-blue-600 bg-blue-50", barColor: "bg-blue-500" },
  ELECTRICAL: { label: "Electrical", icon: Zap, color: "text-amber-600 bg-amber-50", barColor: "bg-amber-500" },
  LIFT: { label: "Lift & Elevator", icon: Building, color: "text-purple-600 bg-purple-50", barColor: "bg-purple-500" },
  SECURITY: { label: "Security & Gate", icon: ShieldAlert, color: "text-red-600 bg-red-50", barColor: "bg-red-500" },
  CLEANING: { label: "Cleaning & Waste", icon: Sparkles, color: "text-emerald-600 bg-emerald-50", barColor: "bg-emerald-500" },
  GENERAL: { label: "General Facility", icon: HelpCircle, color: "text-stone-600 bg-stone-50", barColor: "bg-stone-500" },
};

export function CategoryBreakdown({ stats }: { stats: CategoryStat[] }) {
  return (
    <div className="space-y-4">
      {stats.map((item) => {
        const meta = categoryLabels[item.category] || categoryLabels.GENERAL;
        const Icon = meta.icon;

        return (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-warm-dark">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${meta.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{meta.label}</span>
              </div>
              <div className="flex items-center gap-2 text-warm-muted font-semibold">
                <span>{item.open} open</span>
                <span>•</span>
                <span>{item.total} total ({item.percentage}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-warm-surface overflow-hidden border border-warm-border/60 flex">
              <div
                className={`h-full ${meta.barColor} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
