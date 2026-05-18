import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Route, FileText, Workflow, Database, Activity, Tag, Shield, Lock, Check, ArrowRight } from 'lucide-react'
import AIAssistantMockup from '../components/mockups/AIAssistantMockup'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const featureIcons = [Sparkles, Route, FileText, Workflow, Database, Activity]

const steps = [
  { step: '01', label: 'Customer message', desc: 'A message arrives via any channel — chat, WhatsApp, email, or SMS.' },
  { step: '02', label: 'AI analysis', desc: 'Wavio\'s AI reads intent, sentiment, language, and context in milliseconds.' },
  { step: '03', label: 'Agent suggestion', desc: 'The perfect reply surfaces in the agent\'s inbox, ready to review and send.' },
  { step: '04', label: 'Resolved', desc: 'Faster resolution, happier customer. The loop tightens with every interaction.' },
]

const trustIcons = [Shield, Lock, Check, Activity]

export default function AI() {
  const { t } = useLanguage()
  const ai = t('ai')

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-14 md:py-28 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)' }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-white" />
            <span className="text-sm text-white font-medium">{ai.hero.label}</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-5 leading-tight" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {ai.hero.title}
          </h1>
          <p className="text-base md:text-xl text-white/80 max-w-xl mx-auto mb-8 md:mb-10">{ai.hero.sub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup" className="px-8 py-4 bg-white text-[#1a3fbf] font-semibold rounded-full hover:shadow-xl transition-all text-sm">
              {ai.cta.primary}
            </Link>
            <Link to="/pricing" className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full hover:border-white/80 hover:bg-white/10 transition-all text-sm">
              {ai.cta.secondary}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature deep-dives */}
      <div className="bg-white">
        {ai.featuresData.map((feat, i) => {
          const isEven = i % 2 === 0
          const Icon = featureIcons[i] || Sparkles
          return (
            <section key={i} className={`py-10 md:py-20 px-4 ${isEven ? 'bg-white' : 'bg-[#f5f6f8]'}`}>
              <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className={!isEven ? 'lg:col-start-2' : ''}>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Icon size={16} className="text-[#1a3fbf]" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{feat.label}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mb-4 md:mb-5 leading-tight" style={{ letterSpacing: '-0.5px' }}>
                    {feat.title}
                  </h2>
                  <p className="text-[#475569] mb-6 leading-relaxed">{feat.desc}</p>
                  <ul className="space-y-2.5">
                    {feat.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-[#475569]">
                        <Check size={15} className="text-[#4cc61e] mt-0.5 flex-shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  {i === 0 ? (
                    <AIAssistantMockup />
                  ) : (
                    <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-[#e4e7ed]" style={{ minHeight: 280, background: isEven ? '#f5f6f8' : '#fff' }}>
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                        <Icon size={32} className="text-[#1a3fbf]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0f172a] mb-2">{feat.label}</h3>
                      <p className="text-sm text-[#94a3b8] max-w-xs">{feat.desc.split('.')[0]}.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </section>
          )
        })}
      </div>

      {/* How it works */}
      <section className="py-12 md:py-24 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-10 md:mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">How it works</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              From message to resolved in seconds.
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="relative">
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-[#1a3fbf]/30 to-transparent z-0" />}
                <div className="bg-white rounded-2xl border border-[#e4e7ed] p-6 relative z-10">
                  <div className="text-xs font-bold mb-3 inline-block px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)', color: 'white' }}>
                    {step.step}
                  </div>
                  <h3 className="text-sm font-bold text-[#0f172a] mb-2">{step.label}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-24 px-4 bg-[#f5f6f8]">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ai.trust.label}</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>{ai.trust.title}</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ai.trust.items.map((item, i) => {
              const Icon = trustIcons[i] || Shield
              return (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl border border-[#e4e7ed] p-5 text-center hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-[#4cc61e]" />
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{item}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-3" style={{ letterSpacing: '-0.5px' }}>{ai.cta.title}</h2>
          <p className="text-[#475569] mb-6">{ai.cta.sub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth?mode=signup" className="px-7 py-3 bg-[#1a3fbf] text-white font-semibold rounded-full hover:bg-[#2e5de6] transition-all text-sm">
              {ai.cta.primary}
            </Link>
            <Link to="/pricing" className="px-7 py-3 border border-[#e4e7ed] text-[#475569] font-semibold rounded-full hover:border-[#1a3fbf] hover:text-[#1a3fbf] transition-all text-sm">
              {ai.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
