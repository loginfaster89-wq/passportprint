import { Printer, Lock } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-neutral-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <Printer size={14} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-[15px]">Studio Print</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">India's browser-native print workspace. AI-powered, 100% private.</p>
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Tools</p>
            <div className="space-y-2.5">
              {[
                { label: "Passport Photo", href: "/passport-photo" },
                { label: "ID Card Studio", href: "/id-print" },
                { label: "Forms Library", href: "/forms" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="block text-sm text-neutral-500 hover:text-foreground transition-colors">{label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Company</p>
            <div className="space-y-2.5">
              {[
                { label: "About Us", href: "https://studioprint.pages.dev/about" },
                { label: "Contact", href: "https://studioprint.pages.dev/contact" },
                { label: "Privacy Policy", href: "https://studioprint.pages.dev/privacy" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="block text-sm text-neutral-500 hover:text-foreground transition-colors">{label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Support</p>
            <div className="space-y-2.5">
              {[
                { label: "FAQ", href: "#faq" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Refund Policy", href: "https://studioprint.pages.dev/refund" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="block text-sm text-neutral-500 hover:text-foreground transition-colors">{label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">© 2025 Studio Print. Made in India 🇮🇳</p>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Lock size={11} className="text-primary" /> 100% private · No data uploads · On-device AI only
          </div>
        </div>
      </div>
    </footer>
  );
}
