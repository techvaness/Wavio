import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const sections = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us when you create an account, use our services, or contact us for support. This includes:

• **Account information**: name, email address, company name, and password.
• **Workspace data**: conversations, contacts, and files you upload to Wavio.
• **Usage data**: features you use, pages you visit, and actions you take within the platform.
• **Device information**: IP address, browser type, operating system, and referring URLs.
• **Payment information**: processed securely via Stripe. We do not store raw card numbers.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:

• Provide, maintain, and improve the Wavio platform.
• Process transactions and send related information (receipts, invoices).
• Send technical notices, updates, and support messages.
• Respond to your comments and questions.
• Monitor and analyze usage patterns to improve the product.
• Detect and prevent fraudulent transactions and other illegal activities.

We do not sell your personal data. We do not use your conversation data to train our AI models.`,
  },
  {
    title: '3. Data Sharing',
    body: `We share your information only in the following circumstances:

• **With service providers**: third-party vendors who help us operate the platform (e.g., cloud hosting, payment processing). They are bound by contractual confidentiality obligations.
• **For legal reasons**: if required by applicable law, regulation, or legal process.
• **Business transfers**: in connection with a merger, acquisition, or sale of assets, with advance notice to you.
• **With your consent**: for any other purpose with your explicit consent.`,
  },
  {
    title: '4. Data Retention',
    body: `We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting privacy@wavio.io. We will respond within 30 days.

Conversation data is retained for the period specified in your plan. Enterprise customers may configure custom retention periods.`,
  },
  {
    title: '5. Security',
    body: `We implement industry-standard security measures including:

• TLS 1.3 encryption for all data in transit.
• AES-256 encryption for data at rest.
• Regular security audits and penetration testing.
• Role-based access controls and audit logs.
• SOC 2 Type II certification in progress (expected Q3 2025).`,
  },
  {
    title: '6. Your Rights (GDPR)',
    body: `If you are located in the European Economic Area, you have the following rights:

• **Access**: request a copy of the personal data we hold about you.
• **Rectification**: correct inaccurate or incomplete data.
• **Erasure**: request deletion of your personal data ("right to be forgotten").
• **Portability**: receive your data in a machine-readable format.
• **Objection**: object to certain processing activities.

To exercise any of these rights, contact privacy@wavio.io.`,
  },
  {
    title: '7. Cookies',
    body: `We use cookies and similar tracking technologies to operate and improve our services. Types of cookies we use:

• **Essential cookies**: required for the platform to function correctly.
• **Analytics cookies**: help us understand how users interact with Wavio (e.g., PostHog).
• **Preference cookies**: remember your settings and preferences.

You can control cookies through your browser settings. Disabling essential cookies may impact platform functionality.`,
  },
  {
    title: '8. Contact Us',
    body: `For privacy-related questions or to exercise your rights, contact us at:

**Wavio Inc.**
privacy@wavio.io
1234 Market Street, San Francisco, CA 94103

We aim to respond to all privacy inquiries within 5 business days.`,
  },
]

export default function Privacy() {
  const { t } = useLanguage()
  const hero = t('privacy.hero')
  return (
    <div className="pt-16">
      <section className="py-20 px-4 bg-white border-b border-[#e4e7ed]">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {hero.title}
          </h1>
          <p className="text-[#475569]">Effective date: January 15, 2025 · Last updated: April 8, 2025</p>
        </motion.div>
      </section>

      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10">
            <p className="text-sm text-[#1a3fbf] leading-relaxed">
              <strong>TL;DR:</strong> We collect only what we need, we never sell your data, we never train our AI on your conversations, and you can delete your data at any time.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div key={s.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-7">
                <h2 className="text-lg font-bold text-[#0f172a] mb-4">{s.title}</h2>
                <div className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                  {s.body.split('\n').map((line, j) => {
                    if (line.startsWith('• **')) {
                      const [bold, ...rest] = line.slice(2).split('**:')
                      return <div key={j} className="flex gap-2 mb-1.5"><span className="text-[#94a3b8] mt-0.5">•</span><span><strong className="text-[#0f172a]">{bold}</strong>:{rest.join('')}</span></div>
                    }
                    if (line.startsWith('• ')) return <div key={j} className="flex gap-2 mb-1.5"><span className="text-[#94a3b8] mt-0.5">•</span><span>{line.slice(2)}</span></div>
                    if (line.startsWith('**') && line.endsWith('**')) return <div key={j} className="font-bold text-[#0f172a] mt-3 mb-1">{line.slice(2, -2)}</div>
                    if (line === '') return <div key={j} className="h-2" />
                    return <div key={j}>{line}</div>
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
