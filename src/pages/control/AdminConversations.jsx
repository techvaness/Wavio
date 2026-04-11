import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/client'

const statusColors = { open: 'bg-blue-100 text-blue-700', resolved: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700' }
const chanColors   = { whatsapp: 'text-green-600 bg-green-50', email: 'text-blue-600 bg-blue-50', chat: 'text-purple-600 bg-purple-50', sms: 'text-orange-600 bg-orange-50' }

const channels = ['All Channels', 'chat', 'email', 'whatsapp', 'sms']
const statuses = ['All Status', 'open', 'pending', 'resolved']

export default function AdminConversations() {
  const [rows, setRows]     = useState([])
  const [loading, setLoad]  = useState(true)
  const [search, setSearch] = useState('')
  const [channel, setChan]  = useState('All Channels')
  const [status, setStatus] = useState('All Status')

  useEffect(() => {
    adminApi.conversations()
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  // collect unique workspace names for filter
  const wsNames = ['All Workspaces', ...new Set(rows.map(r => r.workspace_name).filter(Boolean))]
  const [workspace, setWS] = useState('All Workspaces')

  const filtered = rows.filter((c) => {
    const q = search.toLowerCase()
    const matchQ = !q || (c.contact_name || '').toLowerCase().includes(q) || (c.subject || '').toLowerCase().includes(q) || (c.workspace_name || '').toLowerCase().includes(q)
    const matchWS = workspace === 'All Workspaces' || c.workspace_name === workspace
    const matchCh = channel === 'All Channels' || c.channel === channel
    const matchSt = status === 'All Status' || c.status === status
    return matchQ && matchWS && matchCh && matchSt
  })

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>All Conversations</h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            {rows.length} total · {rows.filter(c => c.status === 'open').length} open · {rows.filter(c => c.status === 'pending').length} pending
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="pl-7 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] w-48 transition-colors" />
        </div>
        {[
          [workspace, setWS, wsNames],
          [channel, setChan, channels],
          [status, setStatus, statuses],
        ].map(([val, setter, opts], i) => (
          <div key={i} className="relative">
            <select value={val} onChange={(e) => setter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] text-[#475569] cursor-pointer transition-colors">
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          </div>
        ))}
        <span className="text-xs text-[#94a3b8]">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['ID', 'Contact', 'Workspace', 'Agent', 'Subject', 'Channel', 'Status', 'Updated'].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                  <td className="px-3 py-3 text-[10px] font-mono text-[#94a3b8]">#{c.id}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-[9px] flex-shrink-0">
                        {(c.contact_name || '?')[0]}
                      </div>
                      <span className="text-xs font-semibold text-[#0f172a]">{c.contact_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-[#475569]">{c.workspace_name}</td>
                  <td className="px-3 py-3 text-xs text-[#475569]">{c.agent_name || '—'}</td>
                  <td className="px-3 py-3 text-xs text-[#475569] max-w-[180px] truncate">{c.subject || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${chanColors[c.channel] ?? 'bg-gray-100 text-gray-600'}`}>{c.channel}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                  </td>
                  <td className="px-3 py-3 text-[10px] text-[#94a3b8]">{c.updated_at?.slice(0, 16).replace('T', ' ')}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No conversations found.</div>}
        </div>
      )}
    </div>
  )
}
