import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Users, MessageSquare, Mail,
  TrendingUp, ArrowUpRight, AlertTriangle, CheckCircle,
  UserPlus, Loader2
} from 'lucide-react'
import { adminApi } from '../../api/client'

const planColors = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700', starter: 'bg-slate-100 text-slate-600' }

export default function ControlDashboard() {
  const [stats, setStats]   = useState(null)
  const [wsList, setWsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.workspaces()])
      .then(([s, ws]) => { setStats(s); setWsList(ws) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const kpis = stats ? [
    { label: 'Total Workspaces', value: stats.workspace_count, sub: 'Registered accounts', icon: Building2,     color: '#1a3fbf' },
    { label: 'Total Users',      value: stats.user_count,      sub: 'Agents + admins',     icon: Users,         color: '#f59e0b' },
    { label: 'Open Chats',       value: stats.open_convos,     sub: 'Needs attention',      icon: MessageSquare, color: '#8b5cf6', live: true },
    { label: 'Total Messages',   value: stats.total_messages,  sub: 'All time',             icon: Mail,          color: '#4cc61e' },
  ] : []

  return (
    <div className="p-5 space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Platform Overview</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{new Date().toDateString()} · All times UTC</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {kpis.map(({ label, value, sub, icon: Icon, color, live }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-[#e4e7ed] p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  {live && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>{value?.toLocaleString()}</p>
                <p className="text-[10px] text-[#94a3b8] mt-0.5">{label}</p>
                <p className="text-[10px] font-medium text-[#64748b] mt-1">{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent workspaces */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
              <p className="text-sm font-semibold text-[#0f172a] flex items-center gap-2"><UserPlus size={14} className="text-[#1a3fbf]" />Recent Workspaces</p>
              <a href="/control/workspaces" className="text-[10px] text-[#1a3fbf] font-semibold hover:underline">View all →</a>
            </div>
            <div className="divide-y divide-[#f8fafc]">
              {wsList.slice(0, 6).map((w) => (
                <div key={w.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafbfc] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {w.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0f172a]">{w.name}</p>
                    <p className="text-[10px] text-[#94a3b8] truncate">{w.owner_email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${planColors[w.plan] ?? planColors.starter}`}>{w.plan}</span>
                    <span className="text-[10px] text-[#94a3b8]">{w.agent_count} agents</span>
                  </div>
                </div>
              ))}
              {wsList.length === 0 && <p className="text-xs text-[#94a3b8] text-center py-6">No workspaces yet.</p>}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
