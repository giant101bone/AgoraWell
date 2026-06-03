"use server";

import { revalidatePath } from "next/cache"; // 🏢 FIX 1: Corrected "cache" to "next/cache"
import { requireUserId } from "@/lib/auth/session"; // 🛡️ FIX 2 & 3: Combined into your custom auth helper
import { prisma } from "@/lib/prisma"; 
import { MoodScore } from "@prisma/client";

export async function upsertMoodEntryAction(
  score: MoodScore,
  note?: string
) {
  // Leverage your native session validator to get the secure userId directly
  const userId = await requireUserId();

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Check if an entry already exists for the current calendar day
  const existingEntry = await prisma.moodEntry.findFirst({
    where: {
      userId: userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (existingEntry) {
    await prisma.moodEntry.update({
      where: { id: existingEntry.id },
      data: { score, note },
    });
  } else {
    await prisma.moodEntry.create({
      data: {
        userId: userId,
        score,
        note,
      },
    });
  }

  // Purge layout caches to instantly render the updated state
  revalidatePath("/dashboard");
  revalidatePath("/mood");
}