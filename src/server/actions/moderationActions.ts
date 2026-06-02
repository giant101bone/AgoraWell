"use server"

import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/lib/auth/session"
import { getCommunityMemberRole } from "@/lib/rbac/roles"
import { revalidatePath } from "next/cache"
import { ReportReason, ModActionType, SessionStatus, AuditAction, AuditEntity } from "@prisma/client"
import { ReportStatus } from "@prisma/client"
// 1. Submit a Report (Accessible by any authorized community member)
export async function createReportAction(
  communityId: string,
  entityId: string,
  reason: ReportReason,
  message: string
) {
  try {
    const userId = await requireUserId()
    const role = await getCommunityMemberRole(userId, communityId)
    if (!role) return { success: false, error: "403: Forbidden access parameters." }

    const report = await prisma.report.create({
      data: {
        reporterUserId: userId,
        communityId,
        entityType: "SESSION",
        entityId,
        reason,
        message,
        status: ReportStatus.OPEN
      }
    })

    // Log the event to our audit history
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: AuditAction.BOOKING_CREATED, // Extend your Prisma AuditAction enum or cast if needed
        entityType: AuditEntity.BOOKING,
        entityId: report.id,
        metadata: { info: "REPORT_CREATED", communityId, entityId }
      }
    })

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 2. Fetch Active Reports (Accessible only by MOD/ADMIN)
export async function listReportsAction(communityId: string) {
  const userId = await requireUserId()
  const role = await getCommunityMemberRole(userId, communityId)
  const hasAccess = ["ADMIN", "MOD", "MODERATOR"].includes(String(role))
  
  if (!hasAccess) throw new Error("403: Unauthorized management request.")

  return await prisma.report.findMany({
    where: { communityId, status: { in: [ReportStatus.OPEN, ReportStatus.UNDER_REVIEW] } },
    include: { reporter: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" }
  })
}

// 3. Resolve a Report (Idempotent Transaction Block - Accessible only by MOD/ADMIN)
export async function resolveReportAction(
  reportId: string,
  communityId: string,
  actionType: ModActionType,
  notes: string
) {
  try {
    const userId = await requireUserId()
    const role = await getCommunityMemberRole(userId, communityId)
    const hasAccess = ["ADMIN", "MOD", "MODERATOR"].includes(String(role))
    if (!hasAccess) return { success: false, error: "403: Management override required." }

    return await prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({ where: { id: reportId } })
      if (!report || report.status === ReportStatus.RESOLVED) {
        return { success: true, warning: "Report already addressed." }
      }

      // Execute the moderation action safely and idempotently
      if (actionType === ModActionType.CANCEL_SESSION) {
        await tx.wellnessSession.update({
          where: { id: report.entityId },
          data: { status: SessionStatus.CANCELLED }
        })
      }

      await tx.moderationAction.create({
        data: { reportId, moderatorUserId: userId, actionType, notes }
      })

      await tx.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.RESOLVED }
      })

      return { success: true }
    })
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}