"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId } from "@/lib/auth/session"
import { createSessionSchema } from "@/lib/validation/session"
import { createWellnessSession } from "@/server/services/sessionService"
import {prisma} from "@/lib/prisma"

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