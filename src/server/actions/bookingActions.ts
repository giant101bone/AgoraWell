"use server"

import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"
import { BookingStatus, SessionStatus, AuditAction, AuditEntity } from "@prisma/client"
import { pusherServer } from "@/lib/pusher-server"

interface ActionResponse {
  success: boolean
  error?: string
}


export async function bookSeatAction(sessionId: string):Promise<ActionResponse> {
  let communityIdToNotify = ""
  let updatedSeats = 0
  let updatedStatus: SessionStatus = SessionStatus.OPEN


  try {
    const userId = await requireUserId()

    // 🚀 START INTERACTIVE TRANSACTION
    await prisma.$transaction(async (tx) => {
      
      // 1. Lock rows securely
      const sessions = await tx.$queryRaw<any[]>`
        SELECT id, "status", "seatsRemaining", "startsAt", "communityId" 
        FROM "WellnessSession" 
        WHERE id = ${sessionId} 
        FOR UPDATE
      `
      const session = sessions[0]
      if (!session) throw new Error("404: Session not found")

      communityIdToNotify = session.communityId

      // 2. Structural invariants
      if (session.status === SessionStatus.FULL || session.seatsRemaining <= 0) {
        throw new Error("409: This session has no seats remaining")
      }
      if (session.status === SessionStatus.CANCELLED) {
        throw new Error("422: Cannot book a cancelled session")
      }
      if (new Date(session.startsAt) <= new Date()) {
        throw new Error("422: This session has already started")
      }

      // 3. CHECK DUPLICATE BOOKING INSIDE TRANSACTION
      const existingBooking = await tx.sessionBooking.findUnique({
        where: { sessionId_userId: { sessionId, userId } }
      })

      if (existingBooking) {
        if (existingBooking.status === BookingStatus.CONFIRMED) {
          throw new Error("409: You have already secured a slot here")
        }
        
        await tx.sessionBooking.update({
          where: { id: existingBooking.id },
          data: { status: BookingStatus.CONFIRMED } 
        })
      } else {
        await tx.sessionBooking.create({
          data: { 
            sessionId, 
            userId, 
            status: BookingStatus.CONFIRMED 
          }
        })
      }

      // 4. ATOMICALLY DECREMENT SEATS
      updatedSeats = session.seatsRemaining - 1
      updatedStatus = updatedSeats === 0 ? SessionStatus.FULL : SessionStatus.OPEN

      await tx.wellnessSession.update({
        where: { id: sessionId },
        data: {
          seatsRemaining: updatedSeats,
          status: updatedStatus
        }
      })

      // 5. WRITE SYSTEM AUDIT LOG
      await tx.auditLog.create({
        data: {
          actorId: userId,                        
          action: AuditAction.BOOKING_CREATED,     
          entityType: AuditEntity.BOOKING,        
          entityId: sessionId,
          metadata: {
            communityId: session.communityId,
            seatsBefore: session.seatsRemaining,
            seatsAfter: updatedSeats
          }
        }
      })


      await tx.notification.create({
        data: {
          userId,
          type: "BOOKING_CONFIRMED",
          message: `🎉 Reservation secured! Your slot for "${session.title}" is officially confirmed.`
        }
      })
    })

      await pusherServer.trigger(`community-${communityIdToNotify}`, "availability-changed", {
      sessionId,
      seatsRemaining: updatedSeats,
      status: updatedStatus
    })

    revalidatePath(`/communities`)
    return { success: true }

  } catch (error: any) {
    console.error("🚨 TRANSACTION ABORTED & ROLLED BACK:", error.message)
    return { 
      success: false, 
      error: error.message || "An unexpected error disrupted reservation processing." 
    }
  }
}

export async function cancelBookingAction(sessionId: string): Promise<ActionResponse> {
  let communityIdToNotify = ""
  let updatedSeats = 0
  let updatedStatus: SessionStatus = SessionStatus.OPEN
  try {
    const userId = await requireUserId()

    await prisma.$transaction(async (tx) => {
      const sessions = await tx.$queryRaw<any[]>`
        SELECT id, "status", "seatsRemaining", "totalCapacity", "startsAt", "communityId", "title" 
        FROM "WellnessSession" 
        WHERE id = ${sessionId} 
        FOR UPDATE
      `
      const session = sessions[0]
      if (!session) throw new Error("404: Session not found")
      communityIdToNotify = session.communityId

      // POLICY A VERIFICATION: Prevent cancellations if the session has already started
      if (new Date(session.startsAt) <= new Date()) {
        throw new Error("422: Cancellation window closed. Session already active or complete.")
      }

      // 2. CHECK BOOKING REGISTRY STATUS
      const booking = await tx.sessionBooking.findUnique({
        where: { sessionId_userId: { sessionId, userId } }
      })

      if (!booking || booking.status === "CANCELLED") {
        throw new Error("404: No active booking found to cancel")
      }

      // 3. FLIP BOOKING STATUS TO CANCELLED
      await tx.sessionBooking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED }
      })

      // 4. ATOMICALLY INCREMENT SEATS (Never exceed total capacity)
      updatedSeats = Math.min(session.seatsRemaining + 1, session.totalCapacity)
      updatedStatus = SessionStatus.OPEN
      
      await tx.wellnessSession.update({
        where: { id: sessionId },
        data: {
          seatsRemaining: updatedSeats,
          status: "OPEN" // Releasing a seat guarantees it shifts to open state
        }
      })

      // 5. WRITE CANCELLATION AUDIT ENTRY
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "BOOKING_CANCELLED",
          entityType: "BOOKING",
          entityId: booking.id,
          metadata: {
            communityId: session.communityId,
            seatsBefore: session.seatsRemaining,
            seatsAfter: updatedSeats
          }
        }
      })

      
      await tx.notification.create({
        data: {
          userId,
          type: "BOOKING_CANCELLED",
          message: `💼 Cancellation processed. Slot for "${session.title}" has been released.`
        }
      })
    })

    await pusherServer.trigger(`community-${communityIdToNotify}`, "availability-changed", {
      sessionId,
      seatsRemaining: updatedSeats,
      status: updatedStatus
    })



    revalidatePath(`/communities`)
    return {success: true}

  } catch (error: any) {
    console.error("🚨 CANCELLATION TRANSACTION FAILED & ROLLED BACK:", error.message)
    return { success: false, error: error.message }
  }
}