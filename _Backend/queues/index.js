const { Queue, FlowProducer } = require('bullmq')
const connection = require('../config/redis')

const modelQueue = new Queue('modelQueue', { connection })
const reportQueue = new Queue('reportQueue', { connection })
const emailQueue = new Queue('emailQueue', { connection })
const notificationQueue = new Queue('notificationQueue', { connection })

const flowProducer = new FlowProducer({ connection })

module.exports = {
  modelQueue,
  reportQueue,
  emailQueue,
  notificationQueue,
  flowProducer
}
