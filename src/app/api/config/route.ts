import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: "overdue_threshold_days" },
    });
    return NextResponse.json({
      thresholdDays: config ? parseInt(config.value, 10) : 3,
    });
  } catch (error) {
    console.error("Config fetch error:", error);
    return NextResponse.json({ thresholdDays: 3 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { thresholdDays } = await request.json();

    if (!thresholdDays || thresholdDays < 1 || thresholdDays > 60) {
      return NextResponse.json(
        { error: "Threshold must be between 1 and 60 days" },
        { status: 400 }
      );
    }

    const updated = await prisma.appConfig.upsert({
      where: { key: "overdue_threshold_days" },
      update: { value: thresholdDays.toString() },
      create: { key: "overdue_threshold_days", value: thresholdDays.toString() },
    });

    return NextResponse.json({
      success: true,
      thresholdDays: parseInt(updated.value, 10),
    });
  } catch (error) {
    console.error("Config update error:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
