import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Bot, Radio, Brain, BarChart2, Mic, Star, ArrowRight, Check } from 'lucide-react'
import AgentInboxMockup from '../components/mockups/AgentInboxMockup'
import ChatWidgetMockup from '../components/mockups/ChatWidgetMockup'
import AIAssistantMockup from '../components/mockups/AIAssistantMockup'
import OmnichannelMockup from '../components/mockups/OmnichannelMockup'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const valuePropIcons = [Zap, Bot, Radio, Brain, BarChart2, Mic]
const metricValues = ['< 15kb', '< 200ms', '3x faster', '99.9%']
const logos = ['Shopform', 'Launchkit', 'NomadStudio', 'Patchwork', 'Cresendo', 'Fieldly', 'Stackr', 'Vaultex']
const avatarColors = ['#1a3fbf', '#4cc61e', '#e1306c', '#f59e0b', '#8b5cf6']
const avatarInitials = ['A', 'B', 'C', 'D', 'E']

export default function Home() {
  const { t } = useLanguage()

  const hero = t('home.hero')
  const platform = t('home.platform')
  const valueProps = t('home.valueProps')
  const chat = t('home.chat')
  const ai = t('home.ai')
  const omni = t('home.omni')
  const metrics = t('home.metrics')
  const testimonials = t('home.testimonials')
  const pricing = t('home.pricing')

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-14 md:py-28 px-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2560&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, rgba(10,22,70,0.88) 0%, rgba(15,42,138,0.82) 40%, rgba(26,63,191,0.70) 70%, rgba(46,93,230,0.55) 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,246,248,0.9))' }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-bold text-white leading-tight mb-5"
            style={{
              fontSize: 'clamp(34px, 7vw, 88px)',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 'clamp(-1px, -0.02em, -2px)',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            {hero.line1}{' '}
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #7dd3fc 0%, #4cc61e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {hero.highlight}
            </span>
            <br />{hero.line2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <Link to="/auth?mode=signup" className="w-auto px-6 py-2 sm:px-8 sm:py-4 bg-[#4cc61e] hover:bg-[#3aaa10] text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm text-center">
              {hero.cta1}
            </Link>
            <Link to="/contact" className="w-auto px-6 py-2 sm:px-8 sm:py-4 bg-white/10 border border-white/40 text-white font-semibold rounded-full hover:bg-white/20 hover:border-white/70 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm text-center">
              {hero.cta2}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {avatarInitials.map((init, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: avatarColors[i] }}>
                  {init}
                </div>
              ))}
            </div>
            <div className="text-sm text-white/80">
              <span className="font-semibold text-white">5,000+</span> {hero.social}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" className="text-yellow-400" />)}
              <span className="text-xs font-semibold text-white/80 ml-1">4.9/5</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-4xl mx-auto mt-14 px-2 relative z-10"
        >
          <AgentInboxMockup />
        </motion.div>
      </section>

      {/* Logo trust section */}
      <section className="py-10 md:py-16 bg-[#f5f6f8] px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#94a3b8] text-center mb-6">{t('home.logos.label')}</p>
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {logos.map((logo) => (
              <span key={logo} className="text-sm md:text-base font-bold text-[#cbd5e1] tracking-tight hover:text-[#94a3b8] transition-colors cursor-default" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Value props grid */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-10 md:mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{platform.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3 mb-4" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.5px' }}>
              {platform.title}
            </h2>
            <p className="text-sm md:text-base text-[#475569] max-w-xl mx-auto">{platform.sub}</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {valueProps.map((vp, i) => {
              const Icon = valuePropIcons[i]
              return (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl border border-[#e4e7ed] p-5 md:p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#1a3fbf]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-2">{vp.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{vp.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Spotlight 1 — Live Chat */}
      <section className="py-12 md:py-24 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="order-1 lg:order-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{chat.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3 mb-4 leading-tight" style={{ letterSpacing: '-0.5px' }}>
              {chat.title}
            </h2>
            <p className="text-sm md:text-base text-[#475569] mb-6 leading-relaxed">{chat.sub}</p>
            <ul className="space-y-3 mb-6">
              {chat.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#475569]">
                  <Check size={16} className="text-[#4cc61e] mt-0.5 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link to="/features" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3fbf] hover:gap-2.5 transition-all">
              {chat.link} <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="order-2 lg:order-1">
            <ChatWidgetMockup />
          </motion.div>
        </div>
      </section>

      {/* Spotlight 2 — AI Features */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ai.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3 mb-4 leading-tight" style={{ letterSpacing: '-0.5px' }}>
              {ai.title}
            </h2>
            <p className="text-sm md:text-base text-[#475569] mb-6 leading-relaxed">{ai.sub}</p>
            <ul className="space-y-3 mb-6">
              {ai.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#475569]">
                  <Check size={16} className="text-[#4cc61e] mt-0.5 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link to="/ai" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3fbf] hover:gap-2.5 transition-all">
              {ai.link} <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <AIAssistantMockup />
          </motion.div>
        </div>
      </section>

      {/* Spotlight 3 — Omnichannel */}
      <section className="py-12 md:py-24 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="order-1 lg:order-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{omni.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3 mb-4 leading-tight" style={{ letterSpacing: '-0.5px' }}>
              {omni.title}
            </h2>
            <p className="text-sm md:text-base text-[#475569] mb-6 leading-relaxed">{omni.sub}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: 'WhatsApp', color: '#25D366', bg: '#dcfce7' },
                { label: 'Instagram', color: '#E1306C', bg: '#fce7f3' },
                { label: 'Email', color: '#1a3fbf', bg: '#eff6ff' },
                { label: 'SMS', color: '#64748b', bg: '#f1f5f9' },
                { label: 'Facebook', color: '#1877F2', bg: '#dbeafe' },
                { label: 'Telegram', color: '#0088cc', bg: '#e0f2fe' },
              ].map((ch) => (
                <span key={ch.label} className="text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ color: ch.color, backgroundColor: ch.bg, borderColor: ch.color + '40' }}>
                  {ch.label}
                </span>
              ))}
            </div>
            <Link to="/integrations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3fbf] hover:gap-2.5 transition-all">
              {omni.link} <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="order-2 lg:order-1">
            <OmnichannelMockup />
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-12 md:py-24 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="text-3xl md:text-5xl font-bold text-[#1a3fbf] mb-2" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-1px' }}>
                  {metricValues[i]}
                </div>
                <div className="text-xs md:text-sm text-[#475569] font-medium">{m.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-10 md:mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{testimonials.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              {testimonials.title}
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.items.map((item) => (
              <motion.div key={item.name} variants={fadeUp} className="bg-white rounded-2xl border border-[#e4e7ed] p-5 md:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" className="text-yellow-400" />)}
                </div>
                <p className="text-[#475569] text-sm leading-relaxed mb-5">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0f172a]">{item.name}</div>
                    <div className="text-xs text-[#94a3b8]">{item.title}, {item.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-12 md:py-24 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-10 md:mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{pricing.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3 mb-4" style={{ letterSpacing: '-0.5px' }}>
              {pricing.title}
            </h2>
            <p className="text-sm md:text-base text-[#475569]">{pricing.sub}</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {pricing.plans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp} className={`bg-white rounded-2xl p-5 md:p-6 relative ${plan.highlight ? 'border-2 border-[#1a3fbf] shadow-lg shadow-blue-100' : 'border border-[#e4e7ed] shadow-sm'}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4cc61e] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {pricing.badge}
                  </span>
                )}
                <div className="mb-5">
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#94a3b8] mb-3">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-[#0f172a]" style={{ letterSpacing: '-1px' }}>{plan.price}</span>
                    <span className="text-sm text-[#94a3b8]">/mo</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#475569]">
                      <Check size={14} className="text-[#4cc61e] flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup" className={`block w-full text-center py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 ${plan.highlight ? 'bg-[#1a3fbf] text-white' : 'bg-[#4cc61e] text-white'}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3fbf] hover:gap-2.5 transition-all">
              {pricing.link} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
