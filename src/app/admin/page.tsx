import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bell,
  Users,
  Settings,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Flame,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isOverdue } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/resident");
  }

  const config = await prisma.appConfig.findUnique({
    where: { key: "overdue_threshold_days" },
  });
  const thresholdDays = config ? parseInt(config.value, 10) : 3;

  const [allComplaints, residentsCount, noticesCount, recentComplaints] =
    await Promise.all([
      prisma.complaint.findMany({
        include: {
          resident: true,
          history: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: { role: "RESIDENT" } }),
      prisma.notice.count(),
      prisma.complaint.findMany({
        take: 4,
        include: {
          resident: true,
          history: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const total = allComplaints.length;
  const openCount = allComplaints.filter((c) => c.status === "OPEN").length;
  const inProgressCount = allComplaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolvedCount = allComplaints.filter((c) => c.status === "RESOLVED").length;

  const overdueComplaints = allComplaints.filter((c) =>
    isOverdue(c.createdAt, c.status, thresholdDays)
  );
  const overdueCount = overdueComplaints.length;

  const categories = [
    "PLUMBING",
    "ELECTRICAL",
    "LIFT",
    "SECURITY",
    "CLEANING",
    "GENERAL",
  ];
  const categoryStats = categories.map((cat) => {
    const matching = allComplaints.filter((c) => c.category === cat);
    const resolved = matching.filter((c) => c.status === "RESOLVED").length;
    return {
      category: cat,
      total: matching.length,
      open: matching.filter((c) => c.status !== "RESOLVED").length,
      resolved,
      percentage: total > 0 ? Math.round((matching.length / total) * 100) : 0,
    };
  });

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={user} />

      <div className="max-w-7xl mx-auto w-full py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
                Facility Admin Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-warm-muted mt-1 font-medium">
              Real-time maintenance metrics, complaint volume, and society operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/admin/notices">
              <Button variant="outline" size="sm" className="font-bold">
                <Bell className="w-4 h-4" /> Post Notice
              </Button>
            </Link>

            <Link href="/admin/complaints">
              <Button size="sm" className="font-bold shadow-warm">
                <ClipboardList className="w-4 h-4" /> View Queue
              </Button>
            </Link>
          </div>
        </div>

        {/* Overdue Urgent Alert Banner */}
        {overdueCount > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border border-red-200 text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black">
                  {overdueCount} Overdue Ticket{overdueCount > 1 ? "s" : ""} Exceeding {thresholdDays} Days Threshold
                </h3>
                <p className="text-xs sm:text-sm text-red-800 mt-0.5 font-medium">
                  These complaints have been prioritized to the top of the admin resolution queue.
                </p>
              </div>
            </div>

            <Link href="/admin/complaints?status=OPEN">
              <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white font-bold shrink-0">
                Review Overdue Queue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          <StatCard
            title="Total Complaints"
            value={total}
            subtitle={`${openCount + inProgressCount} pending repairs`}
            icon={ClipboardList}
            colorScheme="stone"
          />

          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Technician assigned"
            icon={Clock}
            colorScheme="indigo"
          />

          <StatCard
            title="Resolved / Closed"
            value={resolvedCount}
            subtitle={`${total > 0 ? Math.round((resolvedCount / total) * 100) : 0}% completion rate`}
            icon={CheckCircle2}
            colorScheme="sage"
          />

          <StatCard
            title="Overdue Count"
            value={overdueCount}
            subtitle={`Threshold: ${thresholdDays} days`}
            icon={AlertTriangle}
            colorScheme={overdueCount > 0 ? "crimson" : "sage"}
            badgeText={overdueCount > 0 ? "⚠️ Requires immediate review" : "✓ On schedule"}
          />
        </div>

        {/* Analytics Section: Category Breakdown + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Category Breakdown */}
          <Card className="lg:col-span-2 shadow-warm bg-white">
            <CardHeader className="pb-3 border-b border-warm-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-warm-primary" />
                  Complaints by Category
                </CardTitle>
                <span className="text-xs font-bold text-warm-muted">
                  Total {total} requests
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-5">
              <CategoryBreakdown stats={categoryStats} />
            </CardContent>
          </Card>

          {/* Right 1 Col: Society Information & Quick Access */}
          <div className="space-y-6">
            <Card className="shadow-warm bg-white">
              <CardHeader className="pb-3 border-b border-warm-border/60">
                <CardTitle className="text-base">Society Snapshot</CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-warm-surface border border-warm-border text-xs">
                  <span className="text-warm-muted font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-warm-primary" /> Registered Residents
                  </span>
                  <span className="font-black text-warm-dark text-sm">{residentsCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-warm-surface border border-warm-border text-xs">
                  <span className="text-warm-muted font-bold flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-700" /> Active Notices
                  </span>
                  <span className="font-black text-warm-dark text-sm">{noticesCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-warm-surface border border-warm-border text-xs">
                  <span className="text-warm-muted font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-warm-primary" /> Overdue Policy
                  </span>
                  <span className="font-black text-warm-dark text-sm">{thresholdDays} Days</span>
                </div>

                <Link href="/admin/settings" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs gap-1.5">
                    <Settings className="w-3.5 h-3.5" /> Adjust Overdue Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Complaints Queue Preview */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-warm-dark tracking-tight">
              Recent Complaints
            </h2>

            <Link
              href="/admin/complaints"
              className="text-xs font-bold text-warm-primary hover:underline flex items-center gap-1"
            >
              View Full Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recentComplaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={{
                  ...c,
                  isOverdue: isOverdue(c.createdAt, c.status, thresholdDays),
                }}
                isAdminView={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
