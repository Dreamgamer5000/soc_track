"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  Wrench,
  Zap,
  Building,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  Edit3,
  ZoomIn,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/Button";
import { StatusUpdateModal } from "@/components/StatusUpdateModal";
import { ImageModal } from "@/components/ImageModal";
import { formatDate, formatTimeAgo, calculateDaysOpen, isOverdue } from "@/lib/utils";

const categoryIcons: Record<string, { icon: React.ElementType; label: string }> = {
  PLUMBING: { icon: Wrench, label: "Plumbing" },
  ELECTRICAL: { icon: Zap, label: "Electrical" },
  LIFT: { icon: Building, label: "Lift & Elevator" },
  SECURITY: { icon: ShieldAlert, label: "Security & Gate" },
  CLEANING: { icon: Sparkles, label: "Cleaning & Waste" },
  GENERAL: { icon: HelpCircle, label: "General Facility" },
};

interface AdminComplaintDetailClientProps {
  complaint: any;
  thresholdDays: number;
  currentUser: any;
}

export function AdminComplaintDetailClient({
  complaint,
  thresholdDays,
  currentUser,
}: AdminComplaintDetailClientProps) {
  const router = useRouter();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const overdue = isOverdue(complaint.createdAt, complaint.status, thresholdDays);
  const daysOpen = calculateDaysOpen(complaint.createdAt);
  const cat = categoryIcons[complaint.category] || categoryIcons.GENERAL;
  const CategoryIcon = cat.icon;

  const handleUpdateSuccess = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={currentUser} />

      <div className="max-w-5xl mx-auto w-full py-6 px-4 space-y-6">
        {/* Navigation & Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin/complaints"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-warm-muted hover:text-warm-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Complaints Queue
          </Link>

          <Button
            onClick={() => setIsStatusModalOpen(true)}
            className="font-bold gap-2 shadow-warm"
          >
            <Edit3 className="w-4 h-4" />
            Update Status / Notes
          </Button>
        </div>

        {/* Overdue Warning Alert */}
        {overdue && complaint.status !== "RESOLVED" && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-warm-dark flex items-center justify-between gap-3 shadow-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 dark:bg-[#FF4D4D] text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-red-500 dark:text-[#FF4D4D]">
                  Overdue Complaint (Open for {daysOpen} days)
                </h4>
                <p className="text-xs text-warm-muted mt-0.5">
                  This complaint exceeded the society resolution policy of {thresholdDays} days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Layout: Left Main Info, Right Resident Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              className={`shadow-warm-lg ${
                overdue && complaint.status !== "RESOLVED"
                  ? "border-red-400/80 bg-red-500/5 dark:bg-red-500/10 dark:border-red-500/40"
                  : "bg-warm-card"
              }`}
            >
              <CardHeader className="pb-4 border-b border-warm-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-warm-primary/15 border border-warm-primary/30 flex items-center justify-center text-warm-primary shrink-0">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-warm-muted uppercase tracking-wider block">
                        {cat.label} Issue
                      </span>
                      <span className="text-xs text-warm-muted flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" /> Filed on {formatDate(complaint.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={complaint.priority} />
                    <StatusBadge status={complaint.status} isOverdue={overdue} />
                  </div>
                </div>

                <CardTitle className="text-xl sm:text-2xl mt-4">
                  {complaint.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-5">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-warm-muted mb-1.5">
                    Issue Description
                  </h4>
                  <p className="text-sm text-warm-dark leading-relaxed whitespace-pre-line bg-warm-surface/60 p-4 rounded-xl border border-warm-border/60">
                    {complaint.description}
                  </p>
                </div>

                {/* Photo Attachment if present */}
                {complaint.photoUrl && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-warm-muted mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-warm-primary" /> Attached Photo Evidence
                    </h4>
                    
                    <div
                      onClick={() => setIsImageModalOpen(true)}
                      className="group relative cursor-pointer rounded-2xl overflow-hidden border border-warm-border max-w-md bg-warm-surface shadow-xs hover:border-warm-primary transition-all duration-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={complaint.photoUrl}
                        alt="Complaint photo"
                        className="w-full h-auto object-cover max-h-80 group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                        <ZoomIn className="w-5 h-5" /> Click to enlarge / view full screen
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="mt-2 text-xs font-bold text-warm-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5" /> View High Resolution Image
                    </button>
                  </div>
                )}

                {/* Resolved Banner */}
                {complaint.status === "RESOLVED" && (
                  <div className="p-4 rounded-2xl bg-warm-sage-light border border-warm-sage-border text-warm-sage-text flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-warm-sage shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <strong>This complaint has been marked as Resolved.</strong>
                      <div className="text-xs text-warm-sage-text/80 mt-0.5">
                        Closed on {formatDate(complaint.resolvedAt)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit History Timeline Card */}
            <Card className="shadow-warm bg-warm-card">
              <CardHeader className="pb-3 border-b border-warm-border/60 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warm-primary" />
                  Status Audit History Timeline
                </CardTitle>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="text-xs gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Add Note
                </Button>
              </CardHeader>

              <CardContent className="pt-6">
                <Timeline items={complaint.history} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Resident Information Card & Management */}
          <div className="space-y-6">
            <Card className="shadow-warm bg-warm-card">
              <CardHeader className="pb-3 border-b border-warm-border/60">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-warm-primary" />
                  Resident Profile
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider block">
                    Resident Name
                  </span>
                  <span className="font-bold text-warm-dark text-sm mt-0.5 block">
                    {complaint.resident?.name || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-warm-surface border border-warm-border text-xs">
                  <Home className="w-4 h-4 text-warm-primary shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-warm-muted uppercase block">
                      Apartment
                    </span>
                    <span className="font-bold text-warm-dark">
                      {complaint.resident?.towerBlock || "Tower B"} • Flat {complaint.resident?.flatNumber || "N/A"}
                    </span>
                  </div>
                </div>

                {complaint.resident?.phone && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-warm-surface border border-warm-border text-xs">
                    <Phone className="w-4 h-4 text-warm-primary shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-warm-muted uppercase block">
                        Contact Number
                      </span>
                      <a
                        href={`tel:${complaint.resident.phone}`}
                        className="font-bold text-warm-dark hover:text-warm-primary transition-colors"
                      >
                        {complaint.resident.phone}
                      </a>
                    </div>
                  </div>
                )}

                {complaint.resident?.email && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-warm-surface border border-warm-border text-xs">
                    <Mail className="w-4 h-4 text-warm-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-warm-muted uppercase block">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${complaint.resident.email}`}
                        className="font-bold text-warm-dark hover:text-warm-primary transition-colors truncate block"
                      >
                        {complaint.resident.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="w-full font-bold text-xs gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Update Ticket Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Resolution Image Lightbox Modal */}
      {complaint.photoUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={complaint.photoUrl}
          title={`Evidence for ${complaint.title}`}
        />
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        complaint={complaint}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
