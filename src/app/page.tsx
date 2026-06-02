import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth/session";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default async function HomePage() {
  // Fetch session for conditional CTAs in the Hero section
  const session = await getServerAuthSession();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <MarketingNav />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Find Your Center in the <span className="text-blue-600">Modern Agora</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              Discover a sanctuary for your mind and body. AgoraWell brings timeless wellness philosophies into the digital age, connecting you with mindful communities and powerful tracking tools.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {session ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/communities"
                className="text-base font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors"
              >
                Explore communities <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section id="features" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Holistic Platform</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Tools for a Balanced Life
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">🏛️</div>
                    Communities
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Join specialized circles dedicated to stoicism, meditation, fitness, and holistic nutrition.</p>
                  </dd>
                </div>

                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">🧘</div>
                    Sessions
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Participate in live, guided mindfulness practices and wellness workshops with expert guides.</p>
                  </dd>
                </div>

                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">🌿</div>
                    Mood Tracking
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Log your daily emotional states to uncover patterns and cultivate lasting inner peace.</p>
                  </dd>
                </div>

                <div className="flex flex-col lg:col-start-2">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">🛡️</div>
                    Moderation
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Experience a safe, supportive environment with AI-assisted and human-led community guidelines.</p>
                  </dd>
                </div>

                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">📜</div>
                    Chronicle
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Keep a secure, private journal of your wellness journey to reflect on your personal growth over time.</p>
                  </dd>
                </div>

              </dl>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / STEPS */}
        <section id="how-it-works" className="bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your Journey to Well-being</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Getting started with AgoraWell is simple. Follow these steps to begin cultivating a healthier mind and body.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-4xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl mb-6">1</div>
                  <h3 className="text-lg font-semibold text-slate-900">Create an Account</h3>
                  <p className="mt-2 text-sm text-slate-600">Secure your digital space and set your personal wellness intentions.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl mb-6">2</div>
                  <h3 className="text-lg font-semibold text-slate-900">Find Your Tribe</h3>
                  <p className="mt-2 text-sm text-slate-600">Browse and join communities that align with your personal growth goals.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl mb-6">3</div>
                  <h3 className="text-lg font-semibold text-slate-900">Engage & Grow</h3>
                  <p className="mt-2 text-sm text-slate-600">Attend sessions, track your mood, and chronicle your journey daily.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}