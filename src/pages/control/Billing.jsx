import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CreditCard, Loader2 } from 'lucide-react'
import { billingApi } from '../../api/client'

const tabs = ['Overview', 'Subscriptions']
const planColors = { starter: 'bg-slate-100 text-slate-600', free: 'bg-slate-100 text-slate-600', pro: 'bg-blue-100 text-blue-700', enterprise: 'bg-violet-100 text-violet-700' }
const PLAN_LABELS = { starter: 'Starter', free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }

export default function Billing() {
  const [tab, setTab]       = useState('Overview')
  const [summary, setSummary]   = useState(null)
  const [subs, setSubs]         = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([billingApi.summary(), billingApi.subscriptions()])
      .then(([s, sub]) => { setSummary(s); setSubs(sub) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxMrr = summary ? Math.max(...summary.breakdown.map(b => b.mrr), 1) : 1

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Billing & Revenue</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Derived from live workspace plan data</p>
        </div>
      </div>

      <div className="flex border-b border-[#e4e7ed] mb-5">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : tab === 'Overview' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { label: 'MRR',              value: `$${summary?.mrr?.toLocaleString() ?? 0}` },
              { label: 'ARR (run-rate)',   value: `$${summary?.arr?.toLocaleString() ?? 0}` },
              { label: 'ARPU',             value: `$${summary?.arpu ?? 0}` },
              { label: 'Total Workspaces', value: summary?.workspace_count ?? 0 },
            ].map(({ label, value }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-[#e4e7ed] p-4">
                <p className="text-[10px] text-[#94a3b8] mb-2 uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-[#0f172a]">{value}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue by plan */}
          <div className="bg-white rounded-xl border border-[#e4e7ed] p-5 max-w-md">
            <p className="text-sm font-semibold text-[#0f172a] mb-4">Revenue by Plan</p>
            <div className="space-y-3">
              {summary?.breakdown?.map(({ plan, count, mrr, per_seat }) => (
                <div key={plan}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#475569] capitalize">
                      {PLAN_LABELS[plan] ?? plan} <span className="text-[#94a3b8]">({count})</span>
                    </span>
                    <span className="font-bold text-[#0f172a]">{mrr ? `$${mrr}/mo` : 'Free'}</span>
                  </div>
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-[#1a3fbf]"
                      initial={{ width: 0 }}
                      animate={{ width: mrr ? `${(mrr / maxMrr) * 100}%` : '3%' }}
                      transition={{ duration: 0.7, delay: 0.3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#f1f5f9] space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#94a3b8]">Total workspaces</span>
                <span className="font-semibold text-[#0f172a]">{summary?.workspace_count}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#94a3b8]">Paying workspaces</span>
                <span className="font-semibold text-[#0f172a]">
                  {summary?.breakdown?.filter(b => b.mrr > 0).reduce((s, b) => s + b.count, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-lg">
            <p className="text-xs font-bold text-amber-700 mb-1">No payment processor connected</p>
            <p className="text-xs text-amber-600">Figures are calculated from workspace plan data. Connect Stripe to see real invoices, payment history, and failed charge recovery.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Workspace', 'Owner', 'Plan', 'MRR', 'Created'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {subs.map((s, i) => {
                const PLAN_MRR = { starter: 0, free: 0, pro: 49, enterprise: 299 }
                const mrr = PLAN_MRR[s.plan] ?? 0
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{s.name}</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{s.owner_email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${planColors[s.plan] ?? planColors.starter}`}>{s.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-[#0f172a]">{mrr ? `$${mrr}/mo` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{s.created_at?.slice(0, 10)}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {subs.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No workspaces.</div>}
        </div>
      )}
    </div>
  )
}
