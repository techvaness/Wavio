import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Inbox, MessageSquare, Users, UserCircle,
  BarChart2, Zap, Settings, LogOut, Menu, X, Bell,
  ChevronDown, Search, Circle,
} from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',     to: '/portal',                badge: null },
    ],
  },
  {
    label: 'Conversations',
    items: [
      { icon: Inbox,           label: 'Inbox',          to: '/portal/inbox',          badge: 5 },
      { icon: MessageSquare,   label: 'All Conversations',to: '/portal/conversations', badge: null },
      { icon: UserCircle,      label: 'Contacts',       to: '/portal/contacts',       badge: null },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { icon: Users,           label: 'Team',           to: '/portal/team',           badge: null },
      { icon: Zap,             label: 'Automation',     to: '/portal/automation',     badge: null },
    ],
  },
  {
    label: 'Insights',
    items: [
      { icon: BarChart2,       label: 'Reports',        to: '/portal/reports',        badge: null },
    ],
  },
  {
    label: 'Configure',
    items: [
      { icon: Settings,        label: 'Settings',       to: '/portal/settings',       badge: null },
    ],
  },
]

const statusOptions = [
  { label: 'Online',  value: 'online',  color: 'bg-emerald-500' },
  { label: 'Busy',    value: 'busy',    color: 'bg-amber-400' },
  { label: 'Offline', value: 'offline', color: 'bg-gray-300' },
]

export default function PortalLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [status, setStatus] = useState('online')
  const [statusMenu, setStatusMenu] = useState(false)

  const currentStatus = statusOptions.find(s => s.value === status)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8fafc' }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-56 bg-white border-r border-[#e4e7ed] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo + close */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#e4e7ed]">
          <Logo height={32} />
          <button className="lg:hidden text-[#94a3b8]" onClick={() => setSidebarOpen(false)}><X size={16} /></button>
        </div>

        {/* Workspace switcher */}
        <div className="px-3 py-2.5 border-b border-[#e4e7ed]">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer transition-colors border border-[#e4e7ed]">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {user?.name?.[0] ?? 'W'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#0f172a] truncate">My Workspace</p>
              <p className="text-[9px] text-[#94a3b8]">Free plan</p>
            </div>
            <ChevronDown size={12} className="text-[#94a3b8]" />
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[#e4e7ed]">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#f8fafc] border border-[#e4e7ed]">
            <Search size={11} className="text-[#94a3b8]" />
            <input placeholder="Search…" className="flex-1 bg-transparent text-xs text-[#475569] placeholder-[#cbd5e1] focus:outline-none" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">{group.label}</p>
              {group.items.map(({ icon: Icon, label, to, badge }) => (
                <NavLink key={to} to={to} end={to === '/portal'} onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all mb-0.5 ${
                      isActive ? 'bg-[#eef2ff] text-[#1a3fbf]' : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={14} className={isActive ? 'text-[#1a3fbf]' : 'text-[#94a3b8]'} />
                      <span className="flex-1">{label}</span>
                      {badge && <span className="text-[9px] font-bold bg-[#1a3fbf] text-white px-1.5 py-0.5 rounded-full">{badge}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Upgrade */}
        <div className="px-3 py-2.5 border-t border-[#e4e7ed]">
          <div className="rounded-xl bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] p-3 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={12} className="text-[#4cc61e]" />
              <span className="text-[11px] font-bold">Upgrade to Pro</span>
            </div>
            <p className="text-[9px] text-white/60 mb-2">AI replies, unlimited agents & more.</p>
            <button className="w-full text-[10px] font-bold bg-[#4cc61e] hover:bg-[#3aaa10] text-white py-1.5 rounded-lg transition-colors">View plans</button>
          </div>
        </div>

        {/* User status + logout */}
        <div className="px-3 py-3 border-t border-[#e4e7ed] relative">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4cc61e] to-[#1a3fbf] flex items-center justify-center text-white text-xs font-bold">
                {user?.avatar ?? '?'}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${currentStatus.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#0f172a] truncate">{user?.name}</p>
              <button onClick={() => setStatusMenu(!statusMenu)}
                className="flex items-center gap-1 text-[9px] text-[#64748b] hover:text-[#0f172a] transition-colors">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.color}`} />
                {currentStatus.label}
                <ChevronDown size={9} />
              </button>
            </div>
            <button onClick={handleLogout} className="text-[#94a3b8] hover:text-red-500 transition-colors"><LogOut size={14} /></button>
          </div>

          <AnimatePresence>
            {statusMenu && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-[#e4e7ed] rounded-xl shadow-lg overflow-hidden z-50">
                {statusOptions.map((s) => (
                  <button key={s.value} onClick={() => { setStatus(s.value); setStatusMenu(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium hover:bg-[#f8fafc] transition-colors ${status === s.value ? 'text-[#1a3fbf]' : 'text-[#475569]'}`}>
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e4e7ed] flex-shrink-0">
          <button className="lg:hidden text-[#475569]" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4cc61e] to-[#1a3fbf] flex items-center justify-center text-white text-[10px] font-bold">
              {user?.avatar ?? '?'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
