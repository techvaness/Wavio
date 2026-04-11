import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ChevronDown, ExternalLink } from 'lucide-react'

const statusColors = { open: 'bg-blue-100 text-blue-700', resolved: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700' }
const chanColors   = { WhatsApp: 'text-green-600 bg-green-50', Email: 'text-blue-600 bg-blue-50', Chat: 'text-purple-600 bg-purple-50', SMS: 'text-orange-600 bg-orange-50' }

const convos = [
  { id:'#9042', contact:'Sarah K.',    workspace:'Shopform',     agent:'Priya S.',    channel:'WhatsApp', status:'open',     topic:'Missing order #8821',        updated:'2m ago',  dur:'3:14' },
  { id:'#9041', contact:'Tom R.',      workspace:'FastShip',     agent:'Carlos M.',   channel:'Email',    status:'open',     topic:'Password reset locked out',  updated:'5m ago',  dur:'1:02' },
  { id:'#9040', contact:'Mia L.',      workspace:'Bloom Studio', agent:'Lena T.',     channel:'Chat',     status:'resolved', topic:'Dashboard feedback',         updated:'12m ago', dur:'5:48' },
  { id:'#9039', contact:'James P.',    workspace:'Shopform',     agent:'Alex M.',     channel:'Email',    status:'pending',  topic:'Invoice #4821 dispute',      updated:'18m ago', dur:'0:55' },
  { id:'#9038', contact:'Aisha B.',    workspace:'Kora',         agent:'Aisha B.',    channel:'WhatsApp', status:'open',     topic:'Plan upgrade question',      updated:'31m ago', dur:'0:31' },
  { id:'#9037', contact:'Carlos R.',   workspace:'FastShip',     agent:'Carlos M.',   channel:'Chat',     status:'open',     topic:'Shopify integration issue',  updated:'45m ago', dur:'2:10' },
  { id:'#9036', contact:'Lena F.',     workspace:'MindBridge',   agent:'Tariq A.',    channel:'Email',    status:'resolved', topic:'GDPR data export request',   updated:'1h ago',  dur:'8:22' },
  { id:'#9035', contact:'Rafi D.',     workspace:'Verdo Health',  agent:'Sophie R.',  channel:'Chat',     status:'pending',  topic:'AI suggestions not working', updated:'1h ago',  dur:'3:05' },
  { id:'#9034', contact:'Nina P.',     workspace:'Shopform',     agent:'Priya S.',    channel:'WhatsApp', status:'resolved', topic:'Refund for order #7710',     updated:'2h ago',  dur:'4:17' },
  { id:'#9033', contact:'Ben T.',      workspace:'Bloom Studio', agent:'Alex M.',     channel:'Email',    status:'open',     topic:'API key rotation needed',    updated:'2h ago',  dur:'1:40' },
]

const workspaces = ['All Workspaces', 'Shopform', 'Bloom Studio', 'FastShip', 'Kora', 'MindBridge', 'Verdo Health']
const channels   = ['All Channels', 'WhatsApp', 'Email', 'Chat', 'SMS']
const statuses   = ['All Status', 'open', 'pending', 'resolved']

export default function AdminConversations() {
  const [search, setSearch]     = useState('')
  const [workspace, setWS]      = useState('All Workspaces')
  const [channel, setChan]      = useState('All Channels')
  const [status, setStatus]     = useState('All Status')

  const filtered = convos.filter((c) => {
    const q = search.toLowerCase()
    const matchQ = !q || c.contact.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q) || c.workspace.toLowerCase().includes(q)
    const matchWS = workspace === 'All Workspaces' || c.workspace === workspace
    const matchCh = channel === 'All Channels' || c.channel === channel
    const matchSt = status === 'All Status' || c.status === status
    return matchQ && matchWS && matchCh && matchSt
  })

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>All Conversations</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{convos.length} shown · {convos.filter(c => c.status === 'open').length} open · {convos.filter(c => c.status === 'pending').length} pending across all workspaces</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-700">342 live now</span>
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
          [workspace, setWS, workspaces],
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

      {/* Table */}
      <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
              {['ID', 'Contact', 'Workspace', 'Agent', 'Topic', 'Channel', 'Status', 'Updated', ''].map((h) => (
                <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                <td className="px-3 py-3 text-[10px] font-mono text-[#94a3b8]">{c.id}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-[9px] flex-shrink-0">
                      {c.contact[0]}
                    </div>
                    <span className="text-xs font-semibold text-[#0f172a]">{c.contact}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-[#475569]">{c.workspace}</td>
                <td className="px-3 py-3 text-xs text-[#475569]">{c.agent}</td>
                <td className="px-3 py-3 text-xs text-[#475569] max-w-[180px] truncate">{c.topic}</td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${chanColors[c.channel]}`}>{c.channel}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-3 py-3 text-[10px] text-[#94a3b8]">{c.updated}</td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded text-[#94a3b8] hover:text-[#1a3fbf] transition-colors"><ExternalLink size={12} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No conversations match your filters.</div>}
      </div>
    </div>
  )
}
