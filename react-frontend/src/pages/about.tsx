import { motion } from "framer-motion";
import { Shield, Cpu, Printer, Globe, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const VALUES = [
  { icon: Shield, title: "Privacy first", desc: "Every tool runs entirely in your browser. Your photos, PDFs, and documents are never uploaded to any server — not even ours." },
  { icon: Cpu, title: "On-device AI", desc: "We use WebAssembly and ONNX to run AI models locally. Background removal, face detection, and document parsing — all on your device." },
  { icon: Printer, title: "Print-ready output", desc: "Every export is optimized for real-world printing: 300 DPI, correct colour profiles, proper bleed margins, and A4 dimensions." },
  { icon: Globe, title: "Built for India", desc: "Designed for Indian print shops, eMitra counters, CSC centres, and home users — with Indian ID cards, government forms, and passport standards." },
];

export default function About() {
  return (
    <div className="bg-white">
      <section className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,165,0,0.07) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-20 text-center relative">
          <motion.div initial="hidden" animate="show" variants={stagger} className="flex flex-col items-center">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4">About</motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              We believe print should be free, fast, and private
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-gray-500 leading-relaxed max-w-2xl">
              Studio Print is a browser-native print workspace — no apps, no accounts, no uploads. Built in India to serve the millions of people who need professional print outputs every day.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="p-6 rounded-2xl border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(240,165,0,0.10)" }}>
                <Icon size={20} style={{ color: "#F0A500" }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Our story</motion.h2>
            <motion.div variants={fadeUp} className="space-y-5 text-gray-600 leading-relaxed">
              <p>Studio Print started as a simple question: <em>"Why do people still pay ₹50–₹200 at a photocopy shop just to print a passport photo?"</em> The answer was that there was no good, free, private tool to do it at home or at an eMitra counter.</p>
              <p>We built the Passport Photo tool first — AI background removal, country-specific crop presets, and 300 DPI A4 export — all running in the browser. No uploads, no account, no waiting for a server.</p>
              <p>Then came the ID Card Print tool, because Aadhaar and PAN cards are printed every day at thousands of counters across India, and the existing tools were either slow, expensive, or required sending PDFs to unknown servers.</p>
              <p>Forms Hub followed — 200+ official Indian government forms, all searchable and previewable, linking directly to official sources.</p>
              <p>Today, Studio Print is used by print shops, eMitra operators, students, and families across India. We're independent, bootstrapped, and committed to keeping the core tools free forever.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Try it now — it's free</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mb-8">No account. No credit card. Open a tool and your first output is ready in seconds.</motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/passport-photo/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5" style={{ background: "#F0A500", color: "#000" }}>
                Open Passport Photo <ArrowRight size={15} />
              </a>
              <a href="/forms/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                Browse Forms Hub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
