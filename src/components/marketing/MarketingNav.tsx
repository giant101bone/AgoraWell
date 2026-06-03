import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth/session";

export default async function MarketingNav() {
  const session = await getServerAuthSession();

  return (
    <header className="fixed top-0 z-50 w-full transition-all duration-500 bg-[#FDFBF7]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-3">
            <span className="text-2xl font-serif font-medium tracking-tight text-stone-900 transition-colors duration-500 group-hover:text-sky-800">
              Agora<span className="italic text-stone-500 group-hover:text-sky-700">Well</span>
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-10">
          <Link 
            href="/communities" 
            className="relative text-xs font-medium uppercase tracking-[0.15em] text-stone-500 transition-colors hover:text-stone-900 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-stone-900 after:transition-all after:duration-500 hover:after:w-full"
          >
            The Forums
          </Link>
          <Link 
            href="/#features" 
            className="relative text-xs font-medium uppercase tracking-[0.15em] text-stone-500 transition-colors hover:text-stone-900 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-stone-900 after:transition-all after:duration-500 hover:after:w-full"
          >
            Instruments
          </Link>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-6">
          {session ? (
            <Link
              href="/dashboard"
              className="text-xs font-medium uppercase tracking-widest text-stone-900 hover:text-sky-800 transition-colors"
            >
              Return to Sanctuary
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors md:block"
              >
                Log in
              </Link>
              <Link
                href="/signin"
                className="px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-500 ease-out"
              >
                Enter Agora
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}