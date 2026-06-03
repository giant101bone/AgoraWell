import { ReactNode } from "react"
import { requireUserId } from "@/lib/auth/session"
import { getDashboardNavItems } from "@/lib/navigation/navItems"
import AppShell from "@/components/layout/AppShell"
import { prisma } from "@/lib/prisma"

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const userId = await requireUserId()

  // 1. Existing user info fetch (Unchanged)
  const memberRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, image: true },
  })

  // 2. Existing navigation item evaluation (Unchanged)
  const items = getDashboardNavItems({
    isAuthed: true,
  })

  // 3. NEW: Fetch communities the current user has joined
  const joinedCommunities = await prisma.community.findMany({
    where: {
      members: {
        some: {
          userId: userId, // Uses your secure userId from session
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <AppShell
      user={{
        name: memberRecord?.name ?? null,
        email: memberRecord?.email ?? null,
        image: memberRecord?.image ?? null,
      }}
      navItems={items}
      joinedCommunities={joinedCommunities} // 👈 Passed safely into AppShell here
    >
      {children}
    </AppShell>
  )
}