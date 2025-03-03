"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import {  CirclePlay, ImageIcon, Loader2Icon, Play, PlayIcon, SendIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import GifPicker from "./GifPicker";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl && !gifUrl) return;

    setIsPosting(true);
    try {
      // If we have a GIF, include it in the post content as a URL
      const finalContent = gifUrl ? `${content} ${gifUrl}` : content;
      
      const result = await createPost(finalContent, imageUrl);
      if (result?.success) {
        // reset the form
        setContent("");
        setImageUrl("");
        setGifUrl("");
        setShowImageUpload(false);
        setShowGifPicker(false);

        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleGifSelect = (url: string) => {
    setGifUrl(url);
    setShowGifPicker(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {gifUrl && (
            <div className="relative">
              <img 
                src={gifUrl} 
                alt="Selected GIF" 
                className="rounded-md max-h-[200px] object-contain"
              />
              <button
                onClick={() => setGifUrl("")}
                className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-sm border"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {showGifPicker && (
            <div className="h-[400px]">
              <GifPicker 
                onGifSelect={handleGifSelect} 
                onClose={() => setShowGifPicker(false)}
              />
            </div>
          )}

          {(showImageUpload || imageUrl) && !gifUrl && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              {!gifUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isPosting || showGifPicker}
                >
                  <ImageIcon className="size-4 mr-2" />
                  Photo
                </Button>
              )}
              
              {!imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => setShowGifPicker(!showGifPicker)}
                  disabled={isPosting || showImageUpload}
                >
                  <CirclePlay className="size-4 mr-2" />
                  GIF
                </Button>
              )}
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl && !gifUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default CreatePost;