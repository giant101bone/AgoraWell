"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/lib/navigation/navItems"

interface SideNavProps {
  navItems: NavItem[]
}

export default function SideNav({ navItems }: SideNavProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-gray-200 bg-slate-50 p-4 flex flex-col gap-1 hidden md:flex min-h-[calc(100vh-64px)]">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation Matrix</p>
      <nav className="flex-1 flex flex-col gap-1">
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
    </aside>
  )
}
// SideNav.tsx at src/components/layout/SideNav.tsx