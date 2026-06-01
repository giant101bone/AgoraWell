import { z } from "zod"
import { CommunityRole as PrismaCommunityRole } from "@prisma/client"
import {VisibilityStatus} from "@prisma/client"

export const COMMUNITY_ROLE = {
  ADMIN: "ADMIN",
  MOD: "MODERATOR",
  MEMBER: "MEMBER",
} as const

export type CommunityRole = PrismaCommunityRole

export const COMMUNITY_NAME_MAX = 64
export const COMMUNITY_SLUG_REGEX = /^[a-z0-9-]+$/

export const createCommunitySchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(COMMUNITY_NAME_MAX, `Name cannot exceed ${COMMUNITY_NAME_MAX} characters`)
    .trim(),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .regex(COMMUNITY_SLUG_REGEX, "Slug can only contain lowercase letters, numbers, and hyphens")
    .trim(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  visibility: z.nativeEnum(VisibilityStatus).default(VisibilityStatus.PUBLIC),
  tagsInput: z.string().transform((val) => 
    val ? val.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0) : []
  )
})