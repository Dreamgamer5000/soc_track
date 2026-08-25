"use client";

import React, { useEffect } from "react";
import { X, ZoomIn, ExternalLink, Download } from "lucide-react";
import { Button } from "./ui/Button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
  title?: string;
}

export function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  altText = "Photo Evidence",
  title = "Attached Photo Evidence",
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-warm-card rounded-2xl overflow-hidden shadow-2xl border border-warm-border/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-warm-border/60 bg-warm-surface/80">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-warm-primary" />
            <h3 className="text-sm font-bold text-warm-dark">{title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-warm-muted hover:text-warm-dark hover:bg-warm-surface transition-colors"
              title="Open full image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={imageUrl}
              download
              className="p-1.5 rounded-lg text-warm-muted hover:text-warm-dark hover:bg-warm-surface transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-warm-muted hover:text-warm-dark hover:bg-warm-surface transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/90 min-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
