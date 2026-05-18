import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Plus, X, ToggleLeft, ToggleRight, Bot, Loader2 } from 'lucide-react'
import { cannedApi, automationsApi } from '../../api/client'

const tabs = ['Rules', 'Canned Responses', 'Away Message']

const TRIGGER_TYPES = [
  { value: 'keyword',          label: 'Message contains keyword' },
  { value: 'channel',          label: 'Specific channel' },
  { value: 'new_conversation', label: 'New conversation started' },
]
const CHANNELS = ['chat', 'email', 'whatsapp', 'sms']
const ACTION_TYPES = [
  { value: 'set_priority', label: 'Set priority' },
  { value: 'set_status',   label: 'Set status' },
]

function RuleEditor({ rule, onClose, onSaved }) {
  const [name, setName]         = useState(rule?.name || '')
  const [trigger, setTrigger]   = useState(rule?.trigger_type || 'keyword')
  const [keyword, setKeyword]   = useState(rule?.conditions?.keyword || '')
  const [channel, setChannel]   = useState(rule?.conditions?.channel || 'chat')
  const [actionType, setAT]     = useState(rule?.actions?.[0]?.type || 'set_priority')
  const [actionVal, setAV]      = useState(rule?.actions?.[0]?.value || 'high')
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')

  const priorityValues = ['low', 'medium', 'high']
  const statusValues   = ['open', 'pending', 'resolved']

  async function save() {
    if (!name.trim()) { setErr('Rule name is required'); return }
    setSaving(true); setErr('')
    const conditions = trigger === 'keyword'  ? { keyword } :
                       trigger === 'channel'  ? { channel } : {}
    const actions    = [{ type: actionType, value: actionVal }]
    try {
      if (rule?.id) {
        await automationsApi.update(rule.id, { name: name.trim(), trigger_type: trigger, conditions, actions })
      } else {
        await automationsApi.create({ name: name.trim(), trigger_type: trigger, conditions, actions })
      }
      onSaved(); onClose()
    } catch (e) {
      setErr(e.message || 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] bg-white rounded-2xl shadow-2xl z-50 p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-[#0f172a]">{rule ? 'Edit Rule' : 'New Automation Rule'}</p>
        <button onClick={onClose}><X size={16} className="text-[#94a3b8]" /></button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Rule Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Flag urgent messages"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">
            <span className="text-amber-600">WHEN (trigger)</span>
          </label>
          <select value={trigger} onChange={e => setTrigger(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569]">
            {TRIGGER_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {trigger === 'keyword' && (
          <div className="pl-4 border-l-2 border-amber-200">
            <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Keyword</label>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. billing"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
          </div>
        )}
        {trigger === 'channel' && (
          <div className="pl-4 border-l-2 border-amber-200">
            <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Channel</label>
            <select value={channel} onChange={e => setChannel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569]">
              {CHANNELS.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">
            <span className="text-blue-600">→ THEN (action)</span>
          </label>
          <div className="flex gap-2">
            <select value={actionType} onChange={e => setAT(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569]">
              {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <select value={actionVal} onChange={e => setAV(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569] capitalize">
              {(actionType === 'set_priority' ? priorityValues : statusValues).map(v => (
                <option key={v} value={v} className="capitalize">{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 rounded-xl transition-colors">
            {saving ? 'Saving…' : 'Save rule'}
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function NewCannedModal({ onClose, onSaved }) {
  const [shortcut, setShortcut] = useState('/')
  const [text, setText]         = useState('')
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')

  async function handleSave() {
    if (!shortcut.trim() || !text.trim()) { setErr('Both fields are required'); return }
    setSaving(true)
    try {
      await cannedApi.create({ shortcut: shortcut.trim(), text: text.trim() })
      onSaved(); onClose()
    } catch (e) {
      setErr(e.message || 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] bg-white rounded-2xl shadow-2xl z-50 p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-[#0f172a]">New Canned Response</p>
        <button onClick={onClose}><X size={16} className="text-[#94a3b8]" /></button>
      </div>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Shortcut</label>
          <input value={shortcut} onChange={e => setShortcut(e.target.value)} placeholder="/greet"
            className="w-full px-3 py-2.5 text-sm font-mono rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Response Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Type your canned response…"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] resize-none transition-colors" />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 rounded-xl transition-colors">
            {saving ? 'Saving…' : 'Save response'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Automation() {
  const [tab, setTab]                 = useState('Rules')
  const [rules, setRules]             = useState([])
  const [cannedRows, setCanned]       = useState([])
  const [loadingRules, setLR]         = useState(false)
  const [showEditor, setShow]         = useState(false)
  const [editRule, setEdit]           = useState(null)
  const [showNewCanned, setShowNC]    = useState(false)
  const [awayMsg, setAway]            = useState("We're away right now but we'll get back to you as soon as possible.")
  const [awayOn, setAwayOn]           = useState(false)

  async function loadRules() {
    setLR(true)
    try { setRules(await automationsApi.list()) } catch { /* ignore */ } finally { setLR(false) }
  }
  async function loadCanned() {
    try { setCanned(await cannedApi.list()) } catch { /* ignore */ }
  }

  useEffect(() => {
    if (tab === 'Rules') loadRules()
    if (tab === 'Canned Responses') loadCanned()
  }, [tab])

  async function toggleRule(rule) {
    try {
      const updated = await automationsApi.update(rule.id, { enabled: !rule.enabled })
      setRules(prev => prev.map(r => r.id === rule.id ? updated : r))
    } catch { /* ignore */ }
  }

  async function deleteRule(id) {
    await automationsApi.delete(id)
    loadRules()
  }

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Automation</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Automate repetitive tasks and save your team hours each week.</p>
        </div>
        {tab === 'Rules' && (
          <button onClick={() => { setEdit(null); setShow(true) }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
            <Plus size={12} /> New rule
          </button>
        )}
        {tab === 'Canned Responses' && (
          <button onClick={() => setShowNC(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
            <Plus size={12} /> New response
          </button>
        )}
      </div>

      <div className="flex border-b border-[#e4e7ed] mb-5">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Rules' && (
        <div className="space-y-3">
          {loadingRules && <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#94a3b8]" /></div>}
          {!loadingRules && rules.length === 0 && (
            <div className="py-10 text-center text-xs text-[#94a3b8]">No rules yet. Click "New rule" to create one.</div>
          )}
          {rules.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-xl border p-4 transition-all ${r.enabled ? 'border-[#e4e7ed]' : 'border-[#e4e7ed] opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap size={13} className={r.enabled ? 'text-[#4cc61e]' : 'text-[#94a3b8]'} />
                    <p className="text-sm font-bold text-[#0f172a]">{r.name}</p>
                    {r.runs > 0 && <span className="text-[9px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-full">{r.runs} runs</span>}
                  </div>
                  <p className="text-[10px] text-[#94a3b8]">
                    <span className="font-semibold text-amber-600">WHEN </span>
                    {r.trigger_type === 'keyword' ? `message contains "${r.conditions?.keyword}"` :
                     r.trigger_type === 'channel' ? `channel is ${r.conditions?.channel}` :
                     'new conversation starts'}
                    {r.actions?.[0] && (
                      <><span className="font-semibold text-blue-600"> · THEN </span>
                      {r.actions[0].type === 'set_priority' ? `set priority to ${r.actions[0].value}` :
                       r.actions[0].type === 'set_status'   ? `set status to ${r.actions[0].value}` :
                       r.actions[0].type}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEdit(r); setShow(true) }}
                    className="text-[10px] font-semibold text-[#64748b] hover:text-[#1a3fbf] transition-colors">Edit</button>
                  <button onClick={() => deleteRule(r.id)}
                    className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition-colors">Delete</button>
                  <button onClick={() => toggleRule(r)}>
                    {r.enabled
                      ? <ToggleRight size={24} className="text-[#4cc61e]" />
                      : <ToggleLeft  size={24} className="text-[#94a3b8]" />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'Canned Responses' && (
        <div className="space-y-2">
          {cannedRows.length === 0 && (
            <div className="py-10 text-center text-xs text-[#94a3b8]">No canned responses yet.</div>
          )}
          {cannedRows.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-start gap-4 bg-white rounded-xl border border-[#e4e7ed] p-4">
              <div className="w-20 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#1a3fbf] bg-[#eef2ff] px-2 py-1 rounded-lg">{c.shortcut}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#64748b] leading-relaxed">{c.text}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={async () => { await cannedApi.delete(c.id); loadCanned() }}
                  className="text-[10px] font-semibold text-red-400 hover:text-red-600">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'Away Message' && (
        <div className="max-w-lg bg-white rounded-xl border border-[#e4e7ed] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0f172a]">Away Message</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">Sent when all agents are offline.</p>
            </div>
            <button onClick={() => setAwayOn(!awayOn)}
              className={`w-10 h-6 rounded-full relative transition-colors ${awayOn ? 'bg-[#4cc61e]' : 'bg-[#e4e7ed]'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${awayOn ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
          <textarea value={awayMsg} onChange={e => setAway(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] resize-none transition-colors mb-4" />
          <button className="px-4 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">Save</button>
        </div>
      )}

      <AnimatePresence>
        {showEditor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setShow(false)} />
            <RuleEditor rule={editRule} onClose={() => setShow(false)} onSaved={loadRules} />
          </>
        )}
        {showNewCanned && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowNC(false)} />
            <NewCannedModal onClose={() => setShowNC(false)} onSaved={loadCanned} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
