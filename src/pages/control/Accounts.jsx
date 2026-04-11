import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, MoreVertical, X, ExternalLink, LogIn,
  CreditCard, Users, MessageSquare, AlertTriangle, CheckCircle,
  ChevronDown, Ban, RefreshCw, Pencil,
} from 'lucide-react'

const planColors = {
  Free: 'bg-slate-100 text-slate-600',
  Pro: 'bg-blue-100 text-blue-700',
  Enterprise: 'bg-violet-100 text-violet-700',
}
const statusColors = {
  active:    'bg-emerald-100 text-emerald-700',
  suspended: 'bg-red-100 text-red-600',
  trial:     'bg-amber-100 text-amber-700',
}

const accounts = [
  { id: 'AC001', name: 'Shopform',      owner: 'Priya Shah',   email: 'priya@shopform.io',  plan: 'Enterprise', agents: 12, convos: 4821, mrr: 299,  status: 'active',    created: 'Jan 5 2026',  lastActive: '2m ago' },
  { id: 'AC002', name: 'Bloom Studio',  owner: 'Lena Torres',  email: 'lena@bloom.io',      plan: 'Pro',        agents: 4,  convos: 1204, mrr: 49,   status: 'active',    created: 'Feb 2 2026',  lastActive: '5m ago' },
  { id: 'AC003', name: 'Zenly',         owner: 'David Kwon',   email: 'david@zenly.co',     plan: 'Free',       agents: 1,  convos: 89,   mrr: 0,    status: 'trial',     created: 'Apr 9 2026',  lastActive: '1h ago' },
  { id: 'AC004', name: 'Nova App',      owner: 'Marco Silva',  email: 'marco@nova.app',     plan: 'Pro',        agents: 3,  convos: 542,  mrr: 49,   status: 'suspended', created: 'Feb 14 2026', lastActive: '3d ago' },
  { id: 'AC005', name: 'Kora',          owner: 'Aisha Bello',  email: 'aisha@kora.io',      plan: 'Free',       agents: 1,  convos: 17,   mrr: 0,    status: 'active',    created: 'Apr 2 2026',  lastActive: '30m ago' },
  { id: 'AC006', name: 'FastShip',      owner: 'Carlos M.',    email: 'carlos@fast.co',     plan: 'Pro',        agents: 6,  convos: 2100, mrr: 49,   status: 'active',    created: 'Jan 30 2026', lastActive: '8m ago' },
  { id: 'AC007', name: 'Verdo Health',  owner: 'Sophie R.',    email: 'sophie@verdo.health', plan: 'Enterprise', agents: 20, convos: 9210, mrr: 599, status: 'active',    created: 'Dec 1 2025',  lastActive: 'just now' },
  { id: 'AC008', name: 'MindBridge',    owner: 'Tariq Al-S.',  email: 'tariq@mindbridge.io',plan: 'Pro',        agents: 5,  convos: 740,  mrr: 49,   status: 'active',    created: 'Mar 11 2026', lastActive: '15m ago' },
]

function AccountDrawer({ account, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  if (!account) return null

  const tabs = ['overview', 'usage', 'billing', 'agents']

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-[#e4e7ed] shadow-2xl z-50 flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white font-bold text-base">
            {account.name[0]}
          </div>
          <div>
            <p className="font-bold text-[#0f172a]">{account.name}</p>
            <p className="text-xs text-[#94a3b8]">{account.id} · {account.email}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Status + quick actions */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#f1f5f9]">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[account.status]}`}>{account.status}</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${planColors[account.plan]}`}>{account.plan}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-lg transition-colors">
            <LogIn size={12} /> Impersonate
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f1f5f9] rounded-lg transition-colors">
            <Pencil size={12} /> Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e4e7ed]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
              activeTab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Agents', account.agents, Users],
                ['Conversations', account.convos.toLocaleString(), MessageSquare],
                ['MRR', account.mrr ? `$${account.mrr}` : 'Free', CreditCard],
                ['Created', account.created, null],
              ].map(([label, val, Icon]) => (
                <div key={label} className="bg-[#f8fafc] rounded-xl p-3 border border-[#e4e7ed]">
                  <p className="text-[10px] text-[#94a3b8] mb-1">{label}</p>
                  <p className="text-base font-bold text-[#0f172a]">{val}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-[#475569] uppercase tracking-wide mb-2">Owner</p>
              <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e4e7ed]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-sm">
                  {account.owner[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{account.owner}</p>
                  <p className="text-xs text-[#94a3b8]">{account.email}</p>
                </div>
                <button className="ml-auto text-[#94a3b8] hover:text-[#1a3fbf] transition-colors"><ExternalLink size={14} /></button>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#475569] uppercase tracking-wide mb-2">Danger Zone</p>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-amber-600 border border-amber-200 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors font-medium">
                  <RefreshCw size={14} /> Reset to Free plan
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-colors font-medium">
                  <Ban size={14} /> {account.status === 'suspended' ? 'Reactivate account' : 'Suspend account'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-3">
            {[
              { label: 'Conversations this month', used: account.convos, limit: account.plan === 'Enterprise' ? 'Unlimited' : account.plan === 'Pro' ? 5000 : 100 },
              { label: 'Agent seats used', used: account.agents, limit: account.plan === 'Enterprise' ? 'Unlimited' : account.plan === 'Pro' ? 10 : 1 },
              { label: 'Storage (MB)', used: Math.floor(account.convos * 0.04), limit: account.plan === 'Enterprise' ? 'Unlimited' : 500 },
            ].map(({ label, used, limit }) => {
              const pct = typeof limit === 'number' ? Math.min((used / limit) * 100, 100) : 20
              return (
                <div key={label} className="bg-[#f8fafc] rounded-xl p-4 border border-[#e4e7ed]">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-[#475569]">{label}</span>
                    <span className="font-bold text-[#0f172a]">{used.toLocaleString()} / {typeof limit === 'number' ? limit.toLocaleString() : limit}</span>
                  </div>
                  <div className="h-1.5 bg-[#e4e7ed] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 85 ? 'bg-red-500' : 'bg-[#1a3fbf]'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-3">
            <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e4e7ed]">
              <p className="text-xs text-[#94a3b8] mb-1">Current Plan</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0f172a]">{account.plan}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[account.plan]}`}>{account.mrr ? `$${account.mrr}/mo` : 'Free'}</span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-1">Next billing: May 1, 2026</p>
            </div>
            <p className="text-xs font-bold text-[#475569] uppercase tracking-wide">Recent invoices</p>
            {['Apr 1', 'Mar 1', 'Feb 1'].map((d) => (
              <div key={d} className="flex items-center justify-between px-3 py-2.5 bg-[#f8fafc] rounded-xl border border-[#e4e7ed]">
                <div>
                  <p className="text-xs font-semibold text-[#0f172a]">Invoice · {d} 2026</p>
                  <p className="text-[10px] text-[#94a3b8]">Paid</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">${account.mrr}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-2">
            {Array.from({ length: Math.min(account.agents, 5) }, (_, i) => ({
              name: ['Priya Shah', 'Alex M.', 'Sam K.', 'Rita P.', 'Ben T.'][i],
              role: i === 0 ? 'Owner' : 'Agent',
              status: 'active',
            })).map((a) => (
              <div key={a.name} className="flex items-center gap-3 px-3 py-2.5 bg-[#f8fafc] rounded-xl border border-[#e4e7ed]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-xs">
                  {a.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#0f172a]">{a.name}</p>
                  <p className="text-[10px] text-[#94a3b8]">{a.role}</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            ))}
            {account.agents > 5 && (
              <p className="text-xs text-[#94a3b8] text-center py-2">+{account.agents - 5} more agents</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Accounts() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [menuOpen, setMenuOpen] = useState(null)

  const filtered = accounts.filter((a) => {
    const q = search.toLowerCase()
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q)
    const matchP = planFilter === 'All' || a.plan === planFilter
    const matchS = statusFilter === 'All' || a.status === statusFilter
    return matchQ && matchP && matchS
  })

  return (
    <div className="p-5 relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Accounts</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{accounts.length} total · {accounts.filter(a => a.status === 'active').length} active · ${accounts.reduce((s, a) => s + a.mrr, 0).toLocaleString()} MRR</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts…"
            className="pl-8 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] w-52 transition-colors"
          />
        </div>
        {['All', 'Free', 'Pro', 'Enterprise'].map((p) => (
          <button key={p} onClick={() => setPlanFilter(p)}
            className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors border ${planFilter === p ? 'bg-[#1a3fbf] text-white border-[#1a3fbf]' : 'bg-white text-[#64748b] border-[#e4e7ed] hover:border-[#1a3fbf]'}`}>
            {p}
          </button>
        ))}
        <div className="w-px h-5 bg-[#e4e7ed]" />
        {['All', 'active', 'trial', 'suspended'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors border capitalize ${statusFilter === s ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white text-[#64748b] border-[#e4e7ed] hover:border-[#0f172a]'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
              {['Account', 'Plan', 'Agents', 'Conversations', 'MRR', 'Status', 'Last Active', ''].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {filtered.map((a, i) => (
              <motion.tr
                key={a.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-[#f8fafc] cursor-pointer transition-colors"
                onClick={() => setSelected(a)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                      {a.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0f172a]">{a.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{a.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${planColors[a.plan]}`}>{a.plan}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">{a.agents}</td>
                <td className="px-4 py-3 text-xs text-[#475569]">{a.convos.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{a.mrr ? `$${a.mrr}` : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'active' ? 'bg-emerald-400' : a.status === 'trial' ? 'bg-amber-400' : 'bg-red-400'}`} />
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[a.status]}`}>{a.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{a.lastActive}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-xs text-[#94a3b8]">No accounts match your filters.</div>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
            <AccountDrawer account={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
