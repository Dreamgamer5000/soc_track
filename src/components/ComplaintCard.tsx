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

const categoryIcons: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  PLUMBING: { icon: Wrench, label: "Plumbing", color: "text-blue-600 bg-blue-50 border-blue-200" },
  ELECTRICAL: { icon: Zap, label: "Electrical", color: "text-amber-600 bg-amber-50 border-amber-200" },
  LIFT: { icon: Building, label: "Lift & Elevator", color: "text-purple-600 bg-purple-50 border-purple-200" },
  SECURITY: { icon: ShieldAlert, label: "Security & Gate", color: "text-red-600 bg-red-50 border-red-200" },
  CLEANING: { icon: Sparkles, label: "Cleaning & Waste", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  GENERAL: { icon: HelpCircle, label: "General Facility", color: "text-stone-600 bg-stone-50 border-stone-200" },
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
  const cat = categoryIcons[complaint.category] || categoryIcons.GENERAL;
  const CategoryIcon = cat.icon;
  const daysOpen = calculateDaysOpen(complaint.createdAt);

  const detailHref = isAdminView
    ? `/admin/complaints`
    : `/resident/complaints/${complaint.id}`;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-warm-lg hover:border-warm-primary/40 ${
        complaint.isOverdue && complaint.status !== "RESOLVED"
          ? "border-red-300 bg-gradient-to-br from-white via-white to-red-50/30"
          : "bg-white"
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
                <span className="text-xs font-semibold text-warm-dark bg-warm-surface px-2 py-0.5 rounded-md border border-warm-border/80">
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
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Raised by <strong className="text-warm-dark">{complaint.resident.name}</strong></span>
                {complaint.isOverdue && complaint.status !== "RESOLVED" && (
                  <span className="text-red-600 font-bold ml-1">
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
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-warm-border shrink-0 bg-stone-100" title="Photo attached">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={complaint.photoUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {isAdminView && onStatusClick ? (
              <button
                type="button"
                onClick={onStatusClick}
                className="text-xs font-bold text-warm-primary bg-warm-primary/10 hover:bg-warm-primary hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Update Status
              </button>
            ) : (
              <Link
                href={detailHref}
                className="inline-flex items-center gap-1 text-xs font-bold text-warm-dark hover:text-warm-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-warm-surface"
              >
                View History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
