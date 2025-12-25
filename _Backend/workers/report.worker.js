const { Worker } = require('bullmq')
const prisma = require('../prisma/prisma-client')
const connection = require('../config/redis')
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { queueNotification, uploadPdfToBlob } = require('../services/')
const escapeHtml = (s = '') => {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const reportWorker = new Worker(
  'reportQueue',
  async (job) => {
    const { studyId } = job.data

    const study = await prisma.study.findUnique({
      where: { id: studyId },
      include: { user: true, report: true }
    })

    if (!study) throw new Error('Study not found')

    const analysis = study.metadata?.analysis
    if (!analysis) throw new Error('Missing analysis metadata')

    const templatePath = path.join(process.cwd(), 'templates', 'report.html')
    let html = fs.readFileSync(templatePath, 'utf-8')

    const findingsHtml = analysis.findings
      .map((f) => `<li>${escapeHtml(String(f))}</li>`)
      .join('')

    const imageHtml = analysis.segmented_image_url
      ? `<img src="${analysis.segmented_image_url}" />`
      : `<p>No segmentation image available.</p>`

    html = html
      .replace('{{SUMMARY}}', escapeHtml(analysis.summary))
      .replace('{{RECOMMENDATIONS}}', escapeHtml(analysis.recommendations))
      .replace('{{FINDINGS}}', findingsHtml)
      .replace('{{IMAGES}}', imageHtml)

    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    })

    await browser.close()

    const pdfUrl = await uploadPdfToBlob(
      `patient-${study.patientId}-report.pdf`,
      pdfBuffer
    )

    await prisma.study.update({
      where: { id: studyId },
      data: { status: 'COMPLETED', report: { update: { filePath: pdfUrl } } }
    })

    await queueNotification({
      userId: study.doctor,
      message: 'MRI report is ready.',
      type: 'report_ready',
      severity: 'success',

      metaData: { studyId, status: 'COMPLETED', reportUrl: pdfUrl }
    })

    return { pdfUrl }
  },
  { connection }
)

reportWorker.on('completed', (job) => {
  console.log(`Report job with ID ${job.id} has been completed`)
})

reportWorker.on('failed', (job, err) => {
  console.error(
    `Report job with ID ${job.id} has failed with error: ${err.message}`
  )
})

reportWorker.on('stalled', (job) => {
  console.warn(`Report job with ID ${job.id} has stalled and will be retried`)
})
