"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/lib/navigation/navItems"

interface JoinedCommunity {
  id: string
  name: string
  slug: string
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  joinedCommunities: JoinedCommunity[] // 👈 Add parameter type
}

export default function MobileNavDrawer({ isOpen, onClose, navItems, joinedCommunities }: MobileNavDrawerProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-5 shadow-xl flex flex-col gap-6 transform transition-transform ease-in-out duration-300">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span className="font-bold text-gray-900 tracking-tight text-sm">AgoraWell</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:bg-gray-100 rounded-md focus:outline-none"
            aria-label="Close layout menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SECTION 1: Core Navigation */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Navigation Matrix</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
                  }`}
                >
                  <span>{item.icon || "🔗"}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* SECTION 2: Mobile Communities Quick Feeds */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">My Communities Feeds</p>
          <nav className="flex flex-col gap-1">
            {joinedCommunities.length === 0 ? (
              <p className="text-[11px] text-gray-400 px-2 italic">Not in any cohorts yet.</p>
            ) : (
              joinedCommunities.map((community) => {
                const targetFeedHref = `/communities/${community.slug}/feed`
                const isActive = pathname === targetFeedHref

                return (
                  <Link
                    key={community.id}
                    href={targetFeedHref}
                    onClick={onClose} // Closes drawer immediately when user changes feeds on mobile
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-200 text-slate-950 font-bold border-l-2 border-slate-950"
                        : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
                    }`}
                  >
                    <span className="truncate max-w-[180px]">✨ {community.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">feed</span>
                  </Link>
                )
              })
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}