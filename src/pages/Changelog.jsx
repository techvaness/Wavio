import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const badgeStyles = {
  New: 'bg-green-50 text-[#4cc61e] border-green-200',
  Improved: 'bg-blue-50 text-[#1a3fbf] border-blue-200',
  Fixed: 'bg-orange-50 text-orange-600 border-orange-200',
  Removed: 'bg-red-50 text-red-500 border-red-200',
}

const entries = [
  {
    version: 'v2.4.0',
    date: 'April 8, 2025',
    changes: [
      { type: 'New', text: 'AI Reply Suggestions are now live for all Growth and Pro plans. Suggestions appear in your inbox in under 300ms.' },
      { type: 'New', text: 'Sentiment Detection,conversations with negative sentiment are now flagged automatically and can trigger routing rules.' },
      { type: 'Improved', text: 'Inbox search is now 3x faster with full-text indexing across all channels.' },
      { type: 'Fixed', text: 'WhatsApp message delivery timestamps were showing UTC instead of workspace timezone.' },
    ],
  },
  {
    version: 'v2.3.0',
    date: 'March 20, 2025',
    changes: [
      { type: 'New', text: 'Chatbot Builder,build no-code conversational flows with the new drag-and-drop editor.' },
      { type: 'New', text: 'Knowledge Base Q&A,train your AI assistant on your own documentation and help articles.' },
      { type: 'Improved', text: 'Widget performance improvements: bundle size reduced from 22kb to 14kb.' },
      { type: 'Improved', text: 'CSAT surveys now support custom questions and 1–10 scale in addition to 1–5 stars.' },
      { type: 'Fixed', text: 'Offline message queue was occasionally dropping messages on reconnect. Now resolved.' },
    ],
  },
  {
    version: 'v2.2.0',
    date: 'March 1, 2025',
    changes: [
      { type: 'New', text: 'Instagram DMs integration,manage Instagram conversations alongside all other channels.' },
      { type: 'New', text: 'Auto-tagging,conversations are now automatically tagged by topic using AI.' },
      { type: 'Improved', text: 'CRM contact profiles now show a full cross-channel conversation timeline.' },
      { type: 'Removed', text: 'Legacy v1 widget embed script has been retired. Migrate to the v2 snippet.' },
    ],
  },
  {
    version: 'v2.1.0',
    date: 'February 10, 2025',
    changes: [
      { type: 'New', text: 'Conversation summaries,AI generates a summary when a conversation is transferred between agents.' },
      { type: 'New', text: 'Smart Routing,route conversations by intent, language, or sentiment with configurable rules.' },
      { type: 'Improved', text: 'Email inbox now supports HTML rendering for rich-text messages.' },
      { type: 'Fixed', text: 'File uploads over 10MB were failing silently. Now returns a proper error message.' },
    ],
  },
  {
    version: 'v2.0.0',
    date: 'January 15, 2025',
    changes: [
      { type: 'New', text: 'Omnichannel Inbox,WhatsApp, Facebook Messenger, Email, and SMS now fully integrated.' },
      { type: 'New', text: 'Full CRM with contact profiles, custom attributes, tags, segments, and pipeline stages.' },
      { type: 'New', text: 'Advanced Analytics dashboard with real-time metrics, team performance, and CSAT trends.' },
      { type: 'Improved', text: 'Complete redesign of the agent dashboard,faster, cleaner, and keyboard-first.' },
    ],
  },
]

export default function Changelog() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-20 px-4 bg-white text-center border-b border-[#e4e7ed]">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Changelog</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            What's new in Wavio.
          </h1>
          <p className="text-base md:text-xl text-[#475569]">Every change, documented. New features ship weekly.</p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto">
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#e4e7ed]" />

            <div className="space-y-12">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.version}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="absolute -left-5 top-3 w-4 h-4 rounded-full border-2 border-[#1a3fbf] bg-white z-10" />

                  <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[#f5f6f8] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-sm font-bold px-3 py-1 rounded-full text-white"
                          style={{ background: 'linear-gradient(135deg, #1a3fbf, #2e5de6)' }}
                        >
                          {entry.version}
                        </span>
                        {i === 0 && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#4cc61e] text-white">
                            Latest
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#94a3b8]">{entry.date}</span>
                    </div>

                    {/* Changes */}
                    <div className="px-6 py-5 space-y-3">
                      {entry.changes.map((change, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <span
                            className={`flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full border mt-0.5 ${badgeStyles[change.type]}`}
                          >
                            {change.type}
                          </span>
                          <p className="text-sm text-[#475569] leading-relaxed">{change.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
