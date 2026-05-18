/**
 * Inbound channel webhooks — WhatsApp (Twilio) + Email (SendGrid Inbound Parse)
 *
 * WhatsApp setup:
 *   1. Buy a Twilio number, enable WhatsApp sandbox
 *   2. Set webhook URL: https://yourdomain.com/api/webhooks/whatsapp
 *   3. Add TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_WHATSAPP_NUMBER to .env
 *
 * Email setup (SendGrid Inbound Parse):
 *   1. Add inbound parse webhook pointing to: https://yourdomain.com/api/webhooks/email
 *   2. Map your support domain (e.g. support@yourdomain.com) in SendGrid
 */
import { Router } from 'express'
import twilio from 'twilio'
import db from '../db.js'
import { stampSla } from '../services/sla.js'

const router = Router()

// ── Helpers ───────────────────────────────────────────────────────────────────

function findOrCreateContact(wsId, { name, phone, email }) {
  if (phone) {
    const existing = db.prepare('SELECT * FROM contacts WHERE workspace_id = ? AND phone = ?').get(wsId, phone)
    if (existing) {
      db.prepare('UPDATE contacts SET last_seen = datetime(\'now\') WHERE id = ?').run(existing.id)
      return existing
    }
  }
  if (email) {
    const existing = db.prepare('SELECT * FROM contacts WHERE workspace_id = ? AND email = ?').get(wsId, email)
    if (existing) {
      db.prepare('UPDATE contacts SET last_seen = datetime(\'now\') WHERE id = ?').run(existing.id)
      return existing
    }
  }
  const result = db.prepare(
    'INSERT INTO contacts (workspace_id, name, email, phone, tags) VALUES (?, ?, ?, ?, ?)'
  ).run(wsId, name || 'Unknown', email || null, phone || null, '[]')
  return db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid)
}

function createConversationAndMessage(wsId, contactId, { subject, channel, text, priority = 'medium' }, io) {
  // Check for existing open conversation with this contact on same channel
  const existing = db.prepare(`
    SELECT id FROM conversations
    WHERE workspace_id = ? AND contact_id = ? AND channel = ? AND status IN ('open','pending')
    ORDER BY updated_at DESC LIMIT 1
  `).get(wsId, contactId, channel)

  let convoId
  if (existing) {
    convoId = existing.id
    db.prepare('UPDATE conversations SET updated_at = datetime(\'now\') WHERE id = ?').run(convoId)
  } else {
    const r = db.prepare(`
      INSERT INTO conversations (workspace_id, contact_id, subject, channel, status, priority)
      VALUES (?, ?, ?, ?, 'open', ?)
    `).run(wsId, contactId, subject, channel, priority)
    convoId = r.lastInsertRowid
    stampSla(convoId, priority)
  }

  const msgResult = db.prepare(`
    INSERT INTO messages (conversation_id, from_type, from_id, text, is_read)
    VALUES (?, 'customer', NULL, ?, 0)
  `).run(convoId, text)

  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(msgResult.lastInsertRowid)
  const convo   = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convoId)

  // Broadcast via socket to the workspace
  if (io) {
    io.to(`workspace:${wsId}`).emit('message:new',          { convoId, message })
    io.to(`workspace:${wsId}`).emit('conversation:updated', { convoId, data: convo })
  }

  return { convoId, messageId: msgResult.lastInsertRowid }
}

// ── WhatsApp webhook (Twilio) ─────────────────────────────────────────────────

router.post('/whatsapp', async (req, res) => {
  // Validate Twilio signature when secret is set
  if (process.env.TWILIO_AUTH_TOKEN) {
    const twilioSignature = req.headers['x-twilio-signature']
    const url = `${process.env.APP_URL || 'http://localhost:3001'}/api/webhooks/whatsapp`
    const valid = twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, twilioSignature, url, req.body)
    if (!valid) return res.status(403).send('Invalid signature')
  }

  const { From, Body, ProfileName } = req.body
  if (!From || !Body) return res.status(400).send('Missing required fields')

  const phone = From.replace('whatsapp:', '')
  const text  = Body.trim()
  const name  = ProfileName || phone

  // Route to the first active workspace (multi-tenant: match by Twilio number config)
  // In production, match workspace by TWILIO_WHATSAPP_NUMBER stored in integrations table
  const integration = db.prepare(`
    SELECT workspace_id FROM integrations
    WHERE channel = 'whatsapp' AND connected = 1
    ORDER BY id LIMIT 1
  `).get()

  const wsId = integration?.workspace_id
  if (!wsId) {
    console.warn('[whatsapp webhook] no connected WhatsApp workspace found')
    return res.status(200).send('<Response/>')
  }

  const contact = findOrCreateContact(wsId, { name, phone })
  createConversationAndMessage(wsId, contact.id, {
    subject: `WhatsApp from ${name}`,
    channel: 'whatsapp',
    text,
  }, req.app.get('io'))

  // Twilio expects TwiML response (empty = no auto-reply)
  res.set('Content-Type', 'text/xml')
  res.send('<Response/>')
})

// ── Outbound WhatsApp reply ───────────────────────────────────────────────────

export async function sendWhatsappReply(toPhone, text) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('[whatsapp] Twilio not configured — skipping outbound:', text)
    return
  }
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
    to:   `whatsapp:${toPhone}`,
    body: text,
  })
}

// ── Inbound email webhook (SendGrid Inbound Parse) ────────────────────────────

router.post('/email', (req, res) => {
  const { from, subject, text, html } = req.body
  if (!from) return res.status(400).json({ error: 'Missing from field' })

  // Parse "Name <email>" format
  const emailMatch = from.match(/<(.+?)>/)
  const email      = emailMatch ? emailMatch[1] : from
  const nameMatch  = from.match(/^(.+?)\s*</)
  const name       = nameMatch ? nameMatch[1].trim() : email

  const body = (text || html || '').replace(/<[^>]*>/g, '').trim().slice(0, 10000)
  if (!body) return res.status(400).json({ error: 'Empty email body' })

  // Route to workspace via email integration config
  const integration = db.prepare(`
    SELECT workspace_id FROM integrations
    WHERE channel = 'email' AND connected = 1
    ORDER BY id LIMIT 1
  `).get()

  const wsId = integration?.workspace_id
  if (!wsId) {
    console.warn('[email webhook] no connected email workspace found')
    return res.status(200).json({ ok: true })
  }

  const contact = findOrCreateContact(wsId, { name, email })
  createConversationAndMessage(wsId, contact.id, {
    subject: subject || '(no subject)',
    channel: 'email',
    text:    body,
  }, req.app.get('io'))

  res.status(200).json({ ok: true })
})

export default router
