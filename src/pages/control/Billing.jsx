import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, CreditCard, AlertTriangle, Download, RefreshCw } from 'lucide-react'

const tabs = ['Overview', 'Subscriptions', 'Invoices', 'Failed Payments']

const planColors = { Free: 'bg-slate-100 text-slate-600', Pro: 'bg-blue-100 text-blue-700', Enterprise: 'bg-violet-100 text-violet-700' }

const subscriptions = [
  { account: 'Verdo Health',  email: 'sophie@verdo.health', plan: 'Enterprise', amount: 599, nextBilling: 'May 1 2026',  status: 'active',  since: 'Dec 1 2025' },
  { account: 'Shopform',     email: 'priya@shopform.io',   plan: 'Enterprise', amount: 299, nextBilling: 'May 1 2026',  status: 'active',  since: 'Jan 5 2026' },
  { account: 'FastShip',     email: 'carlos@fast.co',      plan: 'Pro',        amount: 49,  nextBilling: 'May 1 2026',  status: 'active',  since: 'Jan 30 2026' },
  { account: 'Bloom Studio', email: 'lena@bloom.io',       plan: 'Pro',        amount: 49,  nextBilling: 'May 2 2026',  status: 'active',  since: 'Feb 2 2026' },
  { account: 'MindBridge',   email: 'tariq@mindbridge.io', plan: 'Pro',        amount: 49,  nextBilling: 'May 11 2026', status: 'active',  since: 'Mar 11 2026' },
  { account: 'Nova App',     email: 'marco@nova.app',      plan: 'Pro',        amount: 49,  nextBilling: '—',           status: 'past_due', since: 'Feb 14 2026' },
]

const invoices = [
  { id:'INV-2042', account:'Verdo Health',  amount:599, date:'Apr 1 2026', status:'paid' },
  { id:'INV-2041', account:'Shopform',      amount:299, date:'Apr 1 2026', status:'paid' },
  { id:'INV-2040', account:'FastShip',      amount:49,  date:'Apr 1 2026', status:'paid' },
  { id:'INV-2039', account:'Bloom Studio',  amount:49,  date:'Apr 2 2026', status:'paid' },
  { id:'INV-2038', account:'Nova App',      amount:49,  date:'Apr 1 2026', status:'failed' },
  { id:'INV-2037', account:'MindBridge',    amount:49,  date:'Apr 11 2026',status:'paid' },
  { id:'INV-2036', account:'Verdo Health',  amount:599, date:'Mar 1 2026', status:'paid' },
  { id:'INV-2035', account:'Shopform',      amount:299, date:'Mar 1 2026', status:'paid' },
]

const failed = [
  { account:'Nova App',  email:'marco@nova.app', plan:'Pro', amount:49, attempts:3, lastAttempt:'Apr 1 2026', reason:'Card declined' },
]

const months = ['Nov','Dec','Jan','Feb','Mar','Apr']
const mrrHistory = [18200, 19400, 20800, 22100, 22930, 24810]
const maxMrr = Math.max(...mrrHistory)

const planBreakdown = [
  { plan: 'Enterprise', count: 2, mrr: 898,  color: '#8b5cf6' },
  { plan: 'Pro',        count: 5, mrr: 245,  color: '#1a3fbf' },
  { plan: 'Free',       count: 2, mrr: 0,    color: '#e4e7ed' },
]

export default function Billing() {
  const [tab, setTab] = useState('Overview')

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Billing & Revenue</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Stripe integration · Last synced 2m ago</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f8fafc] transition-colors">
          <RefreshCw size={12} /> Sync Stripe
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e4e7ed] mb-5">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
            {t}
            {t === 'Failed Payments' && failed.length > 0 && (
              <span className="ml-1.5 text-[9px] bg-red-500 text-white rounded-full px-1.5 py-0.5">{failed.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          {/* Top metrics */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { label: 'MRR',          value: '$24,810', change: '+8.2%',  up: true },
              { label: 'ARR',          value: '$297,720',change: '+8.2%',  up: true },
              { label: 'ARPU',         value: '$23.70',  change: '+$1.20', up: true },
              { label: 'Churn Rate',   value: '2.1%',    change: '-0.3%',  up: true },
            ].map(({ label, value, change, up }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-[#e4e7ed] p-4">
                <p className="text-[10px] text-[#94a3b8] mb-2 uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-[#0f172a]">{value}</p>
                <p className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{change} vs last month
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid xl:grid-cols-3 gap-4">
            {/* MRR growth chart */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-[#e4e7ed] p-5">
              <p className="text-sm font-semibold text-[#0f172a] mb-1">MRR Growth</p>
              <p className="text-xs text-[#94a3b8] mb-4">Last 6 months</p>
              <div className="flex items-end gap-3 h-32">
                {mrrHistory.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-[#94a3b8]">${(v/1000).toFixed(1)}k</span>
                    <div className="w-full rounded-t-md" style={{ height: `${(v / maxMrr) * 80}%`, background: i === mrrHistory.length - 1 ? 'linear-gradient(to top, #1a3fbf, #4cc61e)' : '#e4e7ed' }} />
                    <span className="text-[9px] text-[#94a3b8]">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan breakdown */}
            <div className="bg-white rounded-xl border border-[#e4e7ed] p-5">
              <p className="text-sm font-semibold text-[#0f172a] mb-4">Revenue by Plan</p>
              <div className="space-y-3">
                {planBreakdown.map(({ plan, count, mrr, color }) => (
                  <div key={plan}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-[#475569]">{plan} <span className="text-[#94a3b8]">({count})</span></span>
                      <span className="font-bold text-[#0f172a]">{mrr ? `$${mrr}/mo` : 'Free'}</span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: mrr ? `${(mrr / 1143) * 100}%` : '5%' }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-[#f1f5f9] space-y-1">
                {[['Active subs', '7'], ['Past due', '1'], ['Cancelled (30d)', '2']].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-[#94a3b8]">{k}</span>
                    <span className="font-semibold text-[#0f172a]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Subscriptions' && (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Account', 'Plan', 'Amount', 'Next Billing', 'Customer Since', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {subscriptions.map((s, i) => (
                <motion.tr key={s.account} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-[#0f172a]">{s.account}</p>
                    <p className="text-[10px] text-[#94a3b8]">{s.email}</p>
                  </td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${planColors[s.plan]}`}>{s.plan}</span></td>
                  <td className="px-4 py-3 text-xs font-bold text-[#0f172a]">${s.amount}/mo</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{s.nextBilling}</td>
                  <td className="px-4 py-3 text-xs text-[#94a3b8]">{s.since}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {s.status === 'past_due' ? 'Past due' : 'Active'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Invoices' && (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Invoice', 'Account', 'Amount', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {invoices.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-[#64748b]">{inv.id}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{inv.account}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#0f172a]">${inv.amount}</td>
                  <td className="px-4 py-3 text-xs text-[#94a3b8]">{inv.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-[#94a3b8] hover:text-[#1a3fbf] transition-colors"><Download size={13} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Failed Payments' && (
        <div className="space-y-3">
          {failed.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e4e7ed] py-12 text-center text-xs text-[#94a3b8]">No failed payments.</div>
          ) : failed.map((f) => (
            <div key={f.account} className="bg-white rounded-xl border border-red-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">{f.account}</p>
                      <p className="text-xs text-[#94a3b8]">{f.email} · {f.plan}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600">${f.amount}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    <div><span className="text-[#94a3b8]">Attempts: </span><span className="font-semibold text-[#0f172a]">{f.attempts}</span></div>
                    <div><span className="text-[#94a3b8]">Last attempt: </span><span className="font-semibold text-[#0f172a]">{f.lastAttempt}</span></div>
                    <div><span className="text-[#94a3b8]">Reason: </span><span className="font-semibold text-red-600">{f.reason}</span></div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-lg transition-colors">Retry charge</button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-lg transition-colors">Contact owner</button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">Suspend account</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
