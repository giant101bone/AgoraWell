"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NAV_ROUTES } from "@/lib/navigation/navItems"

interface CommunityOption {
  slug: string
  name: string
}

interface QuickActionsProps {
  communities: CommunityOption[]
}

export function QuickActions({ communities }: QuickActionsProps) {
  const router = useRouter()
  const [showSelector, setShowSelector] = useState(false)

  const handleSessionClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // 1. If user hasn't joined any communities, redirect them to create one first
    if (!communities || communities.length === 0) {
      router.push(`${NAV_ROUTES.COMMUNITIES}/new`)
      return
    }

    // 2. If user is in exactly one community, jump straight to its creation route
    if (communities.length === 1) {
      router.push(`${NAV_ROUTES.COMMUNITIES}/${communities[0].slug}/sessions/new`)
      return
    }

    // 3. If user manages multiple, open the selection selector dropdown inline
    setShowSelector((prev) => !prev)
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Quick Controls</h3>
        <p className="text-[11px] text-gray-400">Initialize workspace spaces and events.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Create Community Link */}
        <Link
          href={`${NAV_ROUTES.COMMUNITIES}/new`}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-slate-50 transition group"
        >
          <span className="text-lg">🏢</span>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
            Create Community
          </span>
        </Link>

        {/* Create Session Button Trigger */}
        <button
          onClick={handleSessionClick}
          className={`flex items-center gap-3 p-3 rounded-lg border text-left transition group w-full ${
            showSelector 
              ? "border-gray-900 bg-slate-50 ring-2 ring-slate-100" 
              : "border-gray-200 hover:border-gray-900 hover:bg-slate-50"
          }`}
        >
          <span className="text-lg">⚡</span>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 block">
              Create Session
            </span>
          </div>
        </button>
      </div>

      {/* Dropdown context list shown when they manage more than one community */}
      {showSelector && communities.length > 1 && (
        <div className="p-4 bg-slate-50 border border-gray-200 rounded-lg animate-in fade-in duration-150">
          <label htmlFor="community-context" className="block text-xs font-bold text-gray-700 mb-2">
            Which community do you want to create this session for?
          </label>
          <select
            id="community-context"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                router.push(`${NAV_ROUTES.COMMUNITIES}/${e.target.value}/sessions/new`)
                setShowSelector(false)
              }
            }}
            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          >
            <option value="" disabled>-- Pick a Community Workspace --</option>
            {communities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}