import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Calendar, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
)
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const contactDetails = [
  { icon: Mail, label: 'General', value: 'hello@wavio.io' },
  { icon: MessageSquare, label: 'Support', value: 'support@wavio.io' },
  { icon: MessageSquare, label: 'Sales', value: 'sales@wavio.io' },
]

const socials = [
  { icon: TwitterIcon, label: 'Twitter', href: '#', handle: '@wavioapp' },
  { icon: GithubIcon, label: 'GitHub', href: '#', handle: 'github.com/wavio' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: '#', handle: 'linkedin.com/company/wavio' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', reason: '', message: '' })
  const [sent, setSent] = useState(false)
  const { t } = useLanguage()
  const ct = t('contact')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-10 md:py-20 px-4 bg-white text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ct.hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {ct.hero.title}
          </h1>
          <p className="text-base md:text-xl text-[#475569]">{ct.hero.sub}</p>
        </motion.div>
      </section>

      {/* Split layout */}
      <section className="pb-12 md:pb-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: contact info */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8" style={{ letterSpacing: '-0.3px' }}>{ct.details.title}</h2>

            <div className="space-y-4 mb-10">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 bg-[#f5f6f8] rounded-xl border border-[#e4e7ed]">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#1a3fbf]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-0.5">{label}</div>
                    <a href={`mailto:${value}`} className="text-sm font-semibold text-[#1a3fbf] hover:underline">{value}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl border-2 border-[#1a3fbf] bg-blue-50 mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a3fbf] flex items-center justify-center">
                  <Calendar size={18} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">Book a live demo</h3>
              </div>
              <p className="text-sm text-[#475569] mb-4 leading-relaxed">
                See Wavio in action with a 30-minute personalized walkthrough.
              </p>
              <button className="px-5 py-2.5 bg-[#1a3fbf] text-white font-semibold text-sm rounded-full hover:bg-[#2e5de6] transition-all">
                Pick a time →
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4">{ct.details.social}</div>
              <div className="space-y-3">
                {socials.map(({ icon: Icon, label, href, handle }) => (
                  <a key={label} href={href} className="flex items-center gap-3 text-sm text-[#475569] hover:text-[#1a3fbf] transition-colors group">
                    <Icon size={16} className="text-[#94a3b8] group-hover:text-[#1a3fbf] transition-colors" />
                    {handle}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <div className="bg-white rounded-2xl border border-[#e4e7ed] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">{ct.form.send}</h2>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#4cc61e]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-2">{ct.form.successTitle}</h3>
                  <p className="text-sm text-[#475569]">{ct.form.successSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ct.form.name} *</label>
                      <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e4e7ed] focus:border-[#1a3fbf] focus:outline-none text-sm transition-colors" placeholder="Sarah Kim" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ct.form.email} *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e4e7ed] focus:border-[#1a3fbf] focus:outline-none text-sm transition-colors" placeholder="sarah@acme.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ct.form.company}</label>
                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e4e7ed] focus:border-[#1a3fbf] focus:outline-none text-sm transition-colors" placeholder="Acme Inc." />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ct.form.reason}</label>
                    <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e4e7ed] focus:border-[#1a3fbf] focus:outline-none text-sm transition-colors bg-white">
                      <option value="">—</option>
                      {ct.reasons.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ct.form.message} *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e4e7ed] focus:border-[#1a3fbf] focus:outline-none text-sm transition-colors resize-none" placeholder={ct.form.placeholder} />
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:shadow-lg">
                    {ct.form.send}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
