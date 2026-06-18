import React from "react";
import { Sparkles, X } from "lucide-react";
import { SiteSettings } from "../types";

interface AnnouncementBarProps {
  settings: SiteSettings;
  onClose?: () => void;
}

export default function AnnouncementBar({ settings, onClose }: AnnouncementBarProps) {
  if (!settings.isAnnouncementActive || !settings.announcementText) return null;

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-xs md:text-sm font-medium py-2 px-8 text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-sm">
      <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
      <span>{settings.announcementText}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
