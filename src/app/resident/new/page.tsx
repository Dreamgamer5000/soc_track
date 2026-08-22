"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wrench,
  Zap,
  Building,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PhotoUploadDropzone } from "@/components/PhotoUploadDropzone";

const categories = [
  { id: "PLUMBING", label: "Plumbing", icon: Wrench, desc: "Leaks, taps, drainage, water supply" },
  { id: "ELECTRICAL", label: "Electrical", icon: Zap, desc: "Power outage, switches, common lights" },
  { id: "LIFT", label: "Lift & Elevator", icon: Building, desc: "Breakdown, buttons, sounds, fan" },
  { id: "SECURITY", label: "Security & Gate", desc: "Boom barrier, CCTV, intercom, guards", icon: ShieldAlert },
  { id: "CLEANING", label: "Cleaning & Waste", desc: "Garbage collection, corridor sweeping", icon: Sparkles },
  { id: "GENERAL", label: "General Facility", desc: "Clubhouse, gym, garden, parking", icon: HelpCircle },
];

export default function NewComplaintPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("PLUMBING");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please provide a title and detailed description.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category: selectedCategory,
          description,
          photoUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit complaint");
      }

      router.push(`/resident/complaints/${data.complaint.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while creating complaint");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Navbar currentUser={null} />

      <div className="max-w-2xl mx-auto w-full py-6 px-4">
        {/* Back Link */}
        <Link
          href="/resident"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-warm-muted hover:text-warm-dark mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>

        <Card className="shadow-warm-lg border-warm-border">
          <CardHeader className="pb-3 border-b border-warm-border/60">
            <CardTitle className="text-xl sm:text-2xl">
              Raise Maintenance Complaint
            </CardTitle>
            <CardDescription>
              Submit issue details. The facility management team will be notified immediately.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-5 p-3.5 bg-warm-crimson-light border border-warm-crimson-border rounded-xl text-warm-crimson-text text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Picker Cards */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-warm-dark tracking-wide">
                  Select Issue Category <span className="text-warm-crimson">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1.5 ${
                          isSelected
                            ? "border-warm-primary bg-warm-primary/10 ring-2 ring-warm-primary/30"
                            : "border-warm-border bg-white hover:bg-warm-surface"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-warm-primary text-white"
                              : "bg-warm-surface text-warm-dark"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-warm-dark">
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-warm-muted line-clamp-1">
                          {cat.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <Input
                label="Complaint Title / Brief Subject"
                required
                placeholder="e.g. Master bathroom tap dripping constantly"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="block text-xs md:text-sm font-semibold text-warm-dark tracking-wide">
                  Detailed Description <span className="text-warm-crimson">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe the issue location, urgency, and any specific times technician can visit..."
                  className="w-full p-4 rounded-xl border border-warm-border bg-white text-warm-dark text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary transition-all leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Supporting Photo Upload */}
              <PhotoUploadDropzone onPhotoUploaded={(url) => setPhotoUrl(url)} />

              {/* Action Buttons */}
              <div className="pt-4 border-t border-warm-border/80 flex items-center justify-end gap-3">
                <Link href="/resident">
                  <Button type="button" variant="outline" size="md">
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  size="md"
                  className="font-bold shadow-warm"
                  isLoading={isLoading}
                >
                  <Send className="w-4 h-4" />
                  Submit Complaint
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
