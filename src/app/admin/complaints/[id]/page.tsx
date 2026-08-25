import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AdminComplaintDetailClient } from "@/components/AdminComplaintDetailClient";

export default async function AdminComplaintDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  return (
    <AdminComplaintDetailClient
      complaint={complaint}
      thresholdDays={thresholdDays}
      currentUser={user}
    />
  );
}
