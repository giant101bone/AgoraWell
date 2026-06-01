import { requireUserId } from "@/lib/auth/session"
import { getCommunityBySlug } from "@/server/repos/communityRepo"
import { getCommunityMemberRole } from "@/lib/rbac/roles"
import { notFound } from "next/navigation"
import Link from "next/link"
import JoinLeaveButton from "@/components/community/JoinLeaveButton"

interface PageProps {
  params: Promise<{ communityId: string }>
}

export default async function IndividualCommunityPage({ params }: PageProps) {
  const userId = await requireUserId()
  const { communityId: slug } = await params

  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const currentRole = await getCommunityMemberRole(userId, community.id)

  if (!currentRole) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto mt-12 border rounded-xl bg-red-50 text-red-800">
        <h2 className="text-lg font-bold">Access Boundary Fault</h2>
        <p className="text-sm mt-1">You must join this community space to view internal operations.</p>
        <Link href="/communities" className="mt-4 inline-block text-sm bg-white border px-4 py-2 rounded-lg text-gray-700 font-medium shadow-sm">
          Return to Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6 text-black">
      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/communities" className="text-sm text-blue-600 hover:underline">← System Directory</Link>
          <h1 className="text-3xl font-bold tracking-tight mt-1">{community.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900 text-white tracking-wider uppercase">
            {currentRole}
          </span>
          <JoinLeaveButton communityId={community.id} isMember={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Space Deck</h2>
            <p className="text-sm text-gray-600">Day 2 base setup fully active. Day 3 session slots will mount here.</p>

            {currentRole === "ADMIN" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <span className="text-xs font-bold text-red-700 tracking-wide uppercase block">Root Admin Console</span>
                <p className="text-xs text-red-600 mt-1">You have full override capacity inside this workspace row.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 h-fit">
          <h3 className="font-semibold text-gray-900 border-b pb-2 mb-3">Roster ({community.members.length})</h3>
          <div className="flex flex-col gap-3">
            {community.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">{m.user.name}</p>
                  <p className="text-xs text-gray-400">{m.user.email}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}