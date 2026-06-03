export const NAV_ROUTES = {
  DASHBOARD: "/dashboard",
  COMMUNITIES: "/communities",
  MODERATION: "/moderation",
  MOOD: "/mood",// CHRONICLE could be added later when implemented
} as const

export type NavItem = {
  label: string
  href: string
  icon: string
}

export function getDashboardNavItems(context: { isAuthed: boolean }): NavItem[] {
  if (!context.isAuthed) return []

  return [
    { label: "Dashboard", href: NAV_ROUTES.DASHBOARD, icon: "📊" },
    { label: "Communities", href: NAV_ROUTES.COMMUNITIES, icon: "🏢" },
    { label: "Mood Tracker", href: NAV_ROUTES.MOOD, icon: "🧠" },
    { label: "Moderation", href: NAV_ROUTES.MODERATION, icon: "🛡️" },
  ]
}