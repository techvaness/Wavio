import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, MoreVertical, Loader2, Trash2 } from 'lucide-react'
import { teamApi } from '../../api/client'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'

const roleColors = { admin: 'bg-red-100 text-red-600', agent: 'bg-blue-100 text-blue-700' }
const statusDot  = { online: 'bg-emerald-500', busy: 'bg-amber-400', offline: 'bg-gray-300' }
const statusLabel= { online: 'Online', busy: 'Busy', offline: 'Offline' }

function InviteModal({ onClose, onInvited }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const member = await teamApi.invite(form)
      onInvited(member)
      onClose()
    } catch (err) { setError(err.message || 'Failed to invite member') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
          <p className="text-sm font-bold text-[#0f172a]">Invite team member</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><X size={15} /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors"
              placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">Role</label>
            <div className="flex gap-2">
              {['agent', 'admin'].map(r => (
                <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border-2 capitalize transition-all ${form.role === r ? 'border-[#1a3fbf] text-[#1a3fbf] bg-[#eef2ff]' : 'border-[#e4e7ed] text-[#64748b] hover:border-[#1a3fbf]/30'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] rounded-xl hover:bg-[#f8fafc] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 rounded-xl transition-colors">
              {saving ? 'Inviting…' : 'Send invite'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Team() {
  const { user } = useAuth()
  const socket = useSocket()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('members')
  const [showInvite, setShowInvite] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    teamApi.list()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!socket) return
    function onStatus({ userId, status }) {
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, status } : m))
    }
    socket.on('agent:status', onStatus)
    return () => socket.off('agent:status', onStatus)
  }, [socket])

  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  const handleRemove = async (memberId) => {
    if (!confirm('Remove this member from the workspace?')) return
    setRemoving(memberId)
    try {
      await teamApi.remove(memberId)
      setMembers(prev => prev.filter(m => m.id !== memberId))
    } catch (err) { console.error(err) }
    finally { setRemoving(null); setMenuOpen(null) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-[#94a3b8]" />
    </div>
  )

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Team</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{members.length} members</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
          <UserPlus size={12} /> Invite member
        </button>
      </div>

      <div className="flex gap-1 mb-5 bg-[#f8fafc] p-1 rounded-xl border border-[#e4e7ed] w-fit">
        {['members', 'online'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg capitalize transition-colors ${tab === t ? 'bg-white text-[#1a3fbf] shadow-sm border border-[#e4e7ed]' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
            {t === 'online' ? `Online (${members.filter(m => m.status === 'online').length})` : `All Members (${members.length})`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
              {['Member','Role','Status','Open convos','Resolved',''].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-[9px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {members
              .filter(m => tab === 'online' ? m.status === 'online' : true)
              .map((m, i) => (
              <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-xs">
                        {(m.name || '?')[0]}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${statusDot[m.status] || 'bg-gray-300'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0f172a]">{m.name} {m.id === user?.id && <span className="text-[9px] text-[#94a3b8]">(you)</span>}</p>
                      <p className="text-[10px] text-[#94a3b8]">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${roleColors[m.role] || 'bg-gray-100 text-gray-600'}`}>{m.role}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status] || 'bg-gray-300'}`} />
                    <span className="text-xs text-[#475569]">{statusLabel[m.status] || m.status}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-[#0f172a]">{m.open_convos}</td>
                <td className="px-5 py-3 text-xs text-[#475569]">{m.resolved_convos}</td>
                <td className="px-5 py-3 relative">
                  {m.id !== user?.id && user?.role === 'admin' && (
                    <>
                      <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === m.id ? null : m.id) }}
                        className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]">
                        <MoreVertical size={13} />
                      </button>
                      {menuOpen === m.id && (
                        <div className="absolute right-2 top-8 bg-white border border-[#e4e7ed] rounded-xl shadow-xl z-10 min-w-[140px] py-1"
                          onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleRemove(m.id)} disabled={removing === m.id}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                            {removing === m.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                            Remove member
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showInvite && (
          <InviteModal
            onClose={() => setShowInvite(false)}
            onInvited={(member) => setMembers(prev => [...prev, member])}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
