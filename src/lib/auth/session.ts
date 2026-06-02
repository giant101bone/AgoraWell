import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AUTH_ROUTES } from "@/lib/auth/routes"

export async function getServerAuthSession() {
  return await auth()
}

export async function requireUserId(): Promise<string> {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    redirect(AUTH_ROUTES.SIGN_IN)
  }

  return session.user.id
}