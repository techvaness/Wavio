import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, (req, res) => {
  const { search } = req.query
  let sql = `
    SELECT c.*,
           (SELECT COUNT(*) FROM conversations v WHERE v.contact_id = c.id) AS convo_count
    FROM contacts c
    WHERE c.workspace_id = ?
  `
  const params = [req.user.workspace_id]
  if (search) { sql += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.company LIKE ?)'; const s = `%${search}%`; params.push(s, s, s) }
  sql += ' ORDER BY c.last_seen DESC'
  res.json(db.prepare(sql).all(...params))
})

router.get('/:id', requireAuth, (req, res) => {
  const contact = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM conversations v WHERE v.contact_id = c.id) AS convo_count
    FROM contacts c WHERE c.id = ? AND c.workspace_id = ?
  `).get(req.params.id, req.user.workspace_id)
  if (!contact) return res.status(404).json({ error: 'Not found' })
  res.json(contact)
})

router.get('/:id/conversations', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, u.name AS assigned_name FROM conversations c
    LEFT JOIN users u ON u.id = c.assigned_to
    WHERE c.contact_id = ? AND c.workspace_id = ?
    ORDER BY c.updated_at DESC
  `).all(req.params.id, req.user.workspace_id)
  res.json(rows)
})

router.post('/', requireAuth, (req, res) => {
  const { name, email, phone, company, location } = req.body
  if (!name) return res.status(400).json({ error: 'Name required' })
  const result = db.prepare(`
    INSERT INTO contacts (workspace_id, name, email, phone, company, location, tags) VALUES (?, ?, ?, ?, ?, ?, '[]')
  `).run(req.user.workspace_id, name, email || null, phone || null, company || null, location || null)
  res.status(201).json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid))
})

router.patch('/:id', requireAuth, (req, res) => {
  const c = db.prepare('SELECT * FROM contacts WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!c) return res.status(404).json({ error: 'Not found' })
  const { name, email, phone, company, location, tags } = req.body
  db.prepare(`
    UPDATE contacts SET
      name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone),
      company = COALESCE(?, company), location = COALESCE(?, location),
      tags = COALESCE(?, tags), last_seen = datetime('now')
    WHERE id = ?
  `).run(name, email, phone, company, location, tags ? JSON.stringify(tags) : null, c.id)
  res.json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(c.id))
})

router.delete('/:id', requireAuth, (req, res) => {
  const c = db.prepare('SELECT id FROM contacts WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!c) return res.status(404).json({ error: 'Not found' })
  db.prepare('DELETE FROM contacts WHERE id = ?').run(c.id)
  res.json({ ok: true })
})

export default router
