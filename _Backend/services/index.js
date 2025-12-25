const { emailQueue, notificationQueue, flowProducer } = require('../queues/')
const blobServiceClient = require('../config/azure.blob')

const severityToPriority = {
  critical: 1,
  error: 2,
  warning: 3,
  success: 4,
  info: 5
}

exports.queueEmail = async (emailData, priority) => {
  await emailQueue.add('sendEmail', emailData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 60000 },
    removeOnComplete: true,
    removeOnFail: false,
    priority: priority
  })
}

exports.queueNotification = async (notificationData) => {
  await notificationQueue.add('sendNotification', notificationData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 60000 },
    removeOnComplete: true,
    removeOnFail: false,
    priority: severityToPriority[notificationData.severity] || 5
  })
}

exports.createStudyFlow = async (studyId) => {
  await flowProducer.add({
    name: `email-${studyId}`,
    queueName: 'emailQueue',
    data: { studyId: studyId },
    opts: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false
    },
    children: [
      {
        name: `report-${studyId}`,
        queueName: 'reportQueue',
        opts: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: true,
          removeOnFail: false
        },
        data: { studyId: studyId },

        children: [
          {
            name: 'run-model',
            queueName: 'modelQueue',
            opts: {
              attempts: 3,
              backoff: { type: 'exponential', delay: 1000 },
              removeOnComplete: true,
              removeOnFail: false
            },
            data: { studyId: studyId }
          }
        ]
      }
    ]
  })
}

exports.uploadPdfToBlob = async (path, buffer) => {
  const container = blobServiceClient.getContainerClient('reports')
  await container.createIfNotExists()

  const blob = container.getBlockBlobClient(path)
  await blob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' }
  })
  return blob.url
}
