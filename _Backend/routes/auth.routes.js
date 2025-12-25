const router = require('express').Router()
const controller = require('../controllers/auth.controller')
const middleware = require('../middleware/')

router.post('/register', controller.Register)
router.post('/login', controller.Login)
router.post('/verify-email', controller.VerifyEmail)
router.post('/forget-password', controller.ForgetPassword)
router.post('/reset-password', controller.ResetPassword)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)
module.exports = router
