import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { sendImportantNoticeEmail } from "@/lib/email";

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: [{ isImportant: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ notices });
  } catch (error) {
    console.error("Fetch notices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { title, content, isImportant } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isImportant: Boolean(isImportant),
        authorId: user.id,
      },
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
    });

    // If marked as Important/Pinned, send email broadcast to all residents
    if (notice.isImportant) {
      try {
        const residents = await prisma.user.findMany({
          where: { role: "RESIDENT" },
          select: { email: true, name: true },
        });

        for (const resident of residents) {
          await sendImportantNoticeEmail({
            recipientEmail: resident.email,
            residentName: resident.name,
            noticeTitle: notice.title,
            noticeContent: notice.content,
          });
        }
      } catch (broadcastErr) {
        console.warn("Notice broadcast warning:", broadcastErr);
      }
    }

    return NextResponse.json({
      success: true,
      notice,
    });
  } catch (error) {
    console.error("Create notice error:", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}
