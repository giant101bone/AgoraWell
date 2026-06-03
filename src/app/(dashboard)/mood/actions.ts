"use server"

import { revalidatePath } from "next/cache"
import { requireUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma" // Adjust to point to your prisma instantiation file
import { MoodScore } from "@prisma/client"

export async function upsertMoodEntryAction(score: MoodScore, note?: string) {
  const userId = await requireUserId()

  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  // Determine if user already submitted a response within the current calendar day
  const existingEntry = await prisma.moodEntry.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  if (existingEntry) {
    await prisma.moodEntry.update({
      where: { id: existingEntry.id },
      data: { score, note },
    })
  } else {
    await prisma.moodEntry.create({
      data: {
        userId,
        score,
        note,
      },
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/mood")
}