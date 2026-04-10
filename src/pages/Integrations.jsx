import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Camera, Mail, Smartphone, Send } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const channels = [
  { name: 'WhatsApp', desc: 'Two-way WhatsApp Business API. Send, receive, and automate at scale.', color: '#25D366', bg: '#dcfce7', status: 'Available', icon: MessageCircle },
  { name: 'Instagram', desc: 'Manage Instagram DMs and story replies without leaving your inbox.', color: '#E1306C', bg: '#fce7f3', status: 'Available', icon: Camera },
  { name: 'Facebook Messenger', desc: 'Full Messenger support with rich messages, buttons, and quick replies.', color: '#1877F2', bg: '#dbeafe', status: 'Available', icon: MessageCircle },
  { name: 'Email', desc: 'Turn email into a collaborative, threaded inbox for your whole team.', color: '#1a3fbf', bg: '#eff6ff', status: 'Available', icon: Mail },
  { name: 'SMS', desc: 'Two-way SMS conversations via Twilio or your own provider.', color: '#64748b', bg: '#f1f5f9', status: 'Available', icon: Smartphone },
  { name: 'Telegram', desc: 'Connect your Telegram bot to receive and reply from Wavio.', color: '#0088cc', bg: '#e0f2fe', status: 'Coming soon', icon: Send },
]

const toolCategories = [
  {
    label: 'CRM',
    tools: [
      { name: 'HubSpot', desc: 'Sync contacts and deals' },
      { name: 'Salesforce', desc: 'Bi-directional CRM sync' },
      { name: 'Pipedrive', desc: 'Push leads to pipelines' },
      { name: 'Zoho CRM', desc: 'Contact and deal sync' },
    ],
  },
  {
    label: 'eCommerce',
    tools: [
      { name: 'Shopify', desc: 'Order data in every chat' },
      { name: 'WooCommerce', desc: 'Connect your WP store' },
      { name: 'BigCommerce', desc: 'Enterprise commerce sync' },
    ],
  },
  {
    label: 'Helpdesk',
    tools: [
      { name: 'Zendesk', desc: 'Two-way ticket sync' },
      { name: 'Freshdesk', desc: 'Escalate to helpdesk' },
    ],
  },
  {
    label: 'Analytics',
    tools: [
      { name: 'Google Analytics', desc: 'Chat event tracking' },
      { name: 'Segment', desc: 'Customer data platform' },
    ],
  },
  {
    label: 'Developer',
    tools: [
      { name: 'Zapier', desc: '5,000+ app connections' },
      { name: 'Make', desc: 'Advanced automations' },
      { name: 'REST API', desc: 'Full programmatic access' },
      { name: 'Webhooks', desc: 'Real-time event delivery' },
      { name: 'JS SDK', desc: 'Custom widget control' },
    ],
  },
]

const embedCode = `<!-- Add Wavio to your site in 60 seconds -->
<script>
  window.WavioConfig = {
    workspaceId: 'YOUR_WORKSPACE_ID',
    // Optional overrides:
    // primaryColor: '#1a3fbf',
    // position: 'bottom-right',
    // welcomeMessage: 'Hi! How can we help?'
  };
</script>
<script
  src="https://cdn.wavio.io/widget.js"
  async
></script>`

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState('CRM')

  const currentTools = toolCategories.find(c => c.label === activeCategory)?.tools || []

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 bg-white text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Integrations</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            Connect everything.
          </h1>
          <p className="text-xl text-[#475569] max-w-lg mx-auto">
            Wavio plugs into your existing tools in minutes.
          </p>
        </motion.div>
      </section>

      {/* Channels */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Messaging channels</h2>
            <p className="text-[#475569] mt-2">Connect wherever your customers are.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {channels.map((ch) => (
              <motion.div
                key={ch.name}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: ch.bg }}
                  >
                    <ch.icon size={22} style={{ color: ch.color }} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ch.status === 'Available'
                        ? 'bg-green-50 text-[#4cc61e] border border-green-200'
                        : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                    }`}
                  >
                    {ch.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-2">{ch.name}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{ch.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tool integrations */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Tool integrations</h2>
            <p className="text-[#475569] mt-2">Works with the tools your team already uses.</p>
          </motion.div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {toolCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.label
                    ? 'bg-[#1a3fbf] text-white'
                    : 'bg-[#f5f6f8] text-[#475569] hover:bg-blue-50 hover:text-[#1a3fbf]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {currentTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5f6f8] flex items-center justify-center mb-3 text-lg font-bold text-[#1a3fbf]">
                  {tool.name[0]}
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-1">{tool.name}</h3>
                <p className="text-xs text-[#94a3b8]">{tool.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developer embed */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Developer</span>
            <h2 className="text-3xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              Add Wavio in 60 seconds.
            </h2>
            <p className="text-[#475569] mt-2">One snippet. No engineering required.</p>
          </motion.div>

          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-800 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-400 font-mono">index.html</span>
            </div>
            <pre className="p-6 text-sm overflow-x-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <code className="text-gray-300">{embedCode}</code>
            </pre>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3fbf] hover:gap-2.5 transition-all"
            >
              View API docs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
