import Link from "next/link"
import { CommunityRole } from "@/lib/validation/community"
import JoinLeaveButton from "./JoinLeaveButton"

interface CommunityCardProps {
  id: string
  name: string
  slug: string
  memberCount: number
  userRole: CommunityRole | null
}

export default function CommunityCard({ id, name, slug, memberCount, userRole }: CommunityCardProps) {
  const isMember = !!userRole

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between gap-4 text-black">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">{name}</h2>
          {isMember && (
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded uppercase">
              {userRole}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 font-mono mt-1">/communities/{slug}</p>
        <p className="text-sm text-gray-500 mt-2">{memberCount} active members</p>
      </div>

      <div className="pt-3 border-t flex items-center justify-between gap-2">
        <JoinLeaveButton communityId={id} isMember={isMember} />
        {isMember && (
          <Link href={`/communities/${slug}`} className="px-3 py-1.5 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium rounded-lg transition">
            Enter Dashboard →
          </Link>
        )}
      </div>
    </div>
  )
}