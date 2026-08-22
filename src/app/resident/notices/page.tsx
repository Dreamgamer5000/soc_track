import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bell, Pin, Inbox } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { NoticeCard } from "@/components/NoticeCard";

export default async function ResidentNoticeBoardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const notices = await prisma.notice.findMany({
    include: {
      author: {
        select: { name: true, role: true },
      },
    },
    orderBy: [
      { isImportant: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={user} />

      <div className="max-w-4xl mx-auto w-full py-6 px-4 space-y-6">
        <Link
          href="/resident"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-warm-muted hover:text-warm-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
              Community Notice Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-warm-muted mt-1 font-medium">
            Important announcements, maintenance schedules, and society circulars.
          </p>
        </div>

        {/* Notice List */}
        <div className="space-y-4 pt-2">
          {notices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-warm-border p-12 text-center space-y-2">
              <Inbox className="w-8 h-8 text-warm-muted mx-auto" />
              <h3 className="text-base font-bold text-warm-dark">
                No Notices Posted
              </h3>
              <p className="text-xs text-warm-muted">
                The society administration hasn't posted any circulars yet.
              </p>
            </div>
          ) : (
            notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
