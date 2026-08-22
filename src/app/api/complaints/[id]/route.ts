import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { isOverdue } from "@/lib/utils";
import { sendComplaintStatusEmail } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
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
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // Resident can only view their own complaint
    if (user.role === "RESIDENT" && complaint.residentId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await prisma.appConfig.findUnique({
      where: { key: "overdue_threshold_days" },
    });
    const thresholdDays = config ? parseInt(config.value, 10) : 3;

    return NextResponse.json({
      complaint: {
        ...complaint,
        isOverdue: isOverdue(complaint.createdAt, complaint.status, thresholdDays),
      },
    });
  } catch (error) {
    console.error("Fetch complaint detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Admin can update status and priority
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can update complaint status" },
        { status: 403 }
      );
    }

    const { status, priority, note } = await request.json();

    const existingComplaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: { resident: true },
    });

    if (!existingComplaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    const targetStatus = status || existingComplaint.status;
    const targetPriority = priority || existingComplaint.priority;

    const updatedComplaint = await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id: params.id },
        data: {
          status: targetStatus,
          priority: targetPriority,
          resolvedAt: targetStatus === "RESOLVED" ? new Date() : null,
        },
        include: { resident: true },
      });

      await tx.complaintHistory.create({
        data: {
          complaintId: params.id,
          status: targetStatus,
          priority: targetPriority,
          note: note ? note.trim() : `Status updated to ${targetStatus} by ${user.name}`,
          actorId: user.id,
        },
      });

      return updated;
    });

    // Send email notification to the resident
    try {
      await sendComplaintStatusEmail({
        recipientEmail: existingComplaint.resident.email,
        residentName: existingComplaint.resident.name,
        complaintTitle: existingComplaint.title,
        oldStatus: existingComplaint.status,
        newStatus: targetStatus,
        note: note || "Status updated by maintenance facility admin.",
      });
    } catch (emailErr) {
      console.warn("Email dispatch note:", emailErr);
    }

    return NextResponse.json({
      success: true,
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
