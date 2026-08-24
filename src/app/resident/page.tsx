import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Bell,
  Filter,
  Sparkles,
  Inbox,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isOverdue } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NoticeCard } from "@/components/NoticeCard";

export default async function ResidentDashboard({
  searchParams,
}: {
  searchParams: { category?: string; status?: string };
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  // Fetch overdue config
  const config = await prisma.appConfig.findUnique({
    where: { key: "overdue_threshold_days" },
  });
  const thresholdDays = config ? parseInt(config.value, 10) : 3;

  // Build filter query
  const where: any = { residentId: user.id };

  if (searchParams.category && searchParams.category !== "ALL") {
    where.category = searchParams.category;
  }

  if (searchParams.status && searchParams.status !== "ALL") {
    where.status = searchParams.status;
  }

  const [complaints, pinnedNotice, totalCount, openCount, resolvedCount] =
    await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          resident: true,
          history: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.notice.findFirst({
        where: { isImportant: true },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.complaint.count({ where: { residentId: user.id } }),
      prisma.complaint.count({
        where: { residentId: user.id, status: { not: "RESOLVED" } },
      }),
      prisma.complaint.count({
        where: { residentId: user.id, status: "RESOLVED" },
      }),
    ]);

  const augmentedComplaints = complaints.map((c) => ({
    ...c,
    isOverdue: isOverdue(c.createdAt, c.status, thresholdDays),
  }));

  const categories = [
    { label: "All Categories", value: "ALL" },
    { label: "🚰 Plumbing", value: "PLUMBING" },
    { label: "⚡ Electrical", value: "ELECTRICAL" },
    { label: "🛗 Lift", value: "LIFT" },
    { label: "🛡️ Security", value: "SECURITY" },
    { label: "🧹 Cleaning", value: "CLEANING" },
    { label: "📌 General", value: "GENERAL" },
  ];

  const statuses = [
    { label: "All Statuses", value: "ALL" },
    { label: "Open", value: "OPEN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved", value: "RESOLVED" },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar currentUser={user} />

      {/* Top Welcome Banner */}
      <div className="py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
                Welcome, {user.name}
              </h1>
              <Badge variant="neutral" className="bg-warm-card border-warm-border">
                {user.towerBlock || "Tower B"} • Flat {user.flatNumber || "402"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-warm-muted mt-1 font-medium">
              Track your maintenance tickets and stay informed with society updates.
            </p>
          </div>

          <Link href="/resident/new">
            <Button size="md" className="font-bold shadow-warm">
              <PlusCircle className="w-4 h-4" />
              Raise New Complaint
            </Button>
          </Link>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="bg-warm-card p-4 rounded-2xl border border-warm-border shadow-xs flex flex-col justify-center">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
              Total Raised
            </span>
            <span className="text-2xl sm:text-3xl font-black text-warm-dark mt-1">
              {totalCount}
            </span>
          </div>

          <div className="bg-warm-card p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 shadow-xs flex flex-col justify-center">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> In Progress / Open
            </span>
            <span className="text-2xl sm:text-3xl font-black text-warm-dark mt-1">
              {openCount}
            </span>
          </div>

          <div className="bg-warm-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-xs flex flex-col justify-center">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
            </span>
            <span className="text-2xl sm:text-3xl font-black text-warm-dark mt-1">
              {resolvedCount}
            </span>
          </div>
        </div>

        {/* Pinned Important Notice Strip */}
        {pinnedNotice && (
          <div className="mt-6">
            <NoticeCard notice={pinnedNotice} />
          </div>
        )}

        {/* Filter Navigation */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-warm-dark tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-warm-primary" />
              My Complaints History ({augmentedComplaints.length})
            </h2>

            <Link
              href="/resident/notices"
              className="text-xs font-bold text-warm-primary hover:underline flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5" /> View Notice Board
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected =
                (searchParams.category || "ALL") === cat.value;
              return (
                <Link
                  key={cat.value}
                  href={`/resident?category=${cat.value}&status=${searchParams.status || "ALL"}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-warm-primary text-white border-warm-primary shadow-xs"
                      : "bg-warm-card text-warm-dark/80 hover:bg-warm-surface border-warm-border"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Complaints Feed */}
        <div className="mt-4 space-y-3.5">
          {augmentedComplaints.length === 0 ? (
            <div className="bg-warm-card rounded-2xl border border-warm-border p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-warm-surface border border-warm-border flex items-center justify-center text-warm-muted mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-warm-dark">
                No Complaints Found
              </h3>
              <p className="text-xs sm:text-sm text-warm-muted max-w-sm mx-auto">
                You haven't raised any maintenance complaints matching this filter.
              </p>
              <Link href="/resident/new">
                <Button size="sm" className="mt-2 font-bold">
                  <PlusCircle className="w-4 h-4" /> Raise Complaint
                </Button>
              </Link>
            </div>
          ) : (
            augmentedComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile Thumb Interaction (Fitts's Law) */}
      <Link
        href="/resident/new"
        className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-warm-primary text-white shadow-warm-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Raise Complaint"
      >
        <PlusCircle className="w-7 h-7" />
      </Link>
    </div>
  );
}
