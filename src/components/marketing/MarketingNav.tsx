import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth/session";

export default async function MarketingNav() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-blue-900">
              Agora<span className="text-blue-600">Well</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/communities" 
              className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors"
            >
              Communities
            </Link>
            <Link 
              href="/#features" 
              className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors"
            >
              How it Works
            </Link>
          </nav>
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden text-sm font-medium text-blue-600 hover:text-blue-800 md:block"
              >
                Log in
              </Link>
              <Link
                href="/signin"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}