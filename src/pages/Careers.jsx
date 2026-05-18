import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowRight, Home, DollarSign, Heart, BookOpen, Sun, Zap } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const perks = [
  { icon: Home, color: '#1a3fbf', bg: '#eff6ff', title: 'Remote-first', desc: 'Work from anywhere. We care about results, not where you sit.' },
  { icon: DollarSign, color: '#4cc61e', bg: '#f0fdf4', title: 'Competitive pay', desc: 'Top-of-market salary + equity in a fast-growing startup.' },
  { icon: Heart, color: '#ef4444', bg: '#fef2f2', title: 'Full benefits', desc: 'Medical, dental, and vision for you and your family.' },
  { icon: BookOpen, color: '#8b5cf6', bg: '#f5f3ff', title: '$2,000 learning budget', desc: 'Books, courses, conferences. Invest in yourself.' },
  { icon: Sun, color: '#f59e0b', bg: '#fffbeb', title: 'Unlimited PTO', desc: 'We trust you to take the time you need to do your best work.' },
  { icon: Zap, color: '#0088cc', bg: '#e0f2fe', title: 'Async by default', desc: 'Deep work matters. Minimal meetings, maximum output.' },
]

const jobs = [
  { dept: 'Engineering', title: 'Senior Full-Stack Engineer', location: 'Remote', type: 'Full-time', hot: true },
  { dept: 'Engineering', title: 'AI/ML Engineer', location: 'Remote', type: 'Full-time', hot: true },
  { dept: 'Engineering', title: 'DevOps / Platform Engineer', location: 'Remote', type: 'Full-time' },
  { dept: 'Design', title: 'Product Designer', location: 'Remote', type: 'Full-time', hot: true },
  { dept: 'Product', title: 'Product Manager,AI', location: 'Remote', type: 'Full-time' },
  { dept: 'Growth', title: 'Head of Marketing', location: 'Remote', type: 'Full-time' },
  { dept: 'Growth', title: 'Content Marketing Manager', location: 'Remote', type: 'Full-time' },
  { dept: 'Sales', title: 'Account Executive,Enterprise', location: 'Remote', type: 'Full-time' },
  { dept: 'Customer Success', title: 'Customer Success Manager', location: 'Remote', type: 'Full-time' },
]

const deptColors = {
  Engineering: { color: '#1a3fbf', bg: '#eff6ff' },
  Design: { color: '#8b5cf6', bg: '#f5f3ff' },
  Product: { color: '#f59e0b', bg: '#fffbeb' },
  Growth: { color: '#4cc61e', bg: '#f0fdf4' },
  Sales: { color: '#ec4899', bg: '#fdf2f8' },
  'Customer Success': { color: '#14b8a6', bg: '#f0fdfa' },
}

export default function Careers() {
  const depts = [...new Set(jobs.map(j => j.dept))]
  const { t } = useLanguage()
  const hero = t('careers.hero')

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 text-center bg-white">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4 md:mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {hero.title}
          </h1>
          <p className="text-base md:text-xl text-[#475569] max-w-lg mx-auto mb-6 md:mb-8">
            {hero.sub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#475569]">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#4cc61e]" /> Remote-first</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#4cc61e]" /> {jobs.length} open roles</span>
          </div>
        </motion.div>
      </section>

      {/* Perks */}
      <section className="py-10 md:py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-[#e4e7ed] rounded-2xl p-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-1">{title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job listings */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Open positions</h2>
            <p className="text-[#475569] mt-2">All roles are fully remote unless noted.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {jobs.map((job) => {
              const clr = deptColors[job.dept] || { color: '#94a3b8', bg: '#f8fafc' }
              return (
                <motion.a
                  key={job.title}
                  href="#"
                  variants={fadeUp}
                  className="flex flex-col justify-between p-5 bg-white rounded-2xl border border-[#e4e7ed] hover:border-[#1a3fbf] hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{ color: clr.color, backgroundColor: clr.bg }}
                      >
                        {job.dept}
                      </span>
                      {job.hot && (
                        <span className="text-[10px] font-bold bg-[#4cc61e] text-white px-2 py-0.5 rounded-full">Hot</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#0f172a] group-hover:text-[#1a3fbf] transition-colors leading-snug mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <MapPin size={11} />
                      <span>{job.location}</span>
                      <span>·</span>
                      <Clock size={11} />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-[#1a3fbf] opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply now <ArrowRight size={13} />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>

          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <h3 className="text-base font-bold text-[#0f172a] mb-2">Don't see a fit?</h3>
            <p className="text-sm text-[#475569] mb-4">We're always looking for exceptional people. Send us a note.</p>
            <a href="mailto:careers@wavio.io" className="inline-block px-6 py-2.5 bg-[#1a3fbf] text-white font-semibold text-sm rounded-full hover:bg-[#2e5de6] transition-all">
              careers@wavio.io
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
