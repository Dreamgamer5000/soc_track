import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { isOverdue } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    // Fetch dynamic overdue threshold
    const config = await prisma.appConfig.findUnique({
      where: { key: "overdue_threshold_days" },
    });
    const thresholdDays = config ? parseInt(config.value, 10) : 3;

    // Filter building
    const where: any = {};

    if (user.role === "RESIDENT") {
      where.residentId = user.id;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        resident: {
          select: {
            id: true,
            name: true,
            email: true,
            flatNumber: true,
            towerBlock: true,
            phone: true,
          },
        },
        history: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Augment with isOverdue calculation
    const augmented = complaints.map((c) => {
      const overdue = isOverdue(c.createdAt, c.status, thresholdDays);
      return {
        ...c,
        isOverdue: overdue,
        thresholdDays,
      };
    });

    // If Admin, sort overdue complaints to top
    if (user.role === "ADMIN") {
      augmented.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return NextResponse.json({
      complaints: augmented,
      thresholdDays,
    });
  } catch (error) {
    console.error("Fetch complaints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, category, description, photoUrl } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Atomic creation of complaint and initial history log
    const complaint = await prisma.$transaction(async (tx) => {
      const newComplaint = await tx.complaint.create({
        data: {
          title: title.trim(),
          category: category || "GENERAL",
          description: description.trim(),
          photoUrl: photoUrl || null,
          status: "OPEN",
          priority: "LOW",
          residentId: user.id,
        },
      });

      await tx.complaintHistory.create({
        data: {
          complaintId: newComplaint.id,
          status: "OPEN",
          priority: "LOW",
          note: "Complaint submitted by resident.",
          actorId: user.id,
        },
      });

      return newComplaint;
    });

    return NextResponse.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    return NextResponse.json(
      { error: "Failed to create complaint" },
      { status: 500 }
    );
  }
}
