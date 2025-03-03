"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
  onClose: () => void;
}

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || "YOUR_GIPHY_API_KEY";

export default function GifPicker({ onGifSelect, onClose }: GifPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [trendingGifs, setTrendingGifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    fetchTrendingGifs();
  }, []);

  const fetchTrendingGifs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
      );
      const data = await response.json();
      setTrendingGifs(data.data);
    } catch (error) {
      console.error("Error fetching trending GIFs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchGifs = async (term: string) => {
    if (!term.trim()) {
      setGifs([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          term
        )}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.error("Error searching GIFs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchGifs(searchTerm);
  };

  const handleGifSelect = (gif: any) => {
    onGifSelect(gif.images.fixed_height.url);
    onClose();
  };

  const displayGifs = searchTerm ? gifs : trendingGifs;

  return (
    <div className="flex flex-col h-full border rounded-md bg-background">
      <div className="p-3 border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            ref={searchInputRef}
            placeholder="Search GIFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div className="p-2">
        <p className="text-sm font-medium text-muted-foreground">
          {searchTerm ? "Search Results" : "Trending GIFs"}
        </p>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : displayGifs.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 p-2">
            {displayGifs.map((gif) => (
              <button
                key={gif.id}
                className="overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                onClick={() => handleGifSelect(gif)}
              >
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            {searchTerm ? "No GIFs found" : "Failed to load trending GIFs"}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-2 border-t text-xs text-center text-muted-foreground">
        Powered by GIPHY
      </div>
    </div>
  );
}