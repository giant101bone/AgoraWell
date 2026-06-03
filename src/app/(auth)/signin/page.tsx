import { SignInWithGoogle, SignInWithChanneli } from "@/components/auth-components"
import { getServerAuthSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function SignInPage() {
  const session = await getServerAuthSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans selection:bg-sky-200/50">
      {/* GLOBAL GRAIN TEXTURE */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" 
        style={{ backgroundImage: "url('/textures/grain.png')", backgroundSize: '150px' }}
      />

      {/* LEFT COLUMN: THE GATES (AUTH) */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2 lg:px-24 xl:px-32 relative z-10">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          
          {/* Back to Home Link - Increased text-xs to text-sm */}
          <Link 
            href="/" 
            className="group mb-16 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors"
          >
            <span className="h-[1px] w-6 bg-stone-300 group-hover:bg-stone-900 group-hover:w-8 transition-all duration-300" />
            Return to Agora
          </Link>

          {/* Typography Header */}
          <div className="mb-12">
            {/* Increased text-4xl lg:text-5xl to text-5xl lg:text-6xl */}
            <h1 className="text-5xl lg:text-6xl font-serif font-medium tracking-tight text-stone-900 leading-[1.1]">
              Cross the <br/>
              <span className="italic text-sky-800">Threshold.</span>
            </h1>
            {/* Increased text-sm to text-base */}
            <p className="mt-6 text-base font-light leading-relaxed text-stone-500">
              Verify your identity to enter the sanctuary. No passwords required, only your trusted credentials.
            </p>
          </div>

          {/* Authentication Providers */}
          <div className="flex flex-col gap-5">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-none bg-gradient-to-r from-stone-200 to-stone-300 opacity-0 blur transition duration-500 group-hover:opacity-50"></div>
              <div className="relative bg-[#FDFBF7]">
                <SignInWithGoogle />
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-none bg-gradient-to-r from-stone-200 to-stone-300 opacity-0 blur transition duration-500 group-hover:opacity-50"></div>
              <div className="relative bg-[#FDFBF7]">
                <SignInWithChanneli />
              </div>
            </div>
          </div>

          {/* Subtle Footer Disclaimer - Increased text-xs to text-sm */}
          <div className="mt-16 border-t border-stone-200 pt-6">
            <p className="text-sm font-light leading-relaxed text-stone-400">
              By entering, you agree to our <Link href="#" className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900 transition-colors">Privacy Edict</Link> and pledge to uphold the harmony of the forums.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: THE PHILOSOPHY (PURE CSS ART) */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center bg-stone-950 p-12 overflow-hidden">
        {/* Subtle dark mode noise */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('/textures/grain.png')]" />
        
        {/* Abstract Architectural Circles (The "Agora" Rings) */}
        <div className="absolute -right-[20%] top-1/2 h-[800px] w-[800px] -translate-y-1/2 rounded-full border border-stone-800/40" />
        <div className="absolute -right-[10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-stone-800/60" />
        <div className="absolute right-[5%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full border border-sky-900/30 bg-stone-900/50 backdrop-blur-3xl" />

        {/* Stoic Quote */}
        <div className="relative z-10 max-w-md text-center">
          <span className="mb-8 block font-serif text-7xl text-sky-900 opacity-80 leading-none">"</span>
          <blockquote className="font-serif text-3xl font-medium leading-tight text-stone-200">
            No man is free who is not master of himself.
          </blockquote>
          <cite className="mt-10 flex flex-col items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-stone-500 not-italic">
            <span className="h-4 w-[1px] bg-sky-900" />
            Epictetus
          </cite>
        </div>
      </div>
    </div>
  )
}