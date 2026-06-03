"use server"

import { revalidatePath } from "next/cache";
import {prisma} from "@/lib/prisma";
import { requireUserId } from "@/lib/auth/session"; // <-- Clean import here

export async function createPostAction(data: {
  communityId: string;
  content: string;
  imageUrl?: string;
}) {
  // Pulls real verified user ID from database session strategy
  const userId = await requireUserId();

  // 1. Resolve community ID safely
  const community = await prisma.community.findFirst({
    where: {
      OR: [
        { id: data.communityId },
        { slug: data.communityId }
      ]
    },
    select: { id: true, slug: true }
  });

  if (!community) throw new Error("Community not found");

  // 2. Verify membership matching this real user ID
  const membership = await prisma.communityMember.findUnique({
    where: { 
      userId_communityId: { 
        userId: userId, 
        communityId: community.id 
      } 
    }
  });
  
  if (!membership) throw new Error("Must be a member to post");

  // 3. Create the post
  await prisma.communityPost.create({
    data: {
      communityId: community.id,
      authorId: userId,
      content: data.content,
      imageUrl: data.imageUrl,
    }
  });

  revalidatePath(`/communities/${community.slug}/feed`);
}

export async function deletePostAction(postId: string, communityId: string) {
  const userId = await requireUserId();

  const [post, membership] = await Promise.all([
    prisma.communityPost.findUnique({ where: { id: postId } }),
    prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: userId, communityId } }
    })
  ]);

  if (!post) throw new Error("Post not found");

  const isAuthor = post.authorId === userId;
  const isModOrAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR";
  
  if (!isAuthor && !isModOrAdmin) {
    throw new Error("Unauthorized to delete this post");
  }

  await prisma.communityPost.delete({ where: { id: postId } });

  if (!isAuthor && isModOrAdmin) {
    await prisma.auditLog.create({
      data: {
        action: "POST_DELETED",
        entityType: "POST",
        actorId: userId,
        entityId: postId,
        metadata: {
          communityId,
          details: `Deleted post by user ${post.authorId}`
        }
      }
    });
  }

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { slug: true }
  });

  revalidatePath(`/communities/${community?.slug || communityId}/feed`);
}

export async function likePostAction(postId: string) {
  const userId = await requireUserId();
  
  try {
    await prisma.postLike.create({
      data: { postId, userId }
    });
  } catch (error) {
    await prisma.postLike.delete({
      where: { postId_userId: { postId, userId } }
    });
  }
}

export async function commentPostAction(postId: string, content: string) {
  const userId = await requireUserId();
  
  await prisma.postComment.create({
    data: {
      postId,
      authorId: userId,
      content
    }
  });
}

export async function deleteCommentAction(commentId: string, communityId: string) {
  const userId = await requireUserId()

  try {
    // 1. Fetch the comment to verify ownership or role
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
    })

    if (!comment) throw new Error("Comment not found")

    // 2. Check if user is a Mod/Admin in this community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: { userId, communityId }
      }
    })

    const isModOrAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR"
    const isAuthor = comment.authorId === userId

    // 3. Ensure authorization
    if (!isAuthor && !isModOrAdmin) {
      throw new Error("Unauthorized to delete this comment")
    }

    // 4. Delete the comment
    await prisma.postComment.delete({
      where: { id: commentId }
    })

    // 5. Refresh the feed page
    revalidatePath(`/communities/${communityId}`)
  } catch (error) {
    console.error("Failed to delete comment:", error)
    throw new Error("Failed to delete comment")
  }
}