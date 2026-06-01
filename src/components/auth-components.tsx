import { signIn, signOut } from "@/lib/auth"

export function SignInWithGoogle() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/dashboard" })
      }}
    >
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Sign In with Google
      </button>
    </form>
  )
}

export function SignInWithChanneli() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("channeli", { redirectTo: "/dashboard" })
      }}
    >
      <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">
        Sign In with Channeli
      </button>
    </form>
  )
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/signin" })
      }}
    >
      <button type="submit" className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm">
        Sign Out
      </button>
    </form>
  )
}