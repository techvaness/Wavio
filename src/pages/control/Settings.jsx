import { useState, useEffect, useCallback } from 'react'
import { Globe, Layers, Shield, AlertTriangle, Save, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/client'

const PLAN_KEYS = ['starter', 'pro', 'enterprise']
const PLAN_COLORS = { starter: '#64748b', pro: '#1a3fbf', enterprise: '#8b5cf6' }

const FLAG_META = [
  { key: 'ai_suggestions',       label: 'AI Reply Suggestions',     desc: 'GPT-powered one-click reply drafts',          plans: ['Pro', 'Enterprise'] },
  { key: 'omnichannel_whatsapp', label: 'WhatsApp Business API',    desc: 'Connect official WhatsApp Business account',  plans: ['All'] },
  { key: 'bot_builder',          label: 'No-code Bot Builder',      desc: 'Drag-and-drop chatbot automation',            plans: ['Pro', 'Enterprise'] },
  { key: 'live_translate',       label: 'Live Translation',         desc: 'Real-time AI translation in conversations',   plans: ['Enterprise'] },
  { key: 'custom_reports',       label: 'Custom Analytics Reports', desc: 'Build and export custom dashboards',          plans: ['Enterprise'] },
  { key: 'sso',                  label: 'SSO / SAML',               desc: 'Single sign-on for enterprise workspaces',    plans: ['Enterprise'] },
  { key: 'api_v2',               label: 'API v2 (Beta)',            desc: 'New REST API with webhooks and events',        plans: ['All'] },
]

const tabs = [
  { id: 'general',  label: 'General',       icon: Globe },
  { id: 'plans',    label: 'Plans',         icon: Layers },
  { id: 'features', label: 'Feature Flags', icon: Shield },
  { id: 'danger',   label: 'Danger Zone',   icon: AlertTriangle },
]

export default function ControlSettings() {
  const [activeTab, setActiveTab] = useState('general')

  // General
  const [general, setGeneral]         = useState({ platform_name: 'Wavio', support_email: '', platform_url: '', maintenance_mode: false })
  const [generalSaving, setGSaving]   = useState(false)
  const [generalSaved, setGSaved]     = useState(false)

  // Plans
  const [planConfig, setPlanConfig]   = useState({})
  const [planSaving, setPSaving]      = useState(false)
  const [planSaved, setPSaved]        = useState(false)

  // Feature flags
  const [flags, setFlags]             = useState({})
  const [flagSaving, setFlagSaving]   = useState(null)

  const loadGeneral = useCallback(async () => {
    try { setGeneral(await adminApi.getGeneralSettings()) } catch {}
  }, [])

  const loadPlans = useCallback(async () => {
    try { setPlanConfig(await adminApi.getPlanConfig()) } catch {}
  }, [])

  const loadFlags = useCallback(async () => {
    try { setFlags(await adminApi.getFeatureFlags()) } catch {}
  }, [])

  useEffect(() => {
    if (activeTab === 'general')  loadGeneral()
    if (activeTab === 'plans')    loadPlans()
    if (activeTab === 'features') loadFlags()
  }, [activeTab, loadGeneral, loadPlans, loadFlags])

  const saveGeneral = async () => {
    setGSaving(true)
    try {
      await adminApi.saveGeneralSettings(general)
      setGSaved(true)
      setTimeout(() => setGSaved(false), 2000)
    } catch {}
    setGSaving(false)
  }

  const savePlans = async () => {
    setPSaving(true)
    try {
      await adminApi.savePlanConfig(planConfig)
      setPSaved(true)
      setTimeout(() => setPSaved(false), 2000)
    } catch {}
    setPSaving(false)
  }

  const toggleFlag = async (key) => {
    const next = { ...flags, [key]: !flags[key] }
    setFlags(next)
    setFlagSaving(key)
    try { await adminApi.saveFeatureFlags(next) } catch {}
    setFlagSaving(null)
  }

  const updatePlan = (planKey, field, rawVal) => {
    const val = rawVal === '' ? '' : Number(rawVal)
    setPlanConfig(prev => ({
      ...prev,
      [planKey]: { ...(prev[planKey] || {}), [field]: val },
    }))
  }

  return (
    <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Platform Settings</h1>
        <p className="text-xs text-[#64748b] mt-0.5">Global configuration for all Wavio workspaces.</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                  activeTab === id
                    ? id === 'danger' ? 'bg-red-50 text-red-600' : 'bg-[#eef2ff] text-[#1a3fbf]'
                    : id === 'danger' ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'
                }`}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-[#e4e7ed] p-5 min-h-[500px]">

          {/* ── General ── */}
          {activeTab === 'general' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-4">General Configuration</p>
              <div className="space-y-4 max-w-md">
                {[
                  { label: 'Platform Name', key: 'platform_name', type: 'text' },
                  { label: 'Support Email', key: 'support_email', type: 'email' },
                  { label: 'Platform URL',  key: 'platform_url',  type: 'url' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-[#475569] uppercase tracking-wide mb-1.5">{label}</label>
                    <input type={type} value={general[key] || ''}
                      onChange={(e) => setGeneral(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e4e7ed] focus:outline-none focus:border-[#1a3fbf] transition-colors" />
                  </div>
                ))}

                <div className="flex items-center justify-between py-3 border-t border-[#f1f5f9]">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Maintenance Mode</p>
                    <p className="text-xs text-[#94a3b8]">Shows a maintenance page to all users</p>
                  </div>
                  <button onClick={() => setGeneral(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${general.maintenance_mode ? 'bg-red-500' : 'bg-[#e4e7ed]'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${general.maintenance_mode ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>

                <button onClick={saveGeneral} disabled={generalSaving}
                  className={`flex items-center gap-2 px-4 py-2.5 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60 ${generalSaved ? 'bg-emerald-500' : 'bg-[#1a3fbf] hover:bg-[#2e5de6]'}`}>
                  {generalSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {generalSaved ? 'Saved' : 'Save changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── Plans ── */}
          {activeTab === 'plans' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Plan Configuration</p>
              <p className="text-xs text-[#94a3b8] mb-4">Set pricing and limits per plan. Use -1 for unlimited.</p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e4e7ed]">
                      <th className="text-left py-2 pr-4 text-xs font-bold text-[#64748b] w-44">Field</th>
                      {PLAN_KEYS.map((p) => (
                        <th key={p} className="text-center py-2 px-3 text-xs font-bold capitalize" style={{ color: PLAN_COLORS[p] }}>
                          {planConfig[p]?.name || p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {[
                      { label: 'Plan name',           field: 'name',               isText: true },
                      { label: 'Price / month ($)',    field: 'price' },
                      { label: 'Conversation limit',  field: 'conversation_limit' },
                      { label: 'Seat limit',          field: 'seat_limit' },
                    ].map(({ label, field, isText }) => (
                      <tr key={field} className="hover:bg-[#f8fafc]">
                        <td className="py-3 pr-4 text-xs text-[#475569] font-medium">{label}</td>
                        {PLAN_KEYS.map((p) => (
                          <td key={p} className="py-3 px-3 text-center">
                            <input
                              type={isText ? 'text' : 'number'}
                              value={planConfig[p]?.[field] ?? ''}
                              onChange={(e) => {
                                if (isText) {
                                  setPlanConfig(prev => ({ ...prev, [p]: { ...(prev[p] || {}), [field]: e.target.value } }))
                                } else {
                                  updatePlan(p, field, e.target.value)
                                }
                              }}
                              className="w-24 text-xs text-center border border-[#e4e7ed] rounded-lg py-1.5 focus:outline-none focus:border-[#1a3fbf]" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-[#94a3b8] mt-2">-1 = unlimited seats / conversations</p>

              <button onClick={savePlans} disabled={planSaving}
                className={`mt-4 flex items-center gap-2 px-4 py-2.5 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60 ${planSaved ? 'bg-emerald-500' : 'bg-[#1a3fbf] hover:bg-[#2e5de6]'}`}>
                {planSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                {planSaved ? 'Saved' : 'Save plan limits'}
              </button>
            </div>
          )}

          {/* ── Feature Flags ── */}
          {activeTab === 'features' && (
            <div>
              <p className="text-sm font-bold text-[#0f172a] mb-1">Feature Flags</p>
              <p className="text-xs text-[#94a3b8] mb-4">Toggle features platform-wide. Changes save automatically.</p>
              <div className="space-y-3">
                {FLAG_META.map((f) => (
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
                    <button onClick={() => toggleFlag(f.key)} disabled={flagSaving === f.key}
                      className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 disabled:opacity-60 ${flags[f.key] ? 'bg-[#4cc61e]' : 'bg-[#e4e7ed]'}`}>
                      {flagSaving === f.key
                        ? <Loader2 size={10} className="absolute inset-0 m-auto animate-spin text-white" />
                        : <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${flags[f.key] ? 'left-5' : 'left-1'}`} />
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Danger Zone ── */}
          {activeTab === 'danger' && (
            <div>
              <p className="text-sm font-bold text-red-600 mb-4">Danger Zone</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50">
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Maintenance Mode</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">Redirect all users to a maintenance page. Toggle in General settings.</p>
                  </div>
                  <button onClick={() => setActiveTab('general')}
                    className="px-3 py-2 text-xs font-bold rounded-lg border border-amber-200 bg-white text-amber-700 hover:bg-amber-100 transition-colors flex-shrink-0 ml-4">
                    Go to General
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#e4e7ed]">
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Purge All Sessions</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">Forces every user to log in again. Rotate the JWT_SECRET environment variable to achieve this.</p>
                  </div>
                  <span className="px-3 py-2 text-xs font-bold text-[#94a3b8] flex-shrink-0 ml-4">Via env var</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
