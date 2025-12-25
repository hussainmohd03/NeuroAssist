const router = require('express').Router()
const controller = require('../controllers/study.controller')
const upload = require('../middleware/uploadScans')
const middleware = require('../middleware/')

router.get('/', middleware.verifyToken, controller.getStudies)

router.post(
  '/',
  middleware.verifyToken,
  upload.array('scans', 1),
  controller.createStudy
)

module.exports = router
