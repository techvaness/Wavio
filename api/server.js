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

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
     'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178',
     'http://localhost:4173']

const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true }
})

app.set('io', io)

// ── Socket.io auth ────────────────────────────────────────────────────────────
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

// ── Socket.io connection ──────────────────────────────────────────────────────
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
  })

  socket.on('typing:stop', ({ convoId }) => {
    socket.to(`convo:${convoId}`).emit('typing:stop', { userId: user.id, convoId })
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

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`✓ Wavio API running on http://localhost:${PORT}`)

  // SLA breach checker — runs every 60 seconds
  setInterval(() => checkSlaBreaches(io).catch(() => {}), 60_000)
})
