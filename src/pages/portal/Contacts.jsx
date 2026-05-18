import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Phone, Mail, Globe, Clock, MessageSquare, MoreVertical, Upload, UserPlus, Loader2 } from 'lucide-react'
import { contactApi, convApi } from '../../api/client'

const tagColors = ['bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-red-100 text-red-600','bg-teal-100 text-teal-700','bg-amber-100 text-amber-700']

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function ContactFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    company: initial?.company || '',
    location: initial?.location || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!initial

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Name is required')
    setSaving(true); setError('')
    try {
      let result
      if (isEdit) {
        result = await contactApi.update(initial.id, form)
      } else {
        result = await contactApi.create(form)
      }
      onSave(result)
    } catch (err) { setError(err.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
          <p className="text-sm font-bold text-[#0f172a]">{isEdit ? 'Edit contact' : 'Add contact'}</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><X size={15} /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-3">
          {[
            { label: 'Full Name', key: 'name', type: 'text', required: true },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Company', key: 'company', type: 'text' },
            { label: 'Location', key: 'location', type: 'text' },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={required}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
            </div>
          ))}
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] rounded-xl hover:bg-[#f8fafc] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 rounded-xl transition-colors">
              {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Add contact')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ContactDrawer({ contact, onClose, onContactUpdated, onStartConvo }) {
  const [tab, setTab]           = useState('overview')
  const [convos, setConvos]     = useState([])
  const [loadingConvos, setLC]  = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const tags = contact.tags ? JSON.parse(contact.tags) : []

  useEffect(() => {
    if (tab === 'conversations') {
      setLC(true)
      contactApi.convos(contact.id).then(setConvos).catch(console.error).finally(() => setLC(false))
    }
  }, [tab, contact.id])

  return (
    <>
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-96 bg-white border-l border-[#e4e7ed] shadow-2xl z-50 flex flex-col"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3fbf]/20 to-[#4cc61e]/20 flex items-center justify-center text-[#1a3fbf] font-bold text-base">{(contact.name || '?')[0]}</div>
            <div>
              <p className="font-bold text-[#0f172a] text-sm">{contact.name}</p>
              <p className="text-[10px] text-[#94a3b8]">{contact.company || '—'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><X size={15} /></button>
        </div>

        <div className="flex border-b border-[#e4e7ed]">
          {['overview','conversations','notes'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[10px] font-bold capitalize transition-colors ${tab === t ? 'text-[#1a3fbf] border-b-2 border-[#1a3fbf]' : 'text-[#94a3b8] hover:text-[#475569]'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {[['Conversations', contact.convo_count], ['First seen', new Date(contact.first_seen).toLocaleDateString('en-US', { month:'short', day:'numeric' })], ['Last seen', timeAgo(contact.last_seen)]].map(([k, v]) => (
                  <div key={k} className="bg-[#f8fafc] rounded-xl p-3 border border-[#e4e7ed] text-center">
                    <p className="text-sm font-bold text-[#0f172a]">{v}</p>
                    <p className="text-[9px] text-[#94a3b8] mt-0.5">{k}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Contact Info</p>
                <div className="space-y-2.5">
                  {[[Mail,'Email',contact.email],[Phone,'Phone',contact.phone],[Globe,'Location',contact.location],[Clock,'Last seen',timeAgo(contact.last_seen)]].map(([Icon, label, val]) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <Icon size={13} className="text-[#94a3b8] flex-shrink-0" />
                      <div>
                        <p className="text-[9px] text-[#94a3b8]">{label}</p>
                        <p className="text-xs font-medium text-[#475569]">{val || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.length ? tags.map((t, i) => (
                    <span key={t} className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${tagColors[i % tagColors.length]}`}>#{t}</span>
                  )) : <span className="text-[10px] text-[#94a3b8]">No tags yet</span>}
                </div>
              </div>
              <div className="space-y-2">
                <button onClick={onStartConvo}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
                  <MessageSquare size={13} /> Start conversation
                </button>
                <button onClick={() => setShowEdit(true)}
                  className="w-full py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors">
                  Edit contact
                </button>
                <button onClick={() => contactApi.delete(contact.id).then(onClose).catch(console.error)}
                  className="w-full py-2.5 text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                  Delete contact
                </button>
              </div>
            </>
          )}

          {tab === 'conversations' && (
            <div className="space-y-2">
              {loadingConvos ? <div className="flex justify-center pt-4"><Loader2 size={18} className="animate-spin text-[#94a3b8]" /></div> :
                convos.length ? convos.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e7ed] hover:border-[#1a3fbf]/30 transition-colors cursor-pointer">
                    <span className="text-[9px] font-mono text-[#94a3b8]">#{c.id}</span>
                    <p className="flex-1 text-xs font-medium text-[#475569] truncate">{c.subject || 'No subject'}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${c.status === 'open' ? 'bg-blue-100 text-blue-700' : c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{c.status}</span>
                  </div>
                )) : <p className="text-xs text-[#94a3b8] text-center py-4">No conversations yet</p>
              }
            </div>
          )}

          {tab === 'notes' && (
            <div>
              <textarea rows={4} placeholder="Add a note about this contact…"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e4e7ed] bg-[#f8fafc] focus:outline-none focus:border-[#1a3fbf] resize-none placeholder:text-[#cbd5e1] transition-colors mb-2" />
              <button className="px-4 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-lg transition-colors">Save note</button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showEdit && (
          <ContactFormModal
            initial={contact}
            onSave={(updated) => { onContactUpdated(updated); setShowEdit(false) }}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default function Contacts() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [selected, setSel]      = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [startingConvo, setStartingConvo] = useState(false)

  useEffect(() => {
    load()
  }, [search])

  async function load() {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      setContacts(await contactApi.list(params))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function handleContactUpdated(updated) {
    setContacts(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c))
    setSel(prev => prev?.id === updated.id ? { ...prev, ...updated } : prev)
  }

  async function handleStartConvo(contact) {
    setStartingConvo(true)
    try {
      await convApi.create({ contact_id: contact.id, channel: 'chat' })
      setSel(null)
      navigate('/portal/inbox')
    } catch (err) { console.error(err) }
    finally { setStartingConvo(false) }
  }

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Contacts</h1>
          <p className="text-xs text-[#64748b] mt-0.5">{contacts.length} contacts in your workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475569] border border-[#e4e7ed] bg-white rounded-xl hover:bg-[#f8fafc] transition-colors">
            <Upload size={12} /> Import CSV
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] rounded-xl transition-colors">
            <UserPlus size={12} /> Add contact
          </button>
        </div>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…"
          className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-[#e4e7ed] bg-white focus:outline-none focus:border-[#1a3fbf] transition-colors" />
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-[#94a3b8]" /></div>
      ) : (
        <div className="bg-white border border-[#e4e7ed] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e4e7ed]">
                {['Contact','Company','Email','Location','Conversations','Last seen','Tags',''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[9px] font-bold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {contacts.map((c, i) => {
                const tags = c.tags ? JSON.parse(c.tags) : []
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-[#f8fafc] cursor-pointer transition-colors" onClick={() => setSel(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3fbf]/15 to-[#4cc61e]/15 flex items-center justify-center text-[#1a3fbf] font-bold text-xs flex-shrink-0">{(c.name || '?')[0]}</div>
                        <span className="text-xs font-semibold text-[#0f172a]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#475569]">{c.company || '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{c.location || '—'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#0f172a]">{c.convo_count}</td>
                    <td className="px-4 py-3 text-[10px] text-[#94a3b8]">{timeAgo(c.last_seen)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {tags.slice(0,2).map((t, ti) => (
                          <span key={t} className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${tagColors[ti % tagColors.length]}`}>#{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button className="p-1 rounded text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"><MoreVertical size={13} /></button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {contacts.length === 0 && <div className="py-10 text-center text-xs text-[#94a3b8]">No contacts match your search.</div>}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <ContactFormModal
            onSave={(newContact) => { setContacts(prev => [newContact, ...prev]); setShowAdd(false) }}
            onClose={() => setShowAdd(false)}
          />
        )}
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40" onClick={() => setSel(null)} />
            <ContactDrawer
              contact={selected}
              onClose={() => setSel(null)}
              onContactUpdated={handleContactUpdated}
              onStartConvo={() => handleStartConvo(selected)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
