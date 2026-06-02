import * as sessionRepo from "@/server/repos/sessionRepo"
import { getMembership } from "@/server/repos/communityRepo"

export async function createWellnessSession(
  actorUserId: string,
  communityId: string,
  payload: {
    title: string
    description?: string
    startsAt: Date
    endsAt: Date
    totalCapacity: number
  }
) {
  // 1. RBAC Verification
  const membership = await getMembership(communityId, actorUserId)
  
  if (!membership) {
    throw new Error("Access Denied: You are not a member of this community.")
  }
  
  if (membership.role !== "ADMIN" && membership.role !== "MODERATOR") {
    throw new Error("Access Denied: Only Admins and Moderators can provision sessions.")
  }

  // 2. Execute Creation
  const session = await sessionRepo.createSession({
    ...payload,
    communityId,
    createdByUserId: actorUserId
  })

  return session
}