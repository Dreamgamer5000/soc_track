"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  PlusCircle,
  Pin,
  Trash2,
  Calendar,
  ShieldCheck,
  RefreshCw,
  X,
  Send,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { NoticeCard } from "@/components/NoticeCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // New Notice form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.notices) setNotices(data.notices);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => {});

    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and announcement content.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, isImportant }),
      });

      if (!res.ok) {
        throw new Error("Failed to create notice");
      }

      setTitle("");
      setContent("");
      setIsImportant(true);
      setModalOpen(false);
      fetchNotices();
    } catch (err: any) {
      setError(err.message || "Failed to post notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to remove this notice?")) return;

    try {
      await fetch(`/api/notices/${id}`, { method: "DELETE" });
      fetchNotices();
    } catch (err) {
      console.error("Failed to delete notice:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={currentUser} />

      <div className="max-w-4xl mx-auto w-full py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
                Notice Board Manager
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-warm-muted mt-1 font-medium">
              Publish community circulars, pin important maintenance schedules, and broadcast email alerts.
            </p>
          </div>

          <Button
            size="md"
            onClick={() => setModalOpen(true)}
            className="font-bold shadow-warm gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Post New Notice
          </Button>
        </div>

        {/* Notices List */}
        <div className="space-y-4 pt-2">
          {isLoading ? (
            <div className="text-center py-16 text-warm-muted text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-warm-primary" />
              Loading notice board...
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-warm-card rounded-2xl border border-warm-border p-12 text-center space-y-3 shadow-xs">
              <Inbox className="w-10 h-10 text-warm-muted mx-auto" />
              <h3 className="text-base font-bold text-warm-dark">
                No Notices Active
              </h3>
              <p className="text-xs text-warm-muted max-w-sm mx-auto">
                Post announcements to keep residents updated on maintenance, schedules, and society circulars.
              </p>
              <Button
                size="sm"
                onClick={() => setModalOpen(true)}
                className="mt-2 font-bold"
              >
                <PlusCircle className="w-4 h-4" /> Post Notice
              </Button>
            </div>
          ) : (
            notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                isAdmin={true}
                onDelete={() => handleDeleteNotice(notice.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Post Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-warm-card rounded-3xl border border-warm-border shadow-warm-lg max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-warm-border flex items-center justify-between bg-warm-bg">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-warm-dark">
                  Publish Notice / Circular
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-warm-muted hover:text-warm-dark hover:bg-warm-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-5 sm:p-6 space-y-4">
              {error && (
                <div className="p-3 bg-warm-crimson-light border border-warm-crimson-border rounded-xl text-warm-crimson-text text-xs font-semibold">
                  {error}
                </div>
              )}

              <Input
                label="Notice Title / Headline"
                required
                placeholder="e.g. 🚰 Annual Water Tank Cleaning on Sunday"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-warm-dark tracking-wide">
                  Announcement Details <span className="text-warm-crimson">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter full notice text, affected towers, timing, and resident instructions..."
                  className="w-full p-3.5 rounded-xl border border-warm-border bg-warm-card text-warm-dark text-xs sm:text-sm placeholder:text-warm-muted/60 focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Pin Checkbox */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
                <div>
                  <span className="text-xs font-bold text-warm-dark flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Pin as Important Announcement
                  </span>
                  <span className="text-[11px] text-warm-muted block">
                    Pins this notice to top of the bulletin and triggers an email broadcast to all residents.
                  </span>
                </div>
              </label>

              <div className="pt-3 border-t border-warm-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  className="font-bold"
                  isLoading={isSubmitting}
                >
                  <Send className="w-4 h-4" /> Publish Notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
