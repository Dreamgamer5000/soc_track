import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Wrench,
  Zap,
  Building,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isOverdue, formatDate, formatTimeAgo, calculateDaysOpen } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Timeline } from "@/components/Timeline";
import { ComplaintPhotoEvidence } from "@/components/ComplaintPhotoEvidence";

const categoryIcons: Record<string, { icon: React.ElementType; label: string }> = {
  PLUMBING: { icon: Wrench, label: "Plumbing" },
  ELECTRICAL: { icon: Zap, label: "Electrical" },
  LIFT: { icon: Building, label: "Lift & Elevator" },
  SECURITY: { icon: ShieldAlert, label: "Security & Gate" },
  CLEANING: { icon: Sparkles, label: "Cleaning & Waste" },
  GENERAL: { icon: HelpCircle, label: "General Facility" },
};

export default async function ResidentComplaintDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const config = await prisma.appConfig.findUnique({
    where: { key: "overdue_threshold_days" },
  });
  const thresholdDays = config ? parseInt(config.value, 10) : 3;

  const complaint = await prisma.complaint.findUnique({
    where: { id: params.id },
    include: {
      resident: true,
      history: {
        include: {
          actor: {
            select: { name: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!complaint) {
    notFound();
  }

  // Security check
  if (user.role === "RESIDENT" && complaint.residentId !== user.id) {
    redirect("/resident");
  }

  const overdue = isOverdue(complaint.createdAt, complaint.status, thresholdDays);
  const daysOpen = calculateDaysOpen(complaint.createdAt);
  const cat = categoryIcons[complaint.category] || categoryIcons.GENERAL;
  const CategoryIcon = cat.icon;

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={user} />

      <div className="max-w-4xl mx-auto w-full py-6 px-4 space-y-6">
        {/* Back Link */}
        <Link
          href="/resident"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-warm-muted hover:text-warm-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>

        {/* Complaint Main Overview Card */}
        <Card
          className={`shadow-warm-lg ${
            overdue && complaint.status !== "RESOLVED"
              ? "border-red-400/80 bg-red-500/5 dark:bg-red-950/20"
              : "bg-warm-card"
          }`}
        >
          <CardHeader className="pb-4 border-b border-warm-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary shrink-0">
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
              <ComplaintPhotoEvidence
                photoUrl={complaint.photoUrl}
                title={`Evidence for ${complaint.title}`}
              />
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
          <CardHeader className="pb-3 border-b border-warm-border/60">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-warm-primary" />
              Status Audit History Timeline
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <Timeline items={complaint.history} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
