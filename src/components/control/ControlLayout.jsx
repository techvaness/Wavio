import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, CreditCard, MessageSquare,
  BarChart2, Activity, ScrollText, Settings, LogOut, Menu, X,
  Bell, Shield, ChevronDown, Search,
} from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    to: '/control' },
    ],
  },
  {
    label: 'Management',
    items: [
      { icon: Building2,       label: 'Accounts',     to: '/control/accounts' },
      { icon: Users,           label: 'Users',        to: '/control/users' },
      { icon: CreditCard,      label: 'Billing',      to: '/control/billing' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { icon: MessageSquare,   label: 'Conversations',to: '/control/conversations' },
      { icon: BarChart2,       label: 'Analytics',    to: '/control/analytics' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { icon: Activity,        label: 'System',       to: '/control/system' },
      { icon: ScrollText,      label: 'Audit Log',    to: '/control/audit' },
    ],
  },
  {
    label: 'Config',
    items: [
      { icon: Settings,        label: 'Settings',     to: '/control/settings' },
    ],
  },
]

export default function ControlLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: '#f1f5f9' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-56 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: '#0d1526', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Logo height={30} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">ADMIN</span>
            <button className="lg:hidden text-white/30 hover:text-white/60" onClick={() => setSidebarOpen(false)}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Search size={12} className="text-white/30" />
            <input
              placeholder="Quick search…"
              className="flex-1 bg-transparent text-xs text-white/60 placeholder-white/25 focus:outline-none"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-3">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[9px] font-bold uppercase tracking-widest text-white/25">{group.label}</p>
              {group.items.map(({ icon: Icon, label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/control'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all mb-0.5 ${
                      isActive ? 'text-white' : 'text-white/45 hover:text-white/75 hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) => isActive ? { background: 'rgba(255,255,255,0.1)' } : {}}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={14} className={isActive ? 'text-[#4cc61e]' : 'text-white/30'} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Live badge */}
        <div className="px-3 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(76,198,30,0.08)', border: '1px solid rgba(76,198,30,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cc61e] animate-pulse flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-[#4cc61e]">342 active chats</p>
              <p className="text-[9px] text-white/30">89 agents online</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="px-3 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0">
              {user?.avatar ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{user?.name}</p>
              <p className="text-[9px] text-white/30">Super Admin</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className="text-white/25 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e4e7ed] flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[#475569]" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 border border-red-100">
              <Shield size={11} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Admin Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#e4e7ed]">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">
                {user?.avatar ?? 'A'}
              </div>
              <span className="text-xs font-semibold text-[#0f172a]">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
