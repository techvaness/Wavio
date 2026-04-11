import { useState } from 'react'
import { Search, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'

const workspaces = [
  { id: 'WS001', name: 'Shopform',      owner: 'Priya Shah',   agents: 12, plan: 'Enterprise', conversations: '4,821', created: 'Jan 5, 2026',  status: 'active' },
  { id: 'WS002', name: 'Bloom Studio',  owner: 'Lena Torres',  agents: 4,  plan: 'Pro',         conversations: '1,204', created: 'Feb 2, 2026',  status: 'active' },
  { id: 'WS003', name: 'Zenly',         owner: 'David Kwon',   agents: 1,  plan: 'Free',        conversations: '89',    created: 'Apr 9, 2026',  status: 'active' },
  { id: 'WS004', name: 'Nova App',      owner: 'Marco Silva',  agents: 3,  plan: 'Pro',         conversations: '542',   created: 'Feb 14, 2026', status: 'suspended' },
  { id: 'WS005', name: 'Kora',          owner: 'Aisha Bello',  agents: 1,  plan: 'Free',        conversations: '17',    created: 'Apr 2, 2026',  status: 'active' },
  { id: 'WS006', name: 'FastShip',      owner: 'Carlos M.',    agents: 6,  plan: 'Pro',         conversations: '2,100', created: 'Jan 30, 2026', status: 'active' },
]

const planColors = {
  Free: 'bg-gray-100 text-gray-600',
  Pro: 'bg-blue-100 text-blue-700',
  Enterprise: 'bg-purple-100 text-purple-700',
}

export default function Workspaces() {
  const [search, setSearch] = useState('')

  const filtered = workspaces.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.owner.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Workspaces</h1>
          <p className="text-sm text-[#64748b] mt-0.5">{workspaces.length} total · {workspaces.filter(w => w.status === 'active').length} active</p>
        </div>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workspaces…"
          className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] transition-colors"
        />
      </div>

      <div className="bg-white border border-[#e4e7ed] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e4e7ed] bg-[#f8fafc]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Workspace</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Owner</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Agents</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Conversations</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {filtered.map((w, i) => (
              <motion.tr
                key={w.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-[#f8fafc] cursor-pointer transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {w.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f172a]">{w.name}</p>
                      <p className="text-xs text-[#94a3b8]">{w.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#475569]">{w.owner}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[w.plan]}`}>{w.plan}</span>
                </td>
                <td className="px-5 py-3.5 text-[#475569]">{w.agents}</td>
                <td className="px-5 py-3.5 text-[#475569]">{w.conversations}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-xs text-[#64748b] capitalize">{w.status}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <button className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors">
                    <MoreVertical size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
