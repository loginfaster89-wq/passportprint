import { motion } from "framer-motion";
import {
  Camera, CreditCard, FileText, Zap, Shield, Cpu, Printer,
  ArrowRight, CheckCircle, ChevronDown, Star, Globe, Users, Download
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const TOOLS = [
  {
    icon: Camera, title: "Passport Photo", badge: "Free",
    description: "AI background removal, auto-crop to any country size, 300 DPI A4 sheet export — all in your browser.",
    features: ["AI background removal", "50+ country presets", "300 DPI A4 export", "WhatsApp photos work"],
    href: "/passport-photo/", testId: "card-tool-passport-photo",
  },
  {
    icon: CreditCard, title: "ID Card Print", badge: "Free",
    description: "Auto-detects Aadhaar, PAN, ABHA, e-EPIC, Ayushman, eShram, RC, and ration-card PDFs into A4 print sheets.",
    features: ["Auto PDF detection", "CR80 & custom sizes", "8+ ID card types", "A4 print sheets"],
    href: "/id-print/", testId: "card-tool-id-print",
  },
  {
    icon: FileText, title: "Forms Hub", badge: "Free",
    description: "Search 200+ official Indian government forms — ration, PAN, voter, Aadhaar, EPFO and more.",
    features: ["200+ official forms", "Search & filter by state", "Preview first page", "Direct print / download"],
    href: "/forms/", testId: "card-tool-forms-hub",
  },
];

const TRUST = [
  { icon: Zap, title: "Browser-only", desc: "No server uploads. Everything runs on your device." },
  { icon: Shield, title: "100% Private", desc: "Your photos and documents never leave your browser." },
  { icon: Cpu, title: "AI-powered", desc: "On-device AI removes backgrounds in under 2 seconds." },
  { icon: Printer, title: "Print-ready", desc: "300 DPI output optimized for any A4 printer." },
];

const HOW_STEPS = [
  { n: "01", title: "Open a tool", desc: "Pick Passport Photo, ID Card Print, or Forms Hub — no account needed." },
  { n: "02", title: "Upload or search", desc: "Drop your photo, PDF, or search the 200+ forms library by name or state." },
  { n: "03", title: "Preview & adjust", desc: "Crop, position, choose size presets and background colors in the editor." },
  { n: "04", title: "Print or download", desc: "Get a 300 DPI A4 PDF ready to print in seconds — completely free." },
];

const STATS = [
  { value: "200+", label: "Official govt forms", icon: FileText },
  { value: "50+", label: "Photo size presets", icon: Globe },
  { value: "8+", label: "ID card types", icon: CreditCard },
  { value: "0 KB", label: "Uploaded to server", icon: Shield },
];

const USE_CASES = [
  {
    icon: "🖨️",
    title: "Print Shops",
    desc: "Serve walk-in customers faster. No more manual cropping or expensive photo paper waste. Print perfect passport photos and ID cards in seconds.",
    tags: ["Passport photos", "ID card sheets", "Govt forms"],
  },
  {
    icon: "🏢",
    title: "eMitra & CSC Centres",
    desc: "Handle Aadhaar, PAN, voter ID applications at your counter without waiting for slow government portals. Print instantly.",
    tags: ["Aadhaar services", "PAN card", "Voter ID"],
  },
  {
    icon: "🎓",
    title: "Students & Families",
    desc: "Passport renewal, visa application, exam forms — get your documents print-ready at home without visiting a photo studio.",
    tags: ["Passport photo", "Visa application", "Exam forms"],
  },
  {
    icon: "🏪",
    title: "Stationery Shops",
    desc: "Add a new revenue stream. Print government forms and passport photos for your customers without any extra software or hardware investment.",
    tags: ["Government forms", "Walk-in service", "No extra cost"],
  },
];

const PRICING = [
  {
    name: "Free",
    price: "₹0", period: "forever",
    desc: "All three tools, no sign-up required.",
    features: ["Passport Photo tool", "ID Card Print tool", "Forms Hub (200+ forms)", "300 DPI A4 export", "AI background removal (3/day)", "Browser-only processing"],
    cta: "Start for free", href: "/passport-photo/", highlight: false,
  },
  {
    name: "Pro Weekly",
    price: "₹59", period: "/ week",
    desc: "Unlimited access for busy print shops.",
    features: ["Everything in Free", "Unlimited AI background removal", "Bulk passport photo sheets", "Multi-page ID print sheets", "Priority background processing", "No daily limits"],
    cta: "Get Pro Weekly", href: "/passport-photo/#plans", highlight: false,
  },
  {
    name: "Pro Monthly",
    price: "₹149", period: "/ month",
    desc: "Best value for professional print shops.",
    features: ["Everything in Pro Weekly", "Unlimited everything", "Early access to new tools", "Email support", "Commercial use license", "Save ₹87 vs weekly"],
    cta: "Get Pro Monthly", href: "/passport-photo/#plans", highlight: true,
  },
];

const FAQS = [
  { q: "Do I need to create an account?", a: "No. All three tools work without any account or sign-up. Just open the tool and start working immediately." },
  { q: "Are my photos and documents uploaded to any server?", a: "No. Everything is processed entirely in your browser. Your photos and documents never leave your device — not even for AI background removal." },
  { q: "Which passport photo sizes are supported?", a: "50+ presets including India (35×45mm), USA Visa (51×51mm), UK, Schengen, UAE, Australia, and more. You can also set a custom size." },
  { q: "Which ID cards can the ID Print tool handle?", a: "Aadhaar card, PAN card, ABHA card, e-EPIC (Voter ID), Ayushman Bharat, eShram card, vehicle RC, and ration card — it auto-detects which one you uploaded." },
  { q: "Are the government forms on Forms Hub official?", a: "Yes. Every form links to its official government source URL. We host preview images so you can see the form before downloading from the official site." },
  { q: "What is included in Pro?", a: "Pro unlocks unlimited AI background removal (free tier has 3/day), bulk sheets, and no daily limits. Both weekly (₹59) and monthly (₹149) plans are available." },
  { q: "Is Studio Print free for commercial use?", a: "Free tier is for personal use. Pro Monthly (₹149/month) includes a commercial use license for print shops and eMitra counters." },
  { q: "Does it work on mobile?", a: "Yes. All tools are fully responsive. Passport photos from WhatsApp work perfectly — just download the photo and drop it into the tool." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-amber-200">
      <button className="w-full flex items-center justify-between px-6 py-4 text-left gap-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
        <ChevronDown size={18} className="flex-shrink-0 text-gray-400 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{a}</div>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,165,0,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-8 sm:pt-28 sm:pb-12 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial="hidden" animate="show" variants={stagger} className="flex flex-col items-center lg:items-start">
                <motion.div variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-6" style={{ borderColor: "rgba(240,165,0,0.35)", background: "rgba(240,165,0,0.08)", color: "#8a5e00" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    All tools live · Free to start
                  </span>
                </motion.div>
                <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.02] text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Your browser<br />is now a{" "}<span style={{ color: "#F0A500" }}>print studio</span>
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-6 text-lg text-gray-500 max-w-lg leading-relaxed">
                  Passport photos, ID card sheets, and 200+ government forms — processed on-device. No uploads. No account. 100% free to start.
                </motion.p>
                <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-3">
                  <a href="/passport-photo/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: "#F0A500", color: "#000" }}>
                    <Camera size={17} /> Passport Photo
                  </a>
                  <a href="/id-print/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-gray-900 text-white shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5">
                    <CreditCard size={17} /> ID Card Print
                  </a>
                  <a href="/forms/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <FileText size={17} /> Forms Hub
                  </a>
                </motion.div>
                <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400">
                  {["No account required", "No photo uploads", "300 DPI print-ready", "Made in India 🇮🇳"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5"><CheckCircle size={13} className="text-amber-500" /> {t}</span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Hero Visual - Product Cards */}
            <div className="flex-1 w-full max-w-sm lg:max-w-md xl:max-w-lg relative">
              <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
                {/* Main card - passport photo mockup */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-5 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,165,0,0.12)" }}>
                      <Camera size={14} style={{ color: "#F0A500" }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Passport Photo</span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(240,165,0,0.1)", color: "#8a5e00" }}>Step 1 of 4</span>
                  </div>
                  {/* Simulated upload area */}
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Drop your photo here</p>
                    <p className="text-xs text-gray-400 mt-1">WhatsApp, camera, any image · JPG PNG WEBP</p>
                  </div>
                  {/* Size presets */}
                  <div className="grid grid-cols-3 gap-2">
                    {[{ flag: "🇮🇳", name: "India", size: "35×45mm", active: true }, { flag: "🇺🇸", name: "US Visa", size: "51×51mm", active: false }, { flag: "🇬🇧", name: "UK", size: "35×45mm", active: false }].map((p) => (
                      <div key={p.name} className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${p.active ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-200"}`}>
                        <div className="text-base">{p.flag}</div>
                        <div className="text-xs font-semibold text-gray-800 mt-0.5">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.size}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge - AI removal */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -right-4 top-8 bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2 flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,165,0,0.12)" }}>
                    <Cpu size={12} style={{ color: "#F0A500" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">AI BG Removal</p>
                    <p className="text-xs text-gray-400">On-device · 0 uploads</p>
                  </div>
                </motion.div>

                {/* Floating badge - export */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -left-4 bottom-8 bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2 flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-900">
                    <Download size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Export A4 Sheet</p>
                    <p className="text-xs text-gray-400">300 DPI · Print-ready</p>
                  </div>
                </motion.div>

                {/* Forms count badge */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 }}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                >
                  <FileText size={14} style={{ color: "#F0A500" }} />
                  <span className="text-xs font-semibold text-gray-800">200+ govt forms searchable</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-b border-gray-100 bg-gray-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,165,0,0.10)" }}>
                  <Icon size={17} style={{ color: "#F0A500" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28" id="tools">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Three tools, one workspace</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
            Everything a print shop needs
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
            From portrait photos to government forms — Studio Print handles the full print workflow, entirely in your browser.
          </motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOLS.map(({ icon: Icon, title, badge, description, features, href, testId }) => (
            <motion.div key={title} variants={fadeUp} className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 hover:border-amber-300 hover:shadow-xl transition-all duration-300" data-testid={testId}>
              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "#F0A500" }} />
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(240,165,0,0.10)" }}>
                  <Icon size={22} style={{ color: "#F0A500" }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.10)", color: "#15803d" }}>{badge}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>
              <ul className="space-y-1.5 mb-7">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle size={12} style={{ color: "#F0A500", flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <a href={href} className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group-hover:shadow-md" style={{ background: "#F0A500", color: "#000" }}>
                Open Tool <ArrowRight size={15} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WHO USES IT ── */}
      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Built for India</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Who uses Studio Print?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-gray-500 max-w-lg mx-auto leading-relaxed">
              Trusted by print shops, eMitra counters, CSC centres, students, and families across India.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {USE_CASES.map(({ icon, title, desc, tags }) => (
              <motion.div key={title} variants={fadeUp} className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(240,165,0,0.08)", color: "#8a5e00" }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-gray-100" id="how">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">How it works</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Print-ready in 4 steps
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-gray-500 max-w-lg mx-auto leading-relaxed">
              No installation. No account. No waiting. Open the tool and your first output is ready in under 60 seconds.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map(({ n, title, desc }) => (
              <motion.div key={n} variants={fadeUp} className="relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl font-black mb-4 leading-none" style={{ color: "rgba(240,165,0,0.20)", fontFamily: "'Syne', sans-serif" }}>{n}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="border-t border-gray-100 bg-gray-50/50" id="pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Pricing</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Simple, honest pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-gray-500 max-w-lg mx-auto leading-relaxed">
              Start free — no card required. Upgrade when you need unlimited AI processing for your print shop or eMitra counter.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING.map(({ name, price, period, desc, features, cta, href, highlight }) => (
              <motion.div key={name} variants={fadeUp} className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${highlight ? "border-amber-400 bg-amber-50 shadow-xl shadow-amber-100" : "border-gray-200 bg-white hover:border-amber-200 hover:shadow-lg"}`}>
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#F0A500", color: "#000" }}>
                      <Star size={10} fill="#000" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{price}</span>
                    <span className="text-sm text-gray-400 font-medium">{period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 leading-snug">{desc}</p>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#F0A500" }} /> {f}
                    </li>
                  ))}
                </ul>
                <a href={href} className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${highlight ? "hover:shadow-lg hover:-translate-y-0.5" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`} style={highlight ? { background: "#F0A500", color: "#000" } : {}}>
                  {cta} {highlight && <ArrowRight size={15} />}
                </a>
              </motion.div>
            ))}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs text-gray-400 mt-8">
            All plans include secure UPI / Card / Netbanking payment via Razorpay. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-gray-100" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Frequently asked
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="space-y-3">
            {FAQS.map((item) => (
              <motion.div key={item.q} variants={fadeUp}><FaqItem {...item} /></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-gray-100 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-white max-w-xl mx-auto" style={{ fontFamily: "'Syne', sans-serif" }}>
              Start printing in <span style={{ color: "#F0A500" }}>seconds</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-gray-400 max-w-md mx-auto leading-relaxed">
              No sign-up. No app download. Open any tool and your first output is free — forever.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/passport-photo/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: "#F0A500", color: "#000" }}>
                <Camera size={17} /> Passport Photo Tool
              </a>
              <a href="/id-print/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-200">
                <CreditCard size={17} /> ID Card Print Tool
              </a>
              <a href="/forms/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200">
                <FileText size={17} /> Forms Hub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
