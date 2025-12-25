const { Worker } = require('bullmq')
const connection = require('../config/redis')
const { sendMail } = require('../services/mailer')
const prisma = require('../prisma/prisma-client.js')
require('dotenv').config()

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    if (job.data?.studyId) {

      const reportPath = await prisma.report.findUnique({
        where: {
          studyId: job.data.studyId
        },
        include: {
          study: {
            include: {
              user: true
            }
          }
        }
      })

      let reportUrl = reportPath ? reportPath.filePath : null
      let doctorEmail = reportPath?.study?.user?.email || null
      let name = reportPath?.study?.user?.fullName || 'Doctor'

      return await sendMail({
        to: doctorEmail,
        subject: 'MRI Report Ready',
        template: 'report',
        context: {
          name: name.split(' ')[0],
          reportLink: reportUrl
        }
      })
    }

    return await sendMail(job.data)
  },

  { connection }
)

emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} has been completed`)
})

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job.id} has failed with error: ${err.message}`)
})

emailWorker.on('stalled', (job) => {
  console.warn(`Email job ${job.id} has stalled and will be retried`)
})
