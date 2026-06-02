import {prisma }from "@/lib/prisma"
import { SessionStatus } from "@prisma/client"

export async function createSession(data: {
  communityId: string
  title: string
  description?: string
  startsAt: Date
  endsAt: Date
  totalCapacity: number
  createdByUserId: string
}) {
  // Invariant enforced here: seatsRemaining ALWAYS starts perfectly equal to totalCapacity
  return await prisma.wellnessSession.create({
    data: {
      ...data,
      seatsRemaining: data.totalCapacity,
      status: SessionStatus.OPEN,
    }
  })
}

export async function listCommunitySessions(communityId: string) {
  return await prisma.wellnessSession.findMany({
    where: { communityId },
    orderBy: { startsAt: "asc" },
    include: {
      createdBy: { select: { name: true } }
    }
  })
}