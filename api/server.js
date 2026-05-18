import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './middleware/auth.js'
import app from './app.js'
import db from './db.js'
import { checkSlaBreaches } from './services/sla.js'

// ── A02/A07: Fail hard if JWT_SECRET is the insecure default in production ────
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'wavio-dev-secret-2026') {
  console.error('FATAL: JWT_SECRET env var must be set in production')
  process.exit(1)
}

const httpServer = createServer(app)

// Allow all origins — auth is enforced at namespace middleware level (JWT / sessionId)
export const io = new Server(httpServer, {
  cors: { origin: true, credentials: true }
})

app.set('io', io)

// ── Helper shared with widget namespace ───────────────────────────────────────
function convIdFrom(sid) {
  const parts = String(sid || '').split('.')
  const n = parseInt(parts[parts.length - 1])
  return isNaN(n) ? null : n
}

// ── Main namespace auth (JWT required) ───────────────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('No token'))
  try {
    socket.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

// ── Main namespace connection ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  const user = socket.user
  const wsRoom = `workspace:${user.workspace_id}`

  socket.join(wsRoom)
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('online', user.id)
  io.to(wsRoom).emit('agent:status', { userId: user.id, status: 'online', name: user.name })

  socket.on('join_conversation', (convoId) => {
    const convo = db.prepare(
      'SELECT id FROM conversations WHERE id = ? AND workspace_id = ?'
    ).get(convoId, user.workspace_id)
    if (convo) socket.join(`convo:${convoId}`)
  })

  socket.on('leave_conversation', (convoId) => socket.leave(`convo:${convoId}`))

  socket.on('typing:start', ({ convoId }) => {
    socket.to(`convo:${convoId}`).emit('typing:start', { userId: user.id, name: user.name, convoId })
    // Cross-emit to widget clients viewing this conversation
    widgetNs.to(`convo:${convoId}`).emit('agent:typing:start', { name: user.name })
  })

  socket.on('typing:stop', ({ convoId }) => {
    socket.to(`convo:${convoId}`).emit('typing:stop', { userId: user.id, convoId })
    widgetNs.to(`convo:${convoId}`).emit('agent:typing:stop')
  })

  socket.on('agent:set_status', (status) => {
    if (!['online', 'busy', 'offline'].includes(status)) return
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, user.id)
    io.to(wsRoom).emit('agent:status', { userId: user.id, status, name: user.name })
  })

  socket.on('disconnect', () => {
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('offline', user.id)
    io.to(wsRoom).emit('agent:status', { userId: user.id, status: 'offline', name: user.name })
  })
})

// ── Widget namespace (sessionId auth — no JWT) ────────────────────────────────
const widgetNs = io.of('/widget')

widgetNs.use((socket, next) => {
  const { sessionId, workspaceId } = socket.handshake.auth
  const convId = convIdFrom(sessionId)
  if (!convId) return next(new Error('Invalid session'))
  const wsId = parseInt(workspaceId)
  if (isNaN(wsId)) return next(new Error('Invalid workspace'))
  const conv = db.prepare('SELECT id FROM conversations WHERE id = ? AND workspace_id = ?').get(convId, wsId)
  if (!conv) return next(new Error('Session not found'))
  socket.convId = convId
  socket.wsId = wsId
  next()
})

widgetNs.on('connection', (socket) => {
  const { convId } = socket
  socket.join(`convo:${convId}`)

  // Visitor is typing
  socket.on('widget:typing:start', () => {
    io.to(`convo:${convId}`).emit('typing:start', {
      userId: 'visitor', name: 'Visitor', convoId: convId, isVisitor: true,
    })
  })

  socket.on('widget:typing:stop', () => {
    io.to(`convo:${convId}`).emit('typing:stop', {
      userId: 'visitor', convoId: convId, isVisitor: true,
    })
  })

  // Visitor opened the chat and read agent messages
  socket.on('widget:mark_read', () => {
    db.prepare(
      "UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND from_type = 'agent'"
    ).run(convId)
    io.to(`convo:${convId}`).emit('messages:read', { convoId: convId })
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`✓ Wavio API running on http://localhost:${PORT}`)

  // SLA breach checker — runs every 60 seconds
  setInterval(() => checkSlaBreaches(io).catch(() => {}), 60_000)
})
