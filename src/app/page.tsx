import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth/session";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import {
  Columns3,
  Waves,
  Shield,
  ScrollText,
  Activity,
  Feather
} from "lucide-react";

export default async function HomePage() {
  const session = await getServerAuthSession();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#FDFBF7] font-sans text-stone-800 selection:bg-sky-200/50">
      {/* GLOBAL GRAIN TEXTURE */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" 
        style={{ backgroundImage: "url('/textures/grain.png')", backgroundSize: '150px' }}
      />

      <MarketingNav />

      <main className="flex-grow">
        {/* HERO SECTION - SPLIT EDITORIAL LAYOUT */}
        <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          {/* Large Faded Background Word */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
            <span className="text-[12rem] lg:text-[18rem] font-serif font-black text-stone-200/30 tracking-tighter">
              EUDAIMONIA
            </span>
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              
              {/* Left: Typography & CTAs */}
              <div className="max-w-2xl">
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-stone-500">
                  The Digital Agora
                </p>
                <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-serif font-medium leading-[0.95] tracking-[-0.04em] text-stone-900">
                  Awaken the <br />
                  <span className="italic text-sky-800">Philosopher</span> <br />
                  Within.
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-8 text-stone-600 font-light">
                  Discover a sanctuary for your mind. AgoraWell brings timeless stoic philosophies into the modern age, connecting you with mindful communities and intentional tools for growth.
                </p>
                
                <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {session ? (
                    <Link
                      href="/dashboard"
                      className="group relative overflow-hidden rounded-none bg-stone-900 px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-out hover:bg-sky-900"
                    >
                      <span className="relative z-10">Enter the Sanctuary</span>
                    </Link>
                  ) : (
                    <Link
                      href="/signin"
                      className="group relative overflow-hidden rounded-none bg-stone-900 px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-out hover:bg-sky-900 hover:shadow-xl hover:shadow-sky-900/20"
                    >
                      <span className="relative z-10">Begin Your Journey</span>
                    </Link>
                  )}
                  <Link
                    href="/communities"
                    className="group text-sm font-medium tracking-wider uppercase text-stone-500 hover:text-sky-800 transition-colors flex items-center gap-3"
                  >
                    Explore the Forums
                    <span className="h-[1px] w-8 bg-stone-300 group-hover:bg-sky-800 transition-colors duration-500" />
                  </Link>
                </div>
              </div>

              {/* Right: Real Visual / Artistic Image */}
              <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[700px] overflow-hidden rounded-tl-[6rem] rounded-br-[6rem] bg-stone-200/50 border border-stone-200">
                {/* Placeholder for the actual image you will add */}
                {/* Replace the <img /> in your HomePage with this until you find a real image */}
<div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 p-8 text-center text-stone-100">
  <div className="absolute inset-0 opacity-[0.03] bg-[url('/textures/grain.png')]" />
  <span className="text-sky-800 font-serif text-8xl opacity-50 mb-4">🏛</span>
  <h2 className="text-4xl font-serif font-medium tracking-tight relative z-10">
    The Inner <br/><span className="italic text-stone-400">Citadel</span>
  </h2>
</div>
                {/* Subtle Greek border overlay */}
                <div className="absolute bottom-4 left-4 right-4 h-12 opacity-20 bg-[url('/patterns/greek-border.svg')] bg-repeat-x" />
              </div>

            </div>
          </div>
        </section>

        {/* PHILOSOPHY STRIP */}
        <div className="border-y border-stone-200 bg-stone-100/50 py-6 overflow-hidden">
          <div className="flex gap-16 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            <span>Stoicism</span>
            <span>•</span>
            <span>Presence</span>
            <span>•</span>
            <span>Discipline</span>
            <span>•</span>
            <span>Logos</span>
            <span>•</span>
            <span>Vitality</span>
            <span>•</span>
            <span>Harmony</span>
            <span>•</span>
            <span>Areté</span>
          </div>
        </div>

        {/* THE FOUR PILLARS - ASYMMETRICAL "WOW" SECTION */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative bg-stone-900 text-stone-50 overflow-hidden">
          {/* Subtle noise for dark section */}
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('/textures/grain.png')]" />
          
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="mb-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-400 mb-4">The Foundation</h2>
              <p className="text-5xl lg:text-7xl font-serif font-medium tracking-tight text-stone-100">
                The Four Pillars of <br/><span className="italic text-sky-400">Areté</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Mind', sub: 'Logos', desc: 'Sharpen your perception and untangle your thoughts through guided logic and communal reflection.' },
                { title: 'Body', sub: 'Vitality', desc: 'Treat your physical vessel not as an ornament, but as the engine of your philosophical endurance.', offset: 'lg:mt-16' },
                { title: 'Discipline', sub: 'Practice', desc: 'Forge daily habits that compound over time. True freedom is found only on the other side of structure.', offset: 'lg:mt-8' },
                { title: 'Harmony', sub: 'Sophrosyne', desc: 'Find the delicate balance between ambition and acceptance. Align yourself with the natural order.', offset: 'lg:mt-24' }
              ].map((pillar, idx) => (
                <div key={idx} className={`group flex flex-col border border-stone-800 bg-stone-950/50 p-8 transition-all duration-700 hover:border-sky-900 hover:bg-stone-900 ${pillar.offset || ''}`}>
                  <span className="text-sky-800 font-serif text-5xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                  <h3 className="text-2xl font-serif mb-1">{pillar.title}</h3>
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-6">{pillar.sub}</span>
                  <p className="text-sm font-light leading-relaxed text-stone-400">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES - EDITORIAL GRID */}
        <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7]">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              
              <div className="lg:col-span-4 sticky top-32">
                <h2 className="text-4xl font-serif tracking-tight text-stone-900 mb-6">
                  Tools for an <br/>Intentional Life
                </h2>
                <p className="text-stone-500 font-light leading-relaxed">
                  We have stripped away the noise of modern social media. What remains is a curated set of instruments designed solely to cultivate your inner citadel.
                </p>
              </div>

              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-16">
                {[
                  { name: 'The Forums', icon: Columns3, desc: 'Engage in elevated discourse. Specialized circles for stoicism, meditation, and physical mastery.' },
                  { name: 'Ebb & Flow', icon: Activity, desc: 'Track your daily emotional states to uncover the hidden rhythms of your inner life.' },
                  { name: 'Symposiums', icon: Feather, desc: 'Participate in live, guided mindfulness practices led by modern philosophical guides.' },
                  { name: 'The Chronicle', icon: ScrollText, desc: 'A secure, private journal to document your journey and reflect on your continuous growth.' },
                  { name: 'Aegis Protection', icon: Shield, desc: 'A deeply moderated, safe environment that protects the sanctity of your digital space.' },
                  { name: 'Deep Immersion', icon: Waves, desc: 'Tools designed for focus, removing algorithmic feeds in favor of intentional engagement.' }
                ].map((feature, idx) => (
                  <div key={idx} className="group relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-none border border-stone-200 bg-stone-100 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-sky-800 group-hover:bg-white group-hover:shadow-[0_10px_30px_rgba(2,106,167,0.08)]">
                      <feature.icon className="h-6 w-6 text-stone-700 group-hover:text-sky-800 transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-serif font-medium text-stone-900 mb-3">{feature.name}</h3>
                    <p className="text-sm font-light leading-relaxed text-stone-600">{feature.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

      </main>
      <MarketingFooter />
    </div>
  );
}