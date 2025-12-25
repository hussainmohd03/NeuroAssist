const prisma = require('../prisma/prisma-client.js')

exports.createTestData = async () => {
  const user = await prisma.user.create({
    data: {
      fullName: 'Test User',
      email: `test_${Date.now()}@example.com`,
      passwordDigest: 'hashedpassword',
      Institution: 'Test Institution',
      emailVerified: true,
      nhra: Math.floor(Math.random() * 1e8)
    }
  })

  const study = await prisma.study.create({
    data: {
      doctor: user.id,
      patientId: '03050609',
      report: {
        create: { filePath: 'http://example.com/report.pdf' }
      },
      images: {
        create: { filePath: 'http://example.com/scan1.jpg' }
      }
    },
    include: { report: true, images: true }
  })

  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      message: 'Test Notification',
      isRead: false,
      type: 'profile_updated',
      severity: 'critical'
    }
  })

  return {
    userId: user.id,
    studyId: study.id,
    notificationId: notification.id
  }
}

exports.deleteTestData = async (userId) => {
  if (!userId) return

  await prisma.user.delete({
    where: { id: userId }
  })
}
