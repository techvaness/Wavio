import { motion } from 'framer-motion'
import { Heart, Sparkles, Zap } from 'lucide-react'

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const team = [
  { name: 'Alex Rivera', role: 'Co-founder & CEO', bg: 'from-[#1a3fbf] to-[#2e5de6]' },
  { name: 'Priya Mehta', role: 'Co-founder & CTO', bg: 'from-[#4cc61e] to-[#3aaa10]' },
  { name: 'James O\'Brien', role: 'Head of Design', bg: 'from-[#8b5cf6] to-[#7c3aed]' },
  { name: 'Sarah Kim', role: 'Head of Growth', bg: 'from-[#f59e0b] to-[#d97706]' },
  { name: 'Marcus Leung', role: 'Lead Engineer', bg: 'from-[#ec4899] to-[#db2777]' },
  { name: 'Fatima Al-Sayed', role: 'Head of Customer Success', bg: 'from-[#14b8a6] to-[#0d9488]' },
]

const values = [
  {
    title: 'Customer-obsessed',
    desc: 'We talk to customers every day. Their problems are our problems. We\'d rather ship something customers love than something impressive to investors.',
    icon: Heart,
    color: '#ef4444',
    bg: '#fef2f2',
  },
  {
    title: 'AI-first',
    desc: 'We don\'t bolt AI on as an afterthought. Every feature is designed with AI at the center, making teams faster, not replacing them.',
    icon: Sparkles,
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    title: 'Speed over perfection',
    desc: 'We ship fast and iterate in public. Our customers prefer a working feature today over a polished one in six months.',
    icon: Zap,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
]

const timeline = [
  { year: '2023', label: 'Founded', desc: 'Wavio is founded in San Francisco. The original insight: live chat hasn\'t meaningfully improved in a decade.' },
  { year: 'Q1 2024', label: 'Private beta', desc: '50 hand-picked teams join private beta. NPS score: 72 from day one.' },
  { year: 'Q3 2024', label: 'Public launch', desc: 'Wavio opens to the public. 500 teams sign up in the first week.' },
  { year: 'Q1 2025', label: 'AI features launch', desc: 'AI reply suggestions, smart routing, and chatbot builder ship. Response times drop 40% across our customer base.' },
  { year: 'Q2 2025', label: '5,000 teams', desc: 'We cross 5,000 teams and launch Omnichannel Inbox with WhatsApp and Instagram support.' },
]

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-14 md:py-28 px-4 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">About</span>
          <h1
            className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-6 leading-tight"
            style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}
          >
            We're building the communication layer for the internet.
          </h1>
        </motion.div>
      </section>

      {/* Mission quote */}
      <section className="py-10 md:py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-lg md:text-3xl text-[#0f172a] leading-relaxed"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
          >
            "Every business deserves to talk to its customers like a startup: fast, personal, and human. We built Wavio because that shouldn't require an enterprise budget or a team of engineers."
          </motion.blockquote>
          <div className="mt-6 text-sm text-[#94a3b8]">Alex Rivera & Priya Mehta, Co-founders</div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Team</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              The people behind Wavio.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-6 text-center hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.bg} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
                >
                  {member.name[0]}
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-1">{member.name}</h3>
                <p className="text-sm text-[#94a3b8] mb-4">{member.role}</p>
                <a
                  href="#"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#1a3fbf] hover:bg-[#1a3fbf] hover:text-white transition-all duration-200"
                >
                  <LinkedinIcon />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Values</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>How we work.</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-6"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-7 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: v.bg }}>
                  <v.icon size={20} style={{ color: v.color }} />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-3">{v.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Story</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>From zero to 5,000 teams.</h2>
          </motion.div>

          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#e4e7ed]" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="absolute -left-5 top-1.5 w-4 h-4 rounded-full border-2 border-[#1a3fbf] bg-white" />

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: 'linear-gradient(135deg, #1a3fbf, #2e5de6)' }}
                      >
                        {item.year}
                      </span>
                      <span className="text-sm font-bold text-[#0f172a]">{item.label}</span>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
