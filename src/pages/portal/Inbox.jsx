import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Send, Paperclip, Smile, MoreHorizontal, Tag,
  ChevronDown, Clock, User, Globe, Monitor, Phone,
  CheckCheck, SidebarClose, AlertCircle, X, Hash, Loader2,
} from 'lucide-react'
import { convApi, teamApi, cannedApi } from '../../api/client'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'

const chanIcon = (ch) => ({
  whatsapp: <span className="text-[9px] font-bold text-green-600">WA</span>,
  email:    <span className="text-[9px] font-bold text-blue-600">EM</span>,
  chat:     <span className="text-[9px] font-bold text-purple-600">CH</span>,
  sms:      <span className="text-[9px] font-bold text-amber-600">SMS</span>,
}[ch] ?? <span className="text-[9px] font-bold text-gray-500">?</span>)

const statusBadge = {
  open:     'bg-blue-100 text-blue-700',
  pending:  'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}
const tagColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-red-100 text-red-600', 'bg-teal-100 text-teal-700']

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)   return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Inbox() {
  const { user } = useAuth()
  const socket = useSocket()

  const [threads, setThreads]         = useState([])
  const [active, setActive]           = useState(null)
  const [messages, setMessages]       = useState([])
  const [agents, setAgents]           = useState([])
  const [cannedResponses, setCanned]  = useState([])
  const [reply, setReply]             = useState('')
  const [mode, setMode]               = useState('reply')
  const [showContact, setContact]     = useState(true)
  const [assignOpen, setAssign]       = useState(false)
  const [filter, setFilter]           = useState('All')
  const [showCanned, setShowCanned]   = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending]         = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [search, setSearch]           = useState('')
  const messagesEndRef = useRef(null)
  const typingTimer = useRef(null)

  // Load initial data
  useEffect(() => {
    loadThreads()
    teamApi.list().then(setAgents).catch(console.error)
    cannedApi.list().then(setCanned).catch(console.error)
  }, [filter, search])

  async function loadThreads() {
    try {
      const params = {}
      if (filter === 'Mine')    params.assigned = 'me'
      else if (filter === 'Open')    params.status = 'open'
      else if (filter === 'Pending') params.status = 'pending'
      if (search) params.search = search
      const data = await convApi.list(params)
      setThreads(data)
      if (!active && data.length > 0) selectThread(data[0])
    } catch (err) {
      console.error('Failed to load threads:', err)
    }
  }

  async function selectThread(thread) {
    if (active?.id === thread.id) return
    if (active) socket?.emit('leave_conversation', active.id)

    setActive(thread)
    setLoadingMsgs(true)
    socket?.emit('join_conversation', thread.id)

    try {
      const msgs = await convApi.messages(thread.id)
      setMessages(msgs)
      // mark as read in thread list
      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread_count: 0 } : t))
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setLoadingMsgs(false)
    }
  }

  // Socket events
  useEffect(() => {
    if (!socket) return

    function onNewMessage({ convoId, message }) {
      if (active?.id === convoId) {
        setMessages(prev => [...prev, message])
      }
      // update thread list preview + unread
      setThreads(prev => prev.map(t =>
        t.id === convoId
          ? { ...t, last_message: message.text, last_message_at: message.created_at, unread_count: active?.id === convoId ? 0 : (t.unread_count || 0) + (message.from_type === 'customer' ? 1 : 0) }
          : t
      ))
    }

    function onConvoUpdated({ convoId }) {
      // refresh thread in list
      convApi.get(convoId).then(updated => {
        setThreads(prev => prev.map(t => t.id === convoId ? { ...t, ...updated } : t))
        if (active?.id === convoId) setActive(prev => ({ ...prev, ...updated }))
      }).catch(console.error)
    }

    function onTypingStart({ userId: uid, name, convoId }) {
      if (active?.id !== convoId || uid === user?.id) return
      setTypingUsers(prev => prev.includes(name) ? prev : [...prev, name])
    }

    function onTypingStop({ userId: uid, convoId }) {
      if (active?.id !== convoId) return
      // find and remove by userId – we stored names so just clear all for simplicity
      setTypingUsers([])
    }

    socket.on('message:new', onNewMessage)
    socket.on('conversation:updated', onConvoUpdated)
    socket.on('typing:start', onTypingStart)
    socket.on('typing:stop', onTypingStop)

    return () => {
      socket.off('message:new', onNewMessage)
      socket.off('conversation:updated', onConvoUpdated)
      socket.off('typing:start', onTypingStart)
      socket.off('typing:stop', onTypingStop)
    }
  }, [socket, active, user])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Typing indicator
  function handleReplyChange(e) {
    setReply(e.target.value)
    if (active) {
      socket?.emit('typing:start', { convoId: active.id })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socket?.emit('typing:stop', { convoId: active.id })
      }, 1500)
    }
  }

  async function send() {
    if (!reply.trim() || !active || sending) return
    setSending(true)
    try {
      await convApi.sendMessage(active.id, reply.trim(), mode)
      setReply('')
      setShowCanned(false)
      socket?.emit('typing:stop', { convoId: active.id })
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setSending(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send()
    if (e.key === '/' && reply === '') { e.preventDefault(); setShowCanned(true) }
  }

  async function handleResolve() {
    if (!active) return
    const newStatus = active.status === 'resolved' ? 'open' : 'resolved'
    try {
      await convApi.update(active.id, { status: newStatus })
      setActive(prev => ({ ...prev, status: newStatus }))
      setThreads(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus } : t))
    } catch (err) {
      console.error('Resolve failed:', err)
    }
  }

  async function handleAssign(agentId) {
    if (!active) return
    setAssign(false)
    try {
      const updated = await convApi.update(active.id, { assigned_to: agentId || null })
      setActive(prev => ({ ...prev, assigned_to: updated.assigned_to, assigned_name: updated.assigned_name }))
      setThreads(prev => prev.map(t => t.id === active.id ? { ...t, assigned_to: updated.assigned_to, assigned_name: updated.assigned_name } : t))
    } catch (err) {
      console.error('Assign failed:', err)
    }
  }

  const contact = active ? {
    email:    active.contact_email,
    phone:    active.contact_phone,
    location: active.contact_location,
    company:  active.contact_company,
    tags:     active.contact_tags ? JSON.parse(active.contact_tags) : [],
    firstSeen:active.first_seen,
    lastSeen: active.last_seen,
  } : null

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Thread list ──────────────────────────────────── */}
      <div className="w-72 border-r border-[#e4e7ed] bg-white flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-[#e4e7ed]">
          <div className="relative mb-2.5">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-[#f8fafc] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
          </div>
          <div className="flex gap-1">
            {['All','Mine','Open','Pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${filter === f ? 'bg-[#1a3fbf] text-white' : 'text-[#64748b] hover:bg-[#f1f5f9]'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#f8fafc]">
          {threads.map(t => (
            <div key={t.id} onClick={() => selectThread(t)}
              className={`px-4 py-3.5 cursor-pointer transition-colors ${active?.id === t.id ? 'bg-[#eef2ff] border-l-2 border-[#1a3fbf]' : 'hover:bg-[#f8fafc] border-l-2 border-transparent'}`}>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-xs flex-shrink-0">
                  {(t.contact_name || '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-semibold ${t.unread_count > 0 ? 'text-[#0f172a]' : 'text-[#475569]'}`}>{t.contact_name}</span>
                    <div className="flex items-center gap-1">
                      <span className="flex items-center justify-center w-3 h-3">{chanIcon(t.channel)}</span>
                      <span className="text-[9px] text-[#94a3b8]">{timeAgo(t.last_message_at)}</span>
                    </div>
                  </div>
                  <p className={`text-[10px] truncate mb-1.5 ${t.unread_count > 0 ? 'text-[#475569] font-medium' : 'text-[#94a3b8]'}`}>
                    {t.last_message || t.subject || '—'}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${statusBadge[t.status]}`}>{t.status}</span>
                    {t.unread_count > 0 && (
                      <span className="ml-auto text-[9px] font-bold bg-[#1a3fbf] text-white w-4 h-4 rounded-full flex items-center justify-center">{t.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {threads.length === 0 && (
            <p className="text-center text-xs text-[#94a3b8] py-10">No conversations</p>
          )}
        </div>
      </div>

      {/* ── Conversation ─────────────────────────────────── */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          {/* Convo header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#e4e7ed]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-xs">
                {(active.contact_name || '?')[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f172a]">{active.contact_name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusBadge[active.status]}`}>{active.status}</span>
                  <span className="text-[10px] text-[#94a3b8]">{active.contact_email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Assign */}
              <div className="relative">
                <button onClick={() => setAssign(!assignOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-lg hover:bg-[#f1f5f9] transition-colors">
                  <User size={11} />{active.assigned_name || 'Unassigned'}<ChevronDown size={10} />
                </button>
                <AnimatePresence>
                  {assignOpen && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e4e7ed] rounded-xl shadow-lg z-50 overflow-hidden">
                      <button onClick={() => handleAssign(null)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-[#f8fafc] transition-colors text-[#94a3b8]">
                        Unassigned
                      </button>
                      {agents.filter(a => a.role !== 'admin' || a.id === user?.id).map(a => (
                        <button key={a.id} onClick={() => handleAssign(a.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-[#f8fafc] transition-colors">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[10px] font-bold text-[#1a3fbf]">{(a.name || '?')[0]}</div>
                          {a.name}
                          <span className={`ml-auto w-1.5 h-1.5 rounded-full ${a.status === 'online' ? 'bg-emerald-500' : a.status === 'busy' ? 'bg-amber-400' : 'bg-gray-300'}`} />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={handleResolve}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${active.status === 'resolved' ? 'text-blue-700 bg-blue-100 hover:bg-blue-200' : 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'}`}>
                {active.status === 'resolved' ? '↩ Reopen' : '✓ Resolve'}
              </button>
              <button onClick={() => setContact(!showContact)}
                className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors" title="Toggle contact panel">
                <SidebarClose size={15} />
              </button>
              <button className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {loadingMsgs ? (
              <div className="flex justify-center pt-10"><Loader2 size={20} className="animate-spin text-[#94a3b8]" /></div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <motion.div key={m.id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from_type === 'agent' ? 'justify-end' : m.from_type === 'note' ? 'justify-center' : 'justify-start'}`}>
                    {m.from_type === 'note' ? (
                      <div className="max-w-[70%] px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                        <span className="font-bold">Internal note: </span>{m.text}
                      </div>
                    ) : (
                      <div className="max-w-[68%]">
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          m.from_type === 'agent' ? 'bg-[#1a3fbf] text-white rounded-br-sm' : 'bg-white border border-[#e4e7ed] text-[#0f172a] rounded-bl-sm shadow-sm'
                        }`}>{m.text}</div>
                        <div className={`flex items-center gap-1.5 mt-1 ${m.from_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                          {m.from_type === 'agent' && <span className="text-[9px] text-[#94a3b8]">{m.agent_name}</span>}
                          <span className="text-[9px] text-[#94a3b8]">{formatTime(m.created_at)}</span>
                          {m.from_type === 'agent' && <CheckCheck size={11} className={m.is_read ? 'text-[#4cc61e]' : 'text-[#94a3b8]'} />}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2.5 bg-white border border-[#e4e7ed] rounded-2xl rounded-bl-sm text-xs text-[#94a3b8] italic">
                      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing…
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Reply box */}
          <div className="px-4 pb-4">
            <AnimatePresence>
              {showCanned && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="mb-2 bg-white border border-[#e4e7ed] rounded-xl overflow-hidden shadow-lg">
                  <div className="px-3 py-2 border-b border-[#f1f5f9] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748b]"><Hash size={11} />Canned Responses</div>
                    <button onClick={() => setShowCanned(false)}><X size={12} className="text-[#94a3b8]" /></button>
                  </div>
                  {cannedResponses.map(cr => (
                    <button key={cr.id} onClick={() => { setReply(cr.text); setShowCanned(false) }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#f8fafc] transition-colors border-b border-[#f8fafc] last:border-0">
                      <p className="text-[10px] font-bold text-[#1a3fbf]">{cr.shortcut}</p>
                      <p className="text-[10px] text-[#64748b] truncate">{cr.text}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white border border-[#e4e7ed] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-1 px-3 pt-2.5">
                {['reply','note'].map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg capitalize transition-colors ${mode === m ? (m === 'note' ? 'bg-amber-100 text-amber-700' : 'bg-[#eef2ff] text-[#1a3fbf]') : 'text-[#94a3b8] hover:text-[#475569]'}`}>
                    {m === 'reply' ? '↩ Reply' : '🔒 Note'}
                  </button>
                ))}
              </div>
              <textarea value={reply} onChange={handleReplyChange} onKeyDown={handleKey}
                placeholder={mode === 'note' ? 'Add an internal note (not visible to customer)…' : 'Write a reply… (/ for canned, ⌘↵ to send)'}
                rows={3}
                className={`w-full px-4 pt-2.5 pb-2 text-sm resize-none focus:outline-none placeholder:text-[#cbd5e1] ${mode === 'note' ? 'bg-amber-50/50' : ''}`}
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors"><Paperclip size={15} /></button>
                  <button className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors"><Smile size={15} /></button>
                  <button onClick={() => setShowCanned(!showCanned)}
                    className={`p-1.5 rounded-lg transition-colors ${showCanned ? 'bg-[#eef2ff] text-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]'}`}>
                    <Hash size={15} />
                  </button>
                </div>
                <button onClick={send} disabled={sending || !reply.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  {mode === 'note' ? 'Save note' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#94a3b8] text-sm">
          Select a conversation to start
        </div>
      )}

      {/* ── Contact panel ────────────────────────────────── */}
      <AnimatePresence>
        {showContact && active && contact && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 256, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-[#e4e7ed] bg-white flex-shrink-0 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e4e7ed]">
              <p className="text-xs font-bold text-[#0f172a]">Contact</p>
              <button onClick={() => setContact(false)} className="text-[#94a3b8] hover:text-[#475569]"><X size={14} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-xl mx-auto mb-2">
                  {(active.contact_name || '?')[0]}
                </div>
                <p className="text-sm font-bold text-[#0f172a]">{active.contact_name}</p>
                <p className="text-[10px] text-[#94a3b8]">{contact.company}</p>
              </div>

              <div>
                <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Details</p>
                <div className="space-y-2">
                  {[
                    { icon: Phone,       label: 'Phone',    val: contact.phone || '—' },
                    { icon: Globe,       label: 'Location', val: contact.location || '—' },
                    { icon: Clock,       label: 'First seen',val: contact.firstSeen ? new Date(contact.firstSeen).toLocaleDateString() : '—' },
                    { icon: AlertCircle, label: 'Last seen', val: timeAgo(contact.lastSeen) + ' ago' },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon size={11} className="text-[#94a3b8] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-[#94a3b8]">{label}</p>
                        <p className="text-[10px] font-medium text-[#475569] truncate">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {contact.tags.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((t, i) => (
                      <span key={t} className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${tagColors[i % tagColors.length]}`}>#{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
