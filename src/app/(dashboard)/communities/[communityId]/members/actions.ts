"use server"

import { revalidatePath } from "next/cache"
import { requireUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { requireCommunityRole } from "@/lib/rbac/roles"

interface RemoveMemberPayload {
  communityId: string
  targetUserId: string
  note: string
  slug: string
}

/**
 * PHASE 4.3: Exiles a member node from an active community cell with an administrative warning.
 */
export async function removeCommunityMemberAction({
  communityId,
  targetUserId,
  note,
  slug,
}: RemoveMemberPayload) {
  const callerUserId = await requireUserId()

  try {
    await requireCommunityRole(callerUserId, communityId, "MOD")

    const targetMembership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: targetUserId,
          communityId,
        },
      },
    })

    if (!targetMembership) {
      return { serverError: "Target member assignment does not exist in this domain workspace." }
    }

    if (targetMembership.role === "ADMIN") {
      const remainingAdmins = await prisma.communityMember.count({
        where: {
          communityId,
          role: "ADMIN",
        },
      })

      if (remainingAdmins <= 1) {
        return { serverError: "Administrative Lockout: Cannot remove the solitary structural Administrator of this Agora." }
      }
    }

    await prisma.$transaction([
      prisma.communityMember.delete({
        where: {
          userId_communityId: {
            userId: targetUserId,
            communityId,
          },
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: callerUserId,         // FIXED: Field name is actorId
          action: "BOOKING_CANCELLED",   // FIXED: Valid item from AuditAction enum
          entityType: "COMMUNITY",       // FIXED: Valid item from AuditEntity enum
          entityId: communityId,
          metadata: {                    // FIXED: Replaced details string with metadata Json payload
            subAction: "REMOVE_MEMBER",
            exiledUserId: targetUserId,
            reason: note
          }
        },
      }),
      prisma.notification.create({
        data: {
          userId: targetUserId,
          type: "COMMUNITY_EXILE",       // FIXED: Mapped to standard text type field
          message: `Your membership configuration with the Agora network has been terminated. Reason given: "${note}"`,
        },
      }),
    ])

    revalidatePath(`/communities/${slug}`)
    return { success: true }
  } catch (error: any) {
    return { serverError: error.message || "Failed to execute standard member deployment revocation operations." }
  }
}