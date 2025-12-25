const IORedis = require('ioredis')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

exports.initializeWebSocket = (wss) => {
  const sub = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS || undefined,
    maxRetriesPerRequest: null
  })

  // store active sockets per user
  const userSockets = new Map()

  // auth middleware
  wss.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie
      if (!rawCookie) return next(new Error('no cookies present'))

      const cookies = cookie.parse(rawCookie)
      const accessToken = cookies['access_token']

      if (!accessToken) return next(new Error('no auth token'))

      // validate JWT
      const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)

      // save user on socket
      socket.userId = payload.id

      next()
    } catch (err) {
      console.log('ws auth error:', err.message)
      next(new Error('unauthorized websocket'))
    }
  })

  wss.on('connection', (ws) => {
    const userId = ws.userId
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set())
    }
    userSockets.get(userId).add(ws.id)

    ws.on('disconnect', () => {
      const userSet = userSockets.get(userId)
      if (!userSet) return
      userSet.delete(ws.id)
      if (userSet.size === 0) {
        userSockets.delete(userId)
      }
    })
  })

  sub.psubscribe('user:*:notifications', (err, count) => {
    if (err) {
      console.error('Failed to subscribe: ', err)
    } else {
      console.log(
        `subscribed successfully! This client is currently subscribed to ${count} channels.`
      )
    }
  })

  sub.on('pmessage', (pattern, channel, message) => {
    const userId = channel.split(':')[1]
    const sockets = userSockets.get(userId)
    if (!sockets) return
    const notification = JSON.parse(message)
    sockets.forEach((socketId) => {
      wss.to(socketId).emit('Notification', notification)
    })
  })
}
