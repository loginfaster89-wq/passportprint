import { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import {
  FileText, Search, Download, Printer, Shield,
  ArrowRight, Lock, Zap, BookOpen,
  Globe, ChevronDown, Star
} from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

const categories = [
  { name: "Aadhaar", count: 8, color: "bg-orange-50 text-orange-700 border-orange-200", desc: "UIDAI forms — enrolment, update, correction, biometric exceptions" },
  { name: "PAN Card", count: 6, color: "bg-blue-50 text-blue-700 border-blue-200", desc: "Income Tax forms — new PAN, correction, surrender, reprint" },
  { name: "Voter ID", count: 5, color: "bg-purple-50 text-purple-700 border-purple-200", desc: "Election Commission — new, correction, address change, deletion" },
  { name: "NPS / Pension", count: 14, color: "bg-green-50 text-green-700 border-green-200", desc: "All NPS subscriber forms for registration, withdrawal, nomination" },
  { name: "Rajasthan", count: 80, color: "bg-pink-50 text-pink-700 border-pink-200", desc: "State forms — eMitra, ration, pension, revenue, police, transport" },
  { name: "Delhi", count: 28, color: "bg-red-50 text-red-700 border-red-200", desc: "Delhi government forms — ration, revenue, labour, transport" },
  { name: "West Bengal", count: 9, color: "bg-yellow-50 text-yellow-700 border-yellow-200", desc: "West Bengal ration and civil forms" },
  { name: "EPFO / PF", count: 2, color: "bg-teal-50 text-teal-700 border-teal-200", desc: "Employee Provident Fund withdrawal and transfer forms" },
  { name: "Transport", count: 22, color: "bg-indigo-50 text-indigo-700 border-indigo-200", desc: "Driving licence, vehicle registration, fitness forms" },
  { name: "Labour / Shops", count: 12, color: "bg-cyan-50 text-cyan-700 border-cyan-200", desc: "Shop Act forms, labour welfare, factory compliance" },
  { name: "Revenue / Land", count: 8, color: "bg-lime-50 text-lime-700 border-lime-200", desc: "Land records, mutation, Jamabandi, income certificate" },
  { name: "Police / Security", count: 6, color: "bg-slate-50 text-slate-700 border-slate-200", desc: "Police verification, NOC, character certificate forms" },
];

const features = [
  { icon: Search, title: "Instant search", desc: "Search by form name, category, state, or department — results in milliseconds." },
  { icon: Download, title: "One-click download", desc: "Direct PDF download — no login, no OTP, no redirection to government sites." },
  { icon: Printer, title: "Print directly", desc: "Print any form directly from browser — desktop or mobile, any printer." },
  { icon: Shield, title: "Official forms only", desc: "All forms sourced from official government portals — always up-to-date." },
  { icon: Globe, title: "All states covered", desc: "Central + state forms — Rajasthan, Delhi, West Bengal, and more added regularly." },
  { icon: Zap, title: "Always free", desc: "The forms library is permanently free — no subscription needed, ever." },
];

export default function Forms() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Kaunse forms hain?", a: "300+ forms: Aadhaar (8 forms), PAN (49A, 49AA, correction), Voter ID (6, 6A, 7, 8), NPS subscriber forms, Rajasthan eMitra, Delhi, West Bengal ration, EPFO, transport, labour, revenue aur police forms." },
    { q: "Kya forms free hain?", a: "Haan, forms library permanently free hai. Download, print — koi signup ya payment nahi chahiye." },
    { q: "Kya forms original government forms hain?", a: "Haan. Sabhi forms official government portals se sourced hain — always up-to-date." },
    { q: "Mobile pe kaam karta hai?", a: "Haan, phone pe search aur download fully supported hai." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav activePage="forms" />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-10 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50/60 via-white to-white" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full px-3.5 py-1.5 mb-5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> 300+ forms · Always free · Official sources
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.55 }}
                className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.06] mb-5">
                300+ Govt Forms.<br /><span className="text-primary">Search &amp; print free.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.5 }}
                className="text-lg text-neutral-500 leading-relaxed mb-7 max-w-md">
                Aadhaar, PAN, Voter ID, NPS, Rajasthan eMitra, Delhi, West Bengal ration — all official Indian government forms in one place. Search, download, print — completely free.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-wrap gap-x-5 gap-y-3 mb-8">
                {[{ icon: BookOpen, label: "300+ forms" }, { icon: Globe, label: "All states" }, { icon: Zap, label: "Instant search" }, { icon: Lock, label: "Always free" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                    <Icon size={14} className="text-primary" /> {label}
                  </div>
                ))}
              </motion.div>
              <motion.a href="#tool" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                Browse All Forms <ArrowRight size={16} />
              </motion.a>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="hidden lg:block">
              <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-6 relative">
                <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-neutral-200 shadow-sm mb-4">
                  <Search size={16} className="text-neutral-400" />
                  <span className="text-sm text-neutral-400">Search: Aadhaar, PAN, Voter ID...</span>
                  <div className="ml-auto bg-neutral-100 rounded-lg px-2 py-1 text-[10px] font-bold text-neutral-500">198 forms</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Aadhaar", "PAN", "Voter ID", "NPS", "Rajasthan", "Delhi"].map((c, i) => (
                    <div key={c} className={`text-[11px] font-bold rounded-full px-3 py-1 border ${i === 0 ? "bg-primary text-white border-primary" : "bg-white text-neutral-500 border-neutral-200"}`}>{c}</div>
                  ))}
                </div>
                {["Form 1 — New Enrolment", "Form 49A — Individual PAN", "Form 6 — New Voter"].map((form, i) => (
                  <div key={form} className="bg-white rounded-xl border border-neutral-100 p-3 mb-2 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold">{form}</p>
                        <p className="text-[10px] text-neutral-400">{["Aadhaar", "Income Tax", "Election"][i]}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg">Print</div>
                      <div className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg">PDF</div>
                    </div>
                  </div>
                ))}
                <div className="text-center text-[11px] text-neutral-400 mt-2">+297 more forms available</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[{ icon: FileText, label: "300+ forms" }, { icon: Shield, label: "Official sources only" }, { icon: Zap, label: "Instant download" }, { icon: Globe, label: "Multiple states" }, { icon: Lock, label: "Always free" }].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
              <Icon size={14} className="text-primary" /> {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── TOOL — FULL WIDTH ── */}
      <section id="tool" className="scroll-mt-16">
        <div className="bg-neutral-50 border-b border-neutral-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <FileText size={13} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-800">Government Forms Library</span>
              <span className="ml-2 text-xs text-neutral-400">— 300+ official Indian forms</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Free forever
          </div>
        </div>
        <iframe
          src="/tool-forms.html"
          title="Government Forms Library"
          className="w-full border-0 block"
          style={{ height: "calc(100vh - 64px)" }}
          allow="clipboard-write"
          loading="eager"
        />
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Forms by category</h2>
            <p className="text-neutral-500 text-lg">12 categories · 300+ forms</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 0.05}>
                <div className={`rounded-2xl border p-5 ${cat.color} hover:shadow-md transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-base">{cat.name}</h3>
                    <span className="text-xs font-bold bg-white/60 rounded-full px-2.5 py-1 border border-white/80">{cat.count} forms</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{cat.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Why use Studio Print forms?</h2>
            <p className="text-neutral-500 text-lg">Fastest way to find and print any Indian government form</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="flex gap-4 bg-white p-5 rounded-2xl border border-neutral-100 hover:border-primary/20 hover:shadow-md transition-all h-full">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <f.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{f.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Common questions</h2>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                  <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                    <span className="font-semibold text-sm pr-4">{faq.q}</span>
                    <ChevronDown size={16} className={`text-neutral-400 shrink-0 transition-transform duration-200 ${faqOpen === i ? "rotate-180" : ""}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">{faq.a}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 sm:px-6 bg-foreground text-background">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <FileText size={40} className="text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Find your form in seconds</h2>
            <p className="text-neutral-400 mb-7">300+ official Indian government forms — search, download, print free.</p>
            <a href="#tool" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
              Browse Forms Library <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
