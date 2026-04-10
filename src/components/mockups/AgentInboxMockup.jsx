import { motion } from 'framer-motion'
import { MessageSquare, Sparkles } from 'lucide-react'

const chats = [
  { name: 'Sarah K.', msg: 'I need help with my order #4821', time: '2m', online: true, active: true },
  { name: 'James T.', msg: 'The refund hasn\'t arrived yet...', time: '15m', online: true, active: false },
  { name: 'Maria L.', msg: 'Can I change my delivery address?', time: '1h', online: false, active: false },
  { name: 'Ahmed R.', msg: 'Thank you so much!', time: '2h', online: false, active: false },
]

const messages = [
  { from: 'customer', text: 'Hi! I placed an order yesterday and I haven\'t received a confirmation email.', time: '10:24 AM' },
  { from: 'agent', text: 'Hey Sarah! Let me look into that for you right away.', time: '10:25 AM' },
  { from: 'customer', text: 'My order number is #4821. I\'m a bit worried.', time: '10:25 AM' },
  { from: 'agent', text: 'Found it! Your order is confirmed and ships today. I\'ll resend the email now.', time: '10:26 AM' },
]

export default function AgentInboxMockup() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-2xl mx-auto"
      style={{ filter: 'drop-shadow(0 24px 48px rgba(26,63,191,0.18))' }}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-[#e4e7ed]" style={{ minHeight: 420 }}>
        <div className="flex h-full" style={{ minHeight: 420 }}>
          {/* Sidebar */}
          <div className="w-48 sm:w-56 border-r border-[#e4e7ed] flex flex-col bg-[#f5f6f8]">
            <div className="p-3 border-b border-[#e4e7ed]">
              <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-2">Inbox</div>
              <div className="bg-white rounded-lg px-2 py-1.5 flex items-center gap-1.5 border border-[#e4e7ed]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span className="text-xs text-[#94a3b8]">Search...</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.name}
                  className={`px-3 py-2.5 cursor-pointer flex items-start gap-2 ${chat.active ? 'bg-blue-50 border-l-2 border-[#1a3fbf]' : 'hover:bg-white'}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] flex items-center justify-center text-white text-xs font-bold">
                      {chat.name[0]}
                    </div>
                    {chat.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4cc61e] border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${chat.active ? 'text-[#1a3fbf]' : 'text-[#0f172a]'}`}>{chat.name}</span>
                      <span className="text-[10px] text-[#94a3b8] ml-1 flex-shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-[10px] text-[#94a3b8] truncate mt-0.5">{chat.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main chat */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-[#e4e7ed] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3fbf] to-[#2e5de6] flex items-center justify-center text-white text-xs font-bold">S</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4cc61e] border-2 border-white rounded-full" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#0f172a]">Sarah K.</div>
                  <div className="text-[10px] text-[#4cc61e] font-medium">● Online</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-50 text-[#1a3fbf] font-medium px-2 py-1 rounded-full">Live Chat</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f9fafb]">
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
                    <div className={`text-[9px] mt-1 ${msg.from === 'agent' ? 'text-blue-200' : 'text-[#94a3b8]'}`}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#e4e7ed] bg-white">
              <div className="flex items-center gap-2 bg-[#f5f6f8] rounded-xl px-3 py-2">
                <span className="text-xs text-[#94a3b8] flex-1">Type a message...</span>
                <div className="w-6 h-6 rounded-full bg-[#1a3fbf] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z" fill="white"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-[#e4e7ed] px-3 py-2.5 flex items-center gap-2.5 max-w-48"
      >
        <MessageSquare size={16} className="text-[#1a3fbf]" />
        <div>
          <div className="text-[10px] font-bold text-[#0f172a]">New message</div>
          <div className="text-[9px] text-[#94a3b8]">WhatsApp · James T.</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#4cc61e] flex-shrink-0" />
      </motion.div>

      {/* AI suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-[#e4e7ed] px-3 py-2.5 max-w-52"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles size={11} className="text-[#1a3fbf]" />
          <span className="text-[10px] font-bold text-[#1a3fbf]">AI Suggestion</span>
        </div>
        <p className="text-[10px] text-[#475569] leading-snug">"Happy to help! Let me check your order status..."</p>
        <div className="flex gap-1.5 mt-1.5">
          <button className="text-[9px] bg-[#1a3fbf] text-white px-2 py-0.5 rounded-full font-medium">Use</button>
          <button className="text-[9px] text-[#94a3b8] px-2 py-0.5 rounded-full border border-[#e4e7ed]">Edit</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
