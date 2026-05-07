import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ScanFace, FileText, FileCheck, Printer,
  Shield, CheckCircle2, ChevronRight, ChevronDown,
  Cpu, Smartphone, ArrowRight, Zap, Lock,
  Users, Store, GraduationCap, Star, Globe, BookOpen,
  TrendingUp, Award, Quote, Sparkles, Download, Clock
} from "lucide-react";
import SiteFooter from "@/components/site-footer";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

function CountUp({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / 80);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>;
}

const tools = [
  {
    icon: ScanFace,
    title: "Passport Photo",
    badge: "Live",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "from-amber-50 to-orange-50",
    accent: "bg-amber-500",
    desc: "AI removes background automatically. 35+ country sizes. Print-ready 300 DPI A4 sheet with 10 photos and cut guides.",
    tags: ["AI Background Removal", "35+ Countries", "300 DPI A4"],
    href: "/passport-photo",
    cta: "Open Passport Photo Tool"
  },
  {
    icon: FileCheck,
    title: "ID Card Studio",
    badge: "Live",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    desc: "Design front & back ID cards. School, office, club — any card format. Batch print multiple people on one A4.",
    tags: ["Front & Back", "Batch Print", "Custom Templates"],
    href: "/id-print",
    cta: "Open ID Card Studio"
  },
  {
    icon: FileText,
    title: "Forms Library",
    badge: "Free",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    color: "from-purple-50 to-pink-50",
    accent: "bg-purple-500",
    desc: "300+ official Indian government forms. Aadhaar, PAN, Voter ID, NPS, state forms — search, fill, download free.",
    tags: ["300+ Forms", "Free Download", "All States"],
    href: "/forms",
    cta: "Browse Government Forms"
  }
];

const stats = [
  { icon: Users, num: 50000, suffix: "+", label: "Users across India" },
  { icon: FileText, num: 300, suffix: "+", label: "Government forms" },
  { icon: Globe, num: 35, suffix: "+", label: "Country presets" },
  { icon: Download, num: 2, suffix: "M+", label: "Documents created" },
];

const features = [
  { icon: Lock, title: "100% Private", desc: "All AI processing happens in your browser. Your photos and documents never leave your device — zero uploads, ever." },
  { icon: Zap, title: "Instant — No Signup", desc: "Open the tool and start immediately. No account, no install, no waiting. Results in under 5 seconds." },
  { icon: Printer, title: "300 DPI Professional", desc: "Print-ready output with crop marks — identical quality to a ₹500 photo studio counter." },
  { icon: Smartphone, title: "Any Device", desc: "Phone, tablet, laptop — same full-feature experience on every screen. Take photos directly from your camera." },
  { icon: Globe, title: "35+ Countries", desc: "Every passport photo spec — size, DPI, background — built in for India and 34 other countries worldwide." },
  { icon: BookOpen, title: "300+ Govt Forms", desc: "Aadhaar, PAN, Voter ID, NPS, Rajasthan, Delhi, West Bengal — all pre-loaded and ready to print free." },
];

const howItWorks = [
  { n: "01", title: "Upload or capture", desc: "Upload from your gallery or click directly from your phone camera. JPG, PNG, PDF all work.", icon: Smartphone },
  { n: "02", title: "AI does the work", desc: "On-device AI removes background, aligns face, adjusts to exact specification — all in under 3 seconds.", icon: Cpu },
  { n: "03", title: "Download & print", desc: "Get a 300 DPI A4 PDF. Take it to any print counter or print at home — perfect first time.", icon: Printer },
];

const testimonials = [
  { name: "Ramesh Sharma", role: "Xerox Shop, Jaipur", avatar: "RS", rating: 5, text: "Mere counter ka kaam 3x fast ho gaya. Passport photo 2 minute mein ready, customers bahut khush hain." },
  { name: "Priya Mehta", role: "Student, Delhi University", avatar: "PM", rating: 5, text: "College admission ke liye passport photo chahiye tha. 1 minute mein perfect — white background, sahi size." },
  { name: "Suresh Kumar", role: "Government Staff, Lucknow", avatar: "SK", rating: 5, text: "Aadhaar, PAN, Voter — sabhi forms ek jagah. 300+ forms free mein. Office mein sab use karte hain." },
  { name: "Kavita Patel", role: "HR Manager, Ahmedabad", avatar: "KP", rating: 5, text: "50 employees ke ID cards ek A4 pe batch print. No software, no designer. Studio Print ne easy kar diya." },
];

const faqs = [
  { q: "Kya mera data safe hai?", a: "Bilkul. Studio Print ka AI aapke browser mein hi chalti hai (WebAssembly). Koi bhi photo ya document server par upload nahi hoti — sab kuch aapke device par hi rehta hai." },
  { q: "Kaun kaun se Indian government forms hain?", a: "300+ forms: Aadhaar (8 forms), PAN (49A, 49AA, correction), Voter ID (6, 6A, 7, 8), NPS subscriber forms, Rajasthan state forms, Delhi forms, West Bengal ration forms, EPFO, aur bahut kuch." },
  { q: "Kaun kaun se countries ke passport photo sizes hain?", a: "35+ countries: India (passport, Aadhaar, PAN, Voter), UK (35×45mm), USA (2×2 in), Schengen/EU, Canada, Australia, UAE, Singapore, Malaysia, aur aur bhi." },
  { q: "Kya account banana zaroori hai?", a: "Nahi. Sabhi tools bina signup ke kaam karte hain. Account sirf preferences sync karne aur paid plan lene ke liye chahiye." },
  { q: "Output kaun sa DPI hota hai?", a: "Professional 300 DPI — any print counter pe accepted. Free tier 72 DPI with light watermark export karta hai." },
  { q: "Mobile phone pe kaam karta hai?", a: "Haan, fully responsive. Android aur iPhone dono pe perfectly kaam karta hai — seedha camera se photo le sakte ho." },
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Individual use — forms library always free",
    features: ["Passport photo (72 DPI, watermark)", "ID card designer (2 sheets/day)", "300+ forms download — free forever", "35+ country presets", "No account required"],
    cta: "Start Free",
    href: "/passport-photo",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹149",
    period: "/month",
    desc: "For regular users & print shops",
    features: ["Unlimited 300 DPI exports", "No watermark", "Batch ID card printing", "All country presets", "Priority AI background removal", "HD 600 DPI export"],
    cta: "Get Pro",
    href: "/passport-photo",
    highlight: true,
    badge: "Most Popular"
  },
  {
    name: "Annual",
    price: "₹999",
    period: "/year",
    desc: "Best value — save ₹789 vs monthly",
    features: ["Everything in Pro", "₹999 one-time/year", "Priority support", "Early access to new tools", "Commercial use licence"],
    cta: "Get Annual",
    href: "/passport-photo",
    highlight: false,
    badge: "Best Value"
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground font-sans">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/96 backdrop-blur-xl border-b border-neutral-200 shadow-sm" : "bg-white border-b border-neutral-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Printer size={14} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">Studio Print</span>
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 border border-primary/20 ml-1">
              <Sparkles size={8} /> India #1
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-0.5">
            {[{ label: "Passport Photo", href: "/passport-photo" }, { label: "ID Card Studio", href: "/id-print" }, { label: "Forms Library", href: "/forms" }, { label: "Pricing", href: "#pricing" }].map(({ label, href }) => (
              <a key={label} href={href} className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-foreground hover:bg-neutral-100 rounded-full transition-colors">{label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="#pricing" className="text-sm font-medium text-neutral-500 hover:text-foreground transition-colors">Login</a>
            <a href="/passport-photo" className="bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-full shadow-sm hover:shadow-md shadow-primary/20 transition-all">Try free</a>
          </div>
          <button className="md:hidden p-1.5 rounded-lg hover:bg-neutral-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <span className="text-lg font-bold">✕</span> : <span className="text-lg">☰</span>}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-14 flex flex-col">
          <div className="px-4 py-4 flex flex-col gap-1 flex-1">
            {[{ label: "Passport Photo", href: "/passport-photo" }, { label: "ID Card Studio", href: "/id-print" }, { label: "Forms Library", href: "/forms" }, { label: "Pricing", href: "#pricing" }].map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)} className="py-4 text-base font-semibold border-b border-neutral-100 flex items-center justify-between">
                {label} <ChevronRight size={16} className="text-neutral-400" />
              </a>
            ))}
          </div>
          <div className="px-4 pb-10">
            <a href="/passport-photo" className="flex items-center justify-center w-full bg-primary text-primary-foreground font-bold rounded-2xl py-3.5 text-sm">Try free — no signup</a>
          </div>
        </div>
      )}

      <main>

        {/* ── HERO ── */}
        <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50/60 via-white to-white" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full px-3.5 py-1.5 mb-6">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  50,000+ users · India's #1 browser-native print tool
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-foreground">
                  Passport photos.<br />
                  ID cards.<br />
                  <span className="text-primary">Govt forms.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.5 }}
                  className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
                  Professional print-ready documents from your browser — AI-powered, completely private, works on any device. No studio, no software, no uploads.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a href="/passport-photo" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                    Try free — no signup <ArrowRight size={16} />
                  </a>
                  <a href="/forms" className="flex items-center justify-center gap-2 border border-neutral-200 text-foreground font-semibold px-7 py-3.5 rounded-2xl text-base hover:bg-neutral-50 transition-all">
                    Browse 300+ forms <FileText size={16} />
                  </a>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-wrap gap-x-5 gap-y-2.5">
                  {[
                    { icon: Shield, label: "Zero data uploads" },
                    { icon: Cpu, label: "On-device AI" },
                    { icon: Printer, label: "300 DPI output" },
                    { icon: Globe, label: "35+ countries" },
                    { icon: Clock, label: "Results in 3 sec" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-sm text-neutral-500 font-medium">
                      <Icon size={13} className="text-primary" /> {label}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Hero Visual */}
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block relative">
                <div className="rounded-3xl border border-neutral-200 shadow-2xl shadow-black/10 overflow-hidden bg-white">
                  <div className="h-10 bg-neutral-50 border-b border-neutral-100 flex items-center px-4 gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-300" />
                      <div className="w-3 h-3 rounded-full bg-amber-300" />
                      <div className="w-3 h-3 rounded-full bg-green-300" />
                    </div>
                    <div className="flex-1 bg-white border border-neutral-200 rounded-lg h-6 flex items-center px-3 text-[11px] text-neutral-400 max-w-xs mx-auto gap-1">
                      <Lock size={8} className="text-primary" /> studioprint.pages.dev/passport-photo
                    </div>
                  </div>
                  <div className="flex" style={{ minHeight: 280 }}>
                    <div className="w-44 border-r border-neutral-100 bg-neutral-50 p-3 flex flex-col gap-0.5">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2">Workspace</p>
                      {[{ icon: ScanFace, label: "Passport Photo", active: true }, { icon: FileCheck, label: "ID Card Studio" }, { icon: FileText, label: "Forms Hub" }].map(({ icon: Icon, label, active }) => (
                        <div key={label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium ${active ? "bg-white shadow-sm border border-neutral-200 text-foreground" : "text-neutral-400"}`}>
                          <Icon size={12} className={active ? "text-primary" : ""} /> {label}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-[13px]">Passport Photo</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">LIVE</span>
                          </div>
                          <p className="text-[10px] text-neutral-400">India 2×2 in · White · Biometric ✓</p>
                        </div>
                        <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg">Export</div>
                      </div>
                      <div className="flex-1 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center p-4">
                        <div className="grid grid-cols-5 gap-1.5 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="w-9 h-12 rounded border border-dashed border-neutral-200 bg-[#f0ece4] relative overflow-hidden">
                              <div className="w-5 h-5 rounded-full bg-[#d4c4a8] absolute top-1 left-1/2 -translate-x-1/2" />
                              <div className="absolute bottom-0 w-full h-5 rounded-t-full bg-[#c4b498]" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-neutral-400 text-center">10 photos · A4 · 300 DPI · Cut guides included</div>
                    </div>
                  </div>
                </div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-12 top-12 bg-white border border-neutral-200 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Background removed</p>
                    <p className="text-[10px] text-neutral-400">AI · 0.8 seconds</p>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-10 bottom-12 bg-white border border-neutral-200 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                    <Printer size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Print-ready A4</p>
                    <p className="text-[10px] text-neutral-400">300 DPI · Cut guides</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="border-y border-neutral-100 bg-neutral-50 py-8 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, num, suffix, label }) => (
              <Reveal key={label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon size={20} className="text-primary" />
                </div>
                <div className="text-3xl font-extrabold text-foreground">
                  <CountUp end={num} suffix={suffix} />
                </div>
                <div className="text-sm text-neutral-500 mt-1">{label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TOOLS ── */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-bold rounded-full px-3 py-1.5 mb-4 border border-primary/15">
                <Sparkles size={11} /> 3 Professional Tools
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need to print</h2>
              <p className="text-lg text-neutral-500 max-w-xl mx-auto">Three powerful tools, one browser — no software, no studio, no uploads.</p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {tools.map((tool, i) => (
                <Reveal key={tool.title} delay={i * 0.1}>
                  <div className={`rounded-3xl bg-gradient-to-br ${tool.color} border border-neutral-200 p-7 flex flex-col h-full hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 group`}>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                        <tool.icon size={22} className="text-primary" />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>{tool.badge}</span>
                    </div>
                    <h3 className="text-xl font-extrabold mb-3">{tool.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-5 flex-1">{tool.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-semibold text-neutral-600 bg-white/70 border border-neutral-200 rounded-full px-2.5 py-1">{tag}</span>
                      ))}
                    </div>
                    <a href={tool.href} className="flex items-center justify-center gap-2 bg-white border border-neutral-200 text-foreground font-bold rounded-2xl py-3 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group-hover:shadow-md">
                      {tool.cta} <ArrowRight size={14} />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-20 px-4 sm:px-6 bg-neutral-50">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">How it works</h2>
              <p className="text-neutral-500 text-lg">From photo to print in 3 simple steps</p>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {howItWorks.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.12}>
                  <div className="bg-white rounded-3xl p-7 border border-neutral-200 hover:shadow-lg transition-all h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-black text-primary/15">{step.n}</span>
                      <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <step.icon size={18} className="text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-extrabold mb-2">{step.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Why Studio Print?</h2>
              <p className="text-neutral-500 text-lg max-w-lg mx-auto">Built for India — fast, private, professional.</p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="flex gap-4 p-5 rounded-2xl border border-neutral-100 hover:border-primary/20 hover:bg-primary/2 transition-all">
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

        {/* ── WHO USES ── */}
        <section className="py-20 px-4 sm:px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Who uses Studio Print?</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Store, title: "Print Shop & Xerox Counters", desc: "Deliver professional passport photos and ID cards in 2 minutes. No expensive photo software. Works on any counter device.", color: "bg-amber-50 border-amber-100" },
                { icon: GraduationCap, title: "Students & Job Seekers", desc: "Passport photos for college admissions, government applications, and job forms. Free Aadhaar, PAN, Voter forms included.", color: "bg-blue-50 border-blue-100" },
                { icon: Users, title: "Home & Family", desc: "Handle all family document needs from your phone. No studio visit, no queue, no ₹200 photo counter bill.", color: "bg-purple-50 border-purple-100" },
              ].map((a, i) => (
                <Reveal key={a.title} delay={i * 0.1}>
                  <div className={`rounded-3xl p-7 border ${a.color} h-full`}>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-neutral-100">
                      <a.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3">{a.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">What users say</h2>
              <div className="flex items-center justify-center gap-2 text-neutral-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                <span className="text-sm ml-1">4.9/5 from 2,000+ reviews</span>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div className="bg-white border border-neutral-100 rounded-3xl p-5 flex flex-col h-full hover:shadow-lg transition-all">
                    <Quote size={20} className="text-primary/30 mb-3" />
                    <p className="text-sm text-neutral-600 leading-relaxed flex-1 mb-4">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                      <div>
                        <p className="text-xs font-bold">{t.name}</p>
                        <p className="text-[11px] text-neutral-400">{t.role}</p>
                      </div>
                      <div className="ml-auto flex">
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={10} className="fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-20 px-4 sm:px-6 bg-neutral-50 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Simple pricing</h2>
              <p className="text-neutral-500 text-lg">Start free. Upgrade when you need unlimited.</p>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 0.1}>
                  <div className={`rounded-3xl p-7 border flex flex-col h-full relative ${
                    plan.highlight ? "bg-foreground text-background border-foreground shadow-2xl shadow-black/20" : "bg-white border-neutral-200"
                  }`}>
                    {plan.badge && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-black rounded-full px-3 py-1 ${
                        plan.highlight ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                      }`}>{plan.badge}</div>
                    )}
                    <div className="mb-6">
                      <p className={`text-sm font-bold mb-1 ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>{plan.name}</p>
                      <div className="flex items-end gap-1 mb-2">
                        <span className={`text-4xl font-black ${plan.highlight ? "text-background" : "text-foreground"}`}>{plan.price}</span>
                        <span className={`text-sm mb-1 ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>{plan.period}</span>
                      </div>
                      <p className={`text-xs ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>{plan.desc}</p>
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? "text-primary" : "text-emerald-500"}`} />
                          <span className={plan.highlight ? "text-neutral-200" : "text-neutral-600"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={plan.href} className={`flex items-center justify-center font-bold rounded-2xl py-3 text-sm transition-all ${
                      plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-neutral-100 text-foreground hover:bg-neutral-200 border border-neutral-200"
                    }`}>{plan.cta}</a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-20 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-2xl mx-auto">
            <Reveal className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Frequently asked questions</h2>
            </Reveal>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-sm pr-4">{faq.q}</span>
                      <ChevronDown size={16} className={`text-neutral-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">{faq.a}</div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 sm:px-6 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                <Printer size={24} className="text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Ready to print professional documents?</h2>
              <p className="text-neutral-400 text-lg mb-8">No signup, no install. Open the tool and start in seconds.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/passport-photo" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                  Open Passport Photo Tool <ArrowRight size={18} />
                </a>
                <a href="/forms" className="flex items-center justify-center gap-2 border border-neutral-700 text-background font-semibold px-8 py-4 rounded-2xl text-base hover:bg-neutral-800 transition-all">
                  Browse Free Forms
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <SiteFooter />

      </main>
    </div>
  );
}
