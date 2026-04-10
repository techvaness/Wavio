import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Clock, Zap } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const quarters = [
  {
    label: 'Q1 2025,Shipped',
    status: 'done',
    items: [
      { title: 'AI Reply Suggestions', desc: 'Context-aware suggestions in under 300ms for all Growth+ plans.' },
      { title: 'Sentiment Detection', desc: 'Real-time sentiment scoring with automatic escalation rules.' },
      { title: 'Instagram DMs', desc: 'Full Instagram inbox support including story replies.' },
      { title: 'Chatbot Builder v1', desc: 'No-code visual flow builder with conditional logic.' },
    ],
  },
  {
    label: 'Q2 2025,In progress',
    status: 'active',
    items: [
      { title: 'Voice & Video Calls', desc: 'Browser-based voice and video with AI transcription and summaries.' },
      { title: 'Telegram Integration', desc: 'Connect your Telegram bot to the Wavio unified inbox.' },
      { title: 'Advanced Chatbot Builder', desc: 'A/B testing, analytics, and multi-step conditional flows.' },
      { title: 'Revenue Attribution', desc: 'Track exactly how much revenue Wavio conversations generate.' },
    ],
  },
  {
    label: 'Q3 2025,Planned',
    status: 'planned',
    items: [
      { title: 'SOC 2 Type II Certification', desc: 'Full security compliance certification for enterprise customers.' },
      { title: 'White-label Solution', desc: 'Full white-labeling for agencies and enterprise plans.' },
      { title: 'AI Chatbot v2', desc: 'GPT-4 powered bots that handle complex multi-turn support flows.' },
      { title: 'Mobile Apps (iOS & Android)', desc: 'Native apps so agents can respond on the go.' },
    ],
  },
  {
    label: 'Q4 2025,Exploring',
    status: 'exploring',
    items: [
      { title: 'TikTok DMs Integration', desc: 'Manage TikTok Shop and DM conversations in your inbox.' },
      { title: 'AI Agent (Autonomous)', desc: 'Fully autonomous AI agent that resolves tier-1 tickets end-to-end.' },
      { title: 'Advanced Forecasting', desc: 'Predict support volume and agent capacity needs with AI.' },
      { title: 'Marketplace', desc: 'Community-built integrations and bot templates.' },
    ],
  },
]

const statusConfig = {
  done: { label: 'Shipped', color: '#4cc61e', bg: '#f0fdf4', border: '#bbf7d0', icon: Check },
  active: { label: 'In progress', color: '#1a3fbf', bg: '#eff6ff', border: '#bfdbfe', icon: Zap },
  planned: { label: 'Planned', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: Clock },
  exploring: { label: 'Exploring', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', icon: Clock },
}

export default function Roadmap() {
  return (
    <div className="pt-16">
      <section className="py-12 md:py-24 px-4 text-center bg-white">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Roadmap</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4 md:mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            What's coming to Wavio.
          </h1>
          <p className="text-base md:text-xl text-[#475569] max-w-lg mx-auto mb-6 md:mb-8">
            We ship every week. Here's what we're building,and what's next.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-[#1a3fbf] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#1a3fbf] animate-pulse" />
            Have a feature request? <a href="#" className="font-bold underline ml-1">Vote on our community board →</a>
          </div>
        </motion.div>
      </section>

      <section className="pb-24 px-4 bg-[#f5f6f8]">
        <div className="max-w-4xl mx-auto space-y-10">
          {quarters.map((q) => {
            const cfg = statusConfig[q.status]
            const Icon = cfg.icon
            return (
              <motion.div key={q.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">{q.label}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border"
                    style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}>
                    <Icon size={11} />
                    {cfg.label}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {q.items.map((item) => (
                    <div key={item.title}
                      className="bg-white rounded-2xl border border-[#e4e7ed] p-5">
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: cfg.bg }}>
                          <Icon size={11} style={{ color: cfg.color }} />
                        </div>
                        <h3 className="text-sm font-bold text-[#0f172a]">{item.title}</h3>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed pl-7">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
