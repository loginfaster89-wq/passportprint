import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import {
  ScanFace, Check, Globe, Shield, Cpu, Printer,
  ArrowRight, Star, Zap, Lock, Camera, Download, ChevronDown
} from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { useState } from "react";

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
  { icon: Cpu, title: "On-device AI", desc: "Background removed using WebAssembly AI — 100% in your browser. Nothing sent to server." },
  { icon: ScanFace, title: "Auto face crop & align", desc: "Facial landmarks detected. Photo auto-cropped to exact biometric specification every time." },
  { icon: Globe, title: "35+ country presets", desc: "India, UK, USA, Schengen, UAE, Australia, Singapore — every size, DPI & background built-in." },
  { icon: Printer, title: "300 DPI A4 print sheet", desc: "10 photos on one A4 sheet with crop guides. Print at home or any counter." },
  { icon: Shield, title: "100% private", desc: "Your photo never leaves your device. No cloud, no storage, no account required." },
  { icon: Zap, title: "Results in 3 seconds", desc: "No waiting, no queue. Done in under 3 seconds on any phone or laptop." },
];

const indiaSizes = [
  { doc: "Passport", size: "2×2 in (51×51 mm)", bg: "White", notes: "Biometric, face 70–80%" },
  { doc: "Aadhaar Enrolment", size: "3.5×4.5 cm", bg: "White", notes: "Colour photo" },
  { doc: "PAN Card", size: "3.5×3.5 cm", bg: "White", notes: "Recent, front-facing" },
  { doc: "Voter ID (EPIC)", size: "3.5×4.5 cm", bg: "White", notes: "Colour or B&W" },
  { doc: "Driving Licence", size: "3.5×4.5 cm", bg: "White", notes: "Front-facing" },
  { doc: "Visa Application", size: "2×2 in (51×51 mm)", bg: "White", notes: "Same as passport" },
];

export default function PassportPhoto() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Kya meri photo safe hai?", a: "Bilkul. Background removal aur processing aapke browser mein hi hoti hai (WebAssembly AI). Koi photo server par upload nahi hoti — sab on-device hai." },
    { q: "Kaun se countries supported hain?", a: "35+ countries: India (passport, Aadhaar, PAN, Voter ID), UK, USA, Canada, Schengen/EU, Australia, UAE, Singapore, Malaysia aur bahut kuch." },
    { q: "Kya mobile pe kaam karta hai?", a: "Haan! Phone camera se seedha photo lo. Android aur iPhone dono pe fully supported." },
    { q: "Output DPI kya hota hai?", a: "Free plan: 72 DPI with light watermark. Paid plan: 300 DPI professional — any print counter pe accepted." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav activePage="passport-photo" />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-10 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50/70 via-white to-white" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full px-3.5 py-1.5 mb-5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> AI-powered · 100% Private · No signup
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.55 }}
                className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.06] mb-5">
                Passport Photo<br /><span className="text-primary">in 30 seconds.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.5 }}
                className="text-lg text-neutral-500 leading-relaxed mb-7 max-w-md">
                Upload any photo. AI removes background, aligns face, crops to exact spec. Download a 300 DPI A4 sheet with 10 photos — ready for any print counter.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-wrap gap-x-5 gap-y-3 mb-8">
                {[{ icon: Shield, label: "Zero uploads" }, { icon: Globe, label: "35+ countries" }, { icon: Printer, label: "300 DPI A4" }, { icon: Zap, label: "3 sec result" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                    <Icon size={14} className="text-primary" /> {label}
                  </div>
                ))}
              </motion.div>
              <motion.a href="#tool" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                Open Tool &amp; Start <ArrowRight size={16} />
              </motion.a>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="hidden lg:block">
              <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-8 relative">
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[35/45] rounded-xl bg-white border-2 border-dashed border-amber-200 relative overflow-hidden shadow-sm">
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-200" />
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-amber-100 rounded-t-full" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {[{ icon: Camera, t: "AI BG Removal" }, { icon: ScanFace, t: "Auto Crop" }, { icon: Printer, t: "300 DPI" }, { icon: Globe, t: "35+ Sizes" }, { icon: Download, t: "Instant Save" }].map(({ icon: Icon, t }) => (
                    <div key={t} className="flex items-center gap-1.5 bg-white border border-amber-100 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-600 shadow-sm">
                      <Icon size={11} className="text-primary" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[{ icon: Star, label: "4.9/5 rating" }, { icon: Globe, label: "35+ countries" }, { icon: Printer, label: "300 DPI export" }, { icon: Shield, label: "100% on-device" }, { icon: Lock, label: "Zero uploads" }].map(({ icon: Icon, label }) => (
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
              <Camera size={13} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-800">Passport Photo AI Tool</span>
              <span className="ml-2 text-xs text-neutral-400">— use it right here, no redirect</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
          </div>
        </div>
        <iframe
          src="/tool-passport-photo.html"
          title="Passport Photo Tool"
          className="w-full border-0 block"
          style={{ height: "calc(100vh - 64px)" }}
          allow="camera; clipboard-write"
          loading="eager"
        />
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Why Studio Print?</h2>
            <p className="text-neutral-500 text-lg">Professional quality — completely free, completely private</p>
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

      {/* ── INDIA SIZES TABLE ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Indian document photo sizes</h2>
            <p className="text-neutral-500">All Indian government photo sizes — built into the tool</p>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-5 py-3.5 font-bold text-neutral-600">Document</th>
                    <th className="text-left px-5 py-3.5 font-bold text-neutral-600">Size</th>
                    <th className="text-left px-5 py-3.5 font-bold text-neutral-600 hidden sm:table-cell">Background</th>
                    <th className="text-left px-5 py-3.5 font-bold text-neutral-600 hidden md:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {indiaSizes.map((row, i) => (
                    <tr key={row.doc} className={`border-b border-neutral-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
                      <td className="px-5 py-3.5 font-semibold">{row.doc}</td>
                      <td className="px-5 py-3.5 text-neutral-600 font-mono text-xs">{row.size}</td>
                      <td className="px-5 py-3.5 text-neutral-500 hidden sm:table-cell">{row.bg}</td>
                      <td className="px-5 py-3.5 text-neutral-400 hidden md:table-cell text-xs">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 sm:px-6 bg-neutral-50">
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
            <ScanFace size={40} className="text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Ready to make your passport photo?</h2>
            <p className="text-neutral-400 mb-7">No signup, no install, no uploads. Results in 30 seconds.</p>
            <a href="#tool" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
              Use the tool — it's free <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
