import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const categories = ['All', 'Product', 'Guides', 'Engineering', 'Company']

const posts = [
  {
    category: 'Product',
    categoryColor: '#1a3fbf',
    categoryBg: '#eff6ff',
    title: 'Introducing AI Reply Suggestions,your agent\'s new best friend',
    excerpt: 'Today we\'re shipping the feature our customers have asked for most: real-time AI-generated reply suggestions that surface directly in your agent inbox.',
    author: 'Wavio Team',
    authorInitial: 'W',
    date: 'Apr 8, 2025',
    readTime: '4 min read',
    featured: true,
    bg: 'from-[#1a3fbf] to-[#2e5de6]',
  },
  {
    category: 'Guides',
    categoryColor: '#4cc61e',
    categoryBg: '#f0fdf4',
    title: 'How to set up a WhatsApp support channel in under 10 minutes',
    excerpt: 'A step-by-step walkthrough for connecting your WhatsApp Business API account to Wavio\'s omnichannel inbox.',
    author: 'Maria Chen',
    authorInitial: 'M',
    date: 'Apr 5, 2025',
    readTime: '6 min read',
  },
  {
    category: 'Engineering',
    categoryColor: '#8b5cf6',
    categoryBg: '#f5f3ff',
    title: 'How we built a sub-200ms chat delivery system at scale',
    excerpt: 'A deep dive into the WebSocket architecture, message queuing, and edge delivery infrastructure that powers Wavio.',
    author: 'Dev Team',
    authorInitial: 'D',
    date: 'Apr 2, 2025',
    readTime: '9 min read',
  },
  {
    category: 'Product',
    categoryColor: '#1a3fbf',
    categoryBg: '#eff6ff',
    title: 'Chatbot Builder: build your first bot in 15 minutes',
    excerpt: 'Our new visual chatbot builder is live. Here\'s how to create a lead qualification bot from scratch with zero code.',
    author: 'Wavio Team',
    authorInitial: 'W',
    date: 'Mar 28, 2025',
    readTime: '5 min read',
  },
  {
    category: 'Company',
    categoryColor: '#f59e0b',
    categoryBg: '#fffbeb',
    title: 'Why we\'re building Wavio: the communication layer for the internet',
    excerpt: 'A note from our founders on the problem we\'re solving, our principles, and where we\'re headed.',
    author: 'Founders',
    authorInitial: 'F',
    date: 'Mar 20, 2025',
    readTime: '3 min read',
  },
]

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { t } = useLanguage()
  const hero = t('blog.hero')

  const featured = posts.find((p) => p.featured)
  const filtered = posts.filter((p) => !p.featured && (activeCategory === 'All' || p.category === activeCategory))

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-10 md:py-20 px-4 bg-white text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {hero.title}
          </h1>
          <p className="text-xl text-[#475569]">{hero.sub}</p>
        </motion.div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="px-4 pb-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <a href="#" className="block group">
                <div className={`rounded-2xl bg-gradient-to-br ${featured.bg} p-10 md:p-14 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }}
                  />
                  <div className="relative">
                    <span
                      className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-5 bg-white/20 text-white"
                    >
                      {featured.category}
                    </span>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:opacity-90 transition-opacity max-w-2xl"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl text-base">{featured.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-sm font-bold">
                        {featured.authorInitial}
                      </div>
                      <div className="text-white/80 text-sm">{featured.author}</div>
                      <span className="text-white/40">·</span>
                      <div className="text-white/60 text-sm">{featured.date}</div>
                      <span className="text-white/40">·</span>
                      <div className="text-white/60 text-sm">{featured.readTime}</div>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category filter */}
      <section className="pb-6 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#1a3fbf] text-white'
                    : 'bg-[#f5f6f8] text-[#475569] hover:bg-blue-50 hover:text-[#1a3fbf]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Post grid */}
      <section className="pb-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {filtered.map((post) => (
              <motion.a
                key={post.title}
                href="#"
                variants={fadeUp}
                className="block bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                {/* Cover image placeholder */}
                <div
                  className="h-44 flex items-center justify-center"
                  style={{ background: `${post.categoryBg}` }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: post.categoryColor + '20', color: post.categoryColor }}
                  >
                    {post.authorInitial}
                  </div>
                </div>

                <div className="p-6">
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                    style={{ backgroundColor: post.categoryBg, color: post.categoryColor }}
                  >
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-[#0f172a] mb-2 leading-snug group-hover:text-[#1a3fbf] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-[10px] font-bold">
                      {post.authorInitial}
                    </div>
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
