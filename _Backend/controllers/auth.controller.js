const prisma = require('../prisma/prisma-client.js')
const utils = require('../utils/index.js')
const { queueEmail } = require('../services/')
const jwt = require('jsonwebtoken')

exports.Register = async (req, res) => {
  try {
    const { email, password, fullName, Institution, nhra, confirmPassword } =
      req.body
    if (
      !email ||
      !password ||
      !fullName ||
      !Institution ||
      !nhra ||
      !confirmPassword
    ) {
      return res.status(400).send({ msg: 'all fields are required' })
    }
    if (password.length < 8) {
      return res
        .status(400)
        .send({ msg: 'password must be at least 8 characters long' })
    }
    if (nhra.toString().length !== 8) {
      return res
        .status(400)
        .send({ msg: 'NHRA license must be exactly 8 numbers long' })
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ msg: 'passwords do not match' })
    }

    let existingUserInDB = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    let existingNhraInDB = await prisma.user.findUnique({
      where: {
        nhra: nhra
      }
    })
    if (existingUserInDB || existingNhraInDB) {
      return res
        .status(400)
        .send({ msg: 'email or nhra is already registered' })
    }

    const passwordDigest = await utils.hashPassword(password)
    const verificationToken = utils.generateEmailVerificationToken(email)
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const user = await prisma.user.create({
      data: {
        email,
        passwordDigest,
        fullName,
        Institution,
        nhra,
        verificationToken,
        verificationExpiry
      },
      select: {
        id: true
      }
    })
    // TODO 1 (DONE): send verification email here
    await queueEmail(
      {
        to: email,
        subject: 'Verify your email',
        template: 'verifyEmail',
        context: {
          name: fullName.split(' ')[0],
          verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        }
      },
      3
    )

    return res.status(201).send({ user, msg: 'signed up successfully' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body

    // TODO 2 (DONE): check if email is verified

    if (!email || !password) {
      return res.status(400).send({ msg: 'all fields are required' })
    }
    let userExists = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!userExists) {
      return res.status(400).send({ msg: 'invalid email or password' })
    }
    if (!userExists.emailVerified) {
      return res.status(400).send({ msg: 'please verify your email first' })
    }
    let passwordMatch = await utils.comparePassword(
      password,
      userExists.passwordDigest
    )
    if (!passwordMatch) {
      return res.status(400).send({ msg: 'invalid email or password' })
    }
    const payload = {
      id: userExists.id,
      email: userExists.email,
      nhra: userExists.nhra,
      fullName: userExists.fullName
    }
    const accessToken = utils.createAccessToken(payload)
    const refreshToken = utils.createRefreshToken(payload)

    utils.sendAuthCookies(res, accessToken, refreshToken)

    return res.status(200).send({ user: payload, msg: 'Logged in successfuly' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.VerifyEmail = async (req, res) => {
  try {
    const { token } = req.body
    const user = await prisma.user.findUnique({
      where: {
        verificationToken: token
      }
    })
    if (user.emailVerified) {
      return res.status(400).send({ msg: 'email is already verified' })
    }
    if (!token) {
      return res.status(400).send({ msg: 'verification token is required' })
    }
    if (!user || user.verificationToken !== token) {
      return res.status(400).send({ msg: 'invalid verification token' })
    }
    if (user.verificationExpiry < new Date()) {
      return res.status(400).send({ msg: 'verification token has expired' })
    }
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null
      }
    })
    await queueEmail(
      {
        to: user.email,
        subject: 'Email Verified Successfully',
        template: 'welcome',
        context: {
          name: user.fullName.split(' ')[0],
          dashboardLink: `${process.env.FRONTEND_URL}/dashboard`
        }
      },
      5
    )
    return res.status(200).send({ msg: 'email verified successfully' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).send({ msg: 'email is required' })
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) return
    const resetToken = utils.generateResetToken()
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000)
    const hashedResetToken = utils.hashResetToken(resetToken)

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpiry: resetTokenExpiry
      }
    })

    await queueEmail(
      {
        to: email,
        subject: 'Password Reset Request',
        template: 'resetPassword',
        context: {
          name: user.fullName.split(' ')[0],
          resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      },
      1
    )

    return res.status(200).send({ msg: 'password reset link sent' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.ResetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body
    if (!token || !password || !confirmPassword) {
      return res.status(400).send({ msg: 'all fields are required' })
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ msg: 'passwords do not match' })
    }
    const hashedToken = utils.hashResetToken(token)
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })
    if (!user) {
      return res.status(400).send({ msg: 'invalid or expired reset token' })
    }
    const newPasswordDigest = await utils.hashPassword(password)
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        passwordDigest: newPasswordDigest,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    await queueEmail(
      {
        to: user.email,
        subject: 'Password Reset Successful',
        template: 'resetPasswordSuccess',
        context: {
          name: user.fullName.split(' ')[0]
        }
      },
      2
    )

    return res.status(200).send({ msg: 'password reset successfully' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
      return res.status(401).send({ msg: 'no refresh token' })
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        nhra: true,
        fullName: true
      }
    })
    const newAccessToken = utils.createAccessToken(user)
    const newRefreshToken = utils.createRefreshToken(user)
    utils.sendAuthCookies(res, newAccessToken, newRefreshToken)

    return res.status(200).send({ msg: 'Token refreshed' })
  } catch (error) {
    return res.status(401).send({ msg: 'invalid refresh token' })
  }
}

exports.logout = async (req, res) => {
  try {
    utils.clearAuthCookies(res)
    return res.status(200).send({ msg: 'logged out successfully' })
  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}
