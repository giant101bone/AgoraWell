"use client"

import { ReactNode, useState } from "react"
import TopNav from "./TopNav"
import SideNav from "./SideNav"
import MobileNavDrawer from "./MobileNavDrawer"
import { NavItem } from "@/lib/navigation/navItems"

// 1. Add this interface so TypeScript understands the structure of a community
interface JoinedCommunity {
  id: string
  name: string
  slug: string
}

interface AppShellProps {
  children: ReactNode
  navItems: NavItem[]
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  joinedCommunities: JoinedCommunity[] // 👈 2. Add this line right here!
}

export default function AppShell({ children, navItems, user, joinedCommunities }: AppShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased text-gray-900">
      <TopNav user={user} onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      
      <div className="flex flex-1">
        {/* 3. Pass it to SideNav */}
        <SideNav navItems={navItems} joinedCommunities={joinedCommunities} />
        
        {/* 4. Pass it to MobileNavDrawer */}
        <MobileNavDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          navItems={navItems} 
          joinedCommunities={joinedCommunities} 
        />
        
        <main className="flex-1 bg-white p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}