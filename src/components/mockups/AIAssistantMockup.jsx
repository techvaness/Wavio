import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const messages = [
  { from: 'customer', text: 'My payment failed but money was deducted from my account.' },
  { from: 'agent', text: 'I understand how frustrating that is. Let me check this immediately.' },
  { from: 'customer', text: 'I\'ve been waiting 3 days for a resolution. This is urgent.' },
]

const suggestions = [
  { text: 'I sincerely apologize for the inconvenience. I\'ve escalated this to our payments team and you\'ll hear back within 2 hours.', confidence: 94 },
  { text: 'I can see the failed charge on our end. Your refund has been initiated and will reflect in 2-3 business days.', confidence: 87 },
]

export default function AIAssistantMockup() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-lg mx-auto"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(26,63,191,0.15))' }}
    >
      <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#e4e7ed] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4cc61e] border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0f172a]">Alex M.</div>
              <div className="text-[10px] text-[#94a3b8]">Support Agent</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-1">
            <Sparkles size={10} className="text-purple-600" />
            <span className="text-[10px] font-semibold text-purple-700">AI Active</span>
          </div>
        </div>

        {/* Messages */}
        <div className="p-3 space-y-2.5 bg-[#f9fafb]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.from === 'agent'
                    ? 'bg-[#1a3fbf] text-white rounded-br-sm'
                    : 'bg-white text-[#0f172a] border border-[#e4e7ed] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions panel */}
        <div className="border-t-2 border-dashed border-purple-200 bg-purple-50 p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={13} className="text-purple-600" />
            <span className="text-xs font-bold text-purple-800">AI Suggestions</span>
            <span className="ml-auto text-[10px] text-purple-500">Based on conversation context</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className={`bg-white rounded-xl p-2.5 border ${i === 0 ? 'border-purple-300 shadow-sm' : 'border-[#e4e7ed]'}`}>
                <p className="text-[11px] text-[#0f172a] leading-relaxed mb-2">"{s.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.confidence}%`, background: i === 0 ? '#1a3fbf' : '#94a3b8' }}
                      />
                    </div>
                    <span className="text-[10px] text-[#94a3b8]">{s.confidence}% match</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="text-[10px] bg-[#1a3fbf] text-white px-2.5 py-1 rounded-full font-medium">Use</button>
                    <button className="text-[10px] text-[#94a3b8] px-2.5 py-1 rounded-full border border-[#e4e7ed] bg-white">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
