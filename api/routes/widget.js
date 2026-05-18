/**
 * Public widget API — no auth required.
 * Used by the embeddable widget script (public/widget.js).
 *
 * POST /api/widget/:workspaceId/session   — start anonymous chat session
 * POST /api/widget/:workspaceId/messages  — send a message
 * GET  /api/widget/:workspaceId/messages  — poll for messages
 */
import { Router }     from 'express'
import { randomBytes } from 'crypto'
import db              from '../db.js'

const router = Router()

// Widget routes are public — allow any origin so the script works on external sites
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Encode convId into the session token so we stay stateless (no extra table needed)
function makeSession(convId) {
  return randomBytes(12).toString('hex') + '.' + convId
}
function convIdFrom(sessionId) {
  const parts = String(sessionId || '').split('.')
  const id = parseInt(parts[parts.length - 1])
  return isNaN(id) ? null : id
}

// ── POST /api/widget/:workspaceId/session ─────────────────────────────────────
router.post('/:workspaceId/session', (req, res) => {
  const wsId = parseInt(req.params.workspaceId)
  if (isNaN(wsId)) return res.status(400).json({ error: 'Invalid workspace' })

  const ws = db.prepare('SELECT id FROM workspaces WHERE id = ?').get(wsId)
  if (!ws) return res.status(404).json({ error: 'Workspace not found' })

  const { page, name, email } = req.body
  const visitorName = (name || 'Website Visitor').slice(0, 100)

  // Reuse existing contact if email matches, otherwise create anonymous one
  let contact = email
    ? db.prepare('SELECT * FROM contacts WHERE workspace_id = ? AND email = ?').get(wsId, email)
    : null

  if (!contact) {
    const r = db.prepare(
      'INSERT INTO contacts (workspace_id, name, email) VALUES (?, ?, ?)'
    ).run(wsId, visitorName, email || null)
    contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(r.lastInsertRowid)
  }

  const subject = page ? 'Chat from ' + new URL(page).hostname : 'Chat from website'
  const conv = db.prepare(
    'INSERT INTO conversations (workspace_id, contact_id, subject, channel, status) VALUES (?, ?, ?, ?, ?)'
  ).run(wsId, contact.id, subject, 'chat', 'open')

  const convId = conv.lastInsertRowid
  const io = req.app.get('io')
  if (io) {
    io.to(`workspace:${wsId}`).emit('conversation:new', { convoId: convId })
  }

  res.json({ sessionId: makeSession(convId) })
})

// ── POST /api/widget/:workspaceId/messages ────────────────────────────────────
router.post('/:workspaceId/messages', (req, res) => {
  const wsId = parseInt(req.params.workspaceId)
  const { sessionId, text } = req.body

  if (!text?.trim()) return res.status(400).json({ error: 'Empty message' })
  const convId = convIdFrom(sessionId)
  if (!convId) return res.status(400).json({ error: 'Invalid session' })

  const conv = db.prepare('SELECT id FROM conversations WHERE id = ? AND workspace_id = ?').get(convId, wsId)
  if (!conv) return res.status(404).json({ error: 'Session not found' })

  const result = db.prepare(
    'INSERT INTO messages (conversation_id, from_type, text) VALUES (?, ?, ?)'
  ).run(convId, 'visitor', text.trim().slice(0, 4000))

  db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(convId)

  // Notify portal agents in real-time
  const message = db.prepare('SELECT id, from_type, text, created_at, is_read FROM messages WHERE id = ?').get(result.lastInsertRowid)
  const io = req.app.get('io')
  if (io) {
    io.to(`convo:${convId}`).emit('message:new', { convoId: convId, message })
    io.to(`workspace:${wsId}`).emit('message:new', { convoId: convId, message })
    io.to(`workspace:${wsId}`).emit('conversation:updated', { convoId: convId })
  }

  res.json({ ok: true })
})

// ── GET /api/widget/:workspaceId/messages ─────────────────────────────────────
router.get('/:workspaceId/messages', (req, res) => {
  const wsId = parseInt(req.params.workspaceId)
  const convId = convIdFrom(req.query.sessionId)
  if (!convId) return res.status(400).json({ error: 'Invalid session' })

  const conv = db.prepare('SELECT id FROM conversations WHERE id = ? AND workspace_id = ?').get(convId, wsId)
  if (!conv) return res.status(404).json({ error: 'Session not found' })

  const messages = db.prepare(
    'SELECT id, from_type, text, created_at, is_read FROM messages WHERE conversation_id = ? ORDER BY id ASC'
  ).all(convId)

  res.json({ messages })
})

export default router
