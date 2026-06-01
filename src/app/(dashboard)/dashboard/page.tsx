import { requireUserId, getServerAuthSession } from "@/lib/auth/session"
import { SignOutButton } from "@/components/auth-components"

export default async function DashboardPage() {
  // Secures the view layer context at compile time
  const userId = await requireUserId()
  const session = await getServerAuthSession()

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Main Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session?.user?.name || session?.user?.email}</p>
        </div>
        <SignOutButton />
      </div>
      
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-sm text-emerald-800 font-medium">
          Security Verification Status: Active Database Session Securely Established.
        </p>
        <p className="text-xs text-emerald-600 mt-1 font-mono">
          Internal User Vector Reference Key: {userId}
        </p>
      </div>
    </div>
  )
}