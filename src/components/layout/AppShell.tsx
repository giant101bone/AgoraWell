"use client"

import { ReactNode, useState } from "react"
import TopNav from "./TopNav"
import SideNav from "./SideNav"
import MobileNavDrawer from "./MobileNavDrawer" // New import
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased text-gray-900">
      {/* 1. Added onToggleDrawer prop to TopNav */}
      <TopNav user={user} onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      
      <div className="flex flex-1">
        <SideNav navItems={navItems} />
        
        {/* 2. Added MobileNavDrawer which reuses your navItems */}
        <MobileNavDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          navItems={navItems} 
        />
        
        <main className="flex-1 bg-white p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}