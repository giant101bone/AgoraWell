import { SignInWithGoogle, SignInWithChanneli } from "@/components/auth-components"
import { getServerAuthSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await getServerAuthSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-md flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Portal</h1>
        <p className="text-sm text-gray-500 mb-4">Select an identity provider to sign in</p>
        <SignInWithGoogle />
        <SignInWithChanneli />
      </div>
    </div>
  )
}