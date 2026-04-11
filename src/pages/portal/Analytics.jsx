import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, MessageSquare, Clock, Star, Loader2 } from 'lucide-react'
import { analyticsApi } from '../../api/client'

const chanColor = { whatsapp: '#25d366', email: '#1a3fbf', chat: '#8b5cf6', sms: '#f59e0b' }
const chanLabel = { whatsapp: 'WhatsApp', email: 'Email', chat: 'Live Chat', sms: 'SMS' }

export default function Analytics() {
  const [data, setData]   = useState(null)
  const [loading, setLoad] = useState(true)

  useEffect(() => {
    analyticsApi.workspace()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-[#94a3b8]" size={24} />
    </div>
  )

  if (!data) return (
    <div className="p-6 text-sm text-[#94a3b8]">Failed to load analytics.</div>
  )

  const { daily, statusBreakdown, channelBreakdown, totals, agents } = data
  const maxVol = Math.max(...daily.map(d => d.count), 1)

  const totalByChannel = channelBreakdown.reduce((s, c) => s + c.count, 0) || 1

  const kpis = [
    { label: 'Total Conversations', value: totals.total_convos?.toLocaleString(), icon: MessageSquare, color: '#1a3fbf' },
    { label: 'Total Messages',      value: totals.total_messages?.toLocaleString(), icon: Clock, color: '#4cc61e' },
    { label: 'Resolution Rate',     value: `${totals.resolution_rate}%`, icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Resolved',            value: totals.resolved?.toLocaleString(), icon: Star, color: '#f59e0b' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Analytics</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Last 7 days · live workspace data</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-[#e4e7ed] p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>{value ?? '—'}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Volume chart — last 7 days */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-[#e4e7ed] p-6">
          <h2 className="font-semibold text-[#0f172a] text-sm mb-5">Conversation Volume — last 7 days</h2>
          <div className="flex items-end gap-3 h-40">
            {daily.map(({ day, count }, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(count / maxVol) * 100}%`, minHeight: count > 0 ? 4 : 0, background: 'linear-gradient(to top, #1a3fbf, #2e5de6)', opacity: 0.85 }} />
                <span className="text-[10px] text-[#94a3b8]">{new Date(day).toLocaleDateString('en', { weekday: 'short' })}</span>
                <span className="text-[10px] font-semibold text-[#475569]">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Channel breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-[#e4e7ed] p-6">
          <h2 className="font-semibold text-[#0f172a] text-sm mb-5">Channel Breakdown</h2>
          <div className="space-y-4">
            {channelBreakdown.length === 0 && <p className="text-xs text-[#94a3b8]">No data yet.</p>}
            {channelBreakdown.map(({ channel, count }) => {
              const pct = Math.round((count / totalByChannel) * 100)
              const color = chanColor[channel] ?? '#94a3b8'
              return (
                <div key={channel}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#475569]">{chanLabel[channel] ?? channel}</span>
                    <span className="font-semibold text-[#0f172a]">{pct}%</span>
                  </div>
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }} />
                  </div>
                </div>
              )
            })}
          </div>

          {agents.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
              <p className="text-xs text-[#94a3b8] font-medium mb-3">Top agents by resolved</p>
              {agents.map((a) => (
                <div key={a.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[10px] font-bold text-[#1a3fbf]">
                      {(a.avatar || a.name[0])}
                    </div>
                    <span className="text-xs text-[#475569]">{a.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0f172a]">{a.resolved} resolved</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Status breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {statusBreakdown.map(({ status, count }) => {
          const cfg = { open: ['bg-blue-50 border-blue-200', 'text-blue-700'], pending: ['bg-amber-50 border-amber-200', 'text-amber-700'], resolved: ['bg-emerald-50 border-emerald-200', 'text-emerald-700'] }
          const [bg, text] = cfg[status] ?? ['bg-gray-50 border-gray-200', 'text-gray-700']
          return (
            <div key={status} className={`rounded-xl border p-4 ${bg}`}>
              <p className={`text-xl font-bold ${text}`}>{count}</p>
              <p className={`text-xs capitalize mt-0.5 ${text}`}>{status}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
