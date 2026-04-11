import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, X, Loader2, Unplug } from 'lucide-react'
import { integrationsApi } from '../../api/client'

const CATALOG = [
  {
    channel: 'whatsapp',
    name: 'WhatsApp Business',
    desc: 'Send & receive WhatsApp messages directly in your inbox',
    logo: '💬',
    category: 'Messaging',
    fields: [{ key: 'phone_number', label: 'Phone number', placeholder: '+1 234 567 8900' }],
  },
  {
    channel: 'email',
    name: 'Email',
    desc: 'Connect a support email address to your inbox',
    logo: '✉️',
    category: 'Email',
    fields: [{ key: 'email', label: 'Email address', placeholder: 'support@yourcompany.com' }],
  },
  {
    channel: 'sms',
    name: 'SMS',
    desc: 'Send & receive text messages from customers',
    logo: '📱',
    category: 'Messaging',
    fields: [{ key: 'phone_number', label: 'Phone number', placeholder: '+1 234 567 8900' }],
  },
  {
    channel: 'instagram',
    name: 'Instagram DM',
    desc: 'Manage Instagram direct messages from your inbox',
    logo: '📸',
    category: 'Messaging',
    fields: [{ key: 'username', label: 'Instagram username', placeholder: '@yourbusiness' }],
  },
  {
    channel: 'shopify',
    name: 'Shopify',
    desc: 'Pull order & customer data into conversations',
    logo: '🛒',
    category: 'E-commerce',
    fields: [{ key: 'shop_domain', label: 'Shop domain', placeholder: 'yourstore.myshopify.com' }],
  },
  {
    channel: 'slack',
    name: 'Slack',
    desc: 'Get notified in Slack when new conversations arrive',
    logo: '⚡',
    category: 'Notifications',
    fields: [
      { key: 'channel_name', label: 'Slack channel', placeholder: '#support' },
      { key: 'webhook_url',  label: 'Incoming webhook URL', placeholder: 'https://hooks.slack.com/services/…' },
    ],
  },
]

export default function Integrations() {
  const [connected, setConnected]   = useState({}) // channel → config
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null) // catalog item being configured
  const [formValues, setFormValues] = useState({})
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [disconnecting, setDisc]    = useState(null) // channel being disconnected

  useEffect(() => {
    integrationsApi.list()
      .then(rows => {
        const map = {}
        rows.forEach(r => { if (r.connected) map[r.channel] = r.config || {} })
        setConnected(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function openConnect(item) {
    setFormValues(Object.fromEntries(item.fields.map(f => [f.key, ''])))
    setError('')
    setModal(item)
  }

  async function handleConnect(e) {
    e.preventDefault()
    if (!modal) return
    setSaving(true)
    setError('')
    try {
      await integrationsApi.connect(modal.channel, formValues)
      setConnected(prev => ({ ...prev, [modal.channel]: formValues }))
      setModal(null)
    } catch (err) {
      setError(err.message || 'Failed to connect')
    } finally {
      setSaving(false)
    }
  }

  async function handleDisconnect(channel) {
    setDisc(channel)
    try {
      await integrationsApi.disconnect(channel)
      setConnected(prev => { const n = { ...prev }; delete n[channel]; return n })
    } catch { /* ignore */ }
    finally { setDisc(null) }
  }

  const connectedCount = Object.keys(connected).length

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Integrations</h1>
        <p className="text-sm text-[#64748b] mt-0.5">
          {loading ? 'Loading…' : `${connectedCount} connected · ${CATALOG.length - connectedCount} available`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CATALOG.map((item, i) => {
            const isConnected = Boolean(connected[item.channel])
            const isDisc = disconnecting === item.channel
            return (
              <motion.div key={item.channel}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-[#e4e7ed] p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#f8fafc] border border-[#e4e7ed] flex items-center justify-center text-2xl">
                      {item.logo}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{item.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{item.category}</p>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-emerald-600" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#64748b] mb-4">{item.desc}</p>
                {isConnected ? (
                  <div className="flex gap-2">
                    <button onClick={() => openConnect(item)}
                      className="flex-1 py-2 text-xs font-semibold rounded-xl border border-[#e4e7ed] text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                      Configure
                    </button>
                    <button onClick={() => handleDisconnect(item.channel)} disabled={isDisc}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                      {isDisc ? <Loader2 size={11} className="animate-spin" /> : <Unplug size={11} />}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => openConnect(item)}
                    className="w-full py-2 text-xs font-semibold rounded-xl bg-[#1a3fbf] text-white hover:bg-[#2e5de6] transition-colors">
                    <span className="flex items-center justify-center gap-1.5"><Plus size={12} /> Connect</span>
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Connect modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{modal.logo}</span>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">{modal.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{modal.category}</p>
                  </div>
                </div>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#94a3b8] transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                {modal.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-[#475569] mb-1.5">{field.label}</label>
                    <input
                      type={field.key === 'webhook_url' ? 'url' : 'text'}
                      value={formValues[field.key] || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      required
                      className="w-full px-3 py-2.5 text-sm border border-[#e4e7ed] rounded-xl focus:outline-none focus:border-[#1a3fbf] transition-colors bg-[#f8fafc] placeholder:text-[#cbd5e1]"
                    />
                  </div>
                ))}

                {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setModal(null)}
                    className="flex-1 py-2.5 text-xs font-semibold border border-[#e4e7ed] rounded-xl text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 text-xs font-bold bg-[#1a3fbf] text-white rounded-xl hover:bg-[#2e5de6] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 size={12} className="animate-spin" />}
                    {connected[modal.channel] ? 'Save changes' : 'Connect'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
