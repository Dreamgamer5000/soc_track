import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  Bell,
  Camera,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export default async function HomePage() {
  const currentUser = await getSessionUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12 md:py-20 px-4">
        <Badge variant="gold" className="mb-4 px-3.5 py-1 text-xs sm:text-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Next-Gen Apartment Society Facility Management
        </Badge>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-warm-dark tracking-tight max-w-4xl leading-[1.15]">
          Transparent, Fast & Reliable{" "}
          <span className="text-warm-primary underline decoration-warm-primary/30 decoration-wavy">
            Society Maintenance
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-warm-muted max-w-2xl font-medium leading-relaxed">
          Empowering apartment residents to raise complaints with photo evidence,
          track live repair history, access community notice boards, and receive
          instant updates.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md justify-center">
          {currentUser ? (
            <Link
              href={currentUser.role === "ADMIN" ? "/admin" : "/resident"}
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full font-bold shadow-warm-lg">
                Go to {currentUser.role === "ADMIN" ? "Admin Dashboard" : "My Complaints"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full font-bold shadow-warm">
                  Sign In & Review Demo
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full font-bold">
                  Resident Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl text-left">
          <div className="bg-warm-card p-5 sm:p-6 rounded-2xl border border-warm-border shadow-warm hover:border-warm-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-[#FFCC00] mb-3.5">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-warm-dark">Photo Evidence</h3>
            <p className="text-xs sm:text-sm text-warm-muted mt-1">
              Residents can attach photos to complaints for instant visual clarity on repairs.
            </p>
          </div>

          <div className="bg-warm-card p-5 sm:p-6 rounded-2xl border border-warm-border shadow-warm hover:border-warm-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-[#8A7CFF] mb-3.5">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-warm-dark">Status Audit Trail</h3>
            <p className="text-xs sm:text-sm text-warm-muted mt-1">
              Full chronological timeline of status changes, actor names, and technician notes.
            </p>
          </div>

          <div className="bg-warm-card p-5 sm:p-6 rounded-2xl border border-warm-border shadow-warm hover:border-warm-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 dark:text-[#FF4D4D] mb-3.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-warm-dark">Overdue Detection</h3>
            <p className="text-xs sm:text-sm text-warm-muted mt-1">
              Configurable threshold highlights overdue tickets at the top of the admin feed.
            </p>
          </div>

          <div className="bg-warm-card p-5 sm:p-6 rounded-2xl border border-warm-border shadow-warm hover:border-warm-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-[#00E599] mb-3.5">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-warm-dark">Pinned Notices</h3>
            <p className="text-xs sm:text-sm text-warm-muted mt-1">
              Society bulletins with pinned urgent notices and automated resident email alerts.
            </p>
          </div>
        </div>

        {/* About & Society Info Section */}
        <div className="mt-16 sm:mt-24 max-w-4xl w-full p-6 sm:p-8 rounded-3xl bg-warm-card border border-warm-border shadow-warm text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-warm-dark">About Greenview Heights Maintenance Platform</h3>
              <p className="text-xs text-warm-muted">Designed for residential communities & facilities</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-warm-muted leading-relaxed">
            Greenview Heights Society Maintenance Tracker is an open, modern apartment operations portal built with Next.js, Prisma, and SQLite. It provides complete transparency between residents, facility managers, and technicians with real-time audit trails, SLA overdue alerts, and verified photo uploads.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-warm-border/60 text-xs font-semibold text-warm-muted">
            <span>© 2026 Greenview Heights RWA. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a
                href="https://society.rejit.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-primary hover:underline font-bold"
              >
                society.rejit.in
              </a>
              <span>•</span>
              <a
                href="https://rejit.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-dark hover:text-warm-primary transition-colors font-bold"
              >
                rejit.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
