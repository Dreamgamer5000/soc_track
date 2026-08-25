"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Building,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Clock,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  User,
} from "lucide-react";
import { Card } from "./ui/Card";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { formatTimeAgo, formatDate, calculateDaysOpen } from "@/lib/utils";

import { ImageModal } from "./ImageModal";

const categoryIcons: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  PLUMBING: { icon: Wrench, label: "Plumbing", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  ELECTRICAL: { icon: Zap, label: "Electrical", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  LIFT: { icon: Building, label: "Lift & Elevator", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  SECURITY: { icon: ShieldAlert, label: "Security & Gate", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  CLEANING: { icon: Sparkles, label: "Cleaning & Waste", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  GENERAL: { icon: HelpCircle, label: "General Facility", color: "text-stone-500 bg-stone-500/10 border-stone-500/20" },
};

export interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    category: string;
    description: string;
    photoUrl?: string | null;
    status: string;
    priority: string;
    createdAt: string | Date;
    isOverdue?: boolean;
    resident?: {
      name: string;
      flatNumber?: string | null;
      towerBlock?: string | null;
    };
  };
  isAdminView?: boolean;
  onStatusClick?: () => void;
}

export function ComplaintCard({
  complaint,
  isAdminView = false,
  onStatusClick,
}: ComplaintCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const cat = categoryIcons[complaint.category] || categoryIcons.GENERAL;
  const CategoryIcon = cat.icon;
  const daysOpen = calculateDaysOpen(complaint.createdAt);

  const detailHref = isAdminView
    ? `/admin/complaints/${complaint.id}`
    : `/resident/complaints/${complaint.id}`;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-warm-lg hover:border-warm-primary/40 ${
        complaint.isOverdue && complaint.status !== "RESOLVED"
          ? "border-red-400/80 bg-red-500/5 dark:bg-red-950/20"
          : "bg-warm-card"
      }`}
    >
      {/* Overdue Top Banner Stripe */}
      {complaint.isOverdue && complaint.status !== "RESOLVED" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Icon & Title Area */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${cat.color} mt-0.5`}
          >
            <CategoryIcon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-warm-muted uppercase tracking-wider">
                {cat.label}
              </span>

              {isAdminView && complaint.resident && (
                <span className="text-xs font-semibold text-warm-dark bg-warm-surface px-2 py-0.5 rounded-md border border-warm-border">
                  {complaint.resident.towerBlock || "Tower B"} • Flat {complaint.resident.flatNumber || "N/A"}
                </span>
              )}

              <span className="text-xs text-warm-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatTimeAgo(complaint.createdAt)}
              </span>
            </div>

            <Link href={detailHref} className="block group-hover:text-warm-primary transition-colors">
              <h4 className="text-base sm:text-lg font-bold text-warm-dark leading-snug break-words">
                {complaint.title}
              </h4>
            </Link>

            <p className="text-xs sm:text-sm text-warm-muted line-clamp-2 leading-relaxed">
              {complaint.description}
            </p>

            {/* Resident details for admin */}
            {isAdminView && complaint.resident && (
              <div className="text-xs text-warm-muted flex items-center gap-1.5 pt-1">
                <User className="w-3.5 h-3.5 text-warm-muted" />
                <span>Raised by <strong className="text-warm-dark">{complaint.resident.name}</strong></span>
                {complaint.isOverdue && complaint.status !== "RESOLVED" && (
                  <span className="text-red-500 font-bold ml-1">
                    (Open for {daysOpen} days)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Status & Actions Area */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-warm-border/60">
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge
              status={complaint.status}
              isOverdue={complaint.isOverdue}
            />
          </div>

          <div className="flex items-center gap-2">
            {complaint.photoUrl && (
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="w-8 h-8 rounded-lg overflow-hidden border border-warm-border shrink-0 bg-warm-surface hover:ring-2 hover:ring-warm-primary transition-all cursor-zoom-in"
                title="Click to view photo evidence"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={complaint.photoUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            )}

            {isAdminView && onStatusClick ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={detailHref}
                  className="text-xs font-bold text-warm-dark hover:text-warm-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-warm-surface"
                >
                  Details
                </Link>
                <button
                  type="button"
                  onClick={onStatusClick}
                  className="text-xs font-bold text-warm-primary bg-warm-primary/10 hover:bg-warm-primary hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Update Status
                </button>
              </div>
            ) : (
              <Link
                href={detailHref}
                className="inline-flex items-center gap-1 text-xs font-bold text-warm-dark hover:text-warm-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-warm-surface"
              >
                View Details & History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {complaint.photoUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={complaint.photoUrl}
          title={`Photo Evidence: ${complaint.title}`}
        />
      )}
    </Card>
  );
}
