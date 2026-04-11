import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Download, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/client'

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
  'auth.login.success':  'bg-emerald-100 text-emerald-700',
  'auth.login.failed':   'bg-red-100 text-red-700',
  'auth.logout':         'bg-gray-100 text-gray-600',
  'auth.register':       'bg-blue-100 text-blue-700',
  'profile.updated':     'bg-sky-100 text-sky-700',
  'workspace.suspended': 'bg-red-100 text-red-700',
  'workspace.active':    'bg-emerald-100 text-emerald-700',
}

export default function AuditLog() {
  const [rows, setRows]       = useState([])
  const [loading, setLoad]    = useState(true)
  const [search, setSearch]   = useState('')
  const [actionFilter, setAF] = useState('All Actions')

  useEffect(() => {
    adminApi.auditLog()
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  const allActions = ['All Actions', ...new Set(rows.map(r => r.event))]

  const filtered = rows.filter((l) => {
    const q = search.toLowerCase()
    const detail = typeof l.detail === 'string' ? l.detail : ''
    const matchQ = !q || detail.toLowerCase().includes(q) || l.event.toLowerCase().includes(q) || (l.actor || '').toLowerCase().includes(q)
    const matchA = actionFilter === 'All Actions' || l.event === actionFilter
    return matchQ && matchA
  })

  function exportCsv() {
    const header = 'ID,Timestamp,Event,Actor,Detail\n'
    const body = filtered.map(l =>
      `${l.id},"${l.ts}","${l.event}","${l.actor || ''}","${(l.detail || '').replace(/"/g, '""')}"`
    ).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'audit-log.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Audit Log</h1>
          <p className="text-xs text-[#64748b] mt-0.5">All admin and auth actions are recorded.</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f8fafc] transition-colors">
          <Download size={12} /> Export CSV
        </button>
      </div>

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
            {allActions.map((a) => <option key={a}>{a}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
        </div>
        <span className="text-xs text-[#94a3b8]">{filtered.length} entries</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['ID', 'Timestamp', 'Event', 'Actor', 'Detail'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((l, i) => (
                <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 text-[10px] font-mono text-[#94a3b8]">#{l.id}</td>
                  <td className="px-4 py-3 text-[10px] text-[#94a3b8] whitespace-nowrap">{l.ts?.slice(0, 19).replace('T', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${actionColors[l.event] ?? 'bg-gray-100 text-gray-600'}`}>
                      {l.event}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{l.actor}</td>
                  <td className="px-4 py-3 text-xs text-[#64748b] max-w-[280px] truncate">
                    {(() => { try { const d = JSON.parse(l.detail); return Object.entries(d).map(([k,v]) => `${k}: ${v}`).join(' · ') } catch { return l.detail } })()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No log entries match.</div>}
        </div>
      )}
    </div>
  )
}
