import React from "react";
import { Clock, User, ShieldCheck, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  status: string;
  priority?: string | null;
  note?: string | null;
  createdAt: string | Date;
  actor: {
    name: string;
    role: string;
  };
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-warm-muted text-xs">
        No status history recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-warm-border">
      {items.map((item, index) => {
        const isAdmin = item.actor.role === "ADMIN";
        const isFirst = index === 0;

        return (
          <div key={item.id} className="relative group">
            {/* Timeline Dot Indicator */}
            <div
              className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-warm-card flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                item.status === "RESOLVED"
                  ? "bg-warm-sage text-white"
                  : item.status === "IN_PROGRESS"
                  ? "bg-warm-indigo text-white"
                  : "bg-warm-amber text-white"
              }`}
            >
              {item.status === "RESOLVED" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
            </div>

            {/* Event Box */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isFirst
                  ? "bg-warm-card border-warm-border shadow-xs"
                  : "bg-warm-surface/60 border-warm-border/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Status & Priority Badge */}
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {item.priority && <PriorityBadge priority={item.priority} />}
                </div>

                {/* Date / Time */}
                <span className="text-xs text-warm-muted font-medium" title={formatDate(item.createdAt)}>
                  {formatDate(item.createdAt)} ({formatTimeAgo(item.createdAt)})
                </span>
              </div>

              {/* Actor Header */}
              <div className="mt-2.5 flex items-center gap-2 text-xs text-warm-muted">
                <div className="w-5 h-5 rounded-full bg-warm-surface border border-warm-border flex items-center justify-center text-warm-dark">
                  {isAdmin ? (
                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                  ) : (
                    <User className="w-3 h-3 text-stone-500" />
                  )}
                </div>
                <span>
                  Updated by{" "}
                  <strong className="text-warm-dark font-semibold">
                    {item.actor.name}
                  </strong>{" "}
                  ({isAdmin ? "Society Admin" : "Resident"})
                </span>
              </div>

              {/* Note Content */}
              {item.note && (
                <div className="mt-3 p-3 rounded-xl bg-warm-bg border border-warm-border/80 text-xs text-warm-dark leading-relaxed flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-warm-primary shrink-0 mt-0.5" />
                  <span className="italic font-medium">"{item.note}"</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
