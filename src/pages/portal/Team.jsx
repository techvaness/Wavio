import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, Mail, MoreVertical, Loader2 } from 'lucide-react'
import { teamApi } from '../../api/client'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'

const roleColors = { admin: 'bg-red-100 text-red-600', agent: 'bg-blue-100 text-blue-700' }
const statusDot  = { online: 'bg-emerald-500', busy: 'bg-amber-400', offline: 'bg-gray-300' }
const statusLabel= { online: 'Online', busy: 'Busy', offline: 'Offline' }

export default function Team() {
  const { user } = useAuth()
  const socket = useSocket()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('members')

  useEffect(() => {
    teamApi.list()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Real-time agent status updates
  useEffect(() => {
    if (!socket) return
    function onStatus({ userId, status }) {
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, status } : m))
    }
    socket.on('agent:status', onStatus)
    return () => socket.off('agent:status', onStatus)
  }, [socket])

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
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
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
                <td className="px-5 py-3">
                  <button className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"><MoreVertical size={13} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
