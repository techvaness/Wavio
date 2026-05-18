import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const WhatsAppIcon = ({ size = 22, color = '#25D366' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const InstagramIcon = ({ size = 22, color = '#E1306C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill={color} stroke="none"/>
  </svg>
)

const MessengerIcon = ({ size = 22, color = '#1877F2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/>
  </svg>
)

const TelegramIcon = ({ size = 22, color = '#0088cc' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const SmsIcon = ({ size = 22, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="10" x2="9" y2="10"/>
    <line x1="12" y1="10" x2="12" y2="10"/>
    <line x1="15" y1="10" x2="15" y2="10"/>
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const channels = [
  { name: 'WhatsApp', desc: 'Two-way WhatsApp Business API. Send, receive, and automate at scale.', color: '#25D366', bg: '#dcfce7', status: 'Available', Icon: WhatsAppIcon },
  { name: 'Instagram', desc: 'Manage Instagram DMs and story replies without leaving your inbox.', color: '#E1306C', bg: '#fce7f3', status: 'Available', Icon: InstagramIcon },
  { name: 'Facebook Messenger', desc: 'Full Messenger support with rich messages, buttons, and quick replies.', color: '#1877F2', bg: '#dbeafe', status: 'Available', Icon: MessengerIcon },
  { name: 'Email', desc: 'Turn email into a collaborative, threaded inbox for your whole team.', color: '#1a3fbf', bg: '#eff6ff', status: 'Available', Icon: ({ size, color }) => <Mail size={size} style={{ color }} /> },
  { name: 'SMS', desc: 'Two-way SMS conversations via Twilio or your own provider.', color: '#64748b', bg: '#f1f5f9', status: 'Available', Icon: SmsIcon },
  { name: 'Telegram', desc: 'Connect your Telegram bot to receive and reply from Wavio.', color: '#0088cc', bg: '#e0f2fe', status: 'Coming soon', Icon: TelegramIcon },
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
  const { t } = useLanguage()
  const hero = t('integrations.hero')

  const currentTools = toolCategories.find(c => c.label === activeCategory)?.tools || []

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 bg-white text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {hero.title}
          </h1>
          <p className="text-xl text-[#475569] max-w-lg mx-auto">
            {hero.sub}
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
                    <ch.Icon size={22} color={ch.color} />
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
