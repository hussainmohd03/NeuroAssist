const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRES_IN
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN
const ACCESS_TOKEN_EXPIRES_MS = 1000 * 60 * 15
const REFRESH_TOKEN_EXPIRES_MS = 1000 * 60 * 60 * 24 * 15

exports.generateEmailVerificationToken = (email) => {
  const token = jwt.sign(
    { purpose: 'email-verification', email: email },
    ACCESS_SECRET,
    { expiresIn: '1d' }
  )
  return token
}

exports.hashPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return hashedPassword
}

exports.comparePassword = async (password, passwordDigest) => {
  let matched = await bcrypt.compare(password, passwordDigest)
  return matched
}

exports.createAccessToken = (payload) => {
  let token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY })

  return token
}

exports.createRefreshToken = (payload) => {
  let token = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY })
  return token
}

exports.sendAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: false, //switch to true (HTTPS) when we deploy
    sameSite: 'lax', //switch to 'none'  when we deploy
    maxAge: ACCESS_TOKEN_EXPIRES_MS,
    path: '/'
  })

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: false, //switch to true (HTTPS) when we deploy
    sameSite: 'lax', //switch to 'none'  when we deploy
    maxAge: REFRESH_TOKEN_EXPIRES_MS,
    path: '/'
  })
}
exports.clearAuthCookies = (res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
}

exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}
exports.hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
