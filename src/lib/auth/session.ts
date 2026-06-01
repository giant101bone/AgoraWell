import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getServerAuthSession() {
  return await auth()
}

export async function requireUserId() {
  const session = await getServerAuthSession()
  
  if (!session?.user?.id) {
    redirect("/signin")
  }
  
  return session.user.id
}