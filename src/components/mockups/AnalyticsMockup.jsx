import { motion } from 'framer-motion'

const bars = [
  { label: 'Mon', value: 65, convos: 42 },
  { label: 'Tue', value: 80, convos: 58 },
  { label: 'Wed', value: 55, convos: 35 },
  { label: 'Thu', value: 90, convos: 67 },
  { label: 'Fri', value: 75, convos: 51 },
  { label: 'Sat', value: 45, convos: 28 },
  { label: 'Sun', value: 35, convos: 21 },
]

const stats = [
  { label: 'Avg Response', value: '1m 42s', delta: '-12%', positive: true },
  { label: 'CSAT Score', value: '4.8/5', delta: '+0.3', positive: true },
  { label: 'Open Chats', value: '14', delta: '+2', positive: false },
]

export default function AnalyticsMockup() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-lg mx-auto"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(26,63,191,0.12))' }}
    >
      <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e4e7ed] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Team Performance</h3>
            <p className="text-xs text-[#94a3b8]">Last 7 days</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#f5f6f8] text-[#475569] px-2.5 py-1 rounded-full border border-[#e4e7ed]">This week</span>
            <span className="text-[10px] bg-[#1a3fbf] text-white px-2.5 py-1 rounded-full">Export</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-[#e4e7ed] border-b border-[#e4e7ed]">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-3">
              <div className="text-xs text-[#94a3b8] mb-1">{s.label}</div>
              <div className="text-base font-bold text-[#0f172a]">{s.value}</div>
              <div className={`text-[10px] font-medium ${s.positive ? 'text-[#4cc61e]' : 'text-red-400'}`}>
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="px-5 py-4">
          <div className="text-xs font-semibold text-[#0f172a] mb-4">Conversations / Day</div>
          <div className="flex items-end gap-2 h-24">
            {bars.map((bar, i) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-md relative group cursor-pointer"
                  style={{ backgroundColor: i === 3 ? '#1a3fbf' : '#e4e7ed' }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${bar.value}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                >
                  {i === 3 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap">
                      {bar.convos}
                    </div>
                  )}
                </motion.div>
                <span className="text-[9px] text-[#94a3b8]">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut mini chart */}
        <div className="px-5 pb-4 flex items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="22" fill="none" stroke="#e4e7ed" strokeWidth="10" />
            <circle cx="30" cy="30" r="22" fill="none" stroke="#1a3fbf" strokeWidth="10"
              strokeDasharray={`${0.62 * 138} 138`} strokeLinecap="round"
              transform="rotate(-90 30 30)" />
            <circle cx="30" cy="30" r="22" fill="none" stroke="#4cc61e" strokeWidth="10"
              strokeDasharray={`${0.24 * 138} 138`} strokeLinecap="round"
              transform={`rotate(${-90 + 0.62 * 360} 30 30)`} />
            <text x="30" y="34" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">86%</text>
          </svg>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#1a3fbf]" />
              <span className="text-[10px] text-[#475569]">Resolved — 62%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#4cc61e]" />
              <span className="text-[10px] text-[#475569]">In Progress — 24%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#e4e7ed]" />
              <span className="text-[10px] text-[#475569]">Pending — 14%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
