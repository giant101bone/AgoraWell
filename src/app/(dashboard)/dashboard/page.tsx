import { requireUserId, getServerAuthSession } from "@/lib/auth/session"
import { SignOutButton } from "@/components/auth-components"
import { prisma } from "@/lib/prisma"

// Import our new Phase 6 components
import { StatCards } from "@/components/dashboard/stat-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { MoodWidget } from "@/components/dashboard/mood-widget"
import { RecentNotifications } from "@/components/dashboard/recent-notifications"

export default async function DashboardPage() {
  // 1. Secures the view layer context and fetches current session
  const userId = await requireUserId()
  const session = await getServerAuthSession()

  // 2. Set up date ranges for our widgets
  const rightNow = new Date()
  
  const sevenDaysAhead = new Date()
  sevenDaysAhead.setDate(rightNow.getDate() + 7)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(rightNow.getDate() - 7)

  // 3. Concurrent database aggregation queries
  const [
    upcomingSessionsCount,
    communitiesCount,
    recentNotifications,
    lastSevenDaysMoods,
    userCommunities,
  ] = await Promise.all([
    // Count active confirmed bookings over the next 7 days
    prisma.sessionBooking.count({
      where: {
        userId,
        status: "CONFIRMED",
        session: {
          startsAt: { gte: rightNow, lte: sevenDaysAhead },
        },
      },
    }),
    
    // Count communities joined by this user
    prisma.communityMember.count({
      where: { userId },
    }),
    
    // Grab the top 4 most recent notifications
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    
    // Gather preceding mood logs for our sparkline trend line
    prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.communityMember.findMany({
      where: { userId },
      select: {
        community: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    }),
  ])


  const formattedCommunities = userCommunities.map((membership) => ({
    slug: membership.community.slug,
    name: membership.community.name,
  }))

  // 4. Extract today's mood log if it exists yet
  const todayStr = new Date().toDateString()
  const todayMoodLog = lastSevenDaysMoods.find(
    (m) => new Date(m.createdAt).toDateString() === todayStr
  )

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Header Row remains completely identical to your layout */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Main Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      {/* Main Grid: Replaces the user vector placeholder with responsive panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Aspect Column: Analytics Hub & System Action Vectors */}
        <div className="lg:col-span-2 space-y-6">
          <StatCards
            upcomingSessionsCount={upcomingSessionsCount}
            communitiesCount={communitiesCount}
          />
          <QuickActions communities={formattedCommunities}/>
          <RecentNotifications items={recentNotifications} />
        </div>

        {/* Right Aspect Column: Real-time Mood Tracking Panel */}
        <div className="lg:col-span-1">
          <MoodWidget
            todayMood={todayMoodLog?.score}
            lastSevenDays={lastSevenDaysMoods}
          />
        </div>

      </div>
    </div>
  )
}