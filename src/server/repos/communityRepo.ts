import {prisma} from "@/lib/prisma"
import { CommunityRole } from "@prisma/client"

export async function createCommunity({ 
  name, 
  slug, 
  description, 
  visibility, 
  tags, 
  createdById 
}: { 
  name: string; 
  slug: string; 
  description?: string; 
  visibility: any; 
  tags: string[]; 
  createdById: string 
}) {
  return await prisma.community.create({
    data: { name, slug, description, visibility, tags, createdById }
  })
}
export async function listCommunitiesWithUserStatus(userId: string) {
  return await prisma.community.findMany({
    include: {
      _count: { select: { members: true } },
      members: {
        where: { userId },
        select: { role: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function getCommunityBySlug(slug: string) {
  return await prisma.community.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: { select: { name: true, email: true } } }
      }
    }
  })
}

export async function getMembership(communityId: string, userId: string) {
  return await prisma.communityMember.findUnique({
    where: { userId_communityId: { communityId, userId } }
  })
}

export async function addMember({ communityId, userId, role }: { communityId: string; userId: string; role: CommunityRole }) {
  return await prisma.communityMember.create({
    data: { communityId, userId, role }
  })
}

export async function removeMember(communityId: string, userId: string) {
  return await prisma.communityMember.delete({
    where: { userId_communityId: { communityId, userId } }
  })
}

export async function countCommunityAdmins(communityId: string): Promise<number> {
  return await prisma.communityMember.count({
    where: { communityId, role: "ADMIN" }
  })
}