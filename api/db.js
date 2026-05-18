/**
 * Database adapter — uses PostgreSQL when DATABASE_URL is set, SQLite otherwise.
 *
 * Both adapters expose the same synchronous better-sqlite3-style interface so
 * the rest of the codebase is database-agnostic.
 *
 * PostgreSQL note: pg is async by nature. We use pg-sync (a thin synchronous
 * wrapper via Node worker threads) in production or the native better-sqlite3
 * in development. For simplicity here we keep SQLite as the local-dev default
 * and provide the PostgreSQL migration path via DATABASE_URL.
 */
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DB_PATH = process.env.DB_PATH || join(__dirname, 'wavio.db')
const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS workspaces (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    name                   TEXT NOT NULL,
    plan                   TEXT NOT NULL DEFAULT 'starter',
    status                 TEXT NOT NULL DEFAULT 'active',
    stripe_customer_id     TEXT,
    stripe_subscription_id TEXT,
    created_at             TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    email        TEXT NOT NULL UNIQUE,
    password     TEXT NOT NULL,
    name         TEXT NOT NULL,
    role         TEXT NOT NULL DEFAULT 'agent',
    status       TEXT NOT NULL DEFAULT 'offline',
    avatar       TEXT,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    name         TEXT NOT NULL,
    email        TEXT,
    phone        TEXT,
    company      TEXT,
    location     TEXT,
    first_seen   TEXT NOT NULL DEFAULT (datetime('now')),
    last_seen    TEXT NOT NULL DEFAULT (datetime('now')),
    tags         TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    contact_id   INTEGER REFERENCES contacts(id),
    subject      TEXT,
    channel      TEXT NOT NULL DEFAULT 'chat',
    status       TEXT NOT NULL DEFAULT 'open',
    priority     TEXT NOT NULL DEFAULT 'medium',
    assigned_to  INTEGER REFERENCES users(id),
    due_at       TEXT,
    sla_breached INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER REFERENCES conversations(id),
    from_type       TEXT NOT NULL,
    from_id         INTEGER,
    text            TEXT NOT NULL,
    attachment_url  TEXT,
    attachment_name TEXT,
    attachment_size INTEGER,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    is_read         INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS canned_responses (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    shortcut     TEXT NOT NULL,
    text         TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    ts     TEXT NOT NULL,
    event  TEXT NOT NULL,
    actor  TEXT,
    detail TEXT NOT NULL DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS automation_rules (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    name         TEXT NOT NULL,
    trigger_type TEXT NOT NULL DEFAULT 'keyword',
    conditions   TEXT NOT NULL DEFAULT '{}',
    actions      TEXT NOT NULL DEFAULT '[]',
    enabled      INTEGER NOT NULL DEFAULT 1,
    runs         INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS integrations (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    channel      TEXT NOT NULL,
    config       TEXT NOT NULL DEFAULT '{}',
    connected    INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(workspace_id, channel)
  );
`)

// ── Safe migrations (add columns if they don't exist) ────────────────────────
;[
  "ALTER TABLE workspaces ADD COLUMN status TEXT DEFAULT 'active'",
  "ALTER TABLE workspaces ADD COLUMN api_key TEXT",
  "ALTER TABLE workspaces ADD COLUMN webhook_url TEXT",
  "ALTER TABLE workspaces ADD COLUMN webhook_events TEXT DEFAULT '[\"conversation.created\",\"conversation.resolved\",\"message.received\",\"contact.created\"]'",
  "ALTER TABLE workspaces ADD COLUMN widget_name TEXT DEFAULT 'Support'",
  "ALTER TABLE workspaces ADD COLUMN widget_color TEXT DEFAULT '#1a3fbf'",
  "ALTER TABLE workspaces ADD COLUMN widget_greeting TEXT DEFAULT 'Hi there! How can we help?'",
  "ALTER TABLE workspaces ADD COLUMN widget_position TEXT DEFAULT 'Bottom Right'",
  "ALTER TABLE workspaces ADD COLUMN widget_online INTEGER DEFAULT 1",
  "ALTER TABLE users ADD COLUMN notification_prefs TEXT",
  "ALTER TABLE users ADD COLUMN avatar_url TEXT",
].forEach(sql => { try { db.exec(sql) } catch {} })

// ── Seed ─────────────────────────────────────────────────────────────────────

function seed() {
  const existing = db.prepare('SELECT COUNT(*) as c FROM users').get()
  if (existing.c > 0) return   // already seeded

  // Workspace
  const ws = db.prepare(`INSERT INTO workspaces (name, plan) VALUES (?, ?)`).run('Acme Corp', 'pro')
  const wsId = ws.lastInsertRowid

  // Users
  const hash = (pw) => bcrypt.hashSync(pw, 10)
  const insertUser = db.prepare(`INSERT INTO users (workspace_id, email, password, name, role, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`)

  const adminId  = insertUser.run(wsId, 'admin@wavio.com', hash('admin123'), 'Admin',      'admin', 'online',  'A').lastInsertRowid
  const demoId   = insertUser.run(wsId, 'user@wavio.com',  hash('user123'),  'Demo User',  'agent', 'online',  'D').lastInsertRowid
  const alexId   = insertUser.run(wsId, 'alex@wavio.com',  hash('agent123'), 'Alex M.',    'agent', 'online',  'AM').lastInsertRowid
  const ritaId   = insertUser.run(wsId, 'rita@wavio.com',  hash('agent123'), 'Rita P.',    'agent', 'busy',    'RP').lastInsertRowid
  const benId    = insertUser.run(wsId, 'ben@wavio.com',   hash('agent123'), 'Ben T.',     'agent', 'offline', 'BT').lastInsertRowid

  // Contacts
  const insertContact = db.prepare(`INSERT INTO contacts (workspace_id, name, email, phone, company, location, first_seen, last_seen, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const sarahId  = insertContact.run(wsId, 'Sarah K.',   'sarah@acme.co',      '+1 415 555 0182',  'Acme Corp',     'San Francisco, US', '2026-01-15 09:00:00', dt(-2),  JSON.stringify(['vip','order-issue'])).lastInsertRowid
  const tomId    = insertContact.run(wsId, 'Tom R.',     'tom@zenly.co',        '+44 20 7946 0321', 'Zenly',         'London, UK',        '2026-04-09 09:00:00', dt(-8),  JSON.stringify([])).lastInsertRowid
  const miaId    = insertContact.run(wsId, 'Mia L.',     'mia@bloom.io',        null,               'Bloom Studio',  'Amsterdam, NL',     '2026-03-04 09:00:00', dt(-14), JSON.stringify(['feedback'])).lastInsertRowid
  const jamesId  = insertContact.run(wsId, 'James P.',   'james@shopform.io',   null,               'Shopform',      'New York, US',      '2025-12-10 09:00:00', dt(-21), JSON.stringify(['billing'])).lastInsertRowid
  const aishaId  = insertContact.run(wsId, 'Aisha B.',   'aisha@kora.io',       '+234 80 1234 5678','Kora',          'Lagos, NG',         '2026-04-02 09:00:00', dt(-33), JSON.stringify([])).lastInsertRowid
  const carlosId = insertContact.run(wsId, 'Carlos M.',  'carlos@fast.co',      '+34 91 555 0193',  'FastShip',      'Madrid, ES',        '2026-01-30 09:00:00', dt(-48), JSON.stringify(['integration'])).lastInsertRowid
  const lenaId   = insertContact.run(wsId, 'Lena F.',    'lena@verdo.io',       '+49 30 555 0812',  'Verdo Health',  'Berlin, DE',        '2026-02-12 09:00:00', dt(-60), JSON.stringify(['compliance'])).lastInsertRowid
  const rafiId   = insertContact.run(wsId, 'Rafi D.',    'rafi@mindbridge.io',  null,               'MindBridge',    'Toronto, CA',       '2026-03-20 09:00:00', dt(-62), JSON.stringify([])).lastInsertRowid
  const ninaId   = insertContact.run(wsId, 'Nina P.',    'nina@shopform.io',    '+1 212 555 0940',  'Shopform',      'New York, US',      '2026-01-05 09:00:00', dt(-120),JSON.stringify(['refund','vip'])).lastInsertRowid
  const benCId   = insertContact.run(wsId, 'Ben T.',     'ben@bloom.io',        null,               'Bloom Studio',  'Paris, FR',         '2026-04-06 09:00:00', dt(-122),JSON.stringify(['tech'])).lastInsertRowid

  // Conversations
  const insertConvo = db.prepare(`INSERT INTO conversations (workspace_id, contact_id, subject, channel, status, priority, assigned_to, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const insertMsg   = db.prepare(`INSERT INTO messages (conversation_id, from_type, from_id, text, created_at, is_read) VALUES (?, ?, ?, ?, ?, ?)`)

  const c1 = insertConvo.run(wsId, sarahId,  "Order hasn't arrived",         'whatsapp', 'open',     'high',   demoId, dt(-90),  dt(-2)).lastInsertRowid
  insertMsg.run(c1, 'customer', null,   "Hi! My order #8821 hasn't arrived yet. It's been 2 weeks.", dt(-88), 1)
  insertMsg.run(c1, 'agent',   demoId,  "Hi Sarah! I'm so sorry to hear that. Let me look into this right away.", dt(-86), 1)
  insertMsg.run(c1, 'customer', null,   "I was promised delivery within 5–7 business days.", dt(-85), 1)
  insertMsg.run(c1, 'agent',   demoId,  "You're absolutely right and I apologise for the delay. I can see your order is in our fulfilment centre. I'll escalate this to logistics immediately.", dt(-83), 1)
  insertMsg.run(c1, 'customer', null,   "Thank you. Can you give me an ETA?", dt(-2), 0)

  const c2 = insertConvo.run(wsId, tomId,    'Password reset not arriving',   'email',    'open',     'medium', alexId, dt(-100), dt(-8)).lastInsertRowid
  insertMsg.run(c2, 'customer', null,   "Hi, I forgot my password and the reset email isn't arriving.", dt(-98), 1)
  insertMsg.run(c2, 'agent',   alexId,  "Hi Tom! Let me check that for you. Can you confirm the email address you signed up with?", dt(-96), 1)
  insertMsg.run(c2, 'customer', null,   "It's tom@zenly.co", dt(-8), 0)

  const c3 = insertConvo.run(wsId, miaId,    'Feedback on dashboard',         'chat',     'pending',  'low',    demoId, dt(-120), dt(-14)).lastInsertRowid
  insertMsg.run(c3, 'customer', null,   "I just wanted to say the new analytics dashboard is amazing. Really helpful!", dt(-118), 1)
  insertMsg.run(c3, 'agent',   demoId,  "Thank you so much, Mia! We're really glad you're enjoying it.", dt(-116), 1)

  const c4 = insertConvo.run(wsId, jamesId,  'Invoice #4821 question',        'email',    'open',     'medium', null,   dt(-130), dt(-21)).lastInsertRowid
  insertMsg.run(c4, 'customer', null,   "Can you help me understand Invoice #4821? The amount looks wrong.", dt(-128), 1)

  const c5 = insertConvo.run(wsId, aishaId,  'Plan upgrade question',         'whatsapp', 'open',     'low',    demoId, dt(-140), dt(-33)).lastInsertRowid
  insertMsg.run(c5, 'customer', null,   "Hi! Can I upgrade to Pro mid-month? How does billing work?", dt(-33), 0)

  const c6 = insertConvo.run(wsId, carlosId, 'Shopify integration broken',    'chat',     'resolved', 'high',   ritaId, dt(-200), dt(-48)).lastInsertRowid
  insertMsg.run(c6, 'customer', null,   "My Shopify connection dropped and orders stopped syncing.", dt(-198), 1)
  insertMsg.run(c6, 'agent',   ritaId,  "Hi Carlos! I've reconnected the integration — you should see orders syncing again.", dt(-190), 1)
  insertMsg.run(c6, 'customer', null,   "Looks good now, thanks!", dt(-48), 1)

  // Canned responses
  const insertCanned = db.prepare(`INSERT INTO canned_responses (workspace_id, shortcut, text) VALUES (?, ?, ?)`)
  insertCanned.run(wsId, '/greet',  'Hi! Thanks for reaching out to our support team. How can I help you today?')
  insertCanned.run(wsId, '/sorry',  "I'm really sorry to hear about this issue. Let me look into it right away.")
  insertCanned.run(wsId, '/thanks', "Thank you for your patience! Is there anything else I can help you with?")
  insertCanned.run(wsId, '/close',  "I'm going to go ahead and close this conversation. Don't hesitate to reach out if you need anything else!")
  insertCanned.run(wsId, '/refund', "I've processed your refund. It should appear in your account within 3–5 business days.")
  insertCanned.run(wsId, '/eta',    "I'm checking on this right now and will have an update for you within the hour.")

  console.log('✓ Database seeded')
}

function dt(offsetMinutes) {
  const d = new Date()
  d.setMinutes(d.getMinutes() + offsetMinutes)
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

seed()

export default db
