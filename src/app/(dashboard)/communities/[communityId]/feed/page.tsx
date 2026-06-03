import {prisma} from "@/lib/prisma";
import CreatePostForm from "../../../../../components/community/CreatePostForm";
import PostCard from "../../../../../components/community/PostCard";
import { requireUserId } from "@/lib/auth/session"; // <-- Import your actual helper

export default async function CommunityFeedPage({
  params
}: {
  params: Promise<{ communityId: string }> 
}) {
  const { communityId: slugOrId } = await params; 

  // 1. Force the user to be logged in and extract their real user.id
  const currentUserId = await requireUserId();

  // 2. Resolve the community ID using the slug from the URL
  const community = await prisma.community.findFirst({
    where: {
      OR: [
        { id: slugOrId },
        { slug: slugOrId }
      ]
    },
    select: { id: true, name: true }
  });

  if (!community) {
    return <div className="text-center py-8 text-red-500">Community not found.</div>;
  }

  // 3. Fetch user's community role using their real session ID
  const membership = await prisma.communityMember.findUnique({
    where: { 
      userId_communityId: { 
        userId: currentUserId, 
        communityId: community.id 
      } 
    },
    select: { role: true }
  });

  const isModOrAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR";

  // 4. Fetch posts belonging to this community
  const posts = await prisma.communityPost.findMany({
    where: { communityId: community.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      _count: { select: { comments: true, likes: true } },
      likes: {
        where: { userId: currentUserId },
        select: { userId: true }
      },
      comments: {
      orderBy: { createdAt: "asc" }, // shows oldest comments first
      include: {
        author: { select: { name: true, image: true } }
      }
    }
    }
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{community.name} Feed</h1>
      
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <CreatePostForm communityId={community.id} />
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              communityId={community.id}
              currentUserId={currentUserId}
              isModOrAdmin={isModOrAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
}