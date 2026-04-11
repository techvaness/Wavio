import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Zap, CheckCircle, AlertTriangle, RefreshCw, Terminal, Loader2 } from 'lucide-react'
import { api } from '../../api/client'

const tabs = ['Health', 'Logs']

const levelColors = { ERROR: 'bg-red-100 text-red-700', WARN: 'bg-amber-100 text-amber-700', INFO: 'bg-slate-100 text-slate-600' }

function fmtUptime(secs) {
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${Math.floor(secs % 60)}s`
}

function eventLevel(event) {
  if (event?.includes('failed') || event?.includes('error') || event?.includes('suspended')) return 'ERROR'
  if (event?.includes('warn')   || event?.includes('deleted')) return 'WARN'
  return 'INFO'
}

export default function System() {
  const [tab, setTab]       = useState('Health')
  const [health, setHealth] = useState(null)
  const [logs, setLogs]     = useState([])
  const [loading, setLoad]  = useState(true)
  const [refreshing, setR]  = useState(false)

  const load = useCallback(async () => {
    setR(true)
    try {
      const [h, l] = await Promise.all([
        api.get('/system/health'),
        api.get('/system/logs'),
      ])
      setHealth(h)
      setLogs(l)
    } catch { /* ignore */ }
    finally { setLoad(false); setR(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const services = health ? [
    { name: 'API Server',    status: 'operational', uptime: fmtUptime(health.uptime_seconds), detail: `Node ${health.node_version}`,   icon: Server },
    { name: 'SQLite DB',     status: health.db.ok ? 'operational' : 'down', uptime: '—', detail: `${health.db.response_ms}ms response`, icon: Database },
    { name: 'Socket.io',     status: 'operational', uptime: fmtUptime(health.uptime_seconds), detail: 'Real-time layer',                icon: Zap },
    { name: 'File Storage',  status: 'operational', uptime: '—', detail: 'Local disk (uploads/)',                                      icon: Server },
  ] : []

  const statusCfg = {
    operational: { dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
    degraded:    { dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700' },
    down:        { dot: 'bg-red-400',     badge: 'bg-red-100 text-red-600' },
  }

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>System Health</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Live infrastructure status</p>
        </div>
        <button onClick={load} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-60">
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Live metrics strip */}
      {health && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Uptime',       value: fmtUptime(health.uptime_seconds) },
            { label: 'Heap memory',  value: `${health.memory.heap_used_mb} MB (${health.memory.heap_pct}%)` },
            { label: 'RSS memory',   value: `${health.memory.rss_mb} MB` },
            { label: 'DB latency',   value: `${health.db.response_ms}ms` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-[#e4e7ed] p-3">
              <p className="text-base font-bold text-[#0f172a]">{value}</p>
              <p className="text-[10px] text-[#94a3b8]">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#e4e7ed] mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#94a3b8]" /></div>
      ) : tab === 'Health' ? (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f1f5f9]">
            <p className="text-sm font-semibold text-[#0f172a]">Services</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#64748b]">{services.filter(s => s.status === 'operational').length}/{services.length} operational</span>
            </div>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {services.map(({ name, status, uptime, detail, icon: Icon }, i) => {
              const cfg = statusCfg[status] ?? statusCfg.operational
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
                    <div><p className="text-xs font-bold text-[#0f172a]">{uptime}</p><p className="text-[9px] text-[#94a3b8]">uptime</p></div>
                    <div><p className="text-xs text-[#475569]">{detail}</p></div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#f1f5f9] bg-[#0f172a]">
            <Terminal size={13} className="text-[#4cc61e]" />
            <p className="text-[11px] font-mono text-[#4cc61e]">audit_log · last 50 events</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Level', 'Event', 'Actor', 'Timestamp'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {logs.map((l, i) => {
                const level = eventLevel(l.event)
                return (
                  <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelColors[level]}`}>{level}</span></td>
                    <td className="px-4 py-3 text-xs font-mono text-[#475569]">{l.event}</td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{l.actor}</td>
                    <td className="px-4 py-3 text-[10px] text-[#94a3b8] whitespace-nowrap">{l.ts?.slice(0, 19).replace('T', ' ')}</td>
                  </motion.tr>
                )
              })}
              {logs.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-xs text-[#94a3b8]">No log entries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
