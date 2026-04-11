import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, TrendingUp, Users, Download, Loader2 } from 'lucide-react'
import { dashboardApi } from '../../api/client'

const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const CHAN_COLORS = { whatsapp: '#25d366', email: '#1a3fbf', chat: '#8b5cf6', sms: '#f59e0b' }

export default function Reports() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.reports()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-[#94a3b8]" />
    </div>
  )

  const { total = 0, resolved = 0, vol7 = [], channels = [], agents = [] } = data || {}
  const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0
  const maxVol = Math.max(1, ...vol7.map(d => d.total))

  const kpis = [
    { label: 'Total Conversations', value: String(total),      icon: MessageSquare, color: '#1a3fbf' },
    { label: 'Resolved',            value: String(resolved),   icon: CheckCircle,   color: '#4cc61e' },
    { label: 'Resolution Rate',     value: `${resRate}%`,      icon: TrendingUp,    color: '#06b6d4' },
    { label: 'Active Channels',     value: String(channels.length), icon: Users,   color: '#64748b' },
  ]

  return (
    <div className="p-5 space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Reports</h1>
          <p className="text-xs text-[#64748b] mt-0.5">All time · All channels</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f8fafc] transition-colors">
          <Download size={12} /> Export
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-[#e4e7ed] p-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
              <Icon size={13} style={{ color }} />
            </div>
            <p className="text-xl font-bold text-[#0f172a]">{value}</p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        {/* Volume chart */}
        <div className="bg-white rounded-xl border border-[#e4e7ed] p-5">
          <div className="mb-4">
            <p className="text-sm font-bold text-[#0f172a]">Volume & Resolution</p>
            <p className="text-xs text-[#94a3b8]">Last 7 days</p>
          </div>
          {vol7.length > 0 ? (
            <div className="flex items-end gap-2 h-36">
              {vol7.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t-md" style={{ height: `${(d.total / maxVol) * 120}px`, background: '#1a3fbf', opacity: 0.2 }} />
                    <div className="w-full rounded-t-md -mt-[120px] relative" style={{ height: `${(d.resolved / maxVol) * 120}px`, background: 'linear-gradient(to top, #1a3fbf, #4cc61e)' }} />
                  </div>
                  <span className="text-[9px] text-[#94a3b8]">{new Date(d.day).toLocaleDateString('en-US',{weekday:'short'})}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-xs text-[#94a3b8]">No data for last 7 days</div>
          )}
        </div>

        {/* Channel breakdown */}
        <div className="bg-white rounded-xl border border-[#e4e7ed] p-5">
          <div className="mb-4">
            <p className="text-sm font-bold text-[#0f172a]">Channel Breakdown</p>
            <p className="text-xs text-[#94a3b8]">{total} total conversations</p>
          </div>
          <div className="space-y-4">
            {channels.map(c => {
              const pct = total > 0 ? Math.round((c.convos / total) * 100) : 0
              const color = CHAN_COLORS[c.channel] || '#94a3b8'
              const resPct = c.convos > 0 ? Math.round((c.resolved / c.convos) * 100) : 0
              return (
                <div key={c.channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-xs font-semibold capitalize text-[#0f172a]">{c.channel}</span>
                    </div>
                    <span className="text-xs text-[#64748b]">{c.convos} convos · {resPct}% resolved</span>
                  </div>
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }} />
                  </div>
                </div>
              )
            })}
            {channels.length === 0 && <p className="text-xs text-[#94a3b8] text-center py-4">No channel data yet</p>}
          </div>
        </div>
      </div>

      {/* Agent performance */}
      <div className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#f1f5f9]">
          <p className="text-sm font-bold text-[#0f172a]">Agent Performance</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
              {['Agent','Conversations','Resolved','Resolution Rate'].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-[9px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {agents.map((a, i) => (
              <motion.tr key={a.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-xs">{(a.name || '?')[0]}</div>
                    <span className="text-xs font-semibold text-[#0f172a]">{a.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-[#0f172a]">{a.convos}</td>
                <td className="px-5 py-3 text-xs text-[#475569]">{a.resolved}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#4cc61e]" style={{ width: `${a.convos > 0 ? Math.round((a.resolved / a.convos) * 100) : 0}%` }} />
                    </div>
                    <span className="text-xs text-[#475569]">{a.convos > 0 ? Math.round((a.resolved / a.convos) * 100) : 0}%</span>
                  </div>
                </td>
              </motion.tr>
            ))}
            {agents.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-xs text-[#94a3b8]">No agent data yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
