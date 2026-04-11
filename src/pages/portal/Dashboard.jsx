import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Clock, CheckCircle, Star, ArrowUpRight, ArrowDownRight, Inbox, Users, Zap, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../../api/client'

const priorityColor = { high: 'bg-red-100 text-red-600', medium: 'bg-amber-100 text-amber-700', low: 'bg-gray-100 text-gray-500' }
const chanColor     = { whatsapp: 'text-green-600', email: 'text-blue-600', chat: 'text-purple-600', sms: 'text-amber-600' }
const statusDot     = { online: 'bg-emerald-500', busy: 'bg-amber-400', offline: 'bg-gray-300' }

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export default function PortalDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.stats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const stats = data ? [
    { label: 'Open',            value: String(data.open),           icon: MessageSquare, color: '#1a3fbf' },
    { label: 'Pending reply',   value: String(data.pending),        icon: Inbox,         color: '#f59e0b' },
    { label: 'Resolved today',  value: String(data.resolvedToday),  icon: CheckCircle,   color: '#4cc61e' },
    { label: 'Agents online',   value: `${data.agentsOnline} / ${data.totalAgents}`, icon: Users, color: '#64748b' },
  ] : []

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-[#94a3b8]" />
    </div>
  )

  return (
    <div className="p-5 space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })} · Your workspace at a glance</p>
        </div>
        <Link to="/portal/inbox"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-xl transition-colors">
          <Inbox size={13} /> Open Inbox
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-[#e4e7ed] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={13} style={{ color }} />
              </div>
            </div>
            <p className="text-lg font-bold text-[#0f172a]">{value}</p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* My queue */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f1f5f9]">
            <p className="text-sm font-bold text-[#0f172a]">My Queue <span className="ml-1.5 text-[10px] bg-[#1a3fbf] text-white px-2 py-0.5 rounded-full">{data?.myQueue?.length ?? 0}</span></p>
            <Link to="/portal/inbox" className="text-[10px] text-[#1a3fbf] font-semibold hover:underline">View inbox →</Link>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {(data?.myQueue || []).map((c) => (
              <Link key={c.id} to="/portal/inbox"
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#f8fafc] transition-colors block">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-xs flex-shrink-0">
                  {(c.contact_name || '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0f172a]">{c.contact_name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${priorityColor[c.priority] || ''}`}>{c.priority}</span>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] truncate mt-0.5">{c.subject}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className={`text-[10px] font-semibold ${chanColor[c.channel] || 'text-gray-500'}`}>{c.channel}</p>
                  <p className="text-[9px] text-[#cbd5e1] mt-0.5">Updated {timeAgo(c.updated_at)}</p>
                </div>
              </Link>
            ))}
            {!data?.myQueue?.length && (
              <div className="py-10 text-center text-xs text-[#94a3b8]">Queue is clear — great work! 🎉</div>
            )}
          </div>
        </motion.div>

        {/* Team status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#f1f5f9]">
            <p className="text-sm font-bold text-[#0f172a]">Team</p>
            <Link to="/portal/team" className="text-[10px] text-[#1a3fbf] font-semibold hover:underline">Manage →</Link>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {(data?.team || []).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-[10px]">
                    {(a.name || '?')[0]}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${statusDot[a.status] || 'bg-gray-300'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#0f172a]">{a.name}</p>
                  <p className="text-[10px] text-[#94a3b8] capitalize">{a.status}</p>
                </div>
                {a.convos > 0 && (
                  <span className="text-[10px] font-bold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-full">{a.convos}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity + Quick actions */}
      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-xl border border-[#e4e7ed] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f1f5f9]">
            <p className="text-sm font-bold text-[#0f172a]">Recent Activity</p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {(data?.activity || []).map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#1a3fbf]" />
                <div className="flex-1">
                  <p className="text-xs text-[#475569]">
                    {item.from_type === 'customer' ? `${item.contact_name} sent a message` : `${item.agent_name} replied`}
                  </p>
                  <p className="text-[10px] text-[#cbd5e1] mt-0.5">{timeAgo(item.created_at)}</p>
                </div>
              </div>
            ))}
            {!data?.activity?.length && <p className="text-xs text-[#94a3b8]">No recent activity</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-[#e4e7ed] p-4 space-y-2.5">
          <p className="text-sm font-bold text-[#0f172a] mb-3">Quick Actions</p>
          {[
            { label: 'Open Inbox',              to: '/portal/inbox',        color: 'bg-[#1a3fbf] text-white hover:bg-[#2e5de6]' },
            { label: 'View Contacts',           to: '/portal/contacts',     color: 'bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#e4e7ed]' },
            { label: 'Invite Team Member',      to: '/portal/team',         color: 'bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#e4e7ed]' },
            { label: 'View Reports',            to: '/portal/reports',      color: 'bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#e4e7ed]' },
          ].map(({ label, to, color }) => (
            <Link key={label} to={to}
              className={`block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-colors ${color}`}>
              {label}
            </Link>
          ))}
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-[#1a3fbf]/5 to-[#4cc61e]/5 border border-[#1a3fbf]/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={12} className="text-[#4cc61e]" />
              <span className="text-[11px] font-bold text-[#1a3fbf]">AI Assistant</span>
            </div>
            <p className="text-[10px] text-[#64748b]">AI suggested replies are enabled for your workspace.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
