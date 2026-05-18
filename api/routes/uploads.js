import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ts   = Date.now()
    const ext  = path.extname(file.originalname).slice(0, 10)
    const safe = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50)
    cb(null, `${ts}_${safe}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) cb(null, true)
    else cb(new Error('File type not allowed'))
  },
})

const router = Router()

// POST /api/upload/:convoId  — attach a file to a conversation
router.post('/:convoId', requireAuth, upload.single('file'), (req, res) => {
  const convo = db.prepare(
    'SELECT id FROM conversations WHERE id = ? AND workspace_id = ?'
  ).get(req.params.convoId, req.user.workspace_id)

  if (!convo) {
    // remove orphaned file
    if (req.file) fs.unlinkSync(req.file.path)
    return res.status(404).json({ error: 'Conversation not found' })
  }

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const url = `/api/uploads/files/${req.file.filename}`

  const result = db.prepare(`
    INSERT INTO messages (conversation_id, from_type, from_id, text, attachment_url, attachment_name, attachment_size, is_read)
    VALUES (?, 'agent', ?, ?, ?, ?, ?, 1)
  `).run(convo.id, req.user.id, `[file] ${req.file.originalname}`, url, req.file.originalname, req.file.size)

  db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(convo.id)

  const message = db.prepare(
    'SELECT m.*, u.name AS agent_name FROM messages m LEFT JOIN users u ON u.id = m.from_id WHERE m.id = ?'
  ).get(result.lastInsertRowid)

  const io = req.app.get('io')
  if (io) {
    io.to(`convo:${convo.id}`).emit('message:new', { convoId: convo.id, message })
    io.to(`workspace:${req.user.workspace_id}`).emit('conversation:updated', { convoId: convo.id })
  }

  res.status(201).json(message)
})

// GET /api/uploads/files/:filename  — serve the file
router.get('/files/:filename', requireAuth, (req, res) => {
  const safe = path.basename(req.params.filename) // strip any path traversal
  const filePath = join(UPLOADS_DIR, safe)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' })
  res.sendFile(filePath)
})

export default router
