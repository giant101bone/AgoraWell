import Link from "next/link"
import { requireUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { CommunityRole } from "@prisma/client"

const MOD_ROLES = ["ADMIN", "MOD", "MODERATOR"] as const

export default async function ModerationLandingPage() {
  const userId = await requireUserId()

  const communities = await prisma.community.findMany({
    where: {
      members: {
        some: {
          userId,
          role: {
            in: [CommunityRole.ADMIN, CommunityRole.MODERATOR],
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold">Moderation</h1>
      <p className="text-sm text-gray-500 mt-1">
        Communities where you have admin/mod privileges.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {communities.length === 0 ? (
          <div className="p-6 border rounded-xl bg-gray-50 text-sm text-gray-600">
            You don’t have moderation access in any community yet.
          </div>
        ) : (
          communities.map((c) => (
            <Link
              key={c.id}
              href={`/communities/${c.slug}/mod`}
              className="p-4 border rounded-xl hover:bg-slate-50 transition"
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                Open moderation queue
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}