import { useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Zap, Globe, CheckCircle, AlertTriangle, RefreshCw, Terminal } from 'lucide-react'

const tabs = ['Health', 'Logs', 'Jobs']

const services = [
  { name: 'API Gateway',       status: 'operational', uptime: '99.98%', p95: '42ms',  p99: '91ms',  icon: Globe },
  { name: 'Database (Primary)',status: 'operational', uptime: '99.99%', p95: '8ms',   p99: '18ms',  icon: Database },
  { name: 'Database (Replica)',status: 'operational', uptime: '99.99%', p95: '10ms',  p99: '22ms',  icon: Database },
  { name: 'Message Queue',     status: 'operational', uptime: '99.95%', p95: '12ms',  p99: '29ms',  icon: Zap },
  { name: 'AI / LLM Service',  status: 'degraded',    uptime: '98.1%',  p95: '280ms', p99: '620ms', icon: Server },
  { name: 'File Storage (S3)', status: 'operational', uptime: '100%',   p95: '19ms',  p99: '45ms',  icon: Server },
  { name: 'Email Delivery',    status: 'operational', uptime: '99.87%', p95: '—',     p99: '—',     icon: Globe },
  { name: 'Stripe Webhooks',   status: 'operational', uptime: '99.91%', p95: '55ms',  p99: '120ms', icon: Zap },
]

const statusCfg = {
  operational: { dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle },
  degraded:    { dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700',     Icon: AlertTriangle },
  down:        { dot: 'bg-red-400',     badge: 'bg-red-100 text-red-600',         Icon: AlertTriangle },
}

const errorLogs = [
  { level:'WARN',  service:'AI Service',   msg:'LLM response timeout after 5000ms',               count: 14, last:'2m ago' },
  { level:'ERROR', service:'AI Service',   msg:'Rate limit exceeded for OpenAI key ending in 4a2f', count: 3,  last:'5m ago' },
  { level:'WARN',  service:'API Gateway',  msg:'High latency detected on /v1/conversations (>200ms)', count: 8, last:'12m ago' },
  { level:'INFO',  service:'DB Primary',   msg:'Slow query detected: SELECT * FROM messages (480ms)',  count: 2, last:'1h ago' },
  { level:'ERROR', service:'Stripe',       msg:'Webhook signature verification failed (1 event)',    count: 1,  last:'3h ago' },
]

const jobs = [
  { name:'Daily DB backup',           status:'completed', last:'Apr 10 03:00', next:'Apr 11 03:00', dur:'4m 12s' },
  { name:'Stripe invoice sync',       status:'running',   last:'Apr 10 09:00', next:'Apr 10 10:00', dur:'0m 18s...' },
  { name:'AI embeddings refresh',     status:'completed', last:'Apr 10 02:00', next:'Apr 11 02:00', dur:'12m 40s' },
  { name:'Analytics aggregation',     status:'completed', last:'Apr 10 00:00', next:'Apr 11 00:00', dur:'2m 05s' },
  { name:'Inactive workspace cleanup',status:'failed',    last:'Apr 9 04:00',  next:'Apr 10 04:00', dur:'—' },
  { name:'Email digest sender',       status:'completed', last:'Apr 10 08:00', next:'Apr 10 20:00', dur:'0m 55s' },
]

const liveMetrics = [
  { label: 'Req / min',    value: '12,482' },
  { label: 'Error rate',   value: '0.04%' },
  { label: 'P95 latency',  value: '184ms' },
  { label: 'DB conns',     value: '48 / 200' },
  { label: 'Queue depth',  value: '14 msgs' },
  { label: 'Memory',       value: '62%' },
]

const levelColors = { ERROR: 'bg-red-100 text-red-700', WARN: 'bg-amber-100 text-amber-700', INFO: 'bg-slate-100 text-slate-600' }
const jobColors   = { completed: 'text-emerald-600', running: 'text-blue-600', failed: 'text-red-600' }

function Spark({ data, color = '#1a3fbf' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 64, h = 24
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2)}`).join(' ')
  return (
    <svg width={w} height={h}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={pts} opacity="0.7" />
    </svg>
  )
}

export default function System() {
  const [tab, setTab] = useState('Health')

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>System Health</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Infrastructure monitoring · Live</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f8fafc] transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Live metrics strip */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        {liveMetrics.map(({ label, value }, i) => {
          const sparks = Array.from({ length: 10 }, () => Math.random() * 100)
          return (
            <div key={label} className="bg-white rounded-xl border border-[#e4e7ed] p-3 flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-[#0f172a]">{value}</p>
                <p className="text-[10px] text-[#94a3b8]">{label}</p>
              </div>
              <Spark data={sparks} color={i === 1 ? '#ef4444' : '#1a3fbf'} />
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e4e7ed] mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
            {t}
            {t === 'Logs' && <span className="ml-1.5 text-[9px] bg-red-500 text-white rounded-full px-1.5 py-0.5">2</span>}
          </button>
        ))}
      </div>

      {tab === 'Health' && (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f1f5f9]">
            <p className="text-sm font-semibold text-[#0f172a]">Services</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#64748b]">{services.filter(s => s.status === 'operational').length}/{services.length} operational</span>
            </div>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {services.map(({ name, status, uptime, p95, p99, icon: Icon }, i) => {
              const cfg = statusCfg[status]
              return (
                <motion.div key={name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#f8fafc] border border-[#e4e7ed] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#64748b]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#0f172a]">{name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${cfg.badge}`}>{status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div><p className="text-xs font-bold text-[#0f172a]">{uptime}</p><p className="text-[9px] text-[#94a3b8]">30d uptime</p></div>
                    <div><p className="text-xs font-bold text-[#0f172a]">{p95}</p><p className="text-[9px] text-[#94a3b8]">P95</p></div>
                    <div><p className="text-xs font-bold text-[#0f172a]">{p99}</p><p className="text-[9px] text-[#94a3b8]">P99</p></div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'Logs' && (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#f1f5f9] bg-[#0f172a]">
            <Terminal size={13} className="text-[#4cc61e]" />
            <p className="text-[11px] font-mono text-[#4cc61e]">system.log · live tail</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Level', 'Service', 'Message', 'Count', 'Last seen'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {errorLogs.map((l, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColors[l.level]}`}>{l.level}</span></td>
                  <td className="px-4 py-3 text-[10px] font-semibold text-[#64748b]">{l.service}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#475569] max-w-xs truncate">{l.msg}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#0f172a]">{l.count}×</td>
                  <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{l.last}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Jobs' && (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Job', 'Status', 'Last Run', 'Next Run', 'Duration', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {jobs.map((j, i) => (
                <motion.tr key={j.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{j.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${j.status === 'completed' ? 'bg-emerald-400' : j.status === 'running' ? 'bg-blue-400 animate-pulse' : 'bg-red-400'}`} />
                      <span className={`text-[10px] font-semibold capitalize ${jobColors[j.status]}`}>{j.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#94a3b8]">{j.last}</td>
                  <td className="px-4 py-3 text-xs text-[#94a3b8]">{j.next}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#475569]">{j.dur}</td>
                  <td className="px-4 py-3">
                    {j.status === 'failed' && (
                      <button className="text-[10px] font-semibold text-[#1a3fbf] hover:underline">Retry</button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
