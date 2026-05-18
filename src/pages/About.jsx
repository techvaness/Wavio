import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Zap } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const valueIcons = [Heart, Sparkles, Zap]
const valueStyles = [
  { color: '#ef4444', bg: '#fef2f2' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
  { color: '#f59e0b', bg: '#fffbeb' },
]

const team = [
  { name: 'Alex Rivera', role: 'Co-founder & CEO', bg: 'from-[#1a3fbf] to-[#2e5de6]' },
  { name: 'Priya Mehta', role: 'Co-founder & CTO', bg: 'from-[#4cc61e] to-[#3aaa10]' },
  { name: 'James O\'Brien', role: 'Head of Design', bg: 'from-[#8b5cf6] to-[#7c3aed]' },
  { name: 'Sarah Kim', role: 'Head of Growth', bg: 'from-[#f59e0b] to-[#d97706]' },
  { name: 'Marcus Leung', role: 'Lead Engineer', bg: 'from-[#ec4899] to-[#db2777]' },
  { name: 'Fatima Al-Sayed', role: 'Head of Customer Success', bg: 'from-[#14b8a6] to-[#0d9488]' },
]

export default function About() {
  const { t } = useLanguage()
  const ab = t('about')

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
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ab.hero.label}</span>
          <h1
            className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-6 leading-tight"
            style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}
          >
            {ab.hero.title}
          </h1>
          <p className="text-base md:text-xl text-[#475569] max-w-xl mx-auto">{ab.hero.sub}</p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-10 md:py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ab.mission.label}</span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mt-4 mb-4 leading-snug" style={{ letterSpacing: '-0.3px' }}>
              {ab.mission.title}
            </h2>
            <p className="text-sm md:text-base text-[#475569] leading-relaxed">{ab.mission.sub}</p>
          </motion.div>
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
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ab.team.label}</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              {ab.team.title}
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
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ab.values.label}</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>{ab.values.title}</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-6"
          >
            {ab.valuesData.map((v, i) => {
              const Icon = valueIcons[i]
              const style = valueStyles[i]
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-[#e4e7ed] p-7 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: style.bg }}>
                    <Icon size={20} style={{ color: style.color }} />
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-3">{v.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
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
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{ab.timeline.label}</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>{ab.timeline.title}</h2>
          </motion.div>

          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#e4e7ed]" />
            <div className="space-y-10">
              {ab.timelineData.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative"
                >
                  <div className="absolute -left-5 top-1.5 w-4 h-4 rounded-full border-2 border-[#1a3fbf] bg-white" />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #1a3fbf, #2e5de6)' }}>
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

      {/* CTA */}
      <section className="py-16 px-4 bg-[#f5f6f8] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-3" style={{ letterSpacing: '-0.5px' }}>{ab.cta.title}</h2>
          <p className="text-[#475569] mb-6">{ab.cta.sub}</p>
          <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a3fbf] hover:underline">
            {ab.cta.link} →
          </Link>
        </div>
      </section>
    </div>
  )
}
