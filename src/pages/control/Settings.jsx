import { useState } from 'react'
import { Globe, Shield, Bell, Key, Database, Layers, Webhook, AlertTriangle } from 'lucide-react'

const tabs = [
  { id: 'general',    label: 'General',       icon: Globe },
  { id: 'plans',      label: 'Plans',         icon: Layers },
  { id: 'features',   label: 'Feature Flags', icon: Zap },
  { id: 'security',   label: 'Security',      icon: Shield },
  { id: 'api',        label: 'API Keys',      icon: Key },
  { id: 'webhooks',   label: 'Webhooks',      icon: Webhook },
  { id: 'danger',     label: 'Danger Zone',   icon: AlertTriangle },
]

import { Zap } from 'lucide-react'

const planLimits = [
  {
    name: 'Free',  color: '#64748b',
    limits: [
      { feature: 'Agent seats',           value: 1,        type: 'number' },
      { feature: 'Conversations / month', value: 100,      type: 'number' },
      { feature: 'AI reply suggestions',  value: false,    type: 'bool' },
      { feature: 'Integrations',          value: 2,        type: 'number' },
      { feature: 'Custom branding',       value: false,    type: 'bool' },
      { feature: 'Analytics',             value: 'Basic',  type: 'text' },
    ],
  },
  {
    name: 'Pro',   color: '#1a3fbf',
    limits: [
      { feature: 'Agent seats',           value: 10,       type: 'number' },
      { feature: 'Conversations / month', value: 5000,     type: 'number' },
      { feature: 'AI reply suggestions',  value: true,     type: 'bool' },
      { feature: 'Integrations',          value: 20,       type: 'number' },
      { feature: 'Custom branding',       value: true,     type: 'bool' },
      { feature: 'Analytics',             value: 'Full',   type: 'text' },
    ],
  },
  {
    name: 'Enterprise', color: '#8b5cf6',
    limits: [
      { feature: 'Agent seats',           value: 'Unlimited', type: 'text' },
      { feature: 'Conversations / month', value: 'Unlimited', type: 'text' },
      { feature: 'AI reply suggestions',  value: true,        type: 'bool' },
      { feature: 'Integrations',          value: 'Unlimited', type: 'text' },
      { feature: 'Custom branding',       value: true,        type: 'bool' },
      { feature: 'Analytics',             value: 'Advanced',  type: 'text' },
    ],
  },
]

const featureFlags = [
  { key: 'ai_suggestions',      label: 'AI Reply Suggestions',      desc: 'GPT-powered one-click reply drafts',        on: true,  plans: ['Pro', 'Enterprise'] },
  { key: 'omnichannel_whatsapp',label: 'WhatsApp Business API',     desc: 'Connect official WhatsApp Business account', on: true,  plans: ['All'] },
  { key: 'bot_builder',         label: 'No-code Bot Builder',       desc: 'Drag-and-drop chatbot automation',           on: false, plans: ['Pro', 'Enterprise'] },
  { key: 'live_translate',      label: 'Live Translation',          desc: 'Real-time AI translation in conversations',  on: false, plans: ['Enterprise'] },
  { key: 'custom_reports',      label: 'Custom Analytics Reports',  desc: 'Build and export custom dashboards',         on: true,  plans: ['Enterprise'] },
  { key: 'sso',                 label: 'SSO / SAML',                desc: 'Single sign-on for enterprise workspaces',   on: false, plans: ['Enterprise'] },
  { key: 'api_v2',              label: 'API v2 (Beta)',             desc: 'New REST API with webhooks and events',       on: true,  plans: ['All'] },
]

const webhooks = [
  { url: 'https://hooks.stripe.com/...', events: ['billing.*'],           status: 'active',   lastDelivery: '2m ago' },
  { url: 'https://api.shopform.io/wh',  events: ['conversation.*'],       status: 'active',   lastDelivery: '5m ago' },
  { url: 'https://slack.com/services/…', events: ['user.suspended'],      status: 'failing',  lastDelivery: '1h ago' },
]

export default function ControlSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [flags, setFlags]         = useState(() => Object.fromEntries(featureFlags.map(f => [f.key, f.on])))
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Platform Settings</h1>
        <p className="text-xs text-[#64748b] mt-0.5">Global configuration for all Wavio workspaces.</p>
      </div>

      <div className="flex gap-5">
        {/* Tab list */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                  activeTab === id ? 'bg-[#eef2ff] text-[#1a3fbf]' : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'
                } ${id === 'danger' ? (activeTab === id ? '' : 'text-red-500 hover:text-red-600 hover:bg-red-50') : ''}`}>
                <Icon size={13} className={activeTab === id ? 'text-[#1a3fbf]' : id === 'danger' ? 'text-red-400' : 'text-[#94a3b8]'} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-[#e4e7ed] p-5 min-h-[500px]">

          {activeTab === 'general' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">General Configuration</p>
              <div className="space-y-4 max-w-md">
                {[
                  { label: 'Platform Name',    val: 'Wavio',           type: 'text' },
                  { label: 'Support Email',    val: 'support@wavio.com',type: 'email' },
                  { label: 'Platform URL',     val: 'https://wavio.com',type: 'url' },
                  { label: 'Default Timezone', val: 'UTC',              type: 'text' },
                  { label: 'Default Language', val: 'English (en)',     type: 'text' },
                ].map(({ label, val, type }) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">{label}</label>
                    <input type={type} defaultValue={val}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 border-t border-[#f1f5f9]">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Maintenance Mode</p>
                    <p className="text-xs text-[#94a3b8]">Shows maintenance page to all users</p>
                  </div>
                  <button onClick={() => setMaintenance(!maintenance)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${maintenance ? 'bg-red-500' : 'bg-[#e4e7ed]'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${maintenance ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
                <button className="px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-lg transition-colors">
                  Save changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Plan Configuration</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e4e7ed]">
                      <th className="text-left py-2 pr-4 text-xs font-bold text-[#64748b] w-48">Feature</th>
                      {planLimits.map(({ name, color }) => (
                        <th key={name} className="text-center py-2 px-3 text-xs font-bold" style={{ color }}>{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {planLimits[0].limits.map(({ feature }, fi) => (
                      <tr key={feature} className="hover:bg-[#f8fafc]">
                        <td className="py-3 pr-4 text-xs text-[#475569] font-medium">{feature}</td>
                        {planLimits.map(({ name, limits }) => {
                          const { value, type } = limits[fi]
                          return (
                            <td key={name} className="py-3 px-3 text-center">
                              {type === 'bool' ? (
                                <span className={`text-[10px] font-bold ${value ? 'text-emerald-600' : 'text-red-400'}`}>{value ? 'Yes' : 'No'}</span>
                              ) : type === 'number' ? (
                                <input type="number" defaultValue={value}
                                  className="w-20 text-xs text-center border border-[#e4e7ed] rounded-lg py-1 focus:outline-none focus:border-[#1a3fbf]" />
                              ) : (
                                <span className="text-xs font-semibold text-[#0f172a]">{value}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="mt-4 px-4 py-2.5 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-lg transition-colors">
                Save plan limits
              </button>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Feature Flags</p>
              <p className="text-xs text-[#94a3b8] mb-4">Toggle features platform-wide. Changes apply immediately.</p>
              <div className="space-y-3">
                {featureFlags.map((f) => (
                  <div key={f.key} className="flex items-start justify-between p-4 rounded-xl border border-[#e4e7ed] hover:border-[#1a3fbf]/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-bold text-[#0f172a]">{f.label}</p>
                        <div className="flex gap-1">
                          {f.plans.map((p) => (
                            <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[#64748b]">{p}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#94a3b8]">{f.desc}</p>
                    </div>
                    <button
                      onClick={() => setFlags(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
                      className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${flags[f.key] ? 'bg-[#4cc61e]' : 'bg-[#e4e7ed]'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${flags[f.key] ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Security Settings</p>
              <div className="space-y-3 max-w-md">
                {[
                  ['Enforce 2FA for all admin accounts', true],
                  ['IP allowlisting for admin panel', false],
                  ['Audit log retention (90 days)', true],
                  ['SSO enforcement for Enterprise accounts', false],
                  ['Rate limiting on public API', true],
                  ['Block known malicious IPs (Threat Intel)', true],
                ].map(([label, on]) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-[#f8fafc]">
                    <span className="text-xs text-[#475569]">{label}</span>
                    <button className={`w-9 h-5 rounded-full transition-colors relative ${on ? 'bg-[#1a3fbf]' : 'bg-[#e4e7ed]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Platform API Keys</p>
              <div className="space-y-3">
                {[
                  { name: 'Production API Key',  key: 'wv_live_••••••••••••••••4a2f', created: 'Jan 1, 2026',  scope: 'Full access' },
                  { name: 'Staging API Key',     key: 'wv_test_••••••••••••••••8b3c', created: 'Jan 1, 2026',  scope: 'Read-only' },
                  { name: 'Webhooks Secret',     key: 'wvwh_••••••••••••••••9d1e',   created: 'Feb 15, 2026', scope: 'Webhooks' },
                ].map(({ name, key, created, scope }) => (
                  <div key={name} className="flex items-center justify-between p-4 rounded-xl border border-[#e4e7ed]">
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">{name}</p>
                      <p className="text-[10px] font-mono text-[#64748b] mt-0.5">{key}</p>
                      <p className="text-[9px] text-[#94a3b8] mt-1">Created {created} · {scope}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-[11px] font-semibold text-[#1a3fbf] hover:underline">Reveal</button>
                      <button className="text-[11px] font-semibold text-red-500 hover:underline">Revoke</button>
                    </div>
                  </div>
                ))}
                <button className="px-4 py-2 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-lg transition-colors">
                  + Generate key
                </button>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">Webhook Endpoints</p>
              <div className="space-y-3">
                {webhooks.map((w, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${w.status === 'failing' ? 'border-red-200 bg-red-50' : 'border-[#e4e7ed]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-mono text-[#0f172a] truncate">{w.url}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {w.events.map((e) => (
                            <span key={e} className="text-[9px] font-mono bg-[#f1f5f9] text-[#64748b] px-1.5 py-0.5 rounded">{e}</span>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#94a3b8] mt-1.5">Last delivery: {w.lastDelivery}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${w.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {w.status}
                        </span>
                        <button className="text-[11px] font-semibold text-[#94a3b8] hover:text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="px-4 py-2 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white text-xs font-bold rounded-lg transition-colors">
                  + Add endpoint
                </button>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div>
              <p className="text-sm font-bold text-red-600 mb-4">Danger Zone</p>
              <div className="space-y-3">
                {[
                  { title: 'Enable Maintenance Mode',       desc: 'All users see a maintenance screen. API returns 503.',  btn: 'Enable maintenance', btnColor: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' },
                  { title: 'Purge All Session Tokens',      desc: 'Forces every user to log in again immediately.',        btn: 'Purge sessions',     btnColor: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' },
                  { title: 'Reset Platform Cache',          desc: 'Clears Redis cache. Causes brief latency spike.',       btn: 'Flush cache',        btnColor: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' },
                  { title: 'Export All Platform Data',      desc: 'Generates a full GDPR-compliant data export (SFTP).',   btn: 'Request export',     btnColor: 'border-[#e4e7ed] bg-white text-[#475569] hover:bg-[#f8fafc]' },
                ].map(({ title, desc, btn, btnColor }) => (
                  <div key={title} className="flex items-center justify-between p-4 rounded-xl border border-[#e4e7ed]">
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">{title}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">{desc}</p>
                    </div>
                    <button className={`px-3 py-2 text-xs font-bold rounded-lg border transition-colors flex-shrink-0 ml-4 ${btnColor}`}>{btn}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
