jest.mock('../services/', () => ({
  queueEmail: jest.fn()
}))
const request = require('supertest')
const { app } = require('../server')
const prisma = require('../prisma/prisma-client')
const { queueEmail } = require('../services')
const jwt = require('jsonwebtoken')

describe('Auth Controller', () => {
  let userEmail = 'testuser@example.com'
  let password = 'password123'
  let verificationToken

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: userEmail } })
    await prisma.$disconnect()
  })

  test('Register - success', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: userEmail,
      password,
      confirmPassword: password,
      fullName: 'Test User',
      Institution: 'Test Hospital',
      nhra: 12345678
    })

    expect(res.status).toBe(201)
    expect(queueEmail).toHaveBeenCalled()

    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    expect(user).not.toBeNull()
    expect(user.emailVerified).toBe(false)

    verificationToken = user.verificationToken
  })

  test('Register - duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: userEmail,
      password,
      confirmPassword: password,
      fullName: 'Test User',
      Institution: 'Test Hospital',
      nhra: 12345678
    })
    expect(res.status).toBe(400)
  })

  test('Verify Email - success', async () => {
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: verificationToken })

    expect(res.status).toBe(200)

    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    expect(user.emailVerified).toBe(true)
    expect(user.verificationToken).toBeNull()
  })

  test('Login - success', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userEmail,
      password
    })

    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  test('Login - wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userEmail,
      password: 'wrongpassword'
    })

    expect(res.status).toBe(400)
  })

  test('Forget Password - stores reset token', async () => {
    const res = await request(app)
      .post('/api/auth/forget-password')
      .send({ email: userEmail })

    expect(res.status).toBe(200)

    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    expect(user.resetToken).not.toBeNull()
    expect(user.resetTokenExpiry).not.toBeNull()
  })

  test('Reset Password - success', async () => {
    const rawToken = 'test-reset-token'
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        resetToken: require('../utils').hashResetToken(rawToken),
        resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000)
      }
    })

    const res = await request(app).post('/api/auth/reset-password').send({
      token: rawToken,
      password: 'newpassword123',
      confirmPassword: 'newpassword123'
    })

    expect(res.status).toBe(200)

    const updatedUser = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    expect(updatedUser.resetToken).toBeNull()
  })

  test('Refresh token - success', async () => {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET
    )

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [`refresh_token=${refreshToken}`])

    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  test('Logout - clears cookies', async () => {
    const res = await request(app).post('/api/auth/logout')

    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
  })
})
