/**
 * Auth API integration tests
 * Uses an in-memory SQLite DB so tests never touch wavio.db
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

// Point to a temp DB so tests are isolated
process.env.DB_PATH    = ':memory:'
process.env.JWT_SECRET = 'test-secret-for-vitest'
process.env.NODE_ENV   = 'test'

// Import app after env is set
const { default: app } = await import('../api/app.js')

describe('POST /api/auth/register', () => {
  it('creates a new account and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123', company: 'TestCo' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe('test@example.com')
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('rejects duplicate email with 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123', company: 'TestCo' })
    expect(res.status).toBe(409)
  })

  it('rejects weak passwords (< 8 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'X', email: 'x@x.com', password: 'short', company: 'X' })
    expect(res.status).toBe(400)
  })

  it('requires all fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('rejects invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('rejects non-existent email with 401 (no user enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'whatever' })
    expect(res.status).toBe(401)
    // Same error message — no hint that the email doesn't exist
    expect(res.body.error).toBe('Invalid credentials')
  })
})

describe('GET /api/auth/me', () => {
  it('returns user profile with valid token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
    const token = login.body.token

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@example.com')
  })

  it('rejects requests without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('rejects tampered tokens', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.tampered.signature')
    expect(res.status).toBe(401)
  })
})

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})
