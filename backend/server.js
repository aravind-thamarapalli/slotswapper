import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import http from 'http'
import { connectDB } from './src/config/database.js'
import { config } from './src/config/config.js'
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js'
import SocketManager from './src/socket/socketManager.js'

import authRoutes from './src/routes/auth.js'
import eventRoutes from './src/routes/events.js'
import swapRoutes from './src/routes/swaps.js'

const app = express()
const httpServer = http.createServer(app)

// Connect to MongoDB
connectDB()

// Initialize WebSocket
const socketManager = new SocketManager(httpServer)
global.socketManager = socketManager // Make socket manager globally accessible

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/swaps', swapRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
})

// WebSocket status
app.get('/api/health/ws', (req, res) => {
  const connectedUsers = socketManager.getConnectedUsers()
  res.json({
    success: true,
    websocket: 'connected',
    connectedUsers: connectedUsers.length,
    timestamp: new Date(),
  })
})

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(errorHandler)

const PORT = config.port

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 WebSocket server is ready`)
  console.log(`🔗 Connect to ws://localhost:${PORT}`)
})
