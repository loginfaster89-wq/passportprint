import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/">
              <span
                className="font-black text-xl tracking-tight cursor-pointer"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Studio <span style={{ color: "#F0A500" }}>Print.</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-sm">
              A browser-native print workspace for passport photos, ID-card sheets, and 200+ government forms — built in India for print shops, eMitra counters, and home users.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["No uploads", "No account needed", "Made in India 🇮🇳"].map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-500">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tools</h4>
            <ul className="space-y-2.5">
              <li><a href="/passport-photo/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Passport Photo</a></li>
              <li><a href="/id-print/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">ID Card Print</a></li>
              <li><a href="/forms/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Forms Hub</a></li>
            </ul>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick links</h4>
            <ul className="space-y-2.5">
              <li><a href="/#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="/#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a></li>
              <li><a href="/#how" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How it works</a></li>
            </ul>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© 2026 Studio Print. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Browser-only · No uploads · No tracking</span>
            <a href="mailto:support@studioprint.pages.dev" className="hover:text-gray-600 transition-colors">support@studioprint.pages.dev</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
