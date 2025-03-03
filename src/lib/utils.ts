import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extract YouTube video ID from various YouTube URL formats
export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;

  const regex = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\s?]+)/;
  const match = url.match(regex);
  
  return match?.[1] || null;
}
