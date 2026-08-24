import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isOverdue } from "@/lib/utils";

export async function GET() {
  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: "overdue_threshold_days" },
    });
    const thresholdDays = config ? parseInt(config.value, 10) : 3;

    const [allComplaints, totalResidents, totalNotices] = await Promise.all([
      prisma.complaint.findMany({
        select: {
          id: true,
          status: true,
          category: true,
          priority: true,
          createdAt: true,
          resolvedAt: true,
        },
      }),
      prisma.user.count({ where: { role: "RESIDENT" } }),
      prisma.notice.count(),
    ]);

    const totalComplaints = allComplaints.length;
    const openCount = allComplaints.filter((c) => c.status === "OPEN").length;
    const inProgressCount = allComplaints.filter((c) => c.status === "IN_PROGRESS").length;
    const resolvedCount = allComplaints.filter((c) => c.status === "RESOLVED").length;

    const overdueComplaints = allComplaints.filter(
      (c) => isOverdue(c.createdAt, c.status, thresholdDays)
    );
    const overdueCount = overdueComplaints.length;

    // Category breakdown
    const categories = ["PLUMBING", "ELECTRICAL", "LIFT", "SECURITY", "CLEANING", "GENERAL"];
    const categoryStats = categories.map((cat) => {
      const matching = allComplaints.filter((c) => c.category === cat);
      const resolved = matching.filter((c) => c.status === "RESOLVED").length;
      return {
        category: cat,
        total: matching.length,
        open: matching.filter((c) => c.status !== "RESOLVED").length,
        resolved,
        percentage: totalComplaints > 0 ? Math.round((matching.length / totalComplaints) * 100) : 0,
      };
    });

    // Priority breakdown
    const highPriorityOpen = allComplaints.filter(
      (c) => c.priority === "HIGH" && c.status !== "RESOLVED"
    ).length;

    return NextResponse.json({
      totalComplaints,
      openCount,
      inProgressCount,
      resolvedCount,
      overdueCount,
      highPriorityOpen,
      totalResidents,
      totalNotices,
      thresholdDays,
      categoryStats,
      resolutionRate:
        totalComplaints > 0
          ? Math.round((resolvedCount / totalComplaints) * 100)
          : 0,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
