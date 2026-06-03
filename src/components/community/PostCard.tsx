"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Trash2, Send } from "lucide-react";
import { likePostAction, deletePostAction, commentPostAction , deleteCommentAction } from "@/actions/post.actions";

type PostProps = {
  post: any; // Ideally, define a strict Prisma type here
  communityId: string;
  currentUserId: string;
  isModOrAdmin: boolean;
};

export default function PostCard({ post, communityId, currentUserId, isModOrAdmin }: PostProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [hasLiked, setHasLiked] = useState(post.likes?.some((l: any) => l.userId === currentUserId));
  
  // New state management for managing comments UI expansion and text input
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const isAuthor = post.authorId === currentUserId;
  const canDelete = isAuthor || isModOrAdmin;

  const handleLike = () => {
    // Optimistic UI update
    setOptimisticLikes(hasLiked ? optimisticLikes - 1 : optimisticLikes + 1);
    setHasLiked(!hasLiked);
    
    startTransition(async () => {
      await likePostAction(post.id);
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    startTransition(async () => {
      await deletePostAction(post.id, communityId);
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsCommenting(true);
    try {
      await commentPostAction(post.id, commentText);
      setCommentText(""); // Reset input box upon completion
    } catch (err) {
      alert("Could not post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  // UI Trigger handler for comment deletions
  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await deleteCommentAction(commentId, communityId);
    } catch (err) {
      alert("Could not delete comment");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="font-semibold">{post.author.name}</div>
          <div className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        {canDelete && (
          <button 
            onClick={handleDelete} 
            disabled={isPending}
            className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {post.imageUrl && (
        <div className="relative w-full h-[400px] bg-gray-50 border border-gray-100 rounded-md overflow-hidden mb-4 flex items-center justify-center">
          <Image 
            src={post.imageUrl} 
              alt="Post attachment" 
              fill
              // FIX 1: Tell Next.js the max width of this image container (max-w-2xl is ~672px)
              sizes="(max-width: 672px) 100vw, 672px"
      
      // FIX 2: Change object-cover to object-contain so portrait images show 100% of their content
              className="object-contain"
      
      // OPTIONAL: If it's the very first post on the feed, load it immediately
              priority={post.isFirstPost || false} 
    />
        </div>
      )}

      <div className="flex gap-6 text-sm text-gray-600 border-t pt-3">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-red-500' : 'hover:text-red-500'}`}
        >
          <Heart size={18} fill={hasLiked ? "currentColor" : "none"} /> 
          {optimisticLikes}
        </button>

        {/* Updated comment button to toggle comment layout visibility */}
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 transition-colors hover:text-blue-600 ${showComments ? 'text-blue-600 font-medium' : ''}`}
        >
          <MessageCircle size={18} /> 
          {post._count.comments}
        </button>
      </div>

      {/* Expandable Comment Tray */}
      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-4">
          
          {/* Loop over existing comments if fetched in your page query setup */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {post.comments.map((comment: any) => {
                // Determine if current user has permission to delete this specific comment
                const canDeleteComment = comment.authorId === currentUserId || isModOrAdmin;

                return (
                  <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100 group relative">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{comment.author?.name || "Anonymous"}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* ADDED: Dynamic Delete Comment Action UI */}
                      {canDeleteComment && (
                        <button 
                          onClick={() => handleCommentDelete(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5 md:opacity-0 group-hover:opacity-100"
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap pr-6">{comment.content}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comment Submission Bar */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              disabled={isCommenting}
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isCommenting || !commentText.trim()}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center aspect-square"
              title="Post comment"
            >
              <Send size={16} className={isCommenting ? "animate-pulse" : ""} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}