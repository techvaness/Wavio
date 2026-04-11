import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MoreVertical, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/client'

const planColors  = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700', starter: 'bg-slate-100 text-slate-600', pro: 'bg-blue-100 text-blue-700' }
const roleColors  = { owner: 'bg-amber-100 text-amber-700', admin: 'bg-red-100 text-red-600', agent: 'bg-sky-100 text-sky-700', member: 'bg-gray-100 text-gray-600' }
const statusDot   = { online: 'bg-emerald-400', busy: 'bg-amber-400', offline: 'bg-gray-300', suspended: 'bg-red-400' }

const tabs = ['All', 'Admins', 'Agents', 'Offline']

export default function Users() {
  const [rows, setRows]     = useState([])
  const [loading, setLoad]  = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab]       = useState('All')

  useEffect(() => {
    adminApi.users()
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  const filtered = rows.filter((u) => {
    const q = search.toLowerCase()
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.workspace_name || '').toLowerCase().includes(q)
    const matchT =
      tab === 'All'    ? true :
      tab === 'Admins' ? (u.role === 'admin' || u.role === 'owner') :
      tab === 'Agents' ? u.role === 'agent' :
      tab === 'Offline'? u.status === 'offline' : true
    return matchQ && matchT
  })

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Users</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{rows.length} total · {rows.filter(u => u.status === 'online' || u.status === 'busy').length} online</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-[#e4e7ed] bg-white overflow-hidden">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-semibold transition-colors border-r border-[#e4e7ed] last:border-r-0 ${tab === t ? 'bg-[#1a3fbf] text-white' : 'text-[#64748b] hover:bg-[#f8fafc]'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="pl-7 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] w-48 transition-colors" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['User', 'Workspace', 'Plan', 'Role', 'Status', 'Joined', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-xs">
                          {u.name[0]}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${statusDot[u.status] ?? statusDot.offline}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0f172a]">{u.name}</p>
                        <p className="text-[10px] text-[#94a3b8]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{u.workspace_name}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${planColors[u.plan] ?? planColors.starter}`}>{u.plan}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleColors[u.role] ?? roleColors.member}`}>{u.role}</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold capitalize ${u.status === 'online' ? 'text-emerald-600' : u.status === 'busy' ? 'text-amber-600' : u.status === 'suspended' ? 'text-red-600' : 'text-gray-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{u.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"><MoreVertical size={13} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No users match.</div>}
        </div>
      )}
    </div>
  )
}
