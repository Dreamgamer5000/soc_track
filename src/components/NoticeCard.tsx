import React from "react";
import { Pin, Calendar, User, ShieldCheck } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export interface NoticeCardProps {
  notice: {
    id: string;
    title: string;
    content: string;
    isImportant: boolean;
    createdAt: string | Date;
    author?: {
      name: string;
      role: string;
    };
  };
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function NoticeCard({ notice, onDelete, isAdmin = false }: NoticeCardProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${
        notice.isImportant
          ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20 shadow-warm"
          : "bg-warm-card"
      }`}
    >
      {notice.isImportant && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
      )}

      <div className="space-y-3">
        {/* Header Badges & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {notice.isImportant ? (
              <Badge variant="gold" className="text-xs font-bold py-1 px-2.5">
                <Pin className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                PINNED IMPORTANT
              </Badge>
            ) : (
              <Badge variant="neutral" className="text-xs font-semibold py-1 px-2.5">
                General Announcement
              </Badge>
            )}
          </div>

          <span
            className="text-xs text-warm-muted flex items-center gap-1 font-medium"
            title={formatDate(notice.createdAt)}
          >
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(notice.createdAt)} ({formatTimeAgo(notice.createdAt)})
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-warm-dark leading-snug">
          {notice.title}
        </h3>

        {/* Content */}
        <p className="text-xs sm:text-sm text-warm-dark/90 leading-relaxed whitespace-pre-line">
          {notice.content}
        </p>

        {/* Author Footer */}
        <div className="pt-2 border-t border-warm-border/60 flex items-center justify-between text-xs text-warm-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Posted by{" "}
              <strong className="text-warm-dark">
                {notice.author?.name || "Society Administrator"}
              </strong>
            </span>
          </div>

          {isAdmin && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs font-semibold text-warm-crimson hover:underline"
            >
              Delete Notice
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
