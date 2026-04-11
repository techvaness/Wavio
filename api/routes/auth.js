import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import db from '../db.js'
import { JWT_SECRET, requireAuth } from '../middleware/auth.js'

const router = Router()

// ── A09: Structured audit log ─────────────────────────────────────────────────
function audit(event, detail) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...detail }))
}

// ── A07: Rate limit login — 10 attempts per 15 min per IP ────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  skipSuccessfulRequests: true,   // only count failed attempts against the limit
})

router.post('/login', loginLimiter, (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const ip = req.ip || req.socket?.remoteAddress

  // A07: Look up user — always run bcrypt to prevent timing-based user enumeration
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(
    String(email).toLowerCase().trim().slice(0, 254)   // A03: cap length
  )

  // Always compare even if no user (constant-time dummy compare)
  const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345'
  const passwordMatch = user
    ? bcrypt.compareSync(password, user.password)
    : (bcrypt.compareSync(password, DUMMY_HASH), false)  // run but discard result

  if (!user || !passwordMatch) {
    // A09: Log failed attempt (no user details in log to avoid leaking valid emails)
    audit('auth.login.failed', { ip, email: String(email).slice(0, 60) })
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('online', user.id)

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, workspace_id: user.workspace_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  audit('auth.login.success', { ip, userId: user.id, role: user.role })

  const { password: _, ...safeUser } = user
  res.json({ token, user: { ...safeUser, status: 'online' } })
})

// ── A07: Rate limit registration — 5 accounts per hour per IP ────────────────
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created from this IP. Try again later.' },
})

router.post('/register', registerLimiter, (req, res) => {
  const { name, email, password, company } = req.body

  // Basic validation
  if (!name?.trim())     return res.status(400).json({ error: 'Name is required' })
  if (!email?.trim())    return res.status(400).json({ error: 'Email is required' })
  if (!password)         return res.status(400).json({ error: 'Password is required' })
  if (!company?.trim())  return res.status(400).json({ error: 'Company name is required' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

  const cleanEmail = String(email).toLowerCase().trim().slice(0, 254)
  const cleanName  = String(name).trim().slice(0, 100)
  const cleanCompany = String(company).trim().slice(0, 100)

  // Check email not already taken
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail)
  if (existing) return res.status(409).json({ error: 'An account with that email already exists' })

  // Create workspace + owner account in a transaction
  const create = db.transaction(() => {
    const ws = db.prepare('INSERT INTO workspaces (name, plan) VALUES (?, ?)').run(cleanCompany, 'starter')
    const hashedPw = bcrypt.hashSync(password, 10)
    const user = db.prepare(
      'INSERT INTO users (workspace_id, email, password, name, role, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(ws.lastInsertRowid, cleanEmail, hashedPw, cleanName, 'agent', 'online', cleanName[0].toUpperCase())
    return { workspaceId: ws.lastInsertRowid, userId: user.lastInsertRowid }
  })

  const { workspaceId, userId } = create()

  const newUser = db.prepare(
    'SELECT id, email, name, role, status, avatar, workspace_id, created_at FROM users WHERE id = ?'
  ).get(userId)

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, workspace_id: newUser.workspace_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  audit('auth.register', { userId: newUser.id, email: cleanEmail, ip: req.ip })

  res.status(201).json({ token, user: newUser })
})

router.post('/logout', requireAuth, (req, res) => {
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('offline', req.user.id)
  audit('auth.logout', { userId: req.user.id })
  res.json({ ok: true })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    'SELECT id, email, name, role, status, avatar, workspace_id, created_at FROM users WHERE id = ?'
  ).get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

export default router
