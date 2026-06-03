"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/lib/navigation/navItems"

interface JoinedCommunity {
  id: string
  name: string
  slug: string
}

interface SideNavProps {
  navItems: NavItem[]
  joinedCommunities: JoinedCommunity[] // 👈 Add parameter type
}

export default function SideNav({ navItems, joinedCommunities }: SideNavProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-gray-200 bg-slate-50 p-4 flex flex-col gap-6 hidden md:flex min-h-[calc(100vh-64px)]">
      {/* SECTION 1: Core App Navigation Matrix */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation Matrix</p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
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

      {/* SECTION 2: Instant Feed Short-cuts */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">My Communities Feeds</p>
        <nav className="flex flex-col gap-1">
          {joinedCommunities.length === 0 ? (
            <p className="text-[11px] text-gray-400 px-3 italic">Not in any cohorts yet.</p>
          ) : (
            joinedCommunities.map((community) => {
              const targetFeedHref = `/communities/${community.slug}/feed`
              const isActive = pathname === targetFeedHref

              return (
                <Link
                  key={community.id}
                  href={targetFeedHref}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-200 text-slate-950 font-bold border-l-2 border-slate-950"
                      : "text-gray-600 hover:bg-gray-200/40 hover:text-gray-900"
                  }`}
                >
                  <span className="truncate max-w-[160px]">✨ {community.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">feed</span>
                </Link>
              )
            })
          )}
        </nav>
      </div>
    </aside>
  )
}