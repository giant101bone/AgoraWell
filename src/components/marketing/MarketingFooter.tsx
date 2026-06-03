import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#FDFBF7] py-24 text-stone-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
          
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-serif font-medium tracking-tight text-stone-900">
                Agora<span className="italic text-stone-400">Well</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm font-light leading-relaxed text-stone-600">
              Built in pursuit of balance, clarity, and stillness.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-6">The Platform</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/communities" className="hover:text-sky-800 transition-colors">The Forums</Link></li>
              <li><Link href="/signin" className="hover:text-sky-800 transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-sky-800 transition-colors">Your Chronicle</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-6">Legal Scrolls</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="#" className="hover:text-sky-800 transition-colors">Privacy Edict</Link></li>
              <li><Link href="#" className="hover:text-sky-800 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-24 pt-8 text-xs font-light uppercase tracking-widest text-stone-400 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} AgoraWell. Memento Mori.</p>
        </div>
      </div>
    </footer>
  );
}