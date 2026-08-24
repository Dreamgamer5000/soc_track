"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Filter,
  Search,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Settings,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { StatusUpdateModal } from "@/components/StatusUpdateModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [thresholdDays, setThresholdDays] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/complaints?${params.toString()}`);
      const data = await res.json();
      if (data.complaints) {
        setComplaints(data.complaints);
        setThresholdDays(data.thresholdDays || 3);
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch current user info
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => {});

    fetchComplaints();
  }, [categoryFilter, statusFilter, priorityFilter]);

  const overdueCount = complaints.filter(
    (c) => c.isOverdue && c.status !== "RESOLVED"
  ).length;

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={currentUser} />

      <div className="max-w-7xl mx-auto w-full py-6 px-4 space-y-6">
        {/* Page Title & Overdue Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
                Society Complaint Queue
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-warm-muted mt-1 font-medium">
              Manage resident requests, assign priorities, record technician notes, and track resolution.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchComplaints}
              className="gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Feed
            </Button>
          </div>
        </div>

        {/* Overdue Warning Alert Box */}
        {overdueCount > 0 && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-warm-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-red-500">
                  {overdueCount} Overdue Complaint{overdueCount > 1 ? "s" : ""} Require Attention
                </h4>
                <p className="text-xs text-warm-muted mt-0.5">
                  Complaints open longer than <strong className="text-warm-dark">{thresholdDays} days</strong> have been automatically prioritized to the top.
                </p>
              </div>
            </div>

            <Badge variant="overdue" className="self-start sm:self-auto py-1 px-3">
              Top Priority Queue
            </Badge>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-warm-card p-4 sm:p-5 rounded-2xl border border-warm-border shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search complaint title / details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchComplaints()}
              />
            </div>

            {/* Category Filter */}
            <Select
              options={[
                { label: "All Categories", value: "ALL" },
                { label: "🚰 Plumbing", value: "PLUMBING" },
                { label: "⚡ Electrical", value: "ELECTRICAL" },
                { label: "🛗 Lift & Elevator", value: "LIFT" },
                { label: "🛡️ Security & Gate", value: "SECURITY" },
                { label: "🧹 Cleaning & Waste", value: "CLEANING" },
                { label: "📌 General Facility", value: "GENERAL" },
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />

            {/* Status Filter */}
            <Select
              options={[
                { label: "All Statuses", value: "ALL" },
                { label: "🟢 Open", value: "OPEN" },
                { label: "🔵 In Progress", value: "IN_PROGRESS" },
                { label: "✅ Resolved", value: "RESOLVED" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />

            {/* Priority Filter */}
            <Select
              options={[
                { label: "All Priorities", value: "ALL" },
                { label: "🔥 High Priority", value: "HIGH" },
                { label: "⚡ Medium Priority", value: "MEDIUM" },
                { label: "🟢 Low Priority", value: "LOW" },
              ]}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-3.5">
          {isLoading ? (
            <div className="text-center py-16 text-warm-muted text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-warm-primary" />
              Loading complaints queue...
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-warm-card rounded-2xl border border-warm-border p-12 text-center space-y-3 shadow-xs">
              <Inbox className="w-10 h-10 text-warm-muted mx-auto" />
              <h3 className="text-base font-bold text-warm-dark">
                No Complaints Match Filters
              </h3>
              <p className="text-xs text-warm-muted max-w-sm mx-auto">
                Try adjusting your search query, status, or category filter to view other tickets.
              </p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isAdminView={true}
                onStatusClick={() => {
                  setSelectedComplaint(complaint);
                  setModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Admin Status Update Modal */}
      <StatusUpdateModal
        complaint={selectedComplaint}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedComplaint(null);
        }}
        onSuccess={fetchComplaints}
      />
    </div>
  );
}
