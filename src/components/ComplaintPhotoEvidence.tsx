"use client";

import React, { useState } from "react";
import { ZoomIn, Image as ImageIcon } from "lucide-react";
import { ImageModal } from "./ImageModal";

interface ComplaintPhotoEvidenceProps {
  photoUrl: string;
  title?: string;
}

export function ComplaintPhotoEvidence({
  photoUrl,
  title = "Complaint Photo Evidence",
}: ComplaintPhotoEvidenceProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-warm-muted mb-2 flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5 text-warm-primary" /> Attached Photo Evidence
      </h4>

      <div
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer rounded-2xl overflow-hidden border border-warm-border max-w-md bg-warm-surface shadow-xs hover:border-warm-primary transition-all duration-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt="Complaint photo"
          className="w-full h-auto object-cover max-h-80 group-hover:scale-[1.02] transition-transform duration-200"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
          <ZoomIn className="w-5 h-5" /> Click to enlarge / view full screen
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 text-xs font-bold text-warm-primary hover:underline inline-flex items-center gap-1"
      >
        <ZoomIn className="w-3.5 h-3.5" /> View High Resolution Image
      </button>

      <ImageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        imageUrl={photoUrl}
        title={title}
      />
    </div>
  );
}
