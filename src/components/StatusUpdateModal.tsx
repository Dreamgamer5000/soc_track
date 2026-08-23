"use client";

import React, { useState } from "react";
import { X, CheckCircle, Clock, AlertTriangle, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";

interface StatusUpdateModalProps {
  complaint: {
    id: string;
    title: string;
    status: string;
    priority: string;
    resident?: {
      name: string;
      flatNumber?: string | null;
      towerBlock?: string | null;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StatusUpdateModal({
  complaint,
  isOpen,
  onClose,
  onSuccess,
}: StatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState(complaint?.status || "OPEN");
  const [newPriority, setNewPriority] = useState(complaint?.priority || "LOW");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status);
      setNewPriority(complaint.priority);
      setNote("");
      setError(null);
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          priority: newPriority,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update complaint status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl border border-warm-border shadow-warm-lg max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-warm-border flex items-start justify-between bg-warm-bg">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-warm-primary" />
              <h3 className="text-lg font-bold text-warm-dark">
                Update Complaint Workflow
              </h3>
            </div>
            <p className="text-xs text-warm-muted mt-1">
              {complaint.resident?.towerBlock || "Tower B"} • Flat{" "}
              {complaint.resident?.flatNumber || "N/A"} ({complaint.resident?.name})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-warm-muted hover:text-warm-dark hover:bg-warm-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-warm-crimson-light border border-warm-crimson-border rounded-xl text-warm-crimson-text text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-warm-surface border border-warm-border text-xs">
            <span className="font-bold text-warm-muted uppercase tracking-wider block text-[10px]">
              Complaint Title
            </span>
            <span className="font-bold text-warm-dark text-sm mt-0.5 block">
              {complaint.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Update Status"
              options={[
                { label: "🟢 Open", value: "OPEN" },
                { label: "🔵 In Progress", value: "IN_PROGRESS" },
                { label: "✅ Resolved (Closed)", value: "RESOLVED" },
              ]}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />

            <Select
              label="Set Priority Level"
              options={[
                { label: "Low Priority", value: "LOW" },
                { label: "Medium Priority", value: "MEDIUM" },
                { label: "🔥 High Priority", value: "HIGH" },
              ]}
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-warm-dark tracking-wide">
              Technician / Admin Action Note <span className="text-warm-muted font-normal">(Sent in resident email & audit log)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Electrician scheduled for 3:00 PM today. Valve replaced and tested."
              className="w-full p-3.5 rounded-xl border border-warm-border bg-white text-warm-dark text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {newStatus === "RESOLVED" && (
            <div className="p-3 rounded-xl bg-warm-sage-light border border-warm-sage-border text-warm-sage-text text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>
                Marking this complaint as <strong>Resolved</strong> will permanently close it and record completion timestamp.
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-warm-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              className="font-bold"
              isLoading={isLoading}
            >
              Save & Record Log
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
