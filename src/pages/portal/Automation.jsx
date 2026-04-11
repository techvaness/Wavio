import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Plus, X, ChevronDown, ToggleLeft, ToggleRight, Bot, Clock, Tag, User, MessageSquare, Mail } from 'lucide-react'

const tabs = ['Rules', 'Chatbots', 'Canned Responses', 'Away Message']

const rules = [
  { id:'R1', name:'Auto-assign billing tickets',     trigger:'Conversation contains "invoice" or "billing"',   action:'Assign to Alex M. · Tag as billing',         status:true,  runs:142 },
  { id:'R2', name:'Urgent flag for angry customers', trigger:'Message sentiment is negative',                  action:'Set priority High · Notify team',             status:true,  runs:37 },
  { id:'R3', name:'Auto-close idle resolved',        trigger:'Conversation resolved + no reply for 48 hours', action:'Close conversation',                          status:true,  runs:89 },
  { id:'R4', name:'Weekend away message',            trigger:'Message received on Sat or Sun',                 action:'Send away message · Set status Pending',      status:false, runs:0 },
  { id:'R5', name:'First contact greeting',          trigger:'New conversation started',                       action:'Send canned response /greet',                  status:true,  runs:204 },
]

const bots = [
  { id:'B1', name:'Lead Qualifier Bot', desc:'Asks for name, email and intent before assigning to agent.', active:true,  triggers:89 },
  { id:'B2', name:'FAQ Bot',            desc:'Handles top 20 most-asked questions automatically.',         active:false, triggers:0 },
]

const canned = [
  { shortcut:'/greet',  title:'Greeting',         text:'Hi! Thanks for reaching out to our support team. How can I help you today?' },
  { shortcut:'/sorry',  title:'Apology',           text:"I'm really sorry to hear about this issue. Let me look into it right away." },
  { shortcut:'/thanks', title:'Thank you',         text:"Thank you for your patience! Is there anything else I can help you with?" },
  { shortcut:'/close',  title:'Close conversation',text:"I'm going to close this conversation now. Don't hesitate to reach out if you need anything!" },
  { shortcut:'/refund', title:'Refund processed',  text:"I've processed your refund. It should appear in your account within 3–5 business days." },
  { shortcut:'/eta',    title:'ETA response',      text:"I'm looking into this right now and will get back to you within 30 minutes." },
]

const triggerOptions = ['New conversation started','Message received','Conversation resolved','Specific keyword in message','Sentiment detected','Time-based (schedule)']
const actionOptions  = ['Assign to agent','Set priority','Add tag','Send canned response','Send email notification','Close conversation','Add internal note']

function RuleEditor({ rule, onClose }) {
  const [name, setName] = useState(rule?.name || '')
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] bg-white rounded-2xl shadow-2xl z-50 p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-[#0f172a]">{rule ? 'Edit Rule' : 'New Automation Rule'}</p>
        <button onClick={onClose}><X size={16} className="text-[#94a3b8]" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Rule Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Auto-assign billing tickets"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">
            <span className="inline-flex items-center gap-1 text-amber-600">⚡ WHEN (trigger)</span>
          </label>
          <select className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569]">
            {triggerOptions.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="pl-4 border-l-2 border-amber-200">
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Condition</label>
          <div className="flex items-center gap-2">
            <select className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#e4e7ed] focus:outline-none bg-white text-[#475569]">
              <option>Message text</option>
              <option>Channel</option>
              <option>Contact tag</option>
            </select>
            <select className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#e4e7ed] focus:outline-none bg-white text-[#475569]">
              <option>contains</option>
              <option>does not contain</option>
              <option>equals</option>
            </select>
            <input placeholder="value" className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">
            <span className="inline-flex items-center gap-1 text-blue-600">→ THEN (action)</span>
          </label>
          <div className="space-y-2">
            {[0, 1].map(i => (
              <select key={i} className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569]">
                <option value="">Select an action…</option>
                {actionOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
          <button className="text-xs font-semibold text-[#1a3fbf] hover:underline mt-2">+ Add another action</button>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
            Save rule
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

export default function Automation() {
  const [tab, setTab]         = useState('Rules')
  const [ruleStates, setRS]   = useState(() => Object.fromEntries(rules.map(r => [r.id, r.status])))
  const [showEditor, setShow] = useState(false)
  const [editRule, setEdit]   = useState(null)
  const [awayMsg, setAway]    = useState("We're away right now but we'll get back to you as soon as possible. Our usual response time is under 2 hours.")
  const [awayOn, setAwayOn]   = useState(false)

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
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
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
          {rules.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-xl border p-4 transition-all ${ruleStates[r.id] ? 'border-[#e4e7ed]' : 'border-[#e4e7ed] opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap size={13} className={ruleStates[r.id] ? 'text-[#4cc61e]' : 'text-[#94a3b8]'} />
                    <p className="text-sm font-bold text-[#0f172a]">{r.name}</p>
                    {r.runs > 0 && <span className="text-[9px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-full">{r.runs} runs</span>}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#94a3b8]"><span className="font-semibold text-amber-600">WHEN</span> {r.trigger}</p>
                    <p className="text-[10px] text-[#94a3b8]"><span className="font-semibold text-blue-600">THEN</span> {r.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEdit(r); setShow(true) }}
                    className="text-[10px] font-semibold text-[#64748b] hover:text-[#1a3fbf] transition-colors">Edit</button>
                  <button onClick={() => setRS(p => ({ ...p, [r.id]: !p[r.id] }))}>
                    {ruleStates[r.id]
                      ? <ToggleRight size={24} className="text-[#4cc61e]" />
                      : <ToggleLeft size={24} className="text-[#94a3b8]" />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'Chatbots' && (
        <div className="space-y-3">
          {bots.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl border border-[#e4e7ed] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3fbf]/10 to-[#4cc61e]/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-[#1a3fbf]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">{b.name}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{b.desc}</p>
                    {b.active && <p className="text-[10px] text-emerald-600 font-semibold mt-1">{b.triggers} conversations handled this month</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                  <button className="text-xs font-semibold text-[#1a3fbf] hover:underline">Configure</button>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="p-4 rounded-xl border-2 border-dashed border-[#e4e7ed] text-center">
            <Bot size={20} className="text-[#cbd5e1] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#94a3b8]">Build a new chatbot</p>
            <button className="mt-2 text-xs font-bold text-[#1a3fbf] hover:underline">+ Create bot</button>
          </div>
        </div>
      )}

      {tab === 'Canned Responses' && (
        <div className="space-y-2">
          {canned.map((c, i) => (
            <motion.div key={c.shortcut} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-start gap-4 bg-white rounded-xl border border-[#e4e7ed] p-4">
              <div className="w-20 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#1a3fbf] bg-[#eef2ff] px-2 py-1 rounded-lg">{c.shortcut}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0f172a] mb-0.5">{c.title}</p>
                <p className="text-[11px] text-[#64748b] leading-relaxed">{c.text}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-[10px] font-semibold text-[#64748b] hover:text-[#1a3fbf]">Edit</button>
                <button className="text-[10px] font-semibold text-red-400 hover:text-red-600">Delete</button>
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
              <p className="text-xs text-[#94a3b8] mt-0.5">Sent automatically when all agents are offline.</p>
            </div>
            <button onClick={() => setAwayOn(!awayOn)}
              className={`w-10 h-6 rounded-full relative transition-colors ${awayOn ? 'bg-[#4cc61e]' : 'bg-[#e4e7ed]'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${awayOn ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
          <textarea value={awayMsg} onChange={e => setAway(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] resize-none transition-colors mb-4" />
          <div className="mb-4">
            <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-2">Expected wait time</p>
            <select className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] bg-white text-[#475569]">
              <option>Usually replies within a few minutes</option>
              <option>Usually replies within an hour</option>
              <option>Usually replies within a few hours</option>
              <option>Usually replies within a day</option>
            </select>
          </div>
          <button className="px-4 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">Save</button>
        </div>
      )}

      <AnimatePresence>
        {showEditor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setShow(false)} />
            <RuleEditor rule={editRule} onClose={() => setShow(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
