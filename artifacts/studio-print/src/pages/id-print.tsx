import { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import {
  FileCheck, Shield, Printer, Layers, Cpu,
  ArrowRight, Lock, Zap, Users, Star, CheckCircle2,
  Building2, School, Medal, HardHat, ChevronDown, Download
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

const features = [
  { icon: Layers, title: "Front & back design", desc: "Design both sides of the card on one canvas with pixel-perfect alignment." },
  { icon: Printer, title: "300 DPI print sheet", desc: "Export print-ready A4 PDF with multiple cards and crop marks." },
  { icon: Shield, title: "100% private", desc: "All processing on your device — nothing sent to server, ever." },
  { icon: Cpu, title: "AI detection", desc: "Auto-detects Aadhaar, PAN, Voter ID, ABHA, eShram, RC and more." },
  { icon: Users, title: "Batch printing", desc: "Add multiple cards and print all on one A4 sheet at once." },
  { icon: Zap, title: "Instant export", desc: "One click → perfectly sized, print-counter-ready PDF." },
];

const useCases = [
  { icon: School, title: "School / College IDs", desc: "Student and staff ID cards with photo, name, roll number, and department.", color: "from-blue-50 to-indigo-50 border-blue-100" },
  { icon: Building2, title: "Office / Corporate", desc: "Employee access cards with designation, department, and company logo.", color: "from-emerald-50 to-teal-50 border-emerald-100" },
  { icon: Medal, title: "Club & Society", desc: "Membership cards, library cards, gym IDs — any card format.", color: "from-purple-50 to-pink-50 border-purple-100" },
  { icon: HardHat, title: "Vendor / Contractor", desc: "Visitor passes and temporary contractor IDs for site access.", color: "from-amber-50 to-orange-50 border-amber-100" },
];

export default function IdPrint() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Kaun kaun se card formats supported hain?", a: "Aadhaar, PAN, Voter ID (e-EPIC), ABHA, Ayushman, Jan Aadhaar, eShram, RC — sabhi auto-detected hote hain." },
    { q: "Batch printing kya hai?", a: "Multiple log ke cards ek saath design karo aur sab ek A4 pe print karo — counter workflow ke liye perfect." },
    { q: "Kya PVC card ke liye use kar sakte hain?", a: "Haan! PVC tray preset aur CR80 format built-in hai. Lamination-ready output milta hai." },
    { q: "Kya data safe hai?", a: "Bilkul. Sab kuch aapke browser mein hi hota hai. Koi bhi data ya photo server par nahi jata." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav activePage="id-print" />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-10 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/60 via-white to-white" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full px-3.5 py-1.5 mb-5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> AI-powered · 300 DPI · No software
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.55 }}
                className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.06] mb-5">
                ID Card Studio.<br /><span className="text-primary">Print-ready in 60 sec.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.5 }}
                className="text-lg text-neutral-500 leading-relaxed mb-7 max-w-md">
                Drop any Aadhaar, PAN, Voter ID PDF. AI detects card layout, cleans preview, and builds A4, 4×6 or PVC-ready output — all without leaving your browser.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-wrap gap-x-5 gap-y-3 mb-8">
                {[{ icon: Shield, label: "Zero uploads" }, { icon: Layers, label: "Front & back" }, { icon: Users, label: "Batch print" }, { icon: Printer, label: "CR80 & A4" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                    <Icon size={14} className="text-primary" /> {label}
                  </div>
                ))}
              </motion.div>
              <motion.a href="#tool" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                Open ID Card Studio <ArrowRight size={16} />
              </motion.a>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="hidden lg:block">
              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8 relative">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-8 translate-x-8" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-14 rounded-xl bg-neutral-600 border-2 border-neutral-500" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-white/40 rounded-full" />
                        <div className="h-2 w-20 bg-white/25 rounded-full" />
                        <div className="h-2 w-16 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-md border border-neutral-100">
                    <div className="space-y-2">
                      <div className="h-2 w-32 bg-neutral-200 rounded-full" />
                      <div className="h-2 w-24 bg-neutral-100 rounded-full" />
                      <div className="h-12 w-full bg-neutral-800 rounded-lg mt-3" />
                    </div>
                  </div>
                </div>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -left-8 top-10 bg-white rounded-2xl shadow-xl border border-neutral-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <div><p className="text-[11px] font-bold">CR80 · 300 DPI · PVC</p><p className="text-[10px] text-neutral-400">Print-ready</p></div>
                  </div>
                </motion.div>
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -right-8 bottom-10 bg-white rounded-2xl shadow-xl border border-neutral-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-primary" />
                    <div><p className="text-[11px] font-bold">12 cards · 1 A4</p><p className="text-[10px] text-neutral-400">Batch printed</p></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[{ icon: Star, label: "4.9/5 rating" }, { icon: Users, label: "Batch printing" }, { icon: Printer, label: "300 DPI export" }, { icon: Shield, label: "100% on-device" }, { icon: Lock, label: "Zero uploads" }].map(({ icon: Icon, label }) => (
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
              <FileCheck size={13} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-800">ID Card Studio</span>
              <span className="ml-2 text-xs text-neutral-400">— drop your PDF, AI does the rest</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
          </div>
        </div>
        <iframe
          src="/tool-id-print.html"
          title="ID Card Studio"
          className="w-full border-0 block"
          style={{ height: "calc(100vh - 64px)" }}
          allow="camera; clipboard-write"
          loading="eager"
        />
      </section>

      {/* ── USE CASES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Who uses ID Card Studio?</h2>
            <p className="text-neutral-500 text-lg">Any card format, any organisation</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.08}>
                <div className={`rounded-3xl bg-gradient-to-br ${u.color} border p-6 h-full hover:shadow-lg transition-all`}>
                  <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <u.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-extrabold text-base mb-2">{u.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{u.desc}</p>
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
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Everything you need</h2>
            <p className="text-neutral-500 text-lg">Professional ID cards — no designer, no software</p>
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
            <FileCheck size={40} className="text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Ready to print ID cards?</h2>
            <p className="text-neutral-400 mb-7">No signup, no install, no uploads. Results in 60 seconds.</p>
            <a href="#tool" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
              Open ID Card Studio <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
