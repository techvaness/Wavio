import { motion } from 'framer-motion'
import {
  Building2, Users, CreditCard, MessageSquare,
  TrendingUp, TrendingDown, ArrowUpRight, AlertTriangle, CheckCircle,
  UserPlus, Zap, Clock
} from 'lucide-react'

const kpis = [
  { label: 'Total Accounts',      value: '1,047',   sub: '+38 this month',  trend: '+3.8%', up: true,  icon: Building2,     color: '#1a3fbf' },
  { label: 'MRR',                 value: '$24,810',  sub: '+$1,880 vs last', trend: '+8.2%', up: true,  icon: CreditCard,    color: '#4cc61e' },
  { label: 'Active Chats Now',    value: '342',      sub: '89 agents online',trend: 'live',  up: true,  icon: MessageSquare, color: '#8b5cf6', live: true },
  { label: 'Total Users',         value: '5,284',    sub: '+124 this month', trend: '+2.4%', up: true,  icon: Users,         color: '#f59e0b' },
]

const days = ['Apr 1','Apr 2','Apr 3','Apr 4','Apr 5','Apr 6','Apr 7','Apr 8','Apr 9','Apr 10']
const revenues = [780, 820, 795, 860, 910, 875, 940, 960, 920, 980]
const maxRev = Math.max(...revenues)

const signups = [
  { name: 'Bloom Studio',   owner: 'lena@bloom.io',    plan: 'Pro',        agents: 4,  time: '2m ago' },
  { name: 'Kora Labs',      owner: 'aisha@kora.io',    plan: 'Free',       agents: 1,  time: '9m ago' },
  { name: 'FastShip',       owner: 'carlos@fast.co',   plan: 'Pro',        agents: 6,  time: '23m ago' },
  { name: 'Shopform',       owner: 'priya@shopform.io',plan: 'Enterprise', agents: 12, time: '1h ago' },
  { name: 'Nova App',       owner: 'marco@nova.app',   plan: 'Pro',        agents: 3,  time: '2h ago' },
]

const liveChats = [
  { workspace: 'Shopform',     agent: 'Priya S.',   contact: 'Sarah K.',   channel: 'WhatsApp', dur: '3:14', status: 'active' },
  { workspace: 'FastShip',     agent: 'Carlos M.',  contact: 'Tom R.',     channel: 'Email',    dur: '1:02', status: 'waiting' },
  { workspace: 'Bloom Studio', agent: 'Lena T.',    contact: 'Mia L.',     channel: 'Chat',     dur: '5:48', status: 'active' },
  { workspace: 'Kora Labs',    agent: 'Aisha B.',   contact: 'James P.',   channel: 'WhatsApp', dur: '0:31', status: 'active' },
]

const alerts = [
  { type: 'warn',  text: 'FastShip hit 90% of monthly conversation quota',   time: '4m ago' },
  { type: 'warn',  text: 'Failed payment for Nova App — card declined',       time: '28m ago' },
  { type: 'ok',    text: 'DB backup completed — 3.2 GB snapshot stored',      time: '1h ago' },
  { type: 'warn',  text: 'Unusual login from 185.220.x.x for marco@nova.app', time: '2h ago' },
  { type: 'ok',    text: 'Stripe webhook sync — 14 events processed',         time: '3h ago' },
]

const planColors = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700' }
const chanColors  = { WhatsApp: 'text-green-600', Email: 'text-blue-600', Chat: 'text-purple-600' }

export default function ControlDashboard() {
  return (
    <div className="p-5 space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Platform Overview</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Thursday, April 10 2026 · All times UTC</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map(({ label, value, sub, trend, up, icon: Icon, color, live }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-[#e4e7ed] p-4"
          >
            <div className="flex items-start justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={15} style={{ color }} />
              </div>
              {live ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
                </span>
              ) : (
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{trend}
                </span>
              )}
            </div>
            <p className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>{value}</p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5">{label}</p>
            <p className="text-[10px] font-medium text-[#64748b] mt-1">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="xl:col-span-2 bg-white rounded-xl border border-[#e4e7ed] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">Daily Revenue</p>
              <p className="text-xs text-[#94a3b8]">Last 10 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><ArrowUpRight size={13} />+8.2% MTM</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {revenues.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md"
                  style={{ height: `${(v / maxRev) * 100}%`, background: 'linear-gradient(to top, #1a3fbf, #4cc61e)', opacity: i === revenues.length - 1 ? 1 : 0.55 }}
                />
                <span className="text-[8px] text-[#94a3b8] rotate-0 whitespace-nowrap">{days[i].split(' ')[1]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#f1f5f9]">
            {[['MRR', '$24,810'], ['ARR (run-rate)', '$297,720'], ['ARPU', '$23.70'], ['Churn', '2.1%']].map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] text-[#94a3b8]">{k}</p>
                <p className="text-sm font-bold text-[#0f172a]">{v}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0f172a]">Alerts</p>
            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">3 active</span>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 px-4 py-3">
                {a.type === 'warn'
                  ? <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  : <CheckCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                }
                <div>
                  <p className="text-[11px] text-[#475569] leading-snug">{a.text}</p>
                  <p className="text-[10px] text-[#cbd5e1] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent sign-ups */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
          className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
            <p className="text-sm font-semibold text-[#0f172a] flex items-center gap-2"><UserPlus size={14} className="text-[#1a3fbf]" />Recent Sign-ups</p>
            <a href="/control/accounts" className="text-[10px] text-[#1a3fbf] font-semibold hover:underline">View all →</a>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {signups.map((s) => (
              <div key={s.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafbfc] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
                  <p className="text-[10px] text-[#94a3b8] truncate">{s.owner}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${planColors[s.plan]}`}>{s.plan}</span>
                  <span className="text-[10px] text-[#cbd5e1]">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live conversations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
            <p className="text-sm font-semibold text-[#0f172a] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Live Conversations
            </p>
            <a href="/control/conversations" className="text-[10px] text-[#1a3fbf] font-semibold hover:underline">View all →</a>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {liveChats.map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafbfc] transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0f172a]">{c.contact} <span className="font-normal text-[#94a3b8]">→ {c.workspace}</span></p>
                  <p className="text-[10px] text-[#94a3b8]">Agent: {c.agent}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-semibold ${chanColors[c.channel]}`}>{c.channel}</span>
                  <span className="text-[10px] font-mono text-[#64748b]">{c.dur}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
