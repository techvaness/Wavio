import nodemailer from 'nodemailer'

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  EMAIL_FROM = 'Wavio <noreply@wavio.app>',
  APP_URL = 'http://localhost:5173',
} = process.env

// Build transporter lazily so missing creds don't crash startup
let _transport = null
function getTransport() {
  if (_transport) return _transport
  if (!SMTP_USER || !SMTP_PASS) return null
  _transport = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return _transport
}

async function send({ to, subject, html, text }) {
  const transport = getTransport()
  if (!transport) {
    // Silently skip in dev when SMTP is not configured
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[email] SMTP not configured — skipping: ${subject} → ${to}`)
    }
    return
  }
  try {
    await transport.sendMail({ from: EMAIL_FROM, to, subject, html, text })
  } catch (err) {
    console.error('[email] send failed:', err.message)
  }
}

// ── Email templates ───────────────────────────────────────────────────────────

export async function sendNewConversationAlert({ agentEmail, agentName, contactName, subject, channel, convoId }) {
  await send({
    to: agentEmail,
    subject: `New ${channel} conversation from ${contactName}`,
    text: `Hi ${agentName},\n\nA new ${channel} conversation has been assigned to you.\n\nFrom: ${contactName}\nSubject: ${subject || '(no subject)'}\n\nView it at: ${APP_URL}/portal/conversations/${convoId}\n\n— Wavio`,
    html: `<p>Hi ${agentName},</p>
<p>A new <strong>${channel}</strong> conversation has been assigned to you.</p>
<table cellpadding="8" style="border-collapse:collapse;border:1px solid #eee;width:100%">
  <tr><td><strong>From</strong></td><td>${contactName}</td></tr>
  <tr><td><strong>Subject</strong></td><td>${subject || '(no subject)'}</td></tr>
  <tr><td><strong>Channel</strong></td><td>${channel}</td></tr>
</table>
<p><a href="${APP_URL}/portal/conversations/${convoId}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">Open Conversation</a></p>
<p style="color:#888;font-size:12px">— Wavio</p>`,
  })
}

export async function sendAssignmentAlert({ agentEmail, agentName, contactName, subject, channel, convoId, assignedByName }) {
  await send({
    to: agentEmail,
    subject: `Conversation assigned to you by ${assignedByName}`,
    text: `Hi ${agentName},\n\n${assignedByName} assigned you a conversation from ${contactName}.\n\nSubject: ${subject || '(no subject)'}\nChannel: ${channel}\n\nView it at: ${APP_URL}/portal/conversations/${convoId}\n\n— Wavio`,
    html: `<p>Hi ${agentName},</p>
<p><strong>${assignedByName}</strong> assigned you a conversation.</p>
<table cellpadding="8" style="border-collapse:collapse;border:1px solid #eee;width:100%">
  <tr><td><strong>From</strong></td><td>${contactName}</td></tr>
  <tr><td><strong>Subject</strong></td><td>${subject || '(no subject)'}</td></tr>
  <tr><td><strong>Channel</strong></td><td>${channel}</td></tr>
</table>
<p><a href="${APP_URL}/portal/conversations/${convoId}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">Open Conversation</a></p>
<p style="color:#888;font-size:12px">— Wavio</p>`,
  })
}

export async function sendSlaBreachAlert({ agentEmail, agentName, contactName, subject, priority, convoId }) {
  await send({
    to: agentEmail,
    subject: `⚠️ SLA breach: ${priority} priority conversation from ${contactName}`,
    text: `Hi ${agentName},\n\nA ${priority}-priority conversation has breached its SLA.\n\nFrom: ${contactName}\nSubject: ${subject || '(no subject)'}\n\nPlease respond now: ${APP_URL}/portal/conversations/${convoId}\n\n— Wavio`,
    html: `<p style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px;border-radius:4px"><strong>⚠️ SLA Breach</strong></p>
<p>Hi ${agentName},</p>
<p>A <strong>${priority}-priority</strong> conversation from <strong>${contactName}</strong> has exceeded its SLA response time.</p>
<table cellpadding="8" style="border-collapse:collapse;border:1px solid #eee;width:100%">
  <tr><td><strong>From</strong></td><td>${contactName}</td></tr>
  <tr><td><strong>Subject</strong></td><td>${subject || '(no subject)'}</td></tr>
  <tr><td><strong>Priority</strong></td><td>${priority}</td></tr>
</table>
<p><a href="${APP_URL}/portal/conversations/${convoId}" style="background:#ef4444;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">Respond Now</a></p>
<p style="color:#888;font-size:12px">— Wavio</p>`,
  })
}

export async function sendWelcomeEmail({ email, name, workspaceName }) {
  await send({
    to: email,
    subject: `Welcome to Wavio, ${name}!`,
    text: `Hi ${name},\n\nYour Wavio workspace "${workspaceName}" is ready.\n\nLog in at: ${APP_URL}/login\n\n— The Wavio Team`,
    html: `<h2>Welcome to Wavio, ${name}!</h2>
<p>Your workspace <strong>${workspaceName}</strong> is set up and ready to go.</p>
<p><a href="${APP_URL}/login" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">Log in to Wavio</a></p>
<p style="color:#888;font-size:12px">— The Wavio Team</p>`,
  })
}
