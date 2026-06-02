"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/lib/navigation/navItems"

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileNavDrawer({ isOpen, onClose, navItems }: MobileNavDrawerProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-5 shadow-xl flex flex-col gap-4 transform transition-transform ease-in-out duration-300">
        
        {/* Drawer Header */}
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

        {/* Navigation Matrix mapping (Mirrors SideNav style parameters) */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Navigation Matrix</p>
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Closes drawer panel context immediately upon route tap
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
    </div>
  )
}