import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import {
  MessageSquare, Bot, Globe, Users, BarChart2, Mic,
  Zap, Sliders, BookOpen, Paperclip, ThumbsUp, WifiOff, Star,
  Sparkles, Route, Tag, Workflow, Database, Languages,
  Phone, Mail, Merge, Share2,
  UserCircle, Clock, Layers, Briefcase, Activity,
  TrendingUp, Download, Video, FileText, Headphones,
  Check, X
} from 'lucide-react'

const InstagramIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const tabs = [
  { id: 'chat', label: 'Live Chat', icon: MessageSquare },
  { id: 'ai', label: 'AI & Automation', icon: Bot },
  { id: 'omni', label: 'Omnichannel', icon: Globe },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'voice', label: 'Voice & Video', icon: Mic },
]

const featureData = {
  chat: [
    { icon: Sliders, title: 'Widget Customization', desc: 'Match your brand with custom colors, position, and behavior.' },
    { icon: Zap, title: 'Proactive Triggers', desc: 'Engage visitors automatically based on page, time, or behavior.' },
    { icon: BookOpen, title: 'Canned Responses', desc: 'Save and send common replies instantly with a single keystroke.' },
    { icon: Paperclip, title: 'File Sharing', desc: 'Share images, PDFs, and documents directly in chat.' },
    { icon: MessageSquare, title: 'Typing Indicators', desc: 'Show customers you\'re there with real-time typing previews.' },
    { icon: Phone, title: 'Mobile Widget', desc: 'Fully responsive and performant on every mobile device.' },
    { icon: ThumbsUp, title: 'CSAT Ratings', desc: 'Collect satisfaction scores automatically after every conversation.' },
    { icon: WifiOff, title: 'Offline Mode', desc: 'Capture leads and messages even when your team is away.' },
    { icon: Layers, title: 'Multiple Widgets', desc: 'Run different widgets for different sites or products.' },
    { icon: FileText, title: 'Chat Transcripts', desc: 'Auto-email full conversation transcripts to customers.' },
  ],
  ai: [
    { icon: Sparkles, title: 'Reply Suggestions', desc: 'Context-aware AI suggestions that match your tone and brand.' },
    { icon: FileText, title: 'Conversation Summaries', desc: 'AI-generated summaries when conversations are handed off.' },
    { icon: Route, title: 'Smart Routing', desc: 'Route conversations to the right team based on intent and topic.' },
    { icon: Tag, title: 'Auto-tagging', desc: 'Automatically categorize every conversation as it comes in.' },
    { icon: Workflow, title: 'Chatbot Builder', desc: 'Build no-code bots that handle common questions 24/7.' },
    { icon: Database, title: 'Knowledge Base Q&A', desc: 'Train AI on your docs to answer questions instantly.' },
    { icon: Activity, title: 'Sentiment Detection', desc: 'Detect frustrated customers before they churn.' },
    { icon: Languages, title: 'Language Detection', desc: 'Auto-detect language and route or respond accordingly.' },
  ],
  omni: [
    { icon: MessageSquare, title: 'WhatsApp', desc: 'Two-way WhatsApp Business API conversations at scale.' },
    { icon: InstagramIcon, title: 'Instagram DMs', desc: 'Manage Instagram DMs and story replies in one inbox.' },
    { icon: Globe, title: 'Facebook Messenger', desc: 'Full Messenger support including quick replies and buttons.' },
    { icon: Mail, title: 'Email Inbox', desc: 'Turn your support inbox into a collaborative ticketing system.' },
    { icon: Phone, title: 'SMS', desc: 'Two-way SMS conversations with any customer, anywhere.' },
    { icon: MessageSquare, title: 'Unified Inbox', desc: 'Every channel, every conversation, one place.' },
    { icon: Merge, title: 'Contact Merge', desc: 'Automatically merge the same customer across channels.' },
    { icon: Route, title: 'Channel Routing', desc: 'Route incoming messages to the right team by channel.' },
  ],
  crm: [
    { icon: UserCircle, title: 'Contact Profiles', desc: 'Rich profiles with every detail, note, and interaction.' },
    { icon: Clock, title: 'Conversation History', desc: 'Full cross-channel history for every contact.' },
    { icon: Sliders, title: 'Custom Attributes', desc: 'Add any custom field to contacts and companies.' },
    { icon: Tag, title: 'Tags & Segments', desc: 'Segment contacts by any attribute for targeted outreach.' },
    { icon: TrendingUp, title: 'Pipeline Stages', desc: 'Drag-and-drop deal pipelines for your sales team.' },
    { icon: FileText, title: 'Notes & Activities', desc: 'Log calls, emails, and notes directly on contact records.' },
    { icon: Star, title: 'Lead Scoring', desc: 'Score leads automatically based on behavior and attributes.' },
    { icon: Briefcase, title: 'Company Profiles', desc: 'Group contacts under company records with shared history.' },
  ],
  analytics: [
    { icon: Activity, title: 'Real-time Dashboard', desc: 'Live view of open chats, agent status, and queue depth.' },
    { icon: Users, title: 'Team Performance', desc: 'Individual agent metrics, resolution times, and CSAT scores.' },
    { icon: Clock, title: 'Response Time', desc: 'Track first response and full resolution time trends.' },
    { icon: ThumbsUp, title: 'CSAT Reports', desc: 'Customer satisfaction trends by agent, channel, and time.' },
    { icon: TrendingUp, title: 'Funnel Analysis', desc: 'Measure how chat drives conversions and pipeline.' },
    { icon: BarChart2, title: 'Revenue Attribution', desc: 'See exactly how much revenue Wavio generated.' },
    { icon: Download, title: 'CSV Export', desc: 'Export any report to CSV for custom analysis.' },
  ],
  voice: [
    { icon: Mic, title: 'Audio Messages', desc: 'Send and receive voice messages in any conversation.' },
    { icon: Phone, title: 'Voice Calls', desc: 'Browser-based voice calls directly inside Wavio.' },
    { icon: Video, title: 'Video Calls', desc: 'One-click video calls with screen sharing support.' },
    { icon: Activity, title: 'Call Recording', desc: 'Record and store calls for training and compliance.' },
    { icon: FileText, title: 'AI Transcription', desc: 'Every call automatically transcribed in real time.' },
    { icon: Sparkles, title: 'Call Summaries', desc: 'AI-generated call summaries added to contact records.' },
  ],
}

const comparison = [
  { feature: 'Live Chat Widget', wavio: true, tawkto: true, intercom: true, crisp: true },
  { feature: 'AI Reply Suggestions', wavio: true, tawkto: false, intercom: true, crisp: 'partial' },
  { feature: 'Omnichannel Inbox', wavio: true, tawkto: false, intercom: true, crisp: true },
  { feature: 'Built-in CRM', wavio: true, tawkto: false, intercom: true, crisp: 'partial' },
  { feature: 'WhatsApp Integration', wavio: true, tawkto: false, intercom: true, crisp: false },
  { feature: 'Voice & Video Calls', wavio: true, tawkto: false, intercom: false, crisp: false },
  { feature: 'Chatbot Builder', wavio: true, tawkto: true, intercom: true, crisp: 'partial' },
  { feature: 'Free Plan', wavio: true, tawkto: true, intercom: false, crisp: true },
  { feature: 'Revenue Analytics', wavio: true, tawkto: false, intercom: true, crisp: false },
  { feature: 'Sentiment Detection', wavio: true, tawkto: false, intercom: 'partial', crisp: false },
]

const CheckCell = ({ val }) => {
  if (val === true) return <Check size={16} className="text-[#4cc61e] mx-auto" />
  if (val === false) return <X size={16} className="text-red-400 mx-auto" />
  return <span className="flex items-center justify-center gap-1 text-yellow-500 text-xs"><Zap size={11} /> Partial</span>
}

export default function Features() {
  const [activeTab, setActiveTab] = useState('chat')
  const { t } = useLanguage()
  const hero = t('features.hero')
  const tabLabels = t('features.tabs')
  const compare = t('features.compare')

  const tabList = [
    { id: 'chat', label: tabLabels.chat, icon: MessageSquare },
    { id: 'ai', label: tabLabels.ai, icon: Bot },
    { id: 'omni', label: tabLabels.omni, icon: Globe },
    { id: 'crm', label: tabLabels.crm, icon: Users },
    { id: 'analytics', label: tabLabels.analytics, icon: BarChart2 },
    { id: 'voice', label: tabLabels.voice, icon: Mic },
  ]

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 bg-white text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            {hero.title}
          </h1>
          <p className="text-base md:text-xl text-[#475569] max-w-xl mx-auto">
            {hero.sub}
          </p>
        </motion.div>
      </section>

      {/* Sticky tab nav */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#e4e7ed] shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-0 scrollbar-hide">
            {tabList.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === id
                    ? 'border-[#1a3fbf] text-[#1a3fbf] font-semibold'
                    : 'border-transparent text-[#475569] hover:text-[#1a3fbf]'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <section className="py-10 md:py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {featureData[activeTab].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl border border-[#e4e7ed] p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#1a3fbf]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0f172a] mb-1.5">{title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{desc}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10 md:mb-12"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">{compare.label}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mt-3" style={{ letterSpacing: '-0.5px' }}>
              {compare.title}
            </h2>
          </motion.div>

          <div className="overflow-x-auto -mx-4 px-4">
          <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden shadow-sm min-w-[560px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e4e7ed]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#94a3b8]">{compare.feature}</th>
                  <th className="px-4 py-4 text-center bg-blue-50 border-l-2 border-[#1a3fbf]">
                    <span className="text-sm font-bold text-[#1a3fbf]">Wavio</span>
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[#94a3b8]">tawk.to</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[#94a3b8]">Intercom</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[#94a3b8]">Crisp</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-[#f5f6f8] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                    <td className="px-6 py-3.5 text-sm text-[#0f172a] font-medium">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center bg-blue-50/50 border-l-2 border-[#1a3fbf]">
                      <CheckCell val={row.wavio} />
                    </td>
                    <td className="px-4 py-3.5 text-center"><CheckCell val={row.tawkto} /></td>
                    <td className="px-4 py-3.5 text-center"><CheckCell val={row.intercom} /></td>
                    <td className="px-4 py-3.5 text-center"><CheckCell val={row.crisp} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </section>
    </div>
  )
}
