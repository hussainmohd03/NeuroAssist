const jwt = require('jsonwebtoken')

const APP_SECRET = process.env.JWT_ACCESS_SECRET

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token
    if (!token) {
      return res.status(401).json({ msg: 'not authenticated' })
    }

    const payload = jwt.verify(token, APP_SECRET)

    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid or expired token' })
  }
}
