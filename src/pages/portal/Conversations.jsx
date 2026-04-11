import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { convApi, teamApi } from '../../api/client'
import { useSocket } from '../../context/SocketContext'

const statusBadge = {
  open:     'bg-blue-100 text-blue-700',
  pending:  'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}
const priorityBadge = {
  high:   'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-gray-100 text-gray-500',
}
const chanColor = { whatsapp: 'text-green-600', email: 'text-blue-600', chat: 'text-purple-600', sms: 'text-amber-600' }

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function ConvoDrawer({ convo, agents, onClose, onUpdate }) {
  const [status, setStatus]     = useState(convo.status)
  const [assigned, setAssigned] = useState(convo.assigned_to || '')
  const [saving, setSaving]     = useState(false)

  async function save() {
    setSaving(true)
    try {
      const updated = await convApi.update(convo.id, { status, assigned_to: assigned || null })
      onUpdate(updated)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-96 bg-white border-l border-[#e4e7ed] shadow-2xl z-50 flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
        <div>
          <p className="font-bold text-[#0f172a] text-sm">#{convo.id} · {convo.contact_name}</p>
          <p className="text-[10px] text-[#94a3b8]">{convo.subject || 'No subject'}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><X size={15} /></button>
      </div>

      <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
        <div>
          <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Status</p>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#e4e7ed] rounded-lg focus:outline-none focus:border-[#1a3fbf] bg-white">
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Assigned to</p>
          <select value={assigned} onChange={e => setAssigned(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#e4e7ed] rounded-lg focus:outline-none focus:border-[#1a3fbf] bg-white">
            <option value="">Unassigned</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['Channel', convo.channel], ['Priority', convo.priority], ['Contact', convo.contact_name], ['Updated', timeAgo(convo.updated_at)]].map(([k, v]) => (
            <div key={k} className="bg-[#f8fafc] rounded-xl p-3 border border-[#e4e7ed]">
              <p className="text-[9px] text-[#94a3b8]">{k}</p>
              <p className="text-xs font-semibold text-[#0f172a] capitalize mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[#e4e7ed] flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 size={12} className="animate-spin" />} Save changes
        </button>
        <button onClick={onClose} className="px-4 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors">Cancel</button>
      </div>
    </motion.div>
  )
}

export default function Conversations() {
  const socket = useSocket()
  const [convos, setConvos]           = useState([])
  const [agents, setAgents]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState(null)

  useEffect(() => { teamApi.list().then(setAgents).catch(console.error) }, [])

  useEffect(() => { load() }, [statusFilter, search])

  async function load() {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (search) params.search = search
      setConvos(await convApi.list(params))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!socket) return
    function onUpdated({ convoId, data }) {
      if (data) setConvos(prev => prev.map(c => c.id === convoId ? { ...c, ...data } : c))
      else load()
    }
    socket.on('conversation:updated', onUpdated)
    return () => socket.off('conversation:updated', onUpdated)
  }, [socket])

  const counts = {
    all: convos.length,
    open: convos.filter(c => c.status === 'open').length,
    pending: convos.filter(c => c.status === 'pending').length,
    resolved: convos.filter(c => c.status === 'resolved').length,
  }

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Conversations</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{convos.length} total</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1 bg-[#f8fafc] p-1 rounded-xl border border-[#e4e7ed]">
          {['all','open','pending','resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg capitalize transition-colors ${statusFilter === s ? 'bg-white text-[#1a3fbf] shadow-sm border border-[#e4e7ed]' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
              {s} <span className="ml-1 opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] transition-colors" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['#','Contact','Subject','Channel','Status','Priority','Assigned','Updated',''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[9px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {convos.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors" onClick={() => setSelected(c)}>
                  <td className="px-4 py-3 text-[10px] font-mono text-[#94a3b8]">#{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-[10px]">
                        {(c.contact_name || '?')[0]}
                      </div>
                      <span className="text-xs font-semibold text-[#0f172a]">{c.contact_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569] max-w-[160px] truncate">{c.subject || '—'}</td>
                  <td className={`px-4 py-3 text-xs font-semibold capitalize ${chanColor[c.channel] || 'text-gray-500'}`}>{c.channel}</td>
                  <td className="px-4 py-3"><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusBadge[c.status]}`}>{c.status}</span></td>
                  <td className="px-4 py-3"><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${priorityBadge[c.priority] || ''}`}>{c.priority}</span></td>
                  <td className="px-4 py-3 text-xs text-[#64748b]">{c.assigned_name || '—'}</td>
                  <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{timeAgo(c.updated_at)}</td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); setSelected(c) }}
                      className="text-[10px] text-[#1a3fbf] font-semibold hover:underline">Open</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {convos.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No conversations found.</div>}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
            <ConvoDrawer convo={selected} agents={agents} onClose={() => setSelected(null)}
              onUpdate={(updated) => {
                setConvos(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c))
                setSelected(null)
              }} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
