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

export default function Privacy() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Legal</p>
          <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: May 2026</p>
        </motion.div>

        <Section title="The short version">
          <p><strong>Studio Print does not collect, store, or transmit your photos, documents, or personal files.</strong> Every tool runs entirely in your browser. Your data never leaves your device.</p>
        </Section>

        <Section title="What we collect">
          <p>We collect minimal, anonymous usage data to understand how tools are used and to improve the product:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Page views and tool usage counts (anonymous, no personal data)</li>
            <li>Browser type and device type (for compatibility)</li>
            <li>Country (for region-specific form availability)</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> collect: your name, email, photos, PDFs, documents, or any personally identifiable information unless you create a Pro account.</p>
        </Section>

        <Section title="Your photos and documents">
          <p>Photos and PDFs you open in Passport Photo, ID Card Print, or Forms Hub are processed entirely in your browser using JavaScript, WebAssembly, and on-device AI models. <strong>They are never uploaded to any server.</strong></p>
          <p>The only exception is the AI background removal feature, which may call our processing server (<code>passportprint-studio.onrender.com</code>) for accelerated removal on lower-end devices. In this case, your image is transmitted over HTTPS, processed immediately, and not stored.</p>
        </Section>

        <Section title="Pro accounts">
          <p>If you purchase a Pro plan, we collect:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Email address (for account management)</li>
            <li>Payment information (processed by Razorpay — we do not store card details)</li>
            <li>Plan and purchase history</li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>We use a single essential cookie to remember your preference for the cookie consent banner. We do not use advertising or tracking cookies. If you upgrade to Pro, a session cookie stores your login state.</p>
        </Section>

        <Section title="Third-party services">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Razorpay</strong> — payment processing for Pro plans</li>
            <li><strong>Cloudflare Pages</strong> — website hosting and CDN</li>
            <li><strong>Render.com</strong> — optional AI background removal server</li>
          </ul>
          <p className="mt-2">Each of these services has their own privacy policy. We do not share your data with any advertising networks or data brokers.</p>
        </Section>

        <Section title="Contact">
          <p>For privacy questions, email us at <a href="mailto:privacy@studioprint.pages.dev" className="text-amber-600 hover:underline">privacy@studioprint.pages.dev</a> or use the <a href="/contact" className="text-amber-600 hover:underline">contact form</a>.</p>
        </Section>
      </div>
    </div>
  );
}
