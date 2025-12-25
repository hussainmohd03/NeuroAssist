const prisma = require('../prisma/prisma-client.js')
const { Worker } = require('bullmq')
const workerConnection = require('../config/redis')
const IORedis = require('ioredis')
require('dotenv').config()

const pub = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASS || undefined,
  maxRetriesPerRequest: null
})

const notificationWorker = new Worker(
  'notificationQueue',
  async (job) => {
    const notification = await prisma.notification.create({
      data: {
        ...job.data,
        isRead: false
      }
    })
    await pub.publish(
      `user:${job.data.userId}:notifications`,
      JSON.stringify(notification)
    )
  },
  { connection: workerConnection }
)

notificationWorker.on('completed', (job) => {
  console.log(`Notification job with ID ${job.id} has been completed`)
})

notificationWorker.on('failed', (job, err) => {
  console.error(
    `Notification job with ID ${job.id} has failed with error: ${err.message}`
  )
})

notificationWorker.on('stalled', (job) => {
  console.warn(
    `Notification job with ID ${job.id} has stalled and will be retried`
  )
})
