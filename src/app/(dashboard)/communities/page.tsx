import { requireUserId } from "@/lib/auth/session"
import { listCommunitiesWithUserStatus } from "@/server/repos/communityRepo"
import CommunityCard from "@/components/community/CommunityCard"
import Link from "next/link"

export default async function CommunitiesDirectoryPage() {
  const userId = await requireUserId()
  const communities = await listCommunitiesWithUserStatus(userId)

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Hubs</h1>
          <p className="text-gray-500">Discover and coordinate across organizational spaces</p>
        </div>
        <Link href="/communities/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition">
          + Create Community
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl bg-gray-50">
          <p className="text-gray-500">No organizational branches established yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.map((c) => (
            <CommunityCard
              key={c.id}
              id={c.id}
              name={c.name}
              slug={c.slug}
              memberCount={c._count.members}
              userRole={(c.members[0]?.role as any) || null}
            />
          ))}
        </div>
      )}
    </div>
  )
}