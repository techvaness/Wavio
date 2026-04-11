import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Download } from 'lucide-react'

const actionColors = {
  'account.suspended':   'bg-red-100 text-red-700',
  'account.reactivated': 'bg-emerald-100 text-emerald-700',
  'user.impersonated':   'bg-amber-100 text-amber-700',
  'plan.changed':        'bg-blue-100 text-blue-700',
  'user.suspended':      'bg-red-100 text-red-700',
  'billing.refunded':    'bg-violet-100 text-violet-700',
  'settings.updated':    'bg-slate-100 text-slate-600',
  'user.invited':        'bg-sky-100 text-sky-700',
  'feature.toggled':     'bg-teal-100 text-teal-700',
  'auth.login':          'bg-gray-100 text-gray-600',
}

const logs = [
  { id:'AL-1041', admin:'Admin',   action:'account.suspended',   entity:'Nova App (AC004)',        detail:'Reason: failed payment after 3 attempts',     ip:'203.0.113.5',  time:'Apr 10 2026 09:02' },
  { id:'AL-1040', admin:'Admin',   action:'user.impersonated',   entity:'priya@shopform.io',       detail:'Accessed workspace Shopform for support',     ip:'203.0.113.5',  time:'Apr 10 2026 08:51' },
  { id:'AL-1039', admin:'Admin',   action:'plan.changed',        entity:'Verdo Health → Enterprise',detail:'Upgraded from Pro, prorated $320',           ip:'203.0.113.5',  time:'Apr 9 2026 17:30' },
  { id:'AL-1038', admin:'Admin',   action:'billing.refunded',    entity:'INV-2031 · $49',          detail:'Issued refund to marco@nova.app',             ip:'203.0.113.5',  time:'Apr 9 2026 14:15' },
  { id:'AL-1037', admin:'Admin',   action:'feature.toggled',     entity:'AI Suggestions',          detail:'Enabled for Pro plan globally',               ip:'203.0.113.5',  time:'Apr 9 2026 11:00' },
  { id:'AL-1036', admin:'Admin',   action:'user.invited',        entity:'new@customer.io',         detail:'Invited to workspace Kora as agent',         ip:'203.0.113.5',  time:'Apr 8 2026 16:22' },
  { id:'AL-1035', admin:'Admin',   action:'settings.updated',    entity:'Platform: maintenance_mode',detail:'Set to false (disabled)',                  ip:'203.0.113.5',  time:'Apr 8 2026 09:10' },
  { id:'AL-1034', admin:'Admin',   action:'account.reactivated', entity:'FastShip (AC006)',        detail:'Reactivated after payment resolved',          ip:'203.0.113.5',  time:'Apr 7 2026 13:45' },
  { id:'AL-1033', admin:'Admin',   action:'user.suspended',      entity:'marco@nova.app',          detail:'Suspended due to TOS violation',             ip:'203.0.113.5',  time:'Apr 6 2026 10:30' },
  { id:'AL-1032', admin:'Admin',   action:'auth.login',          entity:'admin@wavio.com',         detail:'Login from browser Chrome/Windows',          ip:'203.0.113.5',  time:'Apr 6 2026 09:00' },
]

const actionTypes = ['All Actions', ...Object.keys(actionColors)]

export default function AuditLog() {
  const [search, setSearch]     = useState('')
  const [actionFilter, setAF]   = useState('All Actions')

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase()
    const matchQ = !q || l.entity.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q) || l.action.toLowerCase().includes(q)
    const matchA = actionFilter === 'All Actions' || l.action === actionFilter
    return matchQ && matchA
  })

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Audit Log</h1>
          <p className="text-xs text-[#64748b] mt-0.5">All admin actions are recorded. Retained for 90 days.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f8fafc] transition-colors">
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs…"
            className="pl-7 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] w-52 transition-colors" />
        </div>
        <div className="relative">
          <select value={actionFilter} onChange={(e) => setAF(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] text-[#475569] cursor-pointer transition-colors">
            {actionTypes.map((a) => <option key={a}>{a}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
              {['ID', 'Admin', 'Action', 'Entity / Target', 'Detail', 'IP', 'Timestamp'].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {filtered.map((l, i) => (
              <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3 text-[10px] font-mono text-[#94a3b8]">{l.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[9px] font-bold">A</div>
                    <span className="text-xs font-semibold text-[#0f172a]">{l.admin}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${actionColors[l.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {l.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#0f172a] font-medium max-w-[160px] truncate">{l.entity}</td>
                <td className="px-4 py-3 text-xs text-[#64748b] max-w-[200px] truncate">{l.detail}</td>
                <td className="px-4 py-3 text-[10px] font-mono text-[#94a3b8]">{l.ip}</td>
                <td className="px-4 py-3 text-[10px] text-[#94a3b8] whitespace-nowrap">{l.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No log entries match.</div>}
      </div>
    </div>
  )
}
