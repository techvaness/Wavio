import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── CRUD ─────────────────────────────────────────────────────────────────────
router.get('/', requireAuth, (req, res) => {
  res.json(db.prepare(
    'SELECT * FROM automation_rules WHERE workspace_id = ? ORDER BY created_at DESC'
  ).all(req.user.workspace_id).map(parseRule))
})

router.post('/', requireAuth, (req, res) => {
  const { name, trigger_type, conditions, actions } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name required' })
  const result = db.prepare(
    'INSERT INTO automation_rules (workspace_id, name, trigger_type, conditions, actions) VALUES (?, ?, ?, ?, ?)'
  ).run(
    req.user.workspace_id,
    String(name).trim().slice(0, 100),
    trigger_type || 'keyword',
    JSON.stringify(conditions || {}),
    JSON.stringify(actions || [])
  )
  res.status(201).json(parseRule(db.prepare('SELECT * FROM automation_rules WHERE id = ?').get(result.lastInsertRowid)))
})

router.patch('/:id', requireAuth, (req, res) => {
  const rule = db.prepare('SELECT id FROM automation_rules WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!rule) return res.status(404).json({ error: 'Not found' })

  const { name, trigger_type, conditions, actions, enabled } = req.body
  const fields = []
  const vals   = []
  if (name        !== undefined) { fields.push('name = ?');         vals.push(String(name).trim().slice(0, 100)) }
  if (trigger_type!== undefined) { fields.push('trigger_type = ?'); vals.push(trigger_type) }
  if (conditions  !== undefined) { fields.push('conditions = ?');   vals.push(JSON.stringify(conditions)) }
  if (actions     !== undefined) { fields.push('actions = ?');      vals.push(JSON.stringify(actions)) }
  if (enabled     !== undefined) { fields.push('enabled = ?');      vals.push(enabled ? 1 : 0) }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' })

  db.prepare(`UPDATE automation_rules SET ${fields.join(', ')} WHERE id = ?`).run(...vals, req.params.id)
  res.json(parseRule(db.prepare('SELECT * FROM automation_rules WHERE id = ?').get(req.params.id)))
})

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM automation_rules WHERE id = ? AND workspace_id = ?').run(req.params.id, req.user.workspace_id)
  res.json({ ok: true })
})

// ── Rule engine (called after message creation) ───────────────────────────────
export function executeRules(workspaceId, convoId, messageText, conversationChannel) {
  const rules = db.prepare(
    'SELECT * FROM automation_rules WHERE workspace_id = ? AND enabled = 1'
  ).all(workspaceId).map(parseRule)

  for (const rule of rules) {
    if (matchesRule(rule, messageText, conversationChannel)) {
      applyActions(rule.actions, convoId)
      db.prepare('UPDATE automation_rules SET runs = runs + 1 WHERE id = ?').run(rule.id)
    }
  }
}

function matchesRule(rule, messageText, channel) {
  const cond = rule.conditions
  switch (rule.trigger_type) {
    case 'keyword':
      return cond.keyword && messageText.toLowerCase().includes(cond.keyword.toLowerCase())
    case 'channel':
      return cond.channel && channel === cond.channel
    case 'new_conversation':
      return true
    default:
      return false
  }
}

function applyActions(actions, convoId) {
  const VALID_STATUSES   = new Set(['open', 'pending', 'resolved'])
  const VALID_PRIORITIES = new Set(['low', 'medium', 'high'])
  for (const action of actions) {
    if (action.type === 'set_priority' && VALID_PRIORITIES.has(action.value)) {
      db.prepare('UPDATE conversations SET priority = ? WHERE id = ?').run(action.value, convoId)
    }
    if (action.type === 'set_status' && VALID_STATUSES.has(action.value)) {
      db.prepare('UPDATE conversations SET status = ? WHERE id = ?').run(action.value, convoId)
    }
    if (action.type === 'assign' && action.userId) {
      // verify agent belongs to same workspace
      const convo = db.prepare('SELECT workspace_id FROM conversations WHERE id = ?').get(convoId)
      const agent = db.prepare('SELECT id FROM users WHERE id = ? AND workspace_id = ?').get(action.userId, convo?.workspace_id)
      if (agent) db.prepare('UPDATE conversations SET assigned_to = ? WHERE id = ?').run(action.userId, convoId)
    }
  }
}

function parseRule(r) {
  return {
    ...r,
    conditions: typeof r.conditions === 'string' ? JSON.parse(r.conditions) : r.conditions,
    actions:    typeof r.actions    === 'string' ? JSON.parse(r.actions)    : r.actions,
    enabled:    Boolean(r.enabled),
  }
}

export default router
