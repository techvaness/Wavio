import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

// Public layout components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CTABanner from './components/CTABanner'
import ScrollToTop from './components/ScrollToTop'

// Public pages
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Integrations from './pages/Integrations'
import AI from './pages/AI'
import Docs from './pages/Docs'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import Changelog from './pages/Changelog'
import Status from './pages/Status'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Roadmap from './pages/Roadmap'
import Ecommerce from './pages/Ecommerce'
import SaaS from './pages/SaaS'
import Agencies from './pages/Agencies'
import Enterprise from './pages/Enterprise'
import Careers from './pages/Careers'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Community from './pages/Community'

// Portal (user dashboard)
import PortalLayout from './components/portal/PortalLayout'
import PortalDashboard from './pages/portal/Dashboard'
import Inbox from './pages/portal/Inbox'
import Conversations from './pages/portal/Conversations'
import Contacts from './pages/portal/Contacts'
import Team from './pages/portal/Team'
import Automation from './pages/portal/Automation'
import Reports from './pages/portal/Reports'
import PortalSettings from './pages/portal/Settings'

// Control (admin panel)
import ControlLayout from './components/control/ControlLayout'
import ControlDashboard from './pages/control/Dashboard'
import Accounts from './pages/control/Accounts'
import Users from './pages/control/Users'
import Billing from './pages/control/Billing'
import AdminConversations from './pages/control/AdminConversations'
import ControlAnalytics from './pages/control/Analytics'
import System from './pages/control/System'
import AuditLog from './pages/control/AuditLog'
import ControlSettings from './pages/control/Settings'

// Pages that manage their own nav
const standalonePages = ['/login', '/signup']

function PublicLayout() {
  const location = useLocation()
  const isStandalone = standalonePages.includes(location.pathname)

  return (
    <>
      {!isStandalone && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/status" element={<Status />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/saas" element={<SaaS />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/community" element={<Community />} />
      </Routes>
      {!isStandalone && <CTABanner />}
      {!isStandalone && <Footer />}
      <ScrollToTop />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Portal — user dashboard */}
            <Route
              path="/portal/*"
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PortalDashboard />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="conversations" element={<Conversations />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="team" element={<Team />} />
              <Route path="automation" element={<Automation />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<PortalSettings />} />
            </Route>

            {/* Control — admin panel */}
            <Route
              path="/control/*"
              element={
                <AdminRoute>
                  <ControlLayout />
                </AdminRoute>
              }
            >
              <Route index element={<ControlDashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="users" element={<Users />} />
              <Route path="billing" element={<Billing />} />
              <Route path="conversations" element={<AdminConversations />} />
              <Route path="analytics" element={<ControlAnalytics />} />
              <Route path="system" element={<System />} />
              <Route path="audit" element={<AuditLog />} />
              <Route path="settings" element={<ControlSettings />} />
            </Route>

            {/* Public landing site */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
