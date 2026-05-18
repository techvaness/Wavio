import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { User, Bell, Shield, Palette, CreditCard, MessageSquare, Code, Check, Eye, EyeOff, Camera, Loader2, X, RotateCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { profileApi, billingApi } from '../../api/client'
import LanguagePicker from '../../components/LanguagePicker'

const tabs = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'widget',        label: 'Chat Widget',   icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
  { id: 'billing',       label: 'Billing',       icon: CreditCard },
  { id: 'developers',    label: 'Developers',    icon: Code },
]

const widgetPositions = ['Bottom Right', 'Bottom Left']
const widgetColors    = ['#1a3fbf', '#4cc61e', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#0f172a']

function centerAspectCrop(mediaWidth, mediaHeight) {
  return centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, mediaWidth, mediaHeight), mediaWidth, mediaHeight)
}

// Rotate a data-url and return a new data-url
function rotateDataUrl(dataUrl, degrees) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const rad = (degrees * Math.PI) / 180
      const sin = Math.abs(Math.sin(rad))
      const cos = Math.abs(Math.cos(rad))
      const w = Math.floor(img.width * cos + img.height * sin)
      const h = Math.floor(img.width * sin + img.height * cos)
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.translate(w / 2, h / 2)
      ctx.rotate(rad)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.src = dataUrl
  })
}

async function getCroppedBlob(image, crop) {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const size = Math.min(crop.width * scaleX, crop.height * scaleY)
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, size, size)
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
}

function AvatarCropModal({ srcUrl, onConfirm, onClose, uploading }) {
  const imgRef = useRef(null)
  const [src, setSrc] = useState(srcUrl)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [rotating, setRotating] = useState(false)

  function onImageLoad(e) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
  }

  const rotate = async () => {
    setRotating(true)
    const rotated = await rotateDataUrl(src, 90)
    setSrc(rotated)
    setRotating(false)
  }

  async function handleConfirm() {
    if (!imgRef.current || !completedCrop) return
    const blob = await getCroppedBlob(imgRef.current, completedCrop)
    onConfirm(blob)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ed]">
          <p className="text-sm font-bold text-[#0f172a]">Crop photo</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><X size={15} /></button>
        </div>

        <div className="p-4">
          <p className="text-[10px] text-[#94a3b8] mb-2 text-center">Drag to reposition. The circle shows your final avatar.</p>
          <div className="bg-[#0f172a] rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 260 }}>
            <ReactCrop crop={crop} onChange={(_, pct) => setCrop(pct)} onComplete={(_, pct) => setCompletedCrop(pct)}
              aspect={1} circularCrop minWidth={60} minHeight={60}>
              <img ref={imgRef} src={src} alt="Crop preview"
                style={{ maxHeight: 260, maxWidth: '100%', display: 'block' }}
                onLoad={onImageLoad} />
            </ReactCrop>
          </div>

          <div className="flex justify-end mt-2.5">
            <button onClick={rotate} disabled={rotating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e4e7ed] text-[10px] font-semibold text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-50 transition-colors">
              <RotateCw size={11} className={rotating ? 'animate-spin' : ''} /> Rotate 90
            </button>
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] rounded-xl hover:bg-[#f8fafc] transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={uploading || !completedCrop}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
            {uploading ? <><Loader2 size={12} className="animate-spin" /> Uploading…</> : 'Apply photo'}
          </button>
        </div>
      </div>
    </div>
  )
}

const ALL_EVENTS = ['conversation.created', 'conversation.resolved', 'message.received', 'contact.created']

export default function Settings() {
  const { user, updateProfile, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  // ── Profile ──────────────────────────────────────────────────────────────
  const [form, setForm]           = useState({ name: user?.name ?? '', email: user?.email ?? '', company: '', jobTitle: '', timezone: '' })
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const avatarInputRef = useRef(null)

  // ── Widget ───────────────────────────────────────────────────────────────
  const [widgetColor, setWColor]     = useState('#1a3fbf')
  const [widgetPos, setWPos]         = useState('Bottom Right')
  const [widgetGreeting, setWG]      = useState("Hi there! How can we help?")
  const [widgetName, setWN]          = useState('Support')
  const [widgetOnline, setWO]        = useState(true)
  const [widgetSaved, setWSaved]     = useState(false)
  const [widgetSaving, setWidgetSaving] = useState(false)
  const [copied, setCopied]          = useState(false)

  // ── Notifications ────────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    'New conversation assigned to me':    true,
    'Customer reply in my conversations': true,
    'Conversation resolved':              false,
    'AI suggestion available':            true,
    'New team mention in note':           true,
    'SLA breach warning':                 true,
    'Weekly digest summary':              false,
    'New contact created':                false,
  })
  const [notifSaved, setNotifSaved] = useState(false)
  const [notifSaving, setNotifSaving] = useState(false)

  // ── Security ─────────────────────────────────────────────────────────────
  const [changePwOpen, setChangePwOpen]   = useState(false)
  const [showCur, setShowCur]             = useState(false)
  const [showNew, setShowNew]             = useState(false)
  const [pwForm, setPwForm]               = useState({ current: '', newPw: '', confirm: '' })
  const [pwMsg, setPwMsg]                 = useState({ text: '', ok: false })
  const [pwLoading, setPwLoading]         = useState(false)
  const [deleteOpen, setDeleteOpen]       = useState(false)
  const [deletePass, setDeletePass]       = useState('')
  const [deleteMsg, setDeleteMsg]         = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ── Appearance ───────────────────────────────────────────────────────────
  const [theme, setTheme]     = useState(() => localStorage.getItem('wavio_theme')   || 'Light')
  const [density, setDensity] = useState(() => localStorage.getItem('wavio_density') || 'Default')

  const applyTheme = useCallback((t) => {
    setTheme(t)
    localStorage.setItem('wavio_theme', t)
    const html = document.documentElement
    html.classList.remove('theme-dark', 'theme-system')
    if (t === 'Dark')   html.classList.add('theme-dark')
    if (t === 'System') html.classList.add('theme-system')
  }, [])

  const applyDensity = useCallback((d) => {
    setDensity(d)
    localStorage.setItem('wavio_density', d)
  }, [])

  // ── Developers ───────────────────────────────────────────────────────────
  const [apiKey, setApiKey]             = useState('')
  const [apiKeyVisible, setApiKeyVis]   = useState(false)
  const [apiKeyLoading, setApiKeyLoad]  = useState(false)
  const [webhookUrl, setWebhookUrl]     = useState('')
  const [webhookEvents, setWHEvents]    = useState(Object.fromEntries(ALL_EVENTS.map(e => [e, true])))
  const [devSaved, setDevSaved]         = useState(false)
  const [devLoading, setDevLoading]     = useState(false)

  useEffect(() => {
    if (activeTab !== 'developers') return
    profileApi.getApiKey().then(d => setApiKey(d.apiKey)).catch(() => {})
    profileApi.getWebhook().then(d => {
      setWebhookUrl(d.webhookUrl || '')
      const evMap = Object.fromEntries(ALL_EVENTS.map(e => [e, false]))
      ;(d.webhookEvents || []).forEach(e => { if (evMap[e] !== undefined) evMap[e] = true })
      setWHEvents(evMap)
    }).catch(() => {})
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'widget') return
    profileApi.getWidget().then(d => {
      if (d.widget_name)     setWN(d.widget_name)
      if (d.widget_color)    setWColor(d.widget_color)
      if (d.widget_greeting) setWG(d.widget_greeting)
      if (d.widget_position) setWPos(d.widget_position)
      if (d.widget_online !== undefined) setWO(!!d.widget_online)
    }).catch(() => {})
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'notifications') return
    profileApi.getNotifications().then(d => {
      if (d.prefs) setNotifs(prev => ({ ...prev, ...d.prefs }))
    }).catch(() => {})
  }, [activeTab])

  // ── Billing ──────────────────────────────────────────────────────────────
  const [billing, setBilling] = useState(null)
  useEffect(() => {
    if (activeTab !== 'billing') return
    billingApi.plan().then(setBilling).catch(() => {})
  }, [activeTab])

  // ── Handlers ─────────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setSaving(true); setSaveMsg('')
    try {
      await updateProfile({ name: form.name })
      setSaveMsg('Saved!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (e) { setSaveMsg(e.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const onFileSelected = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const uploadCroppedAvatar = async (blob) => {
    setAvatarUploading(true)
    try {
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
      await profileApi.uploadAvatar(file)
      await refreshUser()
      setCropSrc(null)
    } catch (err) { console.error(err) }
    finally { setAvatarUploading(false) }
  }

  const saveWidget = async () => {
    setWidgetSaving(true)
    try {
      await profileApi.saveWidget({
        widget_name: widgetName,
        widget_color: widgetColor,
        widget_greeting: widgetGreeting,
        widget_position: widgetPos,
        widget_online: widgetOnline,
      })
      setWSaved(true)
      setTimeout(() => setWSaved(false), 2500)
    } catch (err) { console.error(err) }
    finally { setWidgetSaving(false) }
  }

  const snippetText = `<script src="http://localhost:5173/widget.js"\n  data-workspace-id="${user?.workspace_id}"\n  data-color="${widgetColor}"\n  data-name="${widgetName}"\n  data-greeting="${widgetGreeting}"\n  async>\n</script>`

  const copySnippet = () => {
    navigator.clipboard.writeText(snippetText).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  const saveNotifs = async () => {
    setNotifSaving(true)
    try {
      await profileApi.saveNotifications({ prefs: notifs })
      setNotifSaved(true)
      setTimeout(() => setNotifSaved(false), 2500)
    } catch (err) { console.error(err) }
    finally { setNotifSaving(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPw !== pwForm.confirm) return setPwMsg({ text: 'Passwords do not match', ok: false })
    if (pwForm.newPw.length < 8) return setPwMsg({ text: 'Password must be at least 8 characters', ok: false })
    setPwLoading(true); setPwMsg({ text: '', ok: false })
    try {
      await profileApi.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
      setPwMsg({ text: 'Password changed!', ok: true })
      setPwForm({ current: '', newPw: '', confirm: '' })
      setTimeout(() => { setPwMsg({ text: '', ok: false }); setChangePwOpen(false) }, 2000)
    } catch (e) { setPwMsg({ text: e.message || 'Failed', ok: false }) }
    finally { setPwLoading(false) }
  }

  const revokeAll = async () => {
    await logout()
    navigate('/auth')
  }

  const deleteAccount = async () => {
    if (!deletePass) return setDeleteMsg('Enter your password to confirm')
    setDeleteLoading(true); setDeleteMsg('')
    try {
      await profileApi.deleteAccount({ password: deletePass })
      await logout()
      navigate('/auth')
    } catch (e) { setDeleteMsg(e.message || 'Failed'); setDeleteLoading(false) }
  }

  const regenerateKey = async () => {
    setApiKeyLoad(true)
    try { const d = await profileApi.regenerateApiKey(); setApiKey(d.apiKey); setApiKeyVis(true) }
    catch {}
    finally { setApiKeyLoad(false) }
  }

  const saveDevSettings = async () => {
    setDevLoading(true)
    try {
      await profileApi.saveWebhook({ webhookUrl, webhookEvents: ALL_EVENTS.filter(e => webhookEvents[e]) })
      setDevSaved(true); setTimeout(() => setDevSaved(false), 2500)
    } catch {}
    finally { setDevLoading(false) }
  }

  const maskedKey = apiKey ? apiKey.slice(0, 10) + '•'.repeat(20) + apiKey.slice(-4) : ''

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Settings</h1>
        <p className="text-xs text-[#64748b] mt-0.5">Manage your profile and workspace preferences.</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${activeTab === id ? 'bg-[#eef2ff] text-[#1a3fbf]' : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'}`}>
                <Icon size={13} className={activeTab === id ? 'text-[#1a3fbf]' : 'text-[#94a3b8]'} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-[#e4e7ed] p-5 min-h-[500px]">

          {/* ── Profile ─────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Profile Information</p>
              <div className="flex items-center gap-5 mb-5 pb-5 border-b border-[#f1f5f9]">
                <div className="relative group">
                  {user?.avatar_url
                    ? <img src={user.avatar_url} alt="avatar" className="w-20 h-20 rounded-full object-cover ring-2 ring-[#e4e7ed]" />
                    : <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4cc61e] to-[#1a3fbf] flex items-center justify-center text-white text-3xl font-bold ring-2 ring-[#e4e7ed]">{user?.avatar}</div>
                  }
                  <button onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading}
                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    {avatarUploading
                      ? <Loader2 size={20} className="animate-spin text-white" />
                      : <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    }
                  </button>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f172a] mb-1">{user?.name}</p>
                  <p className="text-[11px] text-[#94a3b8] mb-2.5">{user?.email}</p>
                  <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileSelected} />
                  <button onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1a3fbf] border border-[#1a3fbf]/30 bg-[#eef2ff] hover:bg-[#dbe4ff] rounded-xl transition-colors disabled:opacity-50">
                    <Camera size={12} /> Change photo
                  </button>
                  <p className="text-[10px] text-[#94a3b8] mt-1.5">JPG, PNG or WebP · max 2MB</p>
                </div>
              </div>

              {cropSrc && (
                <AvatarCropModal
                  srcUrl={cropSrc}
                  uploading={avatarUploading}
                  onConfirm={uploadCroppedAvatar}
                  onClose={() => setCropSrc(null)}
                />
              )}
              <div className="space-y-4 max-w-md">
                {[
                  { label: 'Full Name',  key: 'name',     type: 'text' },
                  { label: 'Email',      key: 'email',    type: 'email' },
                  { label: 'Company',    key: 'company',  type: 'text' },
                  { label: 'Job Title',  key: 'jobTitle', type: 'text' },
                  { label: 'Timezone',   key: 'timezone', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <button onClick={saveProfile} disabled={saving}
                    className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors">
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  {saveMsg && <span className={`text-xs font-semibold ${saveMsg === 'Saved!' ? 'text-[#4cc61e]' : 'text-red-500'}`}>{saveMsg}</span>}
                </div>
              </div>
            </div>
          )}

          {/* ── Widget ──────────────────────────────────────────────────── */}
          {activeTab === 'widget' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Chat Widget</p>
              <p className="text-xs text-[#94a3b8] mb-4">Customise how your widget appears to visitors.</p>
              <div className="grid xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Widget Name</label>
                    <input value={widgetName} onChange={e => setWN(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Greeting Message</label>
                    <textarea value={widgetGreeting} onChange={e => setWG(e.target.value)} rows={2}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] resize-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-2">Widget Color</label>
                    <div className="flex gap-2">
                      {widgetColors.map(c => (
                        <button key={c} onClick={() => setWColor(c)}
                          className={`w-7 h-7 rounded-full transition-all ${widgetColor === c ? 'ring-2 ring-offset-2 ring-[#1a3fbf] scale-110' : 'hover:scale-105'}`}
                          style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Position</label>
                    <div className="flex gap-2">
                      {widgetPositions.map(p => (
                        <button key={p} onClick={() => setWPos(p)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-xl border-2 transition-all ${widgetPos === p ? 'border-[#1a3fbf] text-[#1a3fbf] bg-[#eef2ff]' : 'border-[#e4e7ed] text-[#64748b] hover:border-[#1a3fbf]/30'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-[#f1f5f9]">
                    <div>
                      <p className="text-xs font-semibold text-[#0f172a]">Show online status</p>
                      <p className="text-[10px] text-[#94a3b8]">Display "We're online" badge</p>
                    </div>
                    <button onClick={() => setWO(!widgetOnline)}
                      className={`w-9 h-5 rounded-full relative transition-colors ${widgetOnline ? 'bg-[#4cc61e]' : 'bg-[#e4e7ed]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${widgetOnline ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={saveWidget} disabled={widgetSaving}
                      className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors">
                      {widgetSaving ? 'Saving…' : 'Save widget'}
                    </button>
                    {widgetSaved && <span className="text-xs font-semibold text-[#4cc61e]">Saved!</span>}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-3">Preview</p>
                  <div className="relative bg-[#f1f5f9] rounded-2xl h-72 overflow-hidden border border-[#e4e7ed]">
                    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                      <div className="bg-white rounded-2xl shadow-xl w-60 overflow-hidden border border-[#e4e7ed]">
                        <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: widgetColor }}>
                          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">{widgetName[0]}</div>
                          <div>
                            <p className="text-xs font-bold text-white">{widgetName}</p>
                            {widgetOnline && (
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4cc61e] animate-pulse" />
                                <span className="text-[9px] text-white/80">Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="bg-[#f8fafc] rounded-xl p-2.5 mb-2">
                            <p className="text-[10px] text-[#475569]">{widgetGreeting}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <input placeholder="Type a message…" className="flex-1 px-2 py-1.5 text-[10px] rounded-lg border border-[#e4e7ed] focus:outline-none bg-white" />
                            <button className="p-1.5 rounded-lg text-white text-[10px]" style={{ background: widgetColor }}>→</button>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white font-bold text-xs" style={{ background: widgetColor }}>Chat</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">Install snippet</p>
                      <button onClick={copySnippet}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all"
                        style={copied ? { borderColor: '#4cc61e', color: '#4cc61e', background: '#f0fdf4' } : { borderColor: '#e4e7ed', color: '#475569', background: '#f8fafc' }}>
                        {copied ? <Check size={11} /> : <Code size={11} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-[#0f172a] rounded-xl p-3 text-[10px] font-mono text-[#4cc61e] overflow-x-auto whitespace-pre">
                      {snippetText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Notification Preferences</p>
              <div className="space-y-0 divide-y divide-[#f8fafc] max-w-lg">
                {Object.keys(notifs).map(label => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-xs text-[#475569]">{label}</span>
                    <button onClick={() => setNotifs(n => ({ ...n, [label]: !n[label] }))}
                      className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${notifs[label] ? 'bg-[#1a3fbf]' : 'bg-[#e4e7ed]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${notifs[label] ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={saveNotifs} disabled={notifSaving}
                  className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors">
                  {notifSaving ? 'Saving…' : 'Save preferences'}
                </button>
                {notifSaved && <span className="text-xs font-semibold text-[#4cc61e]">Saved!</span>}
              </div>
            </div>
          )}

          {/* ── Security ─────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Security</p>
              <div className="space-y-3 max-w-md">

                {/* Change password */}
                <div className="rounded-xl border border-[#e4e7ed] overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">Change password</p>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">Update your login password</p>
                    </div>
                    <button onClick={() => { setChangePwOpen(o => !o); setPwMsg({ text: '', ok: false }) }}
                      className="text-xs font-semibold text-[#1a3fbf] hover:underline">
                      {changePwOpen ? 'Cancel' : 'Update →'}
                    </button>
                  </div>
                  {changePwOpen && (
                    <form onSubmit={changePassword} className="px-4 pb-4 space-y-3 border-t border-[#f1f5f9]">
                      <div className="pt-3 relative">
                        <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">Current password</label>
                        <div className="relative">
                          <input type={showCur ? 'text' : 'password'} value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} required
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] pr-10 transition-colors" />
                          <button type="button" onClick={() => setShowCur(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            {showCur ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">New password</label>
                        <div className="relative">
                          <input type={showNew ? 'text' : 'password'} value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} required
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] pr-10 transition-colors" />
                          <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1">Confirm new password</label>
                        <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                      </div>
                      {pwMsg.text && <p className={`text-xs font-semibold ${pwMsg.ok ? 'text-[#4cc61e]' : 'text-red-500'}`}>{pwMsg.text}</p>}
                      <button type="submit" disabled={pwLoading}
                        className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors">
                        {pwLoading ? 'Saving…' : 'Update password'}
                      </button>
                    </form>
                  )}
                </div>

                {/* 2FA */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#e4e7ed]">
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Two-factor authentication</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">Coming soon — extra layer of security</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#94a3b8] bg-[#f1f5f9] px-2 py-1 rounded-full">Soon</span>
                </div>

                {/* Revoke all */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#e4e7ed]">
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Active sessions</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">Sign out of all devices</p>
                  </div>
                  <button onClick={revokeAll} className="text-xs font-semibold text-amber-600 hover:underline">
                    Revoke all →
                  </button>
                </div>

                {/* Delete account */}
                <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
                  <div className="p-4">
                    <p className="text-xs font-bold text-red-700 mb-0.5">Delete account</p>
                    <p className="text-[10px] text-red-400 mb-2">Permanently deletes your account and all data.</p>
                    <button onClick={() => setDeleteOpen(o => !o)} className="text-xs font-semibold text-red-600 hover:underline">
                      {deleteOpen ? 'Cancel' : 'Delete my account →'}
                    </button>
                  </div>
                  {deleteOpen && (
                    <div className="px-4 pb-4 border-t border-red-200 space-y-2">
                      <p className="text-[10px] text-red-600 pt-3 font-semibold">Enter your password to confirm deletion:</p>
                      <input type="password" value={deletePass} onChange={e => setDeletePass(e.target.value)} placeholder="Your password"
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-red-300 focus:outline-none focus:border-red-500 transition-colors" />
                      {deleteMsg && <p className="text-[10px] text-red-600 font-semibold">{deleteMsg}</p>}
                      <button onClick={deleteAccount} disabled={deleteLoading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors">
                        {deleteLoading ? 'Deleting…' : 'Permanently delete'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance ───────────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Appearance</p>
              <div className="space-y-5 max-w-sm">
                <div>
                  <p className="text-xs font-semibold text-[#0f172a] mb-2">Theme</p>
                  <div className="flex gap-2">
                    {['Light', 'Dark', 'System'].map(t => (
                      <button key={t} onClick={() => applyTheme(t)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${theme === t ? 'border-[#1a3fbf] text-[#1a3fbf] bg-[#eef2ff]' : 'border-[#e4e7ed] text-[#64748b] hover:border-[#1a3fbf]/30'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  {theme !== 'Light' && (
                    <p className="text-[10px] text-[#94a3b8] mt-2">
                      {theme === 'Dark' ? 'Dark mode applied. Full dark theme coming in the next update.' : 'Uses your system preference.'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0f172a] mb-2">Density</p>
                  <div className="flex gap-2">
                    {['Compact', 'Default', 'Comfortable'].map(d => (
                      <button key={d} onClick={() => applyDensity(d)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${density === d ? 'border-[#1a3fbf] text-[#1a3fbf] bg-[#eef2ff]' : 'border-[#e4e7ed] text-[#64748b] hover:border-[#1a3fbf]/30'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0f172a] mb-2">Language</p>
                  <LanguagePicker placement="down" />
                </div>
              </div>
            </div>
          )}

          {/* ── Billing ──────────────────────────────────────────────────── */}
          {activeTab === 'billing' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Billing & Plan</p>
              <div className="max-w-md space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a3fbf]/5 to-[#4cc61e]/5 border border-[#1a3fbf]/15">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">{billing?.plan ? billing.plan.charAt(0).toUpperCase() + billing.plan.slice(1) + ' Plan' : 'Free Plan'}</p>
                      <p className="text-xs text-[#94a3b8]">{billing?.agent_count ?? 1} agent{(billing?.agent_count ?? 1) !== 1 ? 's' : ''} · {billing?.limit ?? 100} conversations / month</p>
                    </div>
                    <a href="/pricing" className="px-3 py-2 bg-[#4cc61e] hover:bg-[#3aaa10] text-white text-xs font-bold rounded-xl transition-colors">Upgrade →</a>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-[#94a3b8]">Conversations used</span>
                      <span className="font-semibold text-[#0f172a]">{billing?.used ?? 0} / {billing?.limit ?? 100}</span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#1a3fbf] transition-all" style={{ width: `${Math.min(100, ((billing?.used ?? 0) / (billing?.limit ?? 100)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wide mb-2">Pro Plan – $49/mo</p>
                  <div className="space-y-1.5">
                    {['Up to 10 agents', '5,000 conversations / month', 'AI reply suggestions', 'All integrations', 'Priority support', 'Custom branding'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <span className="text-[#4cc61e] font-bold text-xs">+</span>{f}
                      </div>
                    ))}
                  </div>
                  <a href="/pricing" className="mt-4 block text-center w-full py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-xl transition-colors">
                    Upgrade to Pro
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── Developers ───────────────────────────────────────────────── */}
          {activeTab === 'developers' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Developer Settings</p>
              <p className="text-xs text-[#94a3b8] mb-4">API access and webhook configuration for your workspace.</p>
              <div className="space-y-5 max-w-lg">

                {/* API Key */}
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Workspace API Key</p>
                  <div className="flex items-center gap-2">
                    <input readOnly value={apiKeyVisible ? apiKey : maskedKey}
                      className="flex-1 px-3 py-2.5 text-xs font-mono rounded-xl border border-[#e4e7ed] bg-[#f8fafc] text-[#64748b]" />
                    <button onClick={() => setApiKeyVis(v => !v)}
                      className="px-3 py-2.5 text-xs font-semibold text-[#1a3fbf] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors flex items-center gap-1">
                      {apiKeyVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                      {apiKeyVisible ? 'Hide' : 'Reveal'}
                    </button>
                    <button onClick={regenerateKey} disabled={apiKeyLoading}
                      className="px-3 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors disabled:opacity-50">
                      {apiKeyLoading ? '…' : 'Regenerate'}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] mt-1">Keep this secret — it grants full API access to your workspace.</p>
                </div>

                {/* Webhook */}
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Webhook URL</p>
                  <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://yourapp.com/webhook"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  <p className="text-[10px] text-[#94a3b8] mt-1">We'll POST events to this URL when conversations are created, updated, or resolved.</p>
                </div>

                {/* Events */}
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-2">Events to send</p>
                  {ALL_EVENTS.map(ev => (
                    <div key={ev} className="flex items-center justify-between py-2.5 border-b border-[#f8fafc]">
                      <span className="text-xs font-mono text-[#475569]">{ev}</span>
                      <button onClick={() => setWHEvents(e => ({ ...e, [ev]: !e[ev] }))}
                        className={`w-9 h-5 rounded-full relative transition-colors ${webhookEvents[ev] ? 'bg-[#1a3fbf]' : 'bg-[#e4e7ed]'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${webhookEvents[ev] ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={saveDevSettings} disabled={devLoading}
                    className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors">
                    {devLoading ? 'Saving…' : 'Save'}
                  </button>
                  {devSaved && <span className="text-xs font-semibold text-[#4cc61e]">Saved!</span>}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
