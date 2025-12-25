const prisma = require('../prisma/prisma-client.js')
const middleware = require('../middleware/index.js')
const { queueNotification, createStudyFlow } = require('../services/')

exports.getStudies = async (req, res) => {
  try {
    const userId = req.user.id
    const studies = await prisma.study.findMany({
      where: { doctor: userId },
      include: {
        report: true,
        images: true,
        user: true
      },
      orderBy: { updatedAt: 'desc' }
    })
    return res.status(200).send({ studies })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.createStudy = async (req, res) => {
  try {
    const userId = req.user.id
    const { patientId } = req.body
    if (!req.files) {
      return res.status(400).send({ msg: 'patientId and scans are required' })
    }
    const scans = req.files.map((scan) => scan.url)
    if (!patientId || scans.length === 0) {
      return res.status(400).send({ msg: 'patientId and scans are required' })
    }

    const newStudy = await prisma.study.create({
      data: {
        patientId: patientId,
        doctor: userId,
        images: {
          create: {
            filePath: scans[0]
          }
        },
        report: {
          create: {}
        }
      },
      include: {
        images: true,
        report: true,
        user: true
      }
    })

    // TODO 1: send notification to user
    await queueNotification({
      userId,
      message: 'Study created successfully.',
      type: 'study_created',
      severity: 'success'
    })

    // TODO 2: trigger scan analysis process
    await createStudyFlow(newStudy.id)

    return res.status(201).send({ study: newStudy })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}
