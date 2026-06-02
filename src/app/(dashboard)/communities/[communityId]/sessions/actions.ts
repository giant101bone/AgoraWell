"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId } from "@/lib/auth/session"
import { createSessionSchema } from "@/lib/validation/session"
import { createWellnessSession } from "@/server/services/sessionService"
import { prisma } from "@/lib/prisma"
import { requireCommunityRole } from "@/lib/rbac/roles"

export async function createSessionAction(slug: string, prevState: any, formData: FormData) {
  const userId = await requireUserId()
  
  const validatedFields = createSessionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    totalCapacity: formData.get("totalCapacity"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { title, description, startsAt, endsAt, totalCapacity } = validatedFields.data

  try {
    const community = await prisma.community.findUnique({
      where: { slug }
    })

    if (!community) {
      return { serverError: "Target workspace cell could not be resolved." }
    }

    await createWellnessSession(userId, community.id, {
      title,
      description,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      totalCapacity,
    })
  } catch (error: any) {
    return { serverError: error.message || "Failed to provision session inventory." }
  }

  revalidatePath(`/communities/${slug}`)
  redirect(`/communities/${slug}`)
}

/**
 * PHASE 4.2: Purges a cancelled wellness session resource from the system lifecycle.
 */
export async function deleteSessionAction({
  sessionId,
  slug,
  note,
}: {
  sessionId: string
  slug: string
  note?: string
}) {
  const userId = await requireUserId()

  try {
    const community = await prisma.community.findUnique({
      where: { slug },
    })

    if (!community) {
      return { serverError: "Target workspace cell could not be resolved." }
    }

    await requireCommunityRole(userId, community.id, "MOD")

    // FIXED: Query against wellnessSession table model directly
    const targetSession = await prisma.wellnessSession.findUnique({
      where: { id: sessionId },
      select: { status: true, title: true },
    })

    if (!targetSession) {
      return { serverError: "The target session inventory sequence could not be found." }
    }

    if (targetSession.status !== "CANCELLED") {
      return { serverError: "Destructive actions blocked: Only explicitly CANCELLED sessions can be purged." }
    }

    await prisma.$transaction([
      prisma.wellnessSession.delete({
        where: { id: sessionId },
      }),
      prisma.auditLog.create({
        data: {
          actorId: userId,               // FIXED: Field name is actorId
          action: "BOOKING_CANCELLED",   // FIXED: Valid item from AuditAction enum
          entityType: "SESSION",         // FIXED: Valid item from AuditEntity enum
          entityId: sessionId,
          metadata: {                    // FIXED: Replaced details with schema metadata Json object
            subAction: "DELETE_SESSION",
            sessionTitle: targetSession.title,
            moderatorNote: note || "None provided"
          }
        },
      }),
    ])

    revalidatePath(`/communities/${slug}`)
    return { success: true }
  } catch (error: any) {
    return { serverError: error.message || "An exception occurred during session resource cleanup." }
  }
}