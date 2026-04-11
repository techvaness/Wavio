import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'

const integrations = [
  { name: 'WhatsApp Business', desc: 'Send & receive WhatsApp messages', connected: true, logo: '💬', category: 'Messaging' },
  { name: 'Gmail', desc: 'Connect your Google inbox', connected: true, logo: '✉️', category: 'Email' },
  { name: 'Shopify', desc: 'Pull order & customer data', connected: false, logo: '🛒', category: 'E-commerce' },
  { name: 'Slack', desc: 'Get notified in Slack channels', connected: false, logo: '⚡', category: 'Notifications' },
  { name: 'HubSpot', desc: 'Sync contacts & deals', connected: false, logo: '🟠', category: 'CRM' },
  { name: 'Stripe', desc: 'View payment info in conversations', connected: false, logo: '💳', category: 'Payments' },
  { name: 'Instagram DM', desc: 'Manage DMs from your inbox', connected: true, logo: '📸', category: 'Messaging' },
  { name: 'Zapier', desc: 'Automate with 5,000+ apps', connected: false, logo: '⚡', category: 'Automation' },
]

export default function Integrations() {
  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Integrations</h1>
        <p className="text-sm text-[#64748b] mt-0.5">{integrations.filter(i => i.connected).length} connected · {integrations.filter(i => !i.connected).length} available</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map(({ name, desc, connected, logo, category }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-[#e4e7ed] p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#f8fafc] border border-[#e4e7ed] flex items-center justify-center text-2xl">
                  {logo}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{name}</p>
                  <p className="text-[10px] text-[#94a3b8]">{category}</p>
                </div>
              </div>
              {connected && (
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-emerald-600" />
                </div>
              )}
            </div>
            <p className="text-xs text-[#64748b] mb-4">{desc}</p>
            <button
              className={`w-full py-2 text-xs font-semibold rounded-xl transition-colors ${
                connected
                  ? 'border border-[#e4e7ed] text-[#64748b] hover:bg-[#f1f5f9]'
                  : 'bg-[#1a3fbf] text-white hover:bg-[#2e5de6]'
              }`}
            >
              {connected ? 'Manage' : (
                <span className="flex items-center justify-center gap-1.5"><Plus size={12} /> Connect</span>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
