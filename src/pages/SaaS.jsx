import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, TrendingUp, Users, Bot, Zap, BarChart2, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const features = [
  { icon: TrendingUp, title: 'Reduce churn with proactive chat', desc: 'Detect at-risk users via in-app behavior and reach out before they cancel. Proactive support reduces churn by up to 25%.' },
  { icon: Users, title: 'Product-led onboarding flows', desc: 'Trigger contextual chat messages based on user actions inside your app. Guide users to their "aha moment" faster.' },
  { icon: Bot, title: 'AI-powered in-app support', desc: 'Answer product questions with an AI trained on your docs. Deflect tier-1 tickets so your team focuses on complex issues.' },
  { icon: Layers, title: 'Full user context in every chat', desc: 'See plan, usage, signup date, and feature adoption right in the inbox. No more "what account are you on?"' },
  { icon: BarChart2, title: 'NPS & CSAT built-in', desc: 'Collect satisfaction scores automatically after every conversation. Spot trends before they become problems.' },
  { icon: Zap, title: 'Automated lifecycle messaging', desc: 'Send targeted messages at key milestones: trial expiry, feature adoption, renewal. All from Wavio.' },
]

const useCases = [
  { title: 'Trial conversion', desc: 'Engage trial users at the right moments to drive paid conversion.' },
  { title: 'Onboarding', desc: 'Contextual walkthroughs triggered by user behavior in your app.' },
  { title: 'Retention', desc: 'Identify and save at-risk accounts before they churn.' },
  { title: 'Expansion', desc: 'Spot upsell opportunities from usage signals in CRM.' },
]

export default function SaaS() {
  const { t } = useLanguage()
  const hero = t('saas.hero')
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-14 md:py-28 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a3fbf 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #4cc61e 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Layers size={12} /> {hero.label}
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-5 leading-tight" style={{ letterSpacing: '-1px' }}>
              {hero.title}
            </h1>
            <p className="text-xl text-white/70 max-w-xl mx-auto mb-10">
              {hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-[#4cc61e] hover:bg-[#3aaa10] text-white font-bold rounded-full text-sm shadow-lg">Start for free</Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:border-white/60 transition-all text-sm">See a demo</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>One platform for the full lifecycle.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map(({ title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-5">
                <div className="text-2xl font-bold text-[#1a3fbf] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>0{i+1}</div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-[#e4e7ed] rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#1a3fbf]" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
