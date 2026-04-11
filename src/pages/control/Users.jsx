import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MoreVertical, X, LogIn, Ban, RefreshCw, Mail, Shield } from 'lucide-react'

const planColors = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700' }
const roleColors  = { owner: 'bg-amber-100 text-amber-700', admin: 'bg-red-100 text-red-600', agent: 'bg-sky-100 text-sky-700', member: 'bg-gray-100 text-gray-600' }
const statusDot   = { active: 'bg-emerald-400', suspended: 'bg-red-400', inactive: 'bg-gray-300' }

const allUsers = [
  { id:'U001', name:'Priya Shah',     email:'priya@shopform.io',   workspace:'Shopform',     plan:'Enterprise', role:'owner', status:'active',    lastLogin:'2m ago',     joined:'Jan 5 2026' },
  { id:'U002', name:'Lena Torres',    email:'lena@bloom.io',       workspace:'Bloom Studio', plan:'Pro',        role:'owner', status:'active',    lastLogin:'5m ago',     joined:'Feb 2 2026' },
  { id:'U003', name:'David Kwon',     email:'david@zenly.co',      workspace:'Zenly',        plan:'Free',       role:'owner', status:'active',    lastLogin:'1h ago',     joined:'Apr 9 2026' },
  { id:'U004', name:'Marco Silva',    email:'marco@nova.app',      workspace:'Nova App',     plan:'Pro',        role:'owner', status:'suspended', lastLogin:'3d ago',     joined:'Feb 14 2026' },
  { id:'U005', name:'Aisha Bello',    email:'aisha@kora.io',       workspace:'Kora',         plan:'Free',       role:'agent', status:'active',    lastLogin:'30m ago',    joined:'Apr 2 2026' },
  { id:'U006', name:'Carlos Mendes',  email:'carlos@fast.co',      workspace:'FastShip',     plan:'Pro',        role:'admin', status:'active',    lastLogin:'8m ago',     joined:'Jan 30 2026' },
  { id:'U007', name:'Sophie Roy',     email:'sophie@verdo.health', workspace:'Verdo Health', plan:'Enterprise', role:'owner', status:'active',    lastLogin:'just now',   joined:'Dec 1 2025' },
  { id:'U008', name:'Tariq Al-Said',  email:'tariq@mindbridge.io', workspace:'MindBridge',   plan:'Pro',        role:'owner', status:'active',    lastLogin:'15m ago',    joined:'Mar 11 2026' },
  { id:'U009', name:'Alex Martin',    email:'alex@bloom.io',       workspace:'Bloom Studio', plan:'Pro',        role:'agent', status:'active',    lastLogin:'20m ago',    joined:'Feb 5 2026' },
  { id:'U010', name:'Rita Patel',     email:'rita@shopform.io',    workspace:'Shopform',     plan:'Enterprise', role:'agent', status:'inactive',  lastLogin:'5d ago',     joined:'Jan 10 2026' },
]

const tabs = ['All', 'Owners', 'Agents', 'Suspended']

export default function Users() {
  const [search, setSearch]     = useState('')
  const [tab, setTab]           = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = allUsers.filter((u) => {
    const q = search.toLowerCase()
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.workspace.toLowerCase().includes(q)
    const matchT =
      tab === 'All'       ? true :
      tab === 'Owners'    ? u.role === 'owner' :
      tab === 'Agents'    ? u.role === 'agent' :
      tab === 'Suspended' ? u.status === 'suspended' : true
    return matchQ && matchT
  })

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Users</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{allUsers.length} total · {allUsers.filter(u => u.status === 'active').length} active · {allUsers.filter(u => u.status === 'suspended').length} suspended</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-lg transition-colors">
          <Mail size={12} /> Invite user
        </button>
      </div>

      {/* Tabs + search */}
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

      {/* Table */}
      <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
              {['User', 'Workspace', 'Plan', 'Role', 'Status', 'Last Login', 'Joined', ''].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {filtered.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-[#f8fafc] cursor-pointer transition-colors" onClick={() => setSelected(u)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-xs">
                        {u.name[0]}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${statusDot[u.status]}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0f172a]">{u.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">{u.workspace}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${planColors[u.plan]}`}>{u.plan}</span></td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleColors[u.role]}`}>{u.role}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold capitalize ${u.status === 'active' ? 'text-emerald-600' : u.status === 'suspended' ? 'text-red-600' : 'text-gray-400'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{u.lastLogin}</td>
                <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{u.joined}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"><MoreVertical size={13} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No users match.</div>}
      </div>

      {/* User drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-80 bg-white border-l border-[#e4e7ed] shadow-2xl z-50 flex flex-col"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-base">
                    {selected.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a] text-sm">{selected.name}</p>
                    <p className="text-xs text-[#94a3b8]">{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><X size={15} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Role', selected.role],
                    ['Status', selected.status],
                    ['Plan', selected.plan],
                    ['Workspace', selected.workspace],
                    ['Last Login', selected.lastLogin],
                    ['Joined', selected.joined],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[#f8fafc] rounded-lg p-2.5 border border-[#e4e7ed]">
                      <p className="text-[9px] text-[#94a3b8] uppercase tracking-wide mb-0.5">{k}</p>
                      <p className="text-xs font-semibold text-[#0f172a] capitalize">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">Actions</p>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#1a3fbf] border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <LogIn size={13} /> Impersonate user
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f1f5f9] transition-colors">
                    <Shield size={13} /> Reset password
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <Ban size={13} /> {selected.status === 'suspended' ? 'Reactivate' : 'Suspend user'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
