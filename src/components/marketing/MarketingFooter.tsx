import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="text-xl font-semibold tracking-tight text-blue-900">
              Agora<span className="text-blue-600">Well</span>
            </span>
            <p className="mt-4 max-w-xs text-sm">
              Cultivating mind and body through timeless community practices and modern wellness insights.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/communities" className="hover:text-blue-600">Communities</Link></li>
              <li><Link href="/signin" className="hover:text-blue-600">Sign in</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} AgoraWell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}