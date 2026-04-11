import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, MessageSquare, Star, Loader2 } from 'lucide-react'
import { adminApi, analyticsApi } from '../../api/client'

const planColors = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700', starter: 'bg-slate-100 text-slate-600', pro: 'bg-blue-100 text-blue-700', enterprise: 'bg-violet-100 text-violet-700' }

export default function Analytics() {
  const [stats, setStats]   = useState(null)
  const [wsTop, setWsTop]   = useState([])
  const [loading, setLoad]  = useState(true)

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.workspaces()])
      .then(([s, ws]) => { setStats(s); setWsTop(ws.slice(0, 5)) })
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-[#94a3b8]" size={24} />
    </div>
  )

  const kpis = stats ? [
    { label: 'Total Users',         value: stats.user_count?.toLocaleString(),      icon: Users,         color: '#1a3fbf' },
    { label: 'Total Conversations', value: stats.total_convos?.toLocaleString(),     icon: MessageSquare, color: '#4cc61e' },
    { label: 'Open Right Now',      value: stats.open_convos?.toLocaleString(),      icon: Star,          color: '#f59e0b', live: true },
    { label: 'Total Workspaces',    value: stats.workspace_count?.toLocaleString(),  icon: TrendingUp,    color: '#8b5cf6' },
  ] : []

  return (
    <div className="p-5 space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Platform Analytics</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Aggregated across all workspaces · live data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, color, live }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-[#e4e7ed] p-4">
            <div className="flex items-start justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={14} style={{ color }} />
              </div>
              {live && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
                </span>
              )}
            </div>
            <p className="text-xl font-bold text-[#0f172a]">{value ?? '—'}</p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top workspaces by conversation volume */}
      <div className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#f1f5f9]">
          <p className="text-sm font-semibold text-[#0f172a]">Top Workspaces by Volume</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f1f5f9] bg-[#fafbfc]">
              {['#', 'Workspace', 'Owner', 'Conversations', 'Agents', 'Plan'].map((h) => (
                <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {[...wsTop].sort((a, b) => b.convo_count - a.convo_count).map((w, i) => (
              <tr key={w.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-[#94a3b8]">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                      {w.name[0]}
                    </div>
                    <span className="text-xs font-semibold text-[#0f172a]">{w.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#64748b]">{w.owner_email}</td>
                <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{w.convo_count?.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-[#475569]">{w.agent_count}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${planColors[w.plan] ?? planColors.starter}`}>{w.plan}</span>
                </td>
              </tr>
            ))}
            {wsTop.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-[#94a3b8]">No data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats summary cards */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            ['Total Messages',   stats.total_messages?.toLocaleString()],
            ['Total Contacts',   stats.contact_count?.toLocaleString()],
            ['Open Convos',      stats.open_convos?.toLocaleString()],
            ['Total Workspaces', stats.workspace_count?.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-xl border border-[#e4e7ed] p-4">
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide mb-1">{label}</p>
              <p className="text-xl font-bold text-[#0f172a]">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
