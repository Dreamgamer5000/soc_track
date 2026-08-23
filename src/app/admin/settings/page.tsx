"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Clock,
  Mail,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [thresholdDays, setThresholdDays] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => {});

    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => setThresholdDays(data.thresholdDays || 3))
      .catch(() => {});
  }, []);

  const handleSaveThreshold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thresholdDays: Number(thresholdDays) }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update config:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={currentUser} />

      <div className="max-w-4xl mx-auto w-full py-6 px-4 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
              Platform & Facility Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-warm-muted mt-1 font-medium">
            Configure overdue calculation parameters, notification rules, and society policies.
          </p>
        </div>

        {/* Overdue Configuration Card */}
        <Card className="shadow-warm bg-white">
          <CardHeader className="pb-3 border-b border-warm-border/60">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-warm-primary" />
              Overdue Complaint Detection Threshold
            </CardTitle>
            <CardDescription>
              Specify how many days an unresolved complaint can remain open before it is automatically flagged as Overdue and moved to the top of the queue.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            <form onSubmit={handleSaveThreshold} className="space-y-4 max-w-md">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label="Overdue Threshold (Days)"
                    type="number"
                    min={1}
                    max={60}
                    required
                    value={thresholdDays}
                    onChange={(e) => setThresholdDays(Number(e.target.value))}
                    helperText="Default: 3 days. Any open ticket older than this number will be highlighted in red."
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  isLoading={isSaving}
                  className="font-bold shrink-0 mb-1"
                >
                  <Check className="w-4 h-4" />
                  Save Setting
                </Button>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-warm-sage-light border border-warm-sage-border rounded-xl text-warm-sage-text text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-warm-sage" />
                  Overdue threshold updated to {thresholdDays} days successfully!
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Notification Integration Info Card */}
        <Card className="shadow-warm bg-white">
          <CardHeader className="pb-3 border-b border-warm-border/60">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-warm-primary" />
              Email Dispatch & Notification Delivery
            </CardTitle>
            <CardDescription>
              Automatic email triggers for complaint status updates and pinned notice broadcasts.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-3 text-xs sm:text-sm text-warm-dark/90 leading-relaxed">
            <p>
              The system operates in <strong>Dual-Mode Notification</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-warm-muted">
              <li>
                <strong className="text-warm-dark">Live SMTP Mode:</strong> Configured via <code className="bg-warm-surface px-1.5 py-0.5 rounded border border-warm-border text-warm-dark">SMTP_HOST</code>, <code className="bg-warm-surface px-1.5 py-0.5 rounded border border-warm-border text-warm-dark">SMTP_USER</code>, and <code className="bg-warm-surface px-1.5 py-0.5 rounded border border-warm-border text-warm-dark">SMTP_PASS</code> in your <code className="bg-warm-surface px-1.5 py-0.5 rounded border border-warm-border text-warm-dark">.env</code> file (compatible with Gmail, Resend, SendGrid, Ethereal).
              </li>
              <li>
                <strong className="text-warm-dark">Safe Dev Simulation Mode:</strong> When SMTP credentials are not present, emails are safely logged to the server console and previewed without throwing errors.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
