const { Worker } = require('bullmq')
const axios = require('axios')
const prisma = require('../prisma/prisma-client')
const connection = require('../config/redis')
require('dotenv').config()

const modelWorker = new Worker(
  'modelQueue',
  async (job) => {
    const { studyId } = job.data

    const study = await prisma.study.findUnique({
      where: { id: studyId },
      include: { images: true }
    })

    if (!study) throw new Error('Study not found')
    if (!study.images.filePath) {
      throw new Error('Study must contain exactly one image')
    }

    const image = study.images

    // move study to IN_PROGRESS once
    if (study.status === 'PENDING') {
      await prisma.study.update({
        where: { id: studyId },
        data: { status: 'IN_PROGRESS' }
      })
    }

    // Idempotency
    if (image.segmentationPath) return true

    const response = await axios.post(`${process.env.FASTAPI_URL}/analyze`, {
      blob_url: image.filePath
    })

    const result = response.data

    // save segmentation image
    await prisma.image.update({
      where: { id: image.id },
      data: { segmentationPath: result.segmented_image_url }
    })

    // save full analysis result at study level
    await prisma.study.update({
      where: { id: studyId },
      data: {
        status: 'COMPLETED',
        metadata: {
          analysis: {
            has_tumor: result.has_tumor,
            confidence: result.confidence,
            summary: result.summary,
            findings: result.findings,
            recommendations: result.recommendations,
            metaData: result.metadata,
            segmented_image_url: result.segmented_image_url
          }
        }
      }
    })

    return true
  },
  { connection }
)

modelWorker.on('completed', (job) => {
  console.log(`Model job with ID ${job.id} has been completed`)
})

modelWorker.on('failed', (job, err) => {
  console.error(
    `Model job with ID ${job.id} has failed with error: ${err.message}`
  )
})
modelWorker.on('stalled', (job) => {
  console.warn(`Model job with ID ${job.id} has stalled and will be retried`)
})
