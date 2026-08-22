"use client";

import React, { useState, useRef } from "react";
import { Camera, UploadCloud, X, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/Button";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string | null) => void;
  initialUrl?: string | null;
}

export function PhotoUploadDropzone({
  onPhotoUploaded,
  initialUrl = null,
}: PhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPhotoUrl(data.url);
      onPhotoUploaded(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setPhotoUrl(null);
    onPhotoUploaded(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs md:text-sm font-semibold text-warm-dark tracking-wide">
        Attach Supporting Photo <span className="text-warm-muted font-normal">(Optional)</span>
      </label>

      {photoUrl ? (
        <div className="relative rounded-2xl border-2 border-warm-sage/30 bg-warm-sage-light/20 p-3 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-warm-border relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Complaint photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-warm-sage-text">
                <Check className="w-4 h-4" /> Photo Attached Successfully
              </div>
              <p className="text-[11px] text-warm-muted mt-0.5">
                Ready to submit with your complaint
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-warm-crimson hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
            dragActive
              ? "border-warm-primary bg-warm-primary/5"
              : "border-warm-border hover:border-warm-primary/50 hover:bg-warm-surface/50 bg-white"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-2xl bg-warm-primary/10 border border-warm-primary/20 flex items-center justify-center text-warm-primary mb-3">
            {isUploading ? (
              <UploadCloud className="w-6 h-6 animate-pulse" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </div>

          <div className="text-sm font-bold text-warm-dark">
            {isUploading ? "Uploading photo..." : "Take a photo or tap to browse"}
          </div>

          <p className="text-xs text-warm-muted mt-1">
            Supports JPEG, PNG, WebP up to 5MB
          </p>

          {error && (
            <p className="text-xs font-semibold text-warm-crimson mt-2 animate-fade-in">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
