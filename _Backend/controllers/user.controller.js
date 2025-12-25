const prisma = require('../prisma/prisma-client.js')
const { queueNotification } = require('../services/')

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id
    await prisma.user.delete({
      where: {
        id: userId
      }
    })
    return res.status(200).send({ msg: 'user deleted successfully' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.editUser = async (req, res) => {
  try {
    const userId = req.user.id
    const { nhraHolderEmail, nhraHolderName } = req.body
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        fullName: nhraHolderName,
        email: nhraHolderEmail
      }
    })

    await queueNotification({
      userId,
      message: 'Profile Updated',
      type: 'profile_updated',
      severity: 'info'
    })

    return res
      .status(200)
      .send({ msg: 'user updated successfully', user: updatedUser })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.clearData = async (req, res) => {
  try {
    const userId = req.user.id
    const studies = await prisma.study.findMany({
      where: { doctor: userId },
      select: { id: true }
    })
    const studyIds = studies.map((study) => study.id)

    const ops = []

    if (studyIds.length > 0) {
      ops.push(
        prisma.image.deleteMany({ where: { studyId: { in: studyIds } } }),
        prisma.report.deleteMany({ where: { studyId: { in: studyIds } } }),
        prisma.study.deleteMany({ where: { id: { in: studyIds } } })
      )
    }

    ops.push(prisma.notification.deleteMany({ where: { userId } }))

    await prisma.$transaction(ops)

    await queueNotification({
      userId,
      message: 'Data cleared successfully',
      type: 'data_cleared',
      severity: 'success'
    })

    return res.status(200).send({ msg: 'user data cleared successfully' })
  } catch (error) {
    return res
      .status(500)
      .send({ msg: 'error clearing data from DB', error: error.message })
  }
}

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    return res.status(200).send({ user })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const notifications = await prisma.notification.findMany({
      where: { userId, deleted: false }
    })
    return res.status(200).send({ notifications })
  } catch (error) {
    return res
      .status(500)
      .send({ msg: 'error getting notification from DB', error: error.message })
  }
}

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id
    await prisma.notification.updateMany({
      where: {
        userId,
        deleted: false
      },
      data: {
        deleted: true
      }
    })
    return res.status(200).send({ msg: 'successfully deleted notification' })
  } catch (error) {
    return res
      .status(500)
      .send({ msg: 'error updating notifications', error: error.message })
  }
}
exports.markNotification = async (req, res) => {
  try {
    const userId = req.user.id
    const notification = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })
    return res
      .status(200)
      .send({ Ids: notification, msg: 'successfully marked notification' })
  } catch (error) {
    return res
      .status(500)
      .send({ msg: 'error updating notifications', error: error.message })
  }
}
