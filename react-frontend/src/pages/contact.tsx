import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Open mailto with filled content
    const body = encodeURIComponent(`Name: ${form.name}\n\n${form.message}`);
    window.location.href = `mailto:support@studioprint.pages.dev?subject=${encodeURIComponent(form.subject || "Studio Print enquiry")}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="bg-white">
      <section className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,165,0,0.07) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center relative">
          <motion.div initial="hidden" animate="show" variants={stagger} className="flex flex-col items-center">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4">Contact</motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Get in touch
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-gray-500 max-w-md leading-relaxed">
              Questions about a tool, a Pro plan, or a partnership? We reply within 24 hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-gray-200">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "rgba(240,165,0,0.10)" }}>
                <Mail size={18} style={{ color: "#F0A500" }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Email</h3>
              <a href="mailto:support@studioprint.pages.dev" className="text-sm text-amber-600 hover:underline">support@studioprint.pages.dev</a>
            </div>
            <div className="p-5 rounded-2xl border border-gray-200">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "rgba(240,165,0,0.10)" }}>
                <MessageSquare size={18} style={{ color: "#F0A500" }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Response time</h3>
              <p className="text-sm text-gray-500">Within 24 hours on business days</p>
            </div>
          </div>

          <div className="md:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-16 text-center"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(240,165,0,0.10)" }}>
                  <ArrowRight size={24} style={{ color: "#F0A500" }} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Opening your email app…</h3>
                <p className="text-sm text-gray-500">Your message has been pre-filled. Send it from your email client.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-amber-600 hover:underline">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial="hidden" animate="show" variants={stagger}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div variants={fadeUp}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your name</label>
                    <input
                      type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </motion.div>
                </div>
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
                  <select
                    value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-white"
                  >
                    <option value="">Select a topic…</option>
                    <option value="Tool issue — Passport Photo">Tool issue — Passport Photo</option>
                    <option value="Tool issue — ID Card Print">Tool issue — ID Card Print</option>
                    <option value="Tool issue — Forms Hub">Tool issue — Forms Hub</option>
                    <option value="Pro plan / billing">Pro plan / billing</option>
                    <option value="Refund request">Refund request</option>
                    <option value="Partnership enquiry">Partnership enquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your question or issue…"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    style={{ background: "#F0A500", color: "#000" }}
                  >
                    Send message <ArrowRight size={15} />
                  </button>
                </motion.div>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
