import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageSquare, Star, BookOpen, Users, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const spaces = [
  { icon: MessageSquare, title: 'General Discussion', desc: 'Talk about anything Wavio,setup tips, feedback, feature ideas.', members: '2,400', color: '#1a3fbf', bg: '#eff6ff' },
  { icon: Star, title: 'Feature Requests', desc: 'Vote on what we should build next. Top-voted features ship first.', members: '1,800', color: '#f59e0b', bg: '#fffbeb' },
  { icon: BookOpen, title: 'Guides & Tutorials', desc: 'Community-written how-tos, templates, and best practices.', members: '1,200', color: '#4cc61e', bg: '#f0fdf4' },
  { icon: Users, title: 'Introductions', desc: 'New to Wavio? Say hello and tell us about your business.', members: '900', color: '#8b5cf6', bg: '#f5f3ff' },
]

const posts = [
  { title: 'How I set up AI routing to cut response time by 65%', author: 'Priya N.', votes: 142, replies: 23, tag: 'Guide' },
  { title: 'Feature Request: bulk conversation assignment', author: 'Marcus D.', votes: 89, replies: 15, tag: 'Request' },
  { title: 'WhatsApp + Shopify integration: step by step', author: 'Sofia L.', votes: 76, replies: 31, tag: 'Guide' },
  { title: 'Chatbot builder template: lead qualification flow', author: 'Ahmed R.', votes: 64, replies: 18, tag: 'Template' },
  { title: 'Is anyone using Wavio for internal team communication?', author: 'James T.', votes: 48, replies: 22, tag: 'Discussion' },
  { title: 'CSAT improvement from 3.8 to 4.9,here\'s what we changed', author: 'Maria G.', votes: 134, replies: 41, tag: 'Story' },
]

const tagColors = {
  Guide: { color: '#1a3fbf', bg: '#eff6ff' },
  Request: { color: '#f59e0b', bg: '#fffbeb' },
  Template: { color: '#4cc61e', bg: '#f0fdf4' },
  Discussion: { color: '#8b5cf6', bg: '#f5f3ff' },
  Story: { color: '#ec4899', bg: '#fdf2f8' },
}

export default function Community() {
  const { t } = useLanguage()
  const hero = t('community.hero')
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 text-center bg-white">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4 md:mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {hero.title}
          </h1>
          <p className="text-base md:text-xl text-[#475569] max-w-xl mx-auto mb-6 md:mb-8">
            {hero.sub}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="px-8 py-4 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all">
              Join the community
            </a>
            <a href="#" className="px-8 py-4 border-2 border-[#e4e7ed] text-[#475569] font-semibold rounded-full hover:border-[#1a3fbf] hover:text-[#1a3fbf] transition-all text-sm">
              Browse discussions
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[['5,000+', 'Members'], ['2,400', 'Posts'], ['98%', 'Questions answered'], ['< 4h', 'Avg response']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>{v}</div>
                <div className="text-xs text-[#94a3b8] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Spaces */}
      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
            <h2 className="text-2xl font-bold text-[#0f172a]">Community spaces</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {spaces.map(({ icon: Icon, title, desc, members, color, bg }) => (
              <motion.a key={title} href="#" variants={fadeUp}
                className="bg-white border border-[#e4e7ed] rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-1 group-hover:text-[#1a3fbf] transition-colors">{title}</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">{desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <Users size={11} />
                  <span>{members} members</span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#0f172a]">Trending posts</h2>
            <a href="#" className="text-sm font-semibold text-[#1a3fbf] flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </a>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
            {posts.map((post) => {
              const tag = tagColors[post.tag]
              return (
                <motion.a key={post.title} href="#" variants={fadeUp}
                  className="flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-[#e4e7ed] hover:border-[#1a3fbf] hover:shadow-sm transition-all group">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: tag.color, backgroundColor: tag.bg }}>
                        {post.tag}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#0f172a] group-hover:text-[#1a3fbf] transition-colors truncate">{post.title}</div>
                    <div className="text-xs text-[#94a3b8] mt-0.5">by {post.author}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 text-xs text-[#94a3b8]">
                    <span className="flex items-center gap-1"><Star size={11} /> {post.votes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} /> {post.replies}</span>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.5px' }}>Ready to join?</h2>
            <p className="text-white/70 mb-7">It's free and open to all Wavio users.</p>
            <a href="#" className="inline-block px-8 py-3.5 bg-white text-[#1a3fbf] font-bold rounded-full hover:shadow-lg transition-all text-sm">
              Join the community →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
