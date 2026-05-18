import db from '../db.js'
import { sendSlaBreachAlert } from './email.js'

// SLA response-time targets by priority (minutes)
export const SLA_MINUTES = { high: 60, medium: 240, low: 1440 }

// Ensure the due_at / sla_breached columns exist (idempotent)
const colMigrations = [
  'ALTER TABLE conversations ADD COLUMN due_at TEXT',
  'ALTER TABLE conversations ADD COLUMN sla_breached INTEGER NOT NULL DEFAULT 0',
]
for (const sql of colMigrations) { try { db.exec(sql) } catch { /* already exists */ } }

/**
 * Stamp a due_at time on a newly opened conversation.
 * Call this after inserting a new conversation.
 */
export function stampSla(convoId, priority = 'medium') {
  const minutes = SLA_MINUTES[priority] ?? SLA_MINUTES.medium
  db.prepare(`
    UPDATE conversations
    SET due_at = datetime('now', ? || ' minutes')
    WHERE id = ? AND due_at IS NULL
  `).run(`+${minutes}`, convoId)
}

/**
 * Detect breaches and emit socket + email alerts.
 * Run on a recurring interval (see server.js).
 */
export async function checkSlaBreaches(io) {
  const breached = db.prepare(`
    SELECT c.id, c.priority, c.subject, c.assigned_to, c.workspace_id, c.contact_id,
           ct.name AS contact_name,
           u.email AS agent_email, u.name AS agent_name
    FROM conversations c
    LEFT JOIN contacts ct ON ct.id = c.contact_id
    LEFT JOIN users u ON u.id = c.assigned_to
    WHERE c.status IN ('open','pending')
      AND c.sla_breached = 0
      AND c.due_at IS NOT NULL
      AND c.due_at < datetime('now')
  `).all()

  for (const row of breached) {
    // Mark breached
    db.prepare('UPDATE conversations SET sla_breached = 1 WHERE id = ?').run(row.id)

    // Socket broadcast to workspace
    if (io) {
      io.to(`workspace:${row.workspace_id}`).emit('sla:breach', {
        convoId: row.id,
        priority: row.priority,
        contactName: row.contact_name,
        subject: row.subject,
      })
    }

    // Email assigned agent if any
    if (row.agent_email) {
      sendSlaBreachAlert({
        agentEmail: row.agent_email,
        agentName: row.agent_name,
        contactName: row.contact_name || 'Unknown',
        subject: row.subject,
        priority: row.priority,
        convoId: row.id,
      }).catch(() => {})
    }
  }

  return breached.length
}
