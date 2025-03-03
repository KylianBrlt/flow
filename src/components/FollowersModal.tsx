"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import FollowButton from "./FollowButton";

type User = {
  id: string;
  name: string;
  username: string;
  image: string | null;
};

interface FollowersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  initialTab?: "followers" | "following";
}

export default function FollowersModal({
  open,
  onOpenChange,
  userId,
  followersCount,
  followingCount,
  isOwnProfile,
  initialTab = "followers",
}: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab);

  useEffect(() => {
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      const fetchFollows = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/users/${userId}/follows?type=${activeTab}`);
          if (!res.ok) throw new Error("Failed to fetch followers");
          const data = await res.json();
          
          if (activeTab === "followers") {
            setFollowers(data);
          } else {
            setFollowing(data);
          }
        } catch (error) {
          console.error("Error fetching follows:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFollows();
    }
  }, [userId, activeTab, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isOwnProfile ? "Your" : "User's"} Network
          </DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="followers" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "followers" | "following")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="followers">
              Followers ({followersCount})
            </TabsTrigger>
            <TabsTrigger value="following">
              Following ({followingCount})
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[60vh] mt-4 pr-4">
            <TabsContent value="followers" className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))
              ) : followers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No followers yet
                </div>
              ) : (
                followers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                    <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={user.image ?? "/avatar.png"} />
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))
              ) : following.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Not following anyone yet
                </div>
              ) : (
                following.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                    <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={user.image ?? "/avatar.png"} />
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}