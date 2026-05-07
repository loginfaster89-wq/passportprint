import { useState, useEffect } from "react";
import { Menu, X, Printer, ScanFace, FileCheck, FileText, ChevronDown, Sparkles } from "lucide-react";

interface SiteNavProps {
  activePage?: "home" | "passport-photo" | "id-print" | "forms";
}

const tools = [
  { icon: ScanFace, label: "Passport Photo", desc: "AI removal · 35+ countries · 300 DPI", href: "/passport-photo", page: "passport-photo" },
  { icon: FileCheck, label: "ID Card Studio", desc: "Front & back · Batch print · A4", href: "/id-print", page: "id-print" },
  { icon: FileText, label: "Forms Library", desc: "300+ govt forms · Free download", href: "/forms", page: "forms" },
];

export default function SiteNav({ activePage = "home" }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isToolPage = ["passport-photo", "id-print", "forms"].includes(activePage);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/96 backdrop-blur-xl border-b border-neutral-200 shadow-sm" : "bg-white border-b border-neutral-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Printer size={14} className="text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-foreground">Studio Print</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 border border-primary/20">
                <Sparkles size={8} /> India #1
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0">
            <div className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                isToolPage ? "text-foreground bg-neutral-100" : "text-neutral-500 hover:text-foreground hover:bg-neutral-100"
              }`}>
                Tools
                <ChevronDown size={13} className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl shadow-black/10 p-2 w-72">
                    {tools.map((t) => (
                      <a key={t.label} href={t.href} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-neutral-50 group ${
                        activePage === t.page ? "bg-primary/5 border border-primary/10" : ""
                      }`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          activePage === t.page ? "bg-primary/15" : "bg-neutral-100 group-hover:bg-primary/10"
                        }`}>
                          <t.icon size={15} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.label}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{t.desc}</p>
                        </div>
                        {activePage === t.page && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />}
                      </a>
                    ))}
                    <div className="border-t border-neutral-100 mt-1.5 pt-1.5 px-3 pb-1">
                      <a href="/forms" className="flex items-center justify-between text-xs text-neutral-400 hover:text-primary py-1.5 transition-colors font-medium">
                        <span>Browse 300+ government forms free</span>
                        <span className="text-primary">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a href="/#pricing" className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              activePage === "home" ? "text-neutral-500 hover:text-foreground hover:bg-neutral-100" : "text-neutral-500 hover:text-foreground hover:bg-neutral-100"
            }`}>Pricing</a>
            <a href="/#faq" className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-foreground hover:bg-neutral-100 rounded-full transition-all">FAQ</a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => (window as any).openAuth?.()}
              className="text-sm font-medium text-neutral-500 hover:text-foreground transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => (window as any).openPlans?.()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md shadow-primary/20"
            >
              Try free
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-1.5 text-foreground rounded-lg hover:bg-neutral-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-14 flex flex-col md:hidden">
          <div className="px-4 py-5 border-b border-neutral-100">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Tools</p>
            <div className="space-y-1">
              {tools.map((t) => (
                <a key={t.label} href={t.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors ${
                    activePage === t.page ? "bg-primary/8 text-foreground" : "text-neutral-600 hover:bg-neutral-50"
                  }`}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <t.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.label}</p>
                    <p className="text-[11px] text-neutral-400">{t.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 flex-1 overflow-y-auto">
            {[{ label: "Pricing", href: "/#pricing" }, { label: "FAQ", href: "/#faq" }].map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 border-b border-neutral-100 text-sm font-semibold text-foreground last:border-0">
                {label} <span className="text-neutral-400">›</span>
              </a>
            ))}
          </div>
          <div className="px-4 pb-10 pt-4 border-t border-neutral-100 space-y-3">
            <button
              onClick={() => { setMobileOpen(false); setTimeout(() => (window as any).openAuth?.(), 100); }}
              className="flex items-center justify-center w-full border border-neutral-200 text-foreground font-bold rounded-2xl py-3 text-sm"
            >
              Login / Sign up
            </button>
            <button
              onClick={() => { setMobileOpen(false); setTimeout(() => (window as any).openPlans?.(), 100); }}
              className="flex items-center justify-center w-full bg-primary text-primary-foreground font-bold rounded-2xl py-3.5 text-sm shadow-lg shadow-primary/25"
            >
              Try free — upgrade anytime
            </button>
          </div>
        </div>
      )}
    </>
  );
}
