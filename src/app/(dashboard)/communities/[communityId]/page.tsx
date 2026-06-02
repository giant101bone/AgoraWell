import { requireUserId } from "@/lib/auth/session"
import { getCommunityBySlug } from "@/server/repos/communityRepo"
import { getCommunityMemberRole } from "@/lib/rbac/roles"
import { notFound } from "next/navigation"
import Link from "next/link"
import JoinLeaveButton from "@/components/community/JoinLeaveButton"
import BookingActionButton from "@/components/community/BookingActionButton" 
import { prisma } from "@/lib/prisma" // 

interface PageProps {
  params: Promise<{ communityId?: string; slug?: string }>
}

export default async function IndividualCommunityPage({ params }: PageProps) {
  const userId = await requireUserId()

  const resolvedParams = await params
  const slug = resolvedParams.slug || resolvedParams.communityId || ""

  console.log("--------------------------------------------------")
  console.log("NEXT.JS RAW PARAMS:", resolvedParams)
  console.log("RESOLVED SLUG VALUE:", slug)

  const community = await getCommunityBySlug(slug)
  
  if (!community) {
    console.log(`⚠️ DB LOOKUP FAILED: No community found with slug "${slug}"`);
    console.log("--------------------------------------------------")
    notFound()
  }

  console.log(`✅ DB LOOKUP SUCCESS: Found community "${community.name}"`);
  console.log("--------------------------------------------------")

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

  const sessions = await prisma.wellnessSession.findMany({
    where: { communityId: community.id },
    orderBy: { startsAt: "asc" },
    include: {
      bookings: {
        where: { status: "CONFIRMED" } 
      }
    }
  })

  const canManageSessions = ["ADMIN", "MOD", "MODERATOR"].includes(String(currentRole))

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
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Main Space Deck Card */}
          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Space Deck</h2>
                <p className="text-xs text-gray-500 mt-0.5">Real-time scheduling and inventory matrix</p>
              </div>
              
              {canManageSessions && (
                <Link 
                  href={`/communities/${slug}/sessions/new`} 
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  + Provision Session
                </Link>
              )}
            </div>

            {/* Live Session Inventory Mapping Loops */}
            <div className="mt-4 flex flex-col gap-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 border border-dashed rounded-xl text-center">
                  No active wellness slots are allocated inside this community registry yet.
                </p>
              ) : (
                sessions.map((session) => {
                  // 🧠 4. Calculate live operational states inside the map loop
                  const userHasBooked = session.bookings.some((b) => b.userId === userId)
                  const isFull = session.seatsRemaining === 0

                  return (
                    <div key={session.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900">{session.title}</h4>
                          {/* 🧠 5. Visual Confirmation Badge */}
                          {userHasBooked && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                              Your Slot Confirmed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          🗓️ {new Date(session.startsAt).toLocaleString()}
                        </p>
                        {session.description && (
                          <p className="text-xs text-gray-600 mt-1 italic">{session.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <span className={`px-2 py-1 text-[11px] font-bold rounded bg-white border ${
                          isFull ? "text-red-600 border-red-100 bg-red-50" : "text-gray-700"
                        }`}>
                          👥 {session.seatsRemaining} / {session.totalCapacity} Seats Left
                        </span>
                        
                        {/* 🧠 6. Injected Airline-Grade Transactional Button Component */}
                        <BookingActionButton 
                          sessionId={session.id} 
                          hasBooked={userHasBooked} 
                          isFull={isFull} 
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {currentRole === "ADMIN" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <span className="text-xs font-bold text-red-700 tracking-wide uppercase block">Root Admin Console</span>
                <p className="text-xs text-red-600 mt-1">You have full override capacity inside this workspace row.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Roster Panel */}
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