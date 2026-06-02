import { ReactNode } from "react"
import TopNav from "./TopNav"
import SideNav from "./SideNav"
import { NavItem } from "@/lib/navigation/navItems"

interface AppShellProps {
  children: ReactNode
  navItems: NavItem[]
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function AppShell({ children, navItems, user }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased text-gray-900">
      <TopNav user={user} />
      <div className="flex flex-1">
        <SideNav navItems={navItems} />
        <main className="flex-1 bg-white p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
// AppShell.tsx at src/components/layout/AppShell.tsx