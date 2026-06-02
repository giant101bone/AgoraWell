import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/communities/:path*",
    "/moderation/:path*",
    "/chronicle/:path*",
    "/sessions/:path*",
  ],
}

export default function proxy(request: NextRequest) {
  const cookies = request.cookies

  const hasSessionToken =
    cookies.has("authjs.session-token") ||
    cookies.has("__Secure-authjs.session-token") ||
    cookies.has("next-auth.session-token") ||
    cookies.has("__Secure-next-auth.session-token")

  if (!hasSessionToken) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  return NextResponse.next()
}