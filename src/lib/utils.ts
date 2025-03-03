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

// Extract Tenor GIF ID from various Tenor URL formats
export function getTenorGifId(url: string): string | null {
  if (!url) return null;
  
  // Match formats like tenor.com/view/... or tenor.com/fr/view/... with gif-ID at the end
  const viewRegex = /tenor\.com(?:\/\w+)?\/view\/[\w-]+-gif-(\d+)/;
  let match = url.match(viewRegex);
  if (match?.[1]) return match[1];
  
  // Match formats like tenor.com/bXYZ1.gif
  const shortRegex = /tenor\.com\/(\w+)\.gif/;
  match = url.match(shortRegex);
  if (match?.[1]) return match[1];
  
  // Match media.tenor.com URLs which contain the ID in path
  const mediaRegex = /media\.tenor\.com\/[\w-]+\/(\w+)(?:-\w+)*\.gif/;
  match = url.match(mediaRegex);
  if (match?.[1]) return match[1];
  
  return null;
}
