import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MoreVertical, X, Users, MessageSquare, CreditCard, Loader2, ChevronDown } from 'lucide-react'
import { adminApi } from '../../api/client'

const PLANS = ['starter', 'pro', 'enterprise']
const planColors = {
  free:       'bg-slate-100 text-slate-600',
  starter:    'bg-slate-100 text-slate-600',
  pro:        'bg-blue-100 text-blue-700',
  enterprise: 'bg-violet-100 text-violet-700',
}

function PlanBadge({ plan }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${planColors[plan] ?? planColors.starter}`}>
      {plan}
    </span>
  )
}

function AccountDrawer({ account, onClose, onUpdated }) {
  const [activeTab, setActiveTab]   = useState('overview')
  const [changingPlan, setChanging] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [selectedPlan, setSelPlan]  = useState(account.plan)

  if (!account) return null

  const isPlanDirty = selectedPlan !== account.plan

  const savePlan = async () => {
    setSaving(true)
    try {
      await adminApi.changePlan(account.id, selectedPlan)
      onUpdated({ ...account, plan: selectedPlan })
    } catch {}
    setSaving(false)
    setChanging(false)
  }

  const toggleSuspend = async () => {
    const next = account.status === 'suspended' ? 'active' : 'suspended'
    setSaving(true)
    try {
      if (next === 'suspended') await adminApi.suspendWorkspace(account.id)
      else                      await adminApi.activateWorkspace(account.id)
      onUpdated({ ...account, status: next })
    } catch {}
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-[#e4e7ed] shadow-2xl z-50 flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white font-bold text-base">
            {account.name[0]}
          </div>
          <div>
            <p className="font-bold text-[#0f172a]">{account.name}</p>
            <p className="text-xs text-[#94a3b8]">#{account.id} · {account.owner_email}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex border-b border-[#e4e7ed]">
        {['overview', 'usage', 'actions'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${activeTab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Agents', account.agent_count],
                ['Conversations', account.convo_count],
                ['Plan', <PlanBadge plan={account.plan} />],
                ['Status', <span className={`text-xs font-bold ${account.status === 'suspended' ? 'text-red-500' : 'text-emerald-600'}`}>{account.status ?? 'active'}</span>],
                ['Created', account.created_at?.slice(0, 10)],
              ].map(([label, val]) => (
                <div key={label} className="bg-[#f8fafc] rounded-xl p-3 border border-[#e4e7ed]">
                  <p className="text-[10px] text-[#94a3b8] mb-1">{label}</p>
                  <div className="text-sm font-bold text-[#0f172a]">{val}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-[#475569] uppercase tracking-wide mb-2">Owner</p>
              <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e4e7ed]">
                <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#1a3fbf] font-bold text-sm flex-shrink-0">
                  {(account.owner_name || '?')[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{account.owner_name}</p>
                  <p className="text-xs text-[#94a3b8]">{account.owner_email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-3">
            {[
              { label: 'Conversations', used: account.convo_count, limit: account.plan === 'enterprise' ? -1 : account.plan === 'pro' ? 5000 : 100 },
              { label: 'Agent seats',   used: account.agent_count, limit: account.plan === 'enterprise' ? -1 : account.plan === 'pro' ? 10  : 2   },
            ].map(({ label, used, limit }) => {
              const unlimited = limit === -1
              const pct = unlimited ? 20 : Math.min((used / limit) * 100, 100)
              return (
                <div key={label} className="bg-[#f8fafc] rounded-xl p-4 border border-[#e4e7ed]">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-[#475569]">{label}</span>
                    <span className="font-bold text-[#0f172a]">{used} / {unlimited ? 'Unlimited' : limit}</span>
                  </div>
                  <div className="h-1.5 bg-[#e4e7ed] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 85 ? 'bg-red-500' : 'bg-[#1a3fbf]'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            {/* Change plan */}
            <div className="p-4 rounded-xl border border-[#e4e7ed]">
              <p className="text-xs font-bold text-[#0f172a] mb-3">Change Plan</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PLANS.map((p) => (
                  <button key={p} onClick={() => setSelPlan(p)}
                    className={`py-2 rounded-lg text-xs font-bold capitalize border transition-colors ${selectedPlan === p ? 'bg-[#1a3fbf] text-white border-[#1a3fbf]' : 'bg-white text-[#475569] border-[#e4e7ed] hover:border-[#1a3fbf]'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={savePlan} disabled={!isPlanDirty || saving}
                className="w-full py-2 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                Apply plan change
              </button>
            </div>

            {/* Suspend / Activate */}
            <div className="p-4 rounded-xl border border-[#e4e7ed]">
              <p className="text-xs font-bold text-[#0f172a] mb-1">
                {account.status === 'suspended' ? 'Reactivate Workspace' : 'Suspend Workspace'}
              </p>
              <p className="text-[11px] text-[#94a3b8] mb-3">
                {account.status === 'suspended'
                  ? 'Restore access for all agents in this workspace.'
                  : 'Block all agents from logging in. Conversations still exist.'}
              </p>
              <button onClick={toggleSuspend} disabled={saving}
                className={`w-full py-2 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2 ${
                  account.status === 'suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}>
                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                {account.status === 'suspended' ? 'Activate workspace' : 'Suspend workspace'}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function RowMenu({ account, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const act = (action) => { setOpen(false); onAction(action) }

  return (
    <div ref={ref} className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
        className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors">
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 w-40 bg-white border border-[#e4e7ed] rounded-xl shadow-lg z-20 py-1 text-xs">
          <button onClick={() => act('plan')} className="w-full px-3 py-2 text-left hover:bg-[#f8fafc] text-[#475569] font-medium">Change plan</button>
          {account.status === 'suspended'
            ? <button onClick={() => act('activate')} className="w-full px-3 py-2 text-left hover:bg-[#f8fafc] text-emerald-600 font-medium">Activate</button>
            : <button onClick={() => act('suspend')}  className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-500 font-medium">Suspend</button>
          }
        </div>
      )}
    </div>
  )
}

export default function Accounts() {
  const [rows, setRows]         = useState([])
  const [loading, setLoad]      = useState(true)
  const [search, setSearch]     = useState('')
  const [planFilter, setPF]     = useState('All')
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    adminApi.workspaces()
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpdated = (updated) => {
    setRows(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r))
    setSelected(updated)
  }

  const handleRowAction = async (account, action) => {
    if (action === 'plan') { setSelected({ ...account, _openTab: 'actions' }); return }
    if (action === 'suspend') {
      await adminApi.suspendWorkspace(account.id)
      handleUpdated({ ...account, status: 'suspended' })
    }
    if (action === 'activate') {
      await adminApi.activateWorkspace(account.id)
      handleUpdated({ ...account, status: 'active' })
    }
  }

  const filtered = rows.filter((a) => {
    const q = search.toLowerCase()
    const matchQ = !q || a.name.toLowerCase().includes(q) || (a.owner_email || '').toLowerCase().includes(q)
    const matchP = planFilter === 'All' || a.plan === planFilter.toLowerCase()
    return matchQ && matchP
  })

  return (
    <div className="p-5 relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Accounts</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{rows.length} total workspaces</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts..."
            className="pl-8 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] w-52 transition-colors" />
        </div>
        {['All', 'Starter', 'Pro', 'Enterprise'].map((p) => (
          <button key={p} onClick={() => setPF(p)}
            className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors border capitalize ${planFilter === p ? 'bg-[#1a3fbf] text-white border-[#1a3fbf]' : 'bg-white text-[#64748b] border-[#e4e7ed] hover:border-[#1a3fbf]'}`}>
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Account', 'Owner', 'Plan', 'Status', 'Agents', 'Conversations', 'Created', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors" onClick={() => setSelected(a)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                        {a.name[0]}
                      </div>
                      <p className="text-xs font-semibold text-[#0f172a]">{a.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-[#475569]">{a.owner_name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{a.owner_email}</p>
                  </td>
                  <td className="px-4 py-3"><PlanBadge plan={a.plan} /></td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                      {a.status ?? 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{a.agent_count}</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{a.convo_count}</td>
                  <td className="px-4 py-3 text-xs text-[#94a3b8]">{a.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <RowMenu account={a} onAction={(action) => handleRowAction(a, action)} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No accounts match your filters.</div>}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
            <AccountDrawer account={selected} onClose={() => setSelected(null)} onUpdated={handleUpdated} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
