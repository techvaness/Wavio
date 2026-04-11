import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, MessageSquare, Star } from 'lucide-react'

const ranges = ['7d', '30d', '90d', 'All time']

const months  = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
const userGrowth = [3210, 3680, 4100, 4420, 4780, 5060, 5284]
const convoVol   = [28400, 31200, 38900, 41500, 44100, 46800, 48291]
const maxU = Math.max(...userGrowth)
const maxC = Math.max(...convoVol)

const topAccounts = [
  { name: 'Verdo Health',  convos: 9210, agents: 20, plan: 'Enterprise', csat: 4.9 },
  { name: 'Shopform',      convos: 4821, agents: 12, plan: 'Enterprise', csat: 4.7 },
  { name: 'FastShip',      convos: 2100, agents: 6,  plan: 'Pro',        csat: 4.5 },
  { name: 'Bloom Studio',  convos: 1204, agents: 4,  plan: 'Pro',        csat: 4.8 },
  { name: 'MindBridge',    convos: 740,  agents: 5,  plan: 'Pro',        csat: 4.6 },
]

const channelData = [
  { name: 'WhatsApp',  pct: 41, color: '#25d366' },
  { name: 'Email',     pct: 28, color: '#1a3fbf' },
  { name: 'Live Chat', pct: 22, color: '#8b5cf6' },
  { name: 'SMS',       pct: 9,  color: '#f59e0b' },
]

const planColors = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700' }

export default function Analytics() {
  const [range, setRange] = useState('30d')

  return (
    <div className="p-5 space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Platform Analytics</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Aggregated across all workspaces</p>
        </div>
        <div className="flex rounded-lg border border-[#e4e7ed] bg-white overflow-hidden">
          {ranges.map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors border-r border-[#e4e7ed] last:border-r-0 ${range === r ? 'bg-[#1a3fbf] text-white' : 'text-[#64748b] hover:bg-[#f8fafc]'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Users',          value: '5,284',  change: '+124',   icon: Users,          color: '#1a3fbf' },
          { label: 'Conversations (30d)',   value: '48,291', change: '+12.4%', icon: MessageSquare,  color: '#4cc61e' },
          { label: 'Avg CSAT Score',        value: '4.7 / 5',change: '+0.1',   icon: Star,           color: '#f59e0b' },
          { label: 'New Accounts (30d)',    value: '38',     change: '+6',     icon: TrendingUp,     color: '#8b5cf6' },
        ].map(({ label, value, change, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-[#e4e7ed] p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ background: `${color}18` }}>
              <Icon size={14} style={{ color }} />
            </div>
            <p className="text-xl font-bold text-[#0f172a]">{value}</p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5">{label}</p>
            <p className="text-[10px] font-semibold text-emerald-600 mt-1">{change} this month</p>
          </motion.div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        {/* User growth */}
        <div className="bg-white rounded-xl border border-[#e4e7ed] p-5">
          <p className="text-sm font-semibold text-[#0f172a] mb-1">User Growth</p>
          <p className="text-xs text-[#94a3b8] mb-4">Total registered users by month</p>
          <div className="flex items-end gap-2 h-28">
            {userGrowth.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] text-[#94a3b8]">{(v/1000).toFixed(1)}k</span>
                <div className="w-full rounded-t-md" style={{ height: `${(v / maxU) * 80}%`, background: i === userGrowth.length - 1 ? '#1a3fbf' : '#e4e7ed' }} />
                <span className="text-[8px] text-[#94a3b8]">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation volume */}
        <div className="bg-white rounded-xl border border-[#e4e7ed] p-5">
          <p className="text-sm font-semibold text-[#0f172a] mb-1">Conversation Volume</p>
          <p className="text-xs text-[#94a3b8] mb-4">Total platform-wide conversations per month</p>
          <div className="flex items-end gap-2 h-28">
            {convoVol.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] text-[#94a3b8]">{(v/1000).toFixed(0)}k</span>
                <div className="w-full rounded-t-md" style={{ height: `${(v / maxC) * 80}%`, background: i === convoVol.length - 1 ? '#4cc61e' : '#e4e7ed' }} />
                <span className="text-[8px] text-[#94a3b8]">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* Top accounts */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f1f5f9]">
            <p className="text-sm font-semibold text-[#0f172a]">Top Accounts by Volume</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#fafbfc]">
                {['#', 'Account', 'Conversations', 'Agents', 'Plan', 'CSAT'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {topAccounts.map((a, i) => (
                <tr key={a.name} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-[#94a3b8]">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                        {a.name[0]}
                      </div>
                      <span className="text-xs font-semibold text-[#0f172a]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{a.convos.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{a.agents}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${planColors[a.plan]}`}>{a.plan}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400" fill="#f59e0b" />
                      <span className="text-xs font-semibold text-[#0f172a]">{a.csat}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Channel split */}
        <div className="bg-white rounded-xl border border-[#e4e7ed] p-5">
          <p className="text-sm font-semibold text-[#0f172a] mb-4">Channel Distribution</p>
          <div className="space-y-3.5">
            {channelData.map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#475569]">{name}</span>
                  <span className="font-bold text-[#0f172a]">{pct}%</span>
                </div>
                <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#f1f5f9] space-y-1.5">
            {[['Total messages (30d)', '184,292'], ['Avg per conversation', '3.8 msgs'], ['Median response time', '1m 42s']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-[#94a3b8]">{k}</span>
                <span className="font-semibold text-[#0f172a]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
