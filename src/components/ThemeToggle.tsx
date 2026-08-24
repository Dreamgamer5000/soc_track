"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-xl bg-warm-surface border border-warm-border ${className || ""}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-border/40 text-warm-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-primary/40 active:scale-95 flex items-center justify-center ${
        className || ""
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-warm-dark/80 animate-fade-in" />
      )}
    </button>
  );
}
