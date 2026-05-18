import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import db from '../db.js'
import { JWT_SECRET, requireAuth } from '../middleware/auth.js'
import { audit } from '../audit.js'
import { sendWelcomeEmail } from '../services/email.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AVATAR_DIR = join(__dirname, '..', 'uploads', 'avatars')
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true })

const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
      cb(null, `${req.user.id}_${Date.now()}${ext}`)
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPG, PNG, or WebP images allowed'))
  },
})

const router = Router()

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
    'SELECT id, email, name, role, status, avatar, avatar_url, workspace_id, created_at FROM users WHERE id = ?'
  ).get(userId)

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, workspace_id: newUser.workspace_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  audit('auth.register', { userId: newUser.id, email: cleanEmail, ip: req.ip })

  // Send welcome email async — never block response
  sendWelcomeEmail({ email: cleanEmail, name: cleanName, workspaceName: cleanCompany }).catch(() => {})

  res.status(201).json({ token, user: newUser })
})

router.post('/logout', requireAuth, (req, res) => {
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('offline', req.user.id)
  audit('auth.logout', { userId: req.user.id })
  res.json({ ok: true })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    'SELECT id, email, name, role, status, avatar, avatar_url, workspace_id, created_at FROM users WHERE id = ?'
  ).get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

router.patch('/profile', requireAuth, (req, res) => {
  const { name } = req.body
  const cleanName = name ? String(name).trim().slice(0, 100) : null
  if (!cleanName) return res.status(400).json({ error: 'Name is required' })

  db.prepare('UPDATE users SET name = ?, avatar = ? WHERE id = ?')
    .run(cleanName, cleanName[0].toUpperCase(), req.user.id)

  const updated = db.prepare(
    'SELECT id, email, name, role, status, avatar, avatar_url, workspace_id, created_at FROM users WHERE id = ?'
  ).get(req.user.id)

  audit('profile.updated', { userId: req.user.id })
  res.json(updated)
})

// ── Avatar upload ─────────────────────────────────────────────────────────────
router.post('/avatar', requireAuth, avatarUpload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/api/auth/avatar/file/${req.file.filename}`
  db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(url, req.user.id)
  const updated = db.prepare(
    'SELECT id, email, name, role, status, avatar, avatar_url, workspace_id, created_at FROM users WHERE id = ?'
  ).get(req.user.id)
  audit('profile.avatar.updated', { userId: req.user.id })
  res.json(updated)
})

router.get('/avatar/file/:filename', (req, res) => {
  const safe = path.basename(req.params.filename)
  const filePath = join(AVATAR_DIR, safe)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' })
  res.sendFile(filePath)
})

// ── Widget settings ───────────────────────────────────────────────────────────
router.get('/widget', requireAuth, (req, res) => {
  const ws = db.prepare(
    'SELECT widget_name, widget_color, widget_greeting, widget_position, widget_online FROM workspaces WHERE id = ?'
  ).get(req.user.workspace_id)
  res.json(ws || {})
})

router.patch('/widget', requireAuth, (req, res) => {
  const { widget_name, widget_color, widget_greeting, widget_position, widget_online } = req.body
  db.prepare(
    'UPDATE workspaces SET widget_name=?, widget_color=?, widget_greeting=?, widget_position=?, widget_online=? WHERE id=?'
  ).run(
    widget_name ? String(widget_name).slice(0, 100) : 'Support',
    widget_color ? String(widget_color).slice(0, 20) : '#1a3fbf',
    widget_greeting ? String(widget_greeting).slice(0, 500) : 'Hi there! How can we help?',
    ['Bottom Right', 'Bottom Left'].includes(widget_position) ? widget_position : 'Bottom Right',
    widget_online ? 1 : 0,
    req.user.workspace_id
  )
  audit('workspace.widget.updated', { userId: req.user.id })
  res.json({ ok: true })
})

// ── Notification preferences ──────────────────────────────────────────────────
router.get('/notifications', requireAuth, (req, res) => {
  const row = db.prepare('SELECT notification_prefs FROM users WHERE id = ?').get(req.user.id)
  res.json({ prefs: row?.notification_prefs ? JSON.parse(row.notification_prefs) : null })
})

router.patch('/notifications', requireAuth, (req, res) => {
  const { prefs } = req.body
  db.prepare('UPDATE users SET notification_prefs = ? WHERE id = ?')
    .run(JSON.stringify(prefs || {}), req.user.id)
  res.json({ ok: true })
})

// ── Change password ───────────────────────────────────────────────────────────
router.post('/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'All fields required' })
  if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' })

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!bcrypt.compareSync(currentPassword, user.password))
    return res.status(401).json({ error: 'Current password is incorrect' })

  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.user.id)
  audit('auth.password.changed', { userId: req.user.id })
  res.json({ ok: true })
})

// ── Delete account ────────────────────────────────────────────────────────────
router.delete('/account', requireAuth, (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'Password required' })

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Incorrect password' })

  db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id)
  audit('auth.account.deleted', { userId: req.user.id })
  res.json({ ok: true })
})

// ── Workspace API key ─────────────────────────────────────────────────────────
router.get('/api-key', requireAuth, (req, res) => {
  let ws = db.prepare('SELECT api_key FROM workspaces WHERE id = ?').get(req.user.workspace_id)
  if (!ws.api_key) {
    const key = 'wv_live_' + randomBytes(20).toString('hex')
    db.prepare('UPDATE workspaces SET api_key = ? WHERE id = ?').run(key, req.user.workspace_id)
    ws = { api_key: key }
  }
  res.json({ apiKey: ws.api_key })
})

router.post('/api-key/regenerate', requireAuth, (req, res) => {
  const key = 'wv_live_' + randomBytes(20).toString('hex')
  db.prepare('UPDATE workspaces SET api_key = ? WHERE id = ?').run(key, req.user.workspace_id)
  audit('workspace.api_key.regenerated', { userId: req.user.id })
  res.json({ apiKey: key })
})

// ── Webhook config ────────────────────────────────────────────────────────────
router.get('/webhook', requireAuth, (req, res) => {
  const ws = db.prepare('SELECT webhook_url, webhook_events FROM workspaces WHERE id = ?').get(req.user.workspace_id)
  res.json({ webhookUrl: ws.webhook_url || '', webhookEvents: JSON.parse(ws.webhook_events || '[]') })
})

router.patch('/webhook', requireAuth, (req, res) => {
  const { webhookUrl, webhookEvents } = req.body
  db.prepare('UPDATE workspaces SET webhook_url = ?, webhook_events = ? WHERE id = ?')
    .run(webhookUrl || null, JSON.stringify(webhookEvents || []), req.user.workspace_id)
  audit('workspace.webhook.updated', { userId: req.user.id })
  res.json({ ok: true })
})

export default router
