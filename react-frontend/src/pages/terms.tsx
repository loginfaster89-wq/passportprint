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

export default function Terms() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Legal</p>
          <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: May 2026</p>
        </motion.div>

        <Section title="Acceptance">
          <p>By using Studio Print (studioprint.pages.dev), you agree to these Terms. If you do not agree, please do not use the service.</p>
        </Section>

        <Section title="What Studio Print provides">
          <p>Studio Print provides three browser-based tools:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Passport Photo</strong> — AI background removal, crop, 300 DPI A4 export</li>
            <li><strong>ID Card Print</strong> — Auto-detect and print Indian ID card PDFs</li>
            <li><strong>Forms Hub</strong> — Search and access official Indian government forms</li>
          </ul>
          <p className="mt-2">Tools are provided "as is" for personal and commercial print use. We do not guarantee that outputs will be accepted by any government authority — always verify requirements with the issuing authority.</p>
        </Section>

        <Section title="Free tier">
          <p>The free tier is available to all users without registration. Free tier usage is subject to fair-use limits, including a daily limit on AI background removal calls. We reserve the right to modify or discontinue free features at any time.</p>
        </Section>

        <Section title="Pro plans">
          <p>Pro plans (Weekly ₹59 / Monthly ₹149) unlock unlimited AI processing. Pro plans auto-renew unless cancelled. You may cancel at any time from your account settings. Refunds are subject to our <a href="/refund" className="text-amber-600 hover:underline">Refund Policy</a>.</p>
        </Section>

        <Section title="Permitted use">
          <p>You may use Studio Print for personal, educational, and commercial printing purposes. You may not:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Use the service to create fraudulent documents or submit falsified photos to government authorities</li>
            <li>Reverse-engineer, scrape, or automated-access the service beyond normal browser usage</li>
            <li>Resell or redistribute Studio Print as your own product</li>
          </ul>
        </Section>

        <Section title="Intellectual property">
          <p>The Studio Print website, code, and design are © 2026 Studio Print. Government forms linked from Forms Hub remain the property of their respective government bodies. Your photos and documents remain yours — we make no claim over them.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>Studio Print is not liable for any loss or damage arising from use of the service, including but not limited to rejected passport photos, document processing errors, or printer output quality. Always verify photo and document requirements with the relevant authority.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these Terms? Email <a href="mailto:legal@studioprint.pages.dev" className="text-amber-600 hover:underline">legal@studioprint.pages.dev</a> or use the <a href="/contact" className="text-amber-600 hover:underline">contact form</a>.</p>
        </Section>
      </div>
    </div>
  );
}
