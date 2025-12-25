jest.mock('../middleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: global.__TEST_USER_ID__ }
    next()
  }
}))
const request = require('supertest')
const { app } = require('../server')
const prisma = require('../prisma/prisma-client.js')
const { createTestData, deleteTestData } = require('./test-utils.js')

beforeAll(async () => {
  const ids = await createTestData()
  global.__TEST_USER_ID__ = ids.userId
})

afterAll(async () => {
  await deleteTestData(global.__TEST_USER_ID__)
  await prisma.$disconnect()
})
describe('Get Studies Controller', () => {
  test('should get studies successfully', async () => {
    const response = await request(app).get('/api/study')

    expect(response.body.studies.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Create Study Controller', () => {
  test('should create study successfully', async () => {
    const response = await request(app)
      .post('/api/study')
      .field({ patientId: '12345678' })
      .attach('scans', Buffer.from('test file'), 'scan1.jpg')

    expect(response.body.study).toHaveProperty('id')
  })

  test('should return 400 if patient id is missing', async () => {
    const response = await request(app)
      .post('/api/study')
      .attach('scans', Buffer.from('test file'), 'scan1.jpg')

    expect(response.status).toBe(400)
  })

  test('should return 400 if scans missing', async () => {
    const response = await request(app)
      .post('/api/study')
      .send({ patientId: '12345678' })

    expect(response.status).toBe(400)
  })
})
