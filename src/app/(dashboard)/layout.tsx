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

  const memberRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, image: true },
  })

  // No globalRole anymore
  const items = getDashboardNavItems({
    isAuthed: true,
  })

  return (
    <AppShell
      user={{
        name: memberRecord?.name ?? null,
        email: memberRecord?.email ?? null,
        image: memberRecord?.image ?? null,
      }}
      navItems={items}
    >
      {children}
    </AppShell>
  )
}