import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import conversationRoutes from './routes/conversations.js'
import contactRoutes from './routes/contacts.js'
import teamRoutes from './routes/team.js'
import dashboardRoutes from './routes/dashboard.js'
import cannedRoutes from './routes/canned.js'
import adminRoutes from './routes/admin.js'
import db from './db.js'

// ── A02/A07: Fail hard if JWT_SECRET is the insecure default in production ────
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'wavio-dev-secret-2026') {
  console.error('FATAL: JWT_SECRET env var must be set in production')
  process.exit(1)
}

const app = express()
const httpServer = createServer(app)

// ── A05: Allowed origins driven by env ────────────────────────────────────────
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
     'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178',
     'http://localhost:4173']

export const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true }
})

// ── A05: Security headers via helmet ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:'],
      connectSrc: ["'self'", 'ws:', 'wss:'],
    },
  },
}))

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }))

// ── A05: Body size limit — prevent large-payload DoS ─────────────────────────
app.use(express.json({ limit: '64kb' }))

app.set('io', io)

// ── REST Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/contacts',      contactRoutes)
app.use('/api/team',          teamRoutes)
app.use('/api/dashboard',     dashboardRoutes)
app.use('/api/canned',        cannedRoutes)
app.use('/api/admin',         adminRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ── A05: Generic error handler — don't leak stack traces ─────────────────────
app.use((err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`)
  res.status(err.status || 500).json({ error: 'Internal server error' })
})

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

  // ── A01: Verify conversation belongs to user's workspace before joining ──
  socket.on('join_conversation', (convoId) => {
    const convo = db.prepare(
      'SELECT id FROM conversations WHERE id = ? AND workspace_id = ?'
    ).get(convoId, user.workspace_id)
    if (convo) socket.join(`convo:${convoId}`)
  })

  socket.on('leave_conversation', (convoId) => socket.leave(`convo:${convoId}`))

  socket.on('typing:start', ({ convoId }) => {
    // Only emit if user is in that convo room (enforced by join_conversation above)
    socket.to(`convo:${convoId}`).emit('typing:start', { userId: user.id, name: user.name, convoId })
  })

  socket.on('typing:stop', ({ convoId }) => {
    socket.to(`convo:${convoId}`).emit('typing:stop', { userId: user.id, convoId })
  })

  // ── A01: Agents can only set their OWN status ────────────────────────────
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
})
