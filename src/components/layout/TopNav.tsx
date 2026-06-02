"use client"

import Link from "next/link"
import { AUTH_ROUTES } from "@/lib/auth/routes"

interface TopNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onToggleDrawer: () => void // Added this line
}

export default function TopNav({ user, onToggleDrawer }: TopNavProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-2">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onToggleDrawer}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-slate-950"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span className="text-xl">🏛️</span>
        <span className="font-bold text-gray-900 tracking-tight text-sm sm:text-base">AgoraWell Console</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.image ? (
            <img src={user.image} alt="User Profile" className="w-8 h-8 rounded-full border bg-slate-50" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-gray-700">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-gray-800 leading-none">{user.name || "Active Member"}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <Link 
          href={AUTH_ROUTES.SIGN_OUT}
          className="text-xs font-medium text-gray-500 hover:text-red-600 border px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          Sign Out
        </Link>
      </div>
    </header>
  )
}