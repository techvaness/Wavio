import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BookOpen, Zap, Code, Plug, Bot, CreditCard, ChevronRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const categories = [
  { icon: Zap, title: 'Getting Started', desc: 'Set up your workspace and add Wavio to your site in minutes.', articles: 12, color: '#4cc61e', bg: '#f0fdf4' },
  { icon: Code, title: 'Widget Setup', desc: 'Customize the chat widget to match your brand perfectly.', articles: 8, color: '#1a3fbf', bg: '#eff6ff' },
  { icon: BookOpen, title: 'API Reference', desc: 'Full REST API documentation with request and response examples.', articles: 34, color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: Plug, title: 'Integrations', desc: 'Connect Wavio to HubSpot, Shopify, Zapier, and more.', articles: 22, color: '#f59e0b', bg: '#fffbeb' },
  { icon: Bot, title: 'AI Features', desc: 'Set up AI reply suggestions, chatbots, and smart routing.', articles: 15, color: '#ec4899', bg: '#fdf2f8' },
  { icon: CreditCard, title: 'Billing & Plans', desc: 'Manage your subscription, add-ons, and invoices.', articles: 9, color: '#14b8a6', bg: '#f0fdfa' },
]

const quickStart = [
  {
    step: 1,
    title: 'Add the widget script',
    code: `<script>
  window.WavioConfig = { workspaceId: 'YOUR_ID' };
</script>
<script src="https://cdn.wavio.io/widget.js" async></script>`,
  },
  {
    step: 2,
    title: 'Identify your users (optional)',
    code: `window.Wavio('identify', {
  name: 'Sarah Kim',
  email: 'sarah@example.com',
  plan: 'pro'
});`,
  },
  {
    step: 3,
    title: 'Send a custom event',
    code: `window.Wavio('track', 'checkout_started', {
  cart_value: 149.99,
  currency: 'USD'
});`,
  },
]

const popularArticles = [
  'How to install the Wavio widget on Shopify',
  'Setting up your first chatbot flow',
  'Connecting WhatsApp Business API',
  'Customizing widget colors and position',
  'Understanding conversation limits and overages',
  'How AI reply suggestions are generated',
  'Setting up team routing rules',
  'Exporting conversation data via API',
]

export default function Docs() {
  const [query, setQuery] = useState('')

  return (
    <div className="pt-16">
      {/* Hero + Search */}
      <section className="py-12 md:py-24 px-4 text-center" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Documentation</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4 md:mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            How can we help?
          </h1>
          <p className="text-base md:text-xl text-[#475569] mb-8 md:mb-10">Search our docs or browse by category below.</p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs... e.g. 'install widget', 'WhatsApp', 'API'"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#e4e7ed] focus:border-[#1a3fbf] focus:outline-none text-sm shadow-sm transition-colors"
            />
          </div>
        </motion.div>
      </section>

      {/* Category cards */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {categories.map(({ icon: Icon, title, desc, articles, color, bg }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-2 group-hover:text-[#1a3fbf] transition-colors">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed mb-3">{desc}</p>
                <span className="text-xs text-[#94a3b8]">{articles} articles</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick start */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Quick start</h2>
            <p className="text-[#475569] mt-2">Up and running in under 5 minutes.</p>
          </motion.div>

          <div className="space-y-5">
            {quickStart.map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden"
              >
                <div className="px-5 py-4 flex items-center gap-3 border-b border-[#f5f6f8]">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1a3fbf, #2e5de6)' }}
                  >
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-[#0f172a]">{item.title}</h3>
                </div>
                <pre
                  className="px-5 py-4 text-sm text-[#475569] overflow-x-auto bg-[#f9fafb]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <code>{item.code}</code>
                </pre>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular articles */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Popular articles</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-2"
          >
            {popularArticles.map((article) => (
              <motion.a
                key={article}
                href="#"
                variants={fadeUp}
                className="flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-[#e4e7ed] hover:border-[#1a3fbf] hover:shadow-sm transition-all duration-200 group"
              >
                <span className="text-sm font-medium text-[#0f172a] group-hover:text-[#1a3fbf]">{article}</span>
                <ChevronRight size={16} className="text-[#94a3b8] group-hover:text-[#1a3fbf] transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
