import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CTABanner from './components/CTABanner'
import ScrollToTop from './components/ScrollToTop'
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

// Login & Signup have their own built-in mini-navs
const standalonePages = ['/login', '/signup']

function Layout() {
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
    <LanguageProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LanguageProvider>
  )
}
