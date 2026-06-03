"use client";

import { useState } from "react";
import { createPostAction } from "@/actions/post.actions";
import { UploadButton } from "@uploadthing/react"; // or wherever your UT helpers are generated
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

export default function CreatePostForm({ communityId }: { communityId: string }) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    setIsPending(true);
    try {
      await createPostAction({
        communityId,
        content,
        imageUrl, // Passes the uploaded URL string safely to Prisma
      });
      setContent("");
      setImageUrl(""); // Clear image container on success
    } catch (error) {
      alert("Failed to create post");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />

      {/* Preview container for the uploaded image */}
      {imageUrl && (
        <div className="relative w-full h-48 rounded-md overflow-hidden border">
          <Image src={imageUrl} alt="Upload preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
          >
            ✕ Remove
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Replace your static 'Image (4MB)' text with this active worker */}
        <UploadButton<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) setImageUrl(res[0].ufsUrl);
          }}
          onUploadError={(error: Error) => {
            alert(`Upload failed: ${error.message}`);
          }}
          appearance={{
            button:
            "bg-gray-400 text-white text-sm px-4 py-2 rounded-md border border-gray-500 hover:bg-gray-500 transition-all",
             allowedContent: "hidden",
          }}
          content={{
            button({ ready }) {
              if (ready) return "📸 Add Image (4MB)";
              return "Loading...";
            }
          }}
        />

        <button
          type="submit"
          disabled={isPending || (!content.trim() && !imageUrl)}
          className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}