import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
    </motion.div>
  );
}

export default function Refund() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Legal</p>
          <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Refund Policy</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: May 2026</p>
        </motion.div>

        <Section title="Pro plan refunds">
          <p>We offer a <strong>3-day refund window</strong> for all Pro plan purchases. If you are not satisfied with your Pro subscription, contact us within 3 days of purchase for a full refund — no questions asked.</p>
        </Section>

        <Section title="How to request a refund">
          <p>Email <a href="mailto:support@studioprint.pages.dev" className="text-amber-600 hover:underline">support@studioprint.pages.dev</a> with your registered email and Razorpay payment ID. We will process your refund within 5–7 business days.</p>
        </Section>

        <Section title="After the 3-day window">
          <p>Refunds are not available after the 3-day window unless there was a billing error or a technical issue caused by our service that we cannot resolve within 48 hours of you reporting it.</p>
        </Section>

        <Section title="Free tier">
          <p>The free tier has no charges, so no refund is applicable.</p>
        </Section>

        <Section title="Contact">
          <p>For refund requests: <a href="mailto:support@studioprint.pages.dev" className="text-amber-600 hover:underline">support@studioprint.pages.dev</a></p>
        </Section>
      </div>
    </div>
  );
}
