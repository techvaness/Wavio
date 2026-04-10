import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Route, FileText, Workflow, Database, Activity, Tag, Shield, Lock, Check, ArrowRight } from 'lucide-react'
import AIAssistantMockup from '../components/mockups/AIAssistantMockup'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const features = [
  {
    icon: Sparkles,
    label: 'Reply Suggestions',
    title: 'The right words, instantly.',
    desc: 'Wavio reads the full conversation context and generates on-brand reply suggestions in under 300ms. Your agents review and send,or tweak and send.',
    bullets: [
      'Trained on your tone and past conversations',
      'Multi-language support,40+ languages',
      'Learns from accepted and rejected suggestions',
      'Works across all channels: chat, email, WhatsApp',
    ],
  },
  {
    icon: Route,
    label: 'Smart Routing',
    title: 'Every conversation lands with the right team.',
    desc: 'AI reads intent, topic, sentiment, and language,then routes to the most qualified agent or team automatically.',
    bullets: [
      'Intent-based routing (billing, sales, tech support)',
      'Language detection routes to native speakers',
      'Sentiment routing escalates frustrated customers',
      'Overflow routing when teams are at capacity',
    ],
  },
  {
    icon: FileText,
    label: 'Auto-summaries',
    title: 'No more reading 40-message threads.',
    desc: 'When a conversation is transferred or an agent picks up a backlog item, AI generates a crisp summary of everything discussed so far.',
    bullets: [
      'Instant summaries on transfer and handoff',
      'Key points, customer sentiment, and action items',
      'Added automatically to contact records in CRM',
      'Available for voice calls with transcription',
    ],
  },
  {
    icon: Workflow,
    label: 'Chatbot Builder',
    title: 'Automate the repetitive stuff.',
    desc: 'Build powerful no-code bots that handle FAQs, collect leads, and qualify prospects 24/7,without involving your team.',
    bullets: [
      'Visual drag-and-drop flow builder',
      'Conditional logic and branching paths',
      'Hand off to agents when bots reach their limit',
      'A/B test different flows and measure conversion',
    ],
  },
  {
    icon: Database,
    label: 'Knowledge Base Q&A',
    title: 'Train AI on your docs.',
    desc: 'Upload your help center, SOPs, or product docs and Wavio\'s AI will answer customer questions instantly using your own content.',
    bullets: [
      'Supports PDFs, URLs, and text documents',
      'Cites source articles in answers',
      'Identifies knowledge gaps automatically',
      'Updates in real time as your docs change',
    ],
  },
  {
    icon: Activity,
    label: 'Sentiment Detection',
    title: 'Catch unhappy customers before they churn.',
    desc: 'Wavio\'s AI scores sentiment on every message. When frustration is detected, it flags the conversation and can route it to your top agent instantly.',
    bullets: [
      'Real-time sentiment scoring per message',
      'Automatic escalation rules for negative sentiment',
      'Sentiment trends dashboard across all conversations',
      'Alert agents and supervisors proactively',
    ],
  },
  {
    icon: Tag,
    label: 'Auto-tagging',
    title: 'Your inbox, organized automatically.',
    desc: 'Every conversation is tagged by topic, channel, outcome, and more,without any manual work from your team.',
    bullets: [
      'Custom tag taxonomies for your business',
      'Auto-applied on message receipt',
      'Enables powerful filtering and reporting',
      'Integrates with CRM segments and pipelines',
    ],
  },
]

const steps = [
  { step: '01', label: 'Customer message', desc: 'A message arrives via any channel,chat, WhatsApp, email, or SMS.' },
  { step: '02', label: 'AI analysis', desc: 'Wavio\'s AI reads intent, sentiment, language, and context in milliseconds.' },
  { step: '03', label: 'Agent suggestion', desc: 'The perfect reply surfaces in the agent\'s inbox, ready to review and send.' },
  { step: '04', label: 'Resolved', desc: 'Faster resolution, happier customer. The loop tightens with every interaction.' },
]

const trustItems = [
  { icon: Shield, title: 'GDPR Compliant', desc: 'Full data subject request support and right-to-erasure built in.' },
  { icon: Lock, title: 'Data never used for training', desc: 'Your conversations stay yours. We never train on your data.' },
  { icon: Check, title: 'Encrypted in transit + at rest', desc: 'TLS 1.3 in transit. AES-256 at rest. Always.' },
  { icon: Activity, title: 'SOC 2 (in progress)', desc: 'Type II certification audit underway. Expected Q3 2025.' },
]

export default function AI() {
  return (
    <div className="pt-16">
      {/* Hero,blue gradient */}
      <section
        className="py-14 md:py-28 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-white" />
            <span className="text-sm text-white font-medium">Wavio AI</span>
          </div>
          <h1
            className="text-3xl md:text-6xl font-bold text-white mb-5 leading-tight"
            style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}
          >
            Meet your AI-powered<br className="hidden sm:block" /> support team.
          </h1>
          <p className="text-base md:text-xl text-white/80 max-w-xl mx-auto mb-8 md:mb-10">
            Wavio's AI works alongside your agents,handling the repetitive, catching the critical, and making everyone faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-[#1a3fbf] font-semibold rounded-full hover:shadow-xl transition-all text-sm"
            >
              Get started free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full hover:border-white/80 hover:bg-white/10 transition-all text-sm"
            >
              See how it works
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature deep-dives */}
      <div className="bg-white">
        {features.map((feat, i) => {
          const isEven = i % 2 === 0
          const Icon = feat.icon
          return (
            <section key={feat.label} className={`py-10 md:py-20 px-4 ${isEven ? 'bg-white' : 'bg-[#f5f6f8]'}`}>
              <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                {/* Text */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  className={!isEven ? 'lg:col-start-2' : ''}
                >
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
                        <Check size={15} className="text-[#4cc61e] mt-0.5 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Visual placeholder */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                >
                  {i === 0 ? (
                    <AIAssistantMockup />
                  ) : (
                    <div
                      className="rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-[#e4e7ed]"
                      style={{ minHeight: 280, background: isEven ? '#f5f6f8' : '#fff' }}
                    >
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">How it works</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              From message to resolved in seconds.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-[#1a3fbf]/30 to-transparent z-0" />
                )}
                <div className="bg-white rounded-2xl border border-[#e4e7ed] p-6 relative z-10">
                  <div
                    className="text-xs font-bold mb-3 inline-block px-2.5 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)', color: 'white' }}
                  >
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Trust & Safety</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              Your data, your rules.
            </h2>
            <p className="text-[#475569] mt-3 max-w-lg mx-auto">
              We take privacy seriously. Your customer data is never used to train our models.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {trustItems.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-5 text-center hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-[#4cc61e]" />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
