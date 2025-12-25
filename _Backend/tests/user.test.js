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
  await prisma.$disconnect()
})

describe('Get Notification Controller', () => {
  test('should get notification successfully', async () => {
    const response = await request(app).get('/api/user/notifications')

    expect(response.body.notifications.length).toBeGreaterThanOrEqual(1)
  })
})
describe('Mark Notification Controller', () => {
  test('should mark notification as read successfully', async () => {
    await request(app).post('/api/user/notifications')
    const updatedNotifications = await prisma.notification.findMany({
      where: { userId: global.__TEST_USER_ID__, isRead: true }
    })
    expect(updatedNotifications.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Delete Notifications Controller', () => {
  test('should mark notification as deleted successfully', async () => {
    await request(app).delete('/api/user/notifications')
    const deletedNotifications = await prisma.notification.findMany({
      where: { userId: global.__TEST_USER_ID__, deleted: true }
    })
    expect(deletedNotifications.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Get User Controller', () => {
  test('should get user successfully', async () => {
    const response = await request(app).get('/api/user')

    expect(response.body.user).toHaveProperty('id', global.__TEST_USER_ID__)
  })
})

describe('Clear Data Controller', () => {
  test('should clear user data successfully', async () => {
    await request(app).delete('/api/user/data')
    const studies = await prisma.study.findMany({
      where: { doctor: global.__TEST_USER_ID__ }
    })
    expect(studies).toHaveLength(0)
  })
})
describe('Delete User Controller', () => {
  test('should delete user successfully', async () => {
    await request(app).delete('/api/user')
    const user = await prisma.user.findUnique({
      where: { id: global.__TEST_USER_ID__ }
    })
    expect(user).toBeNull()
  })
})
