import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'

process.env.DB_PATH    = ':memory:'
process.env.JWT_SECRET = 'test-secret-for-vitest'
process.env.NODE_ENV   = 'test'

const { default: app } = await import('../api/app.js')

let token
let contactId
let convoId

beforeAll(async () => {
  // Register + login
  await request(app).post('/api/auth/register').send({ name: 'Agent', email: 'agent@test.com', password: 'password123', company: 'TestCo' })
  const login = await request(app).post('/api/auth/login').send({ email: 'agent@test.com', password: 'password123' })
  token = login.body.token

  // Create a contact to converse with
  const contact = await request(app)
    .post('/api/contacts')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Customer A', email: 'cust@example.com' })
  contactId = contact.body.id
})

describe('POST /api/conversations', () => {
  it('creates a new conversation', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ contact_id: contactId, subject: 'Test ticket', channel: 'chat', priority: 'high' })
    expect(res.status).toBe(201)
    expect(res.body.subject).toBe('Test ticket')
    expect(res.body.priority).toBe('high')
    expect(res.body).toHaveProperty('due_at')
    convoId = res.body.id
  })

  it('rejects invalid channel', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ contact_id: contactId, channel: 'fax' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/conversations', () => {
  it('returns conversations for workspace', async () => {
    const res = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('filters by status', async () => {
    const res = await request(app)
      .get('/api/conversations?status=open')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    res.body.forEach(c => expect(c.status).toBe('open'))
  })
})

describe('PATCH /api/conversations/:id', () => {
  it('updates conversation status', async () => {
    const res = await request(app)
      .patch(`/api/conversations/${convoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'resolved' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('resolved')
  })

  it('rejects invalid status', async () => {
    const res = await request(app)
      .patch(`/api/conversations/${convoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'deleted' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/conversations/:id/messages', () => {
  it('adds a message to conversation', async () => {
    const res = await request(app)
      .post(`/api/conversations/${convoId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Hello customer!' })
    expect(res.status).toBe(201)
    expect(res.body.text).toBe('Hello customer!')
    expect(res.body.from_type).toBe('agent')
  })

  it('rejects empty messages', async () => {
    const res = await request(app)
      .post(`/api/conversations/${convoId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '   ' })
    expect(res.status).toBe(400)
  })
})
