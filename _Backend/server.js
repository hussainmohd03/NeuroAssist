// imports
const express = require('express')
require('dotenv').config()
const path = require('path')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser')
const { initializeWebSocket } = require('./realtime/websocket-server')

// Initialize app
const app = express()

// Initialize HTTP server and WebSocket server
const server = http.createServer(app)
const wss = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: 10000,
  pingTimeout: 5000
})

// set Port Configuration
const port = process.env.PORT ? process.env.PORT : 3000

// Require MiddleWares
const morgan = require('morgan')

// use MiddleWares
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.json())

// Root Route
app.get('/', (req, res) => {
  res.send('Your app is connected . . . ')
})

// Require Routers
const AuthRouter = require('./routes/auth.routes')
const UserRouter = require('./routes/user.routes')
const StudyRouter = require('./routes/study.routes')
// use Routers
app.use('/api/auth', AuthRouter)
app.use('/api/user', UserRouter)
app.use('/api/study', StudyRouter)

if (process.env.NODE_ENV !== 'test') {
  initializeWebSocket(wss)
  // Listener
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}
module.exports = { app }
