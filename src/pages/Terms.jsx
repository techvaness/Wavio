import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using the Wavio platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms apply to all users, including free and paid plan subscribers.' },
  { title: '2. Description of Service', body: 'Wavio provides an AI-powered customer communication platform including live chat, omnichannel inbox, CRM, and related tools. Features vary by plan. We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.' },
  { title: '3. Account Registration', body: 'To use the Service, you must create an account with a valid email address and accurate information. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. Notify us immediately of any unauthorized use at security@wavio.io.' },
  { title: '4. Acceptable Use', body: `You agree not to use the Service to:\n\n• Send spam, unsolicited messages, or phishing communications.\n• Violate any applicable law or regulation.\n• Infringe on the intellectual property rights of others.\n• Transmit malware, viruses, or harmful code.\n• Attempt to gain unauthorized access to our systems.\n• Resell or sublicense the Service without written permission.` },
  { title: '5. Payment & Billing', body: 'Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by law or at our sole discretion. If payment fails, we may suspend your account after 7 days notice. Prices may change with 30 days advance notice to your registered email.' },
  { title: '6. Data & Privacy', body: 'Your use of the Service is subject to our Privacy Policy, incorporated by reference. You retain ownership of your data. We process it only to provide the Service and as described in our Privacy Policy. We do not sell your data or use it to train AI models.' },
  { title: '7. Intellectual Property', body: 'The Wavio name, logo, and all related software, features, and documentation are owned by Wavio Inc. and protected by intellectual property laws. These Terms do not grant you any right to use Wavio\'s trademarks, logos, or branding without prior written consent.' },
  { title: '8. Disclaimers', body: 'The Service is provided "as is" without warranties of any kind. We do not warrant that the Service will be uninterrupted, error-free, or meet your specific requirements. To the maximum extent permitted by law, we disclaim all implied warranties.' },
  { title: '9. Limitation of Liability', body: 'To the maximum extent permitted by law, Wavio shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability for any claim arising out of or related to these Terms shall not exceed the fees paid by you in the 12 months preceding the claim.' },
  { title: '10. Termination', body: 'Either party may terminate this agreement at any time. You may cancel your account via the dashboard or by contacting support. We may terminate or suspend your account for violations of these Terms. Upon termination, your data will be retained for 30 days before deletion.' },
  { title: '11. Governing Law', body: 'These Terms are governed by the laws of the State of California, USA, without regard to conflict of law principles. Any disputes shall be resolved in the courts of San Francisco County, California.' },
  { title: '12. Changes to Terms', body: 'We may update these Terms from time to time. We will notify you of material changes via email or in-app notification at least 30 days before they take effect. Continued use of the Service after changes constitutes acceptance of the new Terms.' },
]

export default function Terms() {
  const { t } = useLanguage()
  const hero = t('terms.hero')
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-10">
            <p className="text-sm text-yellow-800 leading-relaxed">
              <strong>Plain English:</strong> Use Wavio for legitimate purposes, pay on time, don't abuse our infrastructure, and we'll both be happy. If something goes wrong, our liability is capped at what you've paid us in the last year.
            </p>
          </div>

          <div className="space-y-5">
            {sections.map((s) => (
              <motion.div key={s.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-7">
                <h2 className="text-base font-bold text-[#0f172a] mb-3">{s.title}</h2>
                <div className="text-sm text-[#475569] leading-relaxed">
                  {s.body.split('\n').map((line, j) => {
                    if (line.startsWith('• ')) return <div key={j} className="flex gap-2 mb-1.5"><span className="text-[#94a3b8]">•</span><span>{line.slice(2)}</span></div>
                    if (line === '') return <div key={j} className="h-2" />
                    return <div key={j}>{line}</div>
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-[#94a3b8]">
            Questions? Contact us at <a href="mailto:legal@wavio.io" className="text-[#1a3fbf] hover:underline font-medium">legal@wavio.io</a>
          </div>
        </div>
      </section>
    </div>
  )
}
