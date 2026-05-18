import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Bell, Shield, Palette, CreditCard, MessageSquare, Globe, Code, Check } from 'lucide-react'
import LanguagePicker from '../../components/LanguagePicker'

const tabs = [
  { id:'profile',      label:'Profile',         icon:User },
  { id:'widget',       label:'Chat Widget',     icon:MessageSquare },
  { id:'notifications',label:'Notifications',   icon:Bell },
  { id:'security',     label:'Security',        icon:Shield },
  { id:'appearance',   label:'Appearance',      icon:Palette },
  { id:'billing',      label:'Billing',         icon:CreditCard },
  { id:'developers',   label:'Developers',      icon:Code },
]

const widgetPositions = ['Bottom Right', 'Bottom Left']
const widgetColors    = ['#1a3fbf','#4cc61e','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#0f172a']

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm]           = useState({ name: user?.name ?? '', email: user?.email ?? '', company: 'Acme Corp', timezone: 'Europe/London', jobTitle: 'Support Lead' })
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')
  const [widgetColor, setWColor]  = useState('#1a3fbf')
  const [widgetPos, setWPos]      = useState('Bottom Right')
  const [widgetGreeting, setWG]   = useState("Hi there 👋 How can we help?")
  const [widgetName, setWN]       = useState('Support')
  const [widgetOnline, setWO]     = useState(true)

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Settings</h1>
        <p className="text-xs text-[#64748b] mt-0.5">Manage your profile and workspace preferences.</p>
      </div>

      <div className="flex gap-5">
        {/* Tab list */}
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

          {activeTab === 'profile' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Profile Information</p>
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#f1f5f9]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4cc61e] to-[#1a3fbf] flex items-center justify-center text-white text-2xl font-bold">{user?.avatar}</div>
                <div>
                  <button className="text-xs font-bold text-[#1a3fbf] hover:underline">Change photo</button>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">JPG or PNG, max 2MB</p>
                </div>
              </div>
              <div className="space-y-4 max-w-md">
                {[
                  { label:'Full Name',  key:'name',     type:'text' },
                  { label:'Email',      key:'email',    type:'email' },
                  { label:'Company',    key:'company',  type:'text' },
                  { label:'Job Title',  key:'jobTitle', type:'text' },
                  { label:'Timezone',   key:'timezone', type:'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      setSaving(true); setSaveMsg('')
                      try {
                        await updateProfile({ name: form.name })
                        setSaveMsg('Saved!')
                        setTimeout(() => setSaveMsg(''), 3000)
                      } catch (e) {
                        setSaveMsg(e.message || 'Save failed')
                      } finally { setSaving(false) }
                    }}
                    className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors"
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  {saveMsg && (
                    <span className={`text-xs font-semibold ${saveMsg === 'Saved!' ? 'text-[#4cc61e]' : 'text-red-500'}`}>
                      {saveMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'widget' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Chat Widget</p>
              <p className="text-xs text-[#94a3b8] mb-4">Customise how your widget appears to visitors.</p>
              <div className="grid xl:grid-cols-2 gap-6">
                {/* Config */}
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
                  <button className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-xl transition-colors">Save widget</button>
                </div>

                {/* Preview */}
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-3">Preview</p>
                  <div className="relative bg-[#f1f5f9] rounded-2xl h-72 overflow-hidden border border-[#e4e7ed]">
                    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                      {/* Bubble */}
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
                      {/* FAB */}
                      <div className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white text-xl" style={{ background: widgetColor }}>
                        💬
                      </div>
                    </div>
                  </div>

                  {/* Embed snippet */}
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Install snippet</p>
                    <div className="bg-[#0f172a] rounded-xl p-3 text-[10px] font-mono text-[#4cc61e] overflow-x-auto">
                      {`<script src="https://cdn.wavio.com/widget.js"\n  data-key="YOUR_WORKSPACE_KEY"\n  data-color="${widgetColor}"\n  async>\n</script>`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Notification Preferences</p>
              <div className="space-y-0 divide-y divide-[#f8fafc]">
                {[
                  ['New conversation assigned to me',     true],
                  ['Customer reply in my conversations',  true],
                  ['Conversation resolved',               false],
                  ['AI suggestion available',             true],
                  ['New team mention in note',            true],
                  ['SLA breach warning',                  true],
                  ['Weekly digest summary',               false],
                  ['New contact created',                 false],
                ].map(([label, on]) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-xs text-[#475569]">{label}</span>
                    <button className={`w-9 h-5 rounded-full transition-colors relative ${on ? 'bg-[#1a3fbf]' : 'bg-[#e4e7ed]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Security</p>
              <div className="space-y-3 max-w-md">
                {[
                  { title:'Change password',         desc:'Last changed 30 days ago', btn:'Update', btnStyle:'text-[#1a3fbf] font-semibold hover:underline text-xs' },
                  { title:'Two-factor authentication',desc:'Add an extra layer of security',btn:'Enable 2FA',btnStyle:'text-[#1a3fbf] font-semibold hover:underline text-xs' },
                  { title:'Active sessions',          desc:'You are logged in on 1 device',btn:'Revoke all',btnStyle:'text-amber-600 font-semibold hover:underline text-xs' },
                ].map(({ title, desc, btn, btnStyle }) => (
                  <div key={title} className="flex items-center justify-between p-4 rounded-xl border border-[#e4e7ed]">
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">{title}</p>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">{desc}</p>
                    </div>
                    <button className={btnStyle}>{btn} →</button>
                  </div>
                ))}
                <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                  <p className="text-xs font-bold text-red-700 mb-0.5">Delete account</p>
                  <p className="text-[10px] text-red-400 mb-2">Permanently deletes your account and all data.</p>
                  <button className="text-xs font-semibold text-red-600 hover:underline">Delete my account →</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Appearance</p>
              <div className="space-y-4 max-w-sm">
                <div>
                  <p className="text-xs font-semibold text-[#0f172a] mb-2">Theme</p>
                  <div className="flex gap-2">
                    {['Light','Dark','System'].map(t => (
                      <button key={t} className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${t === 'Light' ? 'border-[#1a3fbf] text-[#1a3fbf] bg-[#eef2ff]' : 'border-[#e4e7ed] text-[#64748b] hover:border-[#1a3fbf]/30'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0f172a] mb-2">Density</p>
                  <div className="flex gap-2">
                    {['Compact','Default','Comfortable'].map(d => (
                      <button key={d} className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${d === 'Default' ? 'border-[#1a3fbf] text-[#1a3fbf] bg-[#eef2ff]' : 'border-[#e4e7ed] text-[#64748b] hover:border-[#1a3fbf]/30'}`}>{d}</button>
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

          {activeTab === 'billing' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Billing & Plan</p>
              <div className="max-w-md space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a3fbf]/5 to-[#4cc61e]/5 border border-[#1a3fbf]/15">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">Free Plan</p>
                      <p className="text-xs text-[#94a3b8]">1 agent · 100 conversations / month</p>
                    </div>
                    <button className="px-3 py-2 bg-[#4cc61e] hover:bg-[#3aaa10] text-white text-xs font-bold rounded-xl transition-colors">Upgrade →</button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#94a3b8]">Conversations used</span>
                        <span className="font-semibold text-[#0f172a]">31 / 100</span>
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#1a3fbf]" style={{ width: '31%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wide mb-2">Pro Plan – $49/mo</p>
                  <div className="space-y-1.5">
                    {['Up to 10 agents','5,000 conversations / month','AI reply suggestions','All integrations','Priority support','Custom branding'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <span className="text-[#4cc61e] font-bold">✓</span>{f}
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-xl transition-colors">Upgrade to Pro</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'developers' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Developer Settings</p>
              <p className="text-xs text-[#94a3b8] mb-4">API access and webhook configuration for your workspace.</p>
              <div className="space-y-4 max-w-lg">
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Workspace API Key</p>
                  <div className="flex items-center gap-2">
                    <input readOnly value="wv_live_••••••••••••••••4a2f"
                      className="flex-1 px-3 py-2.5 text-xs font-mono rounded-xl border border-[#e4e7ed] bg-[#f8fafc] text-[#64748b]" />
                    <button className="px-3 py-2.5 text-xs font-semibold text-[#1a3fbf] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors">Reveal</button>
                    <button className="px-3 py-2.5 text-xs font-semibold text-[#475569] border border-[#e4e7ed] hover:bg-[#f8fafc] rounded-xl transition-colors">Regenerate</button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">Webhook URL</p>
                  <input placeholder="https://yourapp.com/webhook"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  <p className="text-[10px] text-[#94a3b8] mt-1">We'll POST events to this URL when conversations are created, updated, or resolved.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-2">Events to send</p>
                  {['conversation.created','conversation.resolved','message.received','contact.created'].map(ev => (
                    <div key={ev} className="flex items-center justify-between py-2 border-b border-[#f8fafc]">
                      <span className="text-xs font-mono text-[#475569]">{ev}</span>
                      <button className="w-8 h-5 rounded-full bg-[#1a3fbf] relative">
                        <span className="absolute top-0.5 left-4 w-4 h-4 rounded-full bg-white shadow" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-xl transition-colors">Save</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
