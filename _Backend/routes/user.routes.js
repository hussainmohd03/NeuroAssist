const router = require('express').Router()
const controller = require('../controllers/user.controller')
const middleware = require('../middleware')

router.delete('/', middleware.verifyToken, controller.deleteUser)

router.put('/', middleware.verifyToken, controller.editUser)

router.delete('/data', middleware.verifyToken, controller.clearData)

router.get('/', middleware.verifyToken, controller.getUser)

router.get(
  '/notifications',
  middleware.verifyToken,
  controller.getNotifications
)
router.delete(
  '/notifications',
  middleware.verifyToken,
  controller.deleteNotification
)
router.post(
  '/notifications',
  middleware.verifyToken,
  controller.markNotification
)

module.exports = router
