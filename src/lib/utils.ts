import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  return `${diffInDays} days ago`;
}

export function calculateDaysOpen(createdAt: string | Date): number {
  const created = new Date(createdAt).getTime();
  const now = new Date().getTime();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

export function isOverdue(
  createdAt: string | Date,
  status: string,
  thresholdDays: number = 3
): boolean {
  if (status === "RESOLVED") return false;
  const days = calculateDaysOpen(createdAt);
  return days >= thresholdDays;
}
