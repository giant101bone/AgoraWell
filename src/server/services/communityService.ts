import * as repo from "@/server/repos/communityRepo"
import {prisma} from "@/lib/prisma"

export async function createCommunityWithOwnerAdmin(
  payload: { name: string; slug: string; description?: string; visibility: any; tags: string[] }, 
  userId: string
) {
  const { name, slug, description, visibility, tags } = payload

  // We write directly to prisma.community.create and use nested relational writes ('connectOrCreate' or 'create')
  return await prisma.community.create({
    data: {
      name,
      slug,
      description,
      visibility,
      tags,
      createdById: userId,
      // 🔽 This single block creates the community AND the admin membership simultaneously! 🔽
      members: {
        create: {
          userId: userId,
          role: "ADMIN" // Matches your Prisma Enum schema perfectly
        }
      }
    }
  })
}

export async function joinCommunity(communityId: string, userId: string) {
  const existing = await repo.getMembership(communityId, userId)
  if (existing) {
    throw new Error("You are already a registered member of this community.")
  }
  return await repo.addMember({ communityId, userId, role: "MEMBER" })
}

export async function leaveCommunity(communityId: string, userId: string) {
  const membership = await repo.getMembership(communityId, userId)
  if (!membership) {
    throw new Error("No active membership found to terminate.")
  }

  if (membership.role === "ADMIN") {
    const adminCount = await repo.countCommunityAdmins(communityId)
    if (adminCount <= 1) {
      throw new Error("Security Guardrail: As the last remaining ADMIN, you cannot leave this community space.")
    }
  }

  return await repo.removeMember(communityId, userId)
}