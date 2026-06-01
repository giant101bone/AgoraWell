import {prisma} from "@/lib/prisma"

export const COMMUNITY_ROLE = {
  ADMIN: "ADMIN",
  MOD: "MOD",
  MEMBER: "MEMBER",
} as const

export type CommunityRole = keyof typeof COMMUNITY_ROLE

const ROLE_WEIGHTS: Record<CommunityRole, number> = {
  MEMBER: 1,
  MOD: 2,
  ADMIN: 3,
}

export async function getCommunityMemberRole(userId: string, communityId: string): Promise<CommunityRole | null> {
  const membership = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        communityId,
        userId,
      },
    },
    select: {
      role: true,
    },
  })
  
  return (membership?.role as CommunityRole) || null
}

export async function requireCommunityRole(userId: string, communityId: string, minRole: CommunityRole) {
  const currentRole = await getCommunityMemberRole(userId, communityId)
  
  if (!currentRole || ROLE_WEIGHTS[currentRole] < ROLE_WEIGHTS[minRole]) {
    throw new Error("Unauthorized: Insufficient localized community permissions.")
  }
  
  return true
}