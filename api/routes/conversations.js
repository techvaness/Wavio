import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/conversations
router.get('/', requireAuth, (req, res) => {
  const { status, assigned, channel, search } = req.query
  const wsId = req.user.workspace_id

  let sql = `
    SELECT c.*,
           ct.name  AS contact_name,
           ct.email AS contact_email,
           ct.tags  AS contact_tags,
           u.name   AS assigned_name,
           (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.is_read = 0 AND m.from_type = 'customer') AS unread_count,
           (SELECT m2.text FROM messages m2 WHERE m2.conversation_id = c.id ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
           (SELECT m3.created_at FROM messages m3 WHERE m3.conversation_id = c.id ORDER BY m3.created_at DESC LIMIT 1) AS last_message_at
    FROM conversations c
    LEFT JOIN contacts ct ON ct.id = c.contact_id
    LEFT JOIN users u ON u.id = c.assigned_to
    WHERE c.workspace_id = ?
  `
  const params = [wsId]

  if (status && status !== 'all') { sql += ' AND c.status = ?'; params.push(status) }
  if (channel)                    { sql += ' AND c.channel = ?'; params.push(channel) }
  if (assigned === 'me')          { sql += ' AND c.assigned_to = ?'; params.push(req.user.id) }
  if (search)                     { sql += ' AND (ct.name LIKE ? OR ct.email LIKE ? OR c.subject LIKE ?)'; const s = `%${search}%`; params.push(s, s, s) }

  sql += ' ORDER BY c.updated_at DESC'

  const rows = db.prepare(sql).all(...params)
  res.json(rows)
})

// GET /api/conversations/:id
router.get('/:id', requireAuth, (req, res) => {
  const convo = db.prepare(`
    SELECT c.*, ct.name AS contact_name, ct.email AS contact_email, ct.phone AS contact_phone,
           ct.location AS contact_location, ct.company AS contact_company, ct.tags AS contact_tags,
           ct.first_seen, ct.last_seen,
           u.name AS assigned_name
    FROM conversations c
    LEFT JOIN contacts ct ON ct.id = c.contact_id
    LEFT JOIN users u ON u.id = c.assigned_to
    WHERE c.id = ? AND c.workspace_id = ?
  `).get(req.params.id, req.user.workspace_id)

  if (!convo) return res.status(404).json({ error: 'Not found' })
  res.json(convo)
})

// ── A03: Allowlists for enum fields ──────────────────────────────────────────
const VALID_STATUSES  = new Set(['open', 'pending', 'resolved'])
const VALID_PRIORITIES = new Set(['low', 'medium', 'high'])

// PATCH /api/conversations/:id
router.patch('/:id', requireAuth, (req, res) => {
  const { status, assigned_to, priority } = req.body
  const convo = db.prepare('SELECT * FROM conversations WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!convo) return res.status(404).json({ error: 'Not found' })

  // A03: reject values not in allowlist
  if (status   && !VALID_STATUSES.has(status))    return res.status(400).json({ error: 'Invalid status value' })
  if (priority && !VALID_PRIORITIES.has(priority)) return res.status(400).json({ error: 'Invalid priority value' })

  if (status)      db.prepare('UPDATE conversations SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, convo.id)
  if (priority)    db.prepare('UPDATE conversations SET priority = ?, updated_at = datetime(\'now\') WHERE id = ?').run(priority, convo.id)
  if ('assigned_to' in req.body) {
    db.prepare('UPDATE conversations SET assigned_to = ?, updated_at = datetime(\'now\') WHERE id = ?').run(assigned_to || null, convo.id)
  }

  const updated = db.prepare(`
    SELECT c.*, u.name AS assigned_name FROM conversations c
    LEFT JOIN users u ON u.id = c.assigned_to WHERE c.id = ?
  `).get(convo.id)

  const io = req.app.get('io')
  if (io) io.to(`workspace:${req.user.workspace_id}`).emit('conversation:updated', { convoId: convo.id, data: updated })

  res.json(updated)
})

// GET /api/conversations/:id/messages
router.get('/:id/messages', requireAuth, (req, res) => {
  const convo = db.prepare('SELECT id FROM conversations WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!convo) return res.status(404).json({ error: 'Not found' })

  // mark customer messages as read
  db.prepare('UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND from_type = \'customer\'').run(convo.id)

  const messages = db.prepare(`
    SELECT m.*, u.name AS agent_name FROM messages m
    LEFT JOIN users u ON u.id = m.from_id
    WHERE m.conversation_id = ? ORDER BY m.created_at ASC
  `).all(convo.id)

  res.json(messages)
})

// POST /api/conversations/:id/messages
router.post('/:id/messages', requireAuth, (req, res) => {
  const { text, type } = req.body   // type: 'reply' | 'note'
  if (!text?.trim()) return res.status(400).json({ error: 'Text required' })

  const convo = db.prepare('SELECT * FROM conversations WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!convo) return res.status(404).json({ error: 'Not found' })

  const fromType = type === 'note' ? 'note' : 'agent'
  const result = db.prepare(`
    INSERT INTO messages (conversation_id, from_type, from_id, text, is_read) VALUES (?, ?, ?, ?, 1)
  `).run(convo.id, fromType, req.user.id, text.trim())

  db.prepare('UPDATE conversations SET updated_at = datetime(\'now\') WHERE id = ?').run(convo.id)

  const message = db.prepare(`
    SELECT m.*, u.name AS agent_name FROM messages m
    LEFT JOIN users u ON u.id = m.from_id WHERE m.id = ?
  `).get(result.lastInsertRowid)

  // broadcast to all sockets in this conversation room
  const io = req.app.get('io')
  if (io) {
    io.to(`convo:${convo.id}`).emit('message:new', { convoId: convo.id, message })
    io.to(`workspace:${req.user.workspace_id}`).emit('conversation:updated', { convoId: convo.id })
  }

  res.status(201).json(message)
})

export default router
