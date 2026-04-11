import { motion } from 'framer-motion'
import { TrendingUp, MessageSquare, Clock, Star } from 'lucide-react'

const metrics = [
  { label: 'Total Conversations', value: '1,284', change: '+8.4%', icon: MessageSquare, color: '#1a3fbf' },
  { label: 'Avg. Response Time', value: '1m 42s', change: '-12%', icon: Clock, color: '#4cc61e' },
  { label: 'Resolution Rate', value: '94.2%', change: '+2.1%', icon: TrendingUp, color: '#8b5cf6' },
  { label: 'CSAT Score', value: '4.8 / 5', change: '+0.2', icon: Star, color: '#f59e0b' },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const volumes = [42, 58, 47, 73, 65, 31, 18]
const maxVol = Math.max(...volumes)

const channelData = [
  { name: 'WhatsApp', pct: 44, color: '#25d366' },
  { name: 'Email', pct: 31, color: '#1a3fbf' },
  { name: 'Live Chat', pct: 18, color: '#8b5cf6' },
  { name: 'SMS', pct: 7, color: '#f59e0b' },
]

export default function Analytics() {
  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Analytics</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Last 7 days · Apr 3 – Apr 10</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {metrics.map(({ label, value, change, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-[#e4e7ed] p-5"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>{value}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{label}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-1.5">{change} vs last week</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Volume chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-[#e4e7ed] p-6"
        >
          <h2 className="font-semibold text-[#0f172a] text-sm mb-5">Conversation Volume</h2>
          <div className="flex items-end gap-3 h-40">
            {days.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(volumes[i] / maxVol) * 100}%`,
                    background: `linear-gradient(to top, #1a3fbf, #2e5de6)`,
                    opacity: 0.85,
                  }}
                />
                <span className="text-[10px] text-[#94a3b8]">{day}</span>
                <span className="text-[10px] font-semibold text-[#475569]">{volumes[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Channel breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-[#e4e7ed] p-6"
        >
          <h2 className="font-semibold text-[#0f172a] text-sm mb-5">Channel Breakdown</h2>
          <div className="space-y-4">
            {channelData.map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#475569]">{name}</span>
                  <span className="font-semibold text-[#0f172a]">{pct}%</span>
                </div>
                <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
            <p className="text-xs text-[#94a3b8] font-medium mb-3">Top performers</p>
            {['You', 'Alex M.', 'Priya N.'].map((agent, i) => (
              <div key={agent} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[10px] font-bold text-[#1a3fbf]">
                    {agent[0]}
                  </div>
                  <span className="text-xs text-[#475569]">{agent}</span>
                </div>
                <span className="text-xs font-semibold text-[#0f172a]">{[57, 43, 38][i]} resolved</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
