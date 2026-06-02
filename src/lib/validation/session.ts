import { z } from "zod"

export const SESSION_MAX_CAPACITY = 200

export const createSessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100).trim(),
  description: z.string().max(1000, "Description is too long").optional(),
  startsAt: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Session start time must be in the future",
  }),
  endsAt: z.string(),
  totalCapacity: z.coerce
    .number()
    .min(1, "Must have at least 1 seat")
    .max(SESSION_MAX_CAPACITY, `Cannot exceed ${SESSION_MAX_CAPACITY} seats`),
}).refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
  message: "End time must be strictly after start time",
  path: ["endsAt"],
})