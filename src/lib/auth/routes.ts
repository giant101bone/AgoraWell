// Client-safe constants only (no next/navigation, no auth(), no prisma)

export const AUTH_ROUTES = {
  SIGN_IN: "/signin",
  SIGN_OUT: "/api/auth/signout",
} as const