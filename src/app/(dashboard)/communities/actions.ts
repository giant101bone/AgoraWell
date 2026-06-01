"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId } from "@/lib/auth/session"
import { createCommunitySchema } from "@/lib/validation/community"
import * as service from "@/server/services/communityService"

export async function createCommunityAction(prevState: any, formData: FormData) {
  const userId = await requireUserId()
  
  const validatedFields = createCommunitySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    visibility: formData.get("visibility"),
    tagsInput: formData.get("tags"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { name, slug, description, visibility, tagsInput: tags } = validatedFields.data
  let redirectToPath = ""

  try {
    await service.createCommunityWithOwnerAdmin({ name, slug, description, visibility, tags }, userId)
    redirectToPath = `/communities/${slug}`
  } catch (error: any) {
    console.error("DETAILED SERVER ERROR:", error)
    if (error.code === "P2002") {
      return { serverError: "A community with that name or URL slug already exists." }
    }
    return { serverError: "Failed to initialize community space." }
  }

  revalidatePath("/communities")
  redirect(redirectToPath)
}

export async function joinCommunityAction(communityId: string) {
  const userId = await requireUserId()
  try {
    await service.joinCommunity(communityId, userId)
    revalidatePath("/communities")
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function leaveCommunityAction(communityId: string) {
  const userId = await requireUserId()
  try {
    await service.leaveCommunity(communityId, userId)
    revalidatePath("/communities")
  } catch (error: any) {
    throw new Error(error.message)
  }
}