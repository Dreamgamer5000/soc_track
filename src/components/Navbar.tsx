"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ThemeToggle } from "./ThemeToggle";
import type { SessionUser } from "@/lib/auth";

export function Navbar({ currentUser }: { currentUser: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isAdmin = currentUser?.role === "ADMIN";

  const residentNavLinks = [
    { href: "/resident", label: "My Complaints", icon: ClipboardList },
    { href: "/resident/notices", label: "Notice Board", icon: Bell },
  ];

  const adminNavLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "All Complaints", icon: ClipboardList },
    { href: "/admin/notices", label: "Notice Board", icon: Bell },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const navLinks = isAdmin ? adminNavLinks : residentNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-warm-card/90 backdrop-blur-md border-b border-warm-border shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Society Name */}
          <div className="flex items-center gap-3">
            <Link
              href={currentUser ? (isAdmin ? "/admin" : "/resident") : "/"}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary group-hover:bg-warm-primary group-hover:text-white transition-all duration-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black text-warm-dark tracking-tight leading-tight block">
                  Greenview Heights
                </span>
                <span className="text-[11px] font-medium text-warm-muted block tracking-wide">
                  Society Maintenance Tracker
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1.5 bg-warm-surface p-1 rounded-xl border border-warm-border">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-warm-card text-warm-primary shadow-xs border border-warm-border/50 font-bold"
                        : "text-warm-dark/80 hover:text-warm-dark hover:bg-warm-card/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle Button */}
            <ThemeToggle />

            {currentUser ? (
              <>
                {/* Raise Complaint Action (for residents) */}
                {!isAdmin && (
                  <Link href="/resident/new">
                    <Button
                      size="sm"
                      className="hidden sm:inline-flex bg-warm-primary text-white shadow-xs hover:shadow-warm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Raise Complaint
                    </Button>
                  </Link>
                )}

                {/* User Info Badge */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-warm-border">
                  <div className="text-right">
                    <div className="text-xs font-bold text-warm-dark flex items-center justify-end gap-1.5">
                      {currentUser.name}
                      {isAdmin ? (
                        <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                          <ShieldCheck className="w-3 h-3 text-amber-500" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="neutral" className="text-[10px] px-1.5 py-0 bg-warm-surface font-bold">
                          {currentUser.towerBlock || "Tower B"} • {currentUser.flatNumber || "402"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-warm-muted block">
                      {currentUser.email}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    isLoading={isLoggingOut}
                    title="Sign out"
                    className="text-warm-muted hover:text-warm-crimson"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2.5 rounded-xl border border-warm-border bg-warm-surface text-warm-dark"
                  aria-label="Toggle Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Resident Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {currentUser && mobileMenuOpen && (
          <div className="md:hidden border-t border-warm-border py-4 space-y-3 animate-fade-in">
            {/* User Details Box */}
            <div className="bg-warm-surface rounded-xl p-3 border border-warm-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-warm-primary/10 flex items-center justify-center text-warm-primary">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-warm-dark">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-warm-muted">
                    {isAdmin ? "Society Administrator" : `${currentUser.towerBlock || "Tower B"} - Flat ${currentUser.flatNumber || "402"}`}
                  </div>
                </div>
              </div>
              <Badge variant={isAdmin ? "gold" : "neutral"} className="text-[10px]">
                {currentUser.role}
              </Badge>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-warm-primary text-white shadow-xs"
                        : "text-warm-dark hover:bg-warm-surface"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}

              {!isAdmin && (
                <Link
                  href="/resident/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-warm-primary text-white shadow-sm mt-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  Raise New Complaint
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-warm-crimson hover:bg-red-500/10 transition-colors w-full text-left mt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
