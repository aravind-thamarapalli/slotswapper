import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

class SocketManager {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.corsOrigin || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    this.userSockets = new Map() // Map of userId -> socketId
    this.setupMiddleware()
    this.setupEventHandlers()
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      try {
        const decoded = jwt.verify(token, config.jwtSecret)
        socket.userId = decoded.userId
        next()
      } catch (err) {
        next(new Error('Authentication error: Invalid token'))
      }
    })
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const userId = socket.userId

      // Store user socket mapping
      this.userSockets.set(userId, socket.id)
      console.log(`User ${userId} connected with socket ${socket.id}`)

      // Join user to their own room for private notifications
      socket.join(`user:${userId}`)

      // Handle disconnect
      socket.on('disconnect', () => {
        this.userSockets.delete(userId)
        console.log(`User ${userId} disconnected`)
      })

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for user ${userId}:`, error)
      })
    })
  }

  /**
   * Notify a user of a swap request
   * @param {string} userId - The user to notify
   * @param {object} swapRequest - Swap request details
   */
  notifySwapRequest(userId, swapRequest) {
    console.log(`Notifying user ${userId} of new swap request`)
    this.io.to(`user:${userId}`).emit('swap:request-received', {
      type: 'swap_request',
      timestamp: new Date(),
      data: swapRequest,
    })
  }

  /**
   * Notify a user that their swap request was accepted
   * @param {string} userId - The user who made the request
   * @param {object} swapDetails - Swap details
   */
  notifySwapAccepted(userId, swapDetails) {
    console.log(`Notifying user ${userId} that their swap request was accepted`)
    this.io.to(`user:${userId}`).emit('swap:request-accepted', {
      type: 'swap_accepted',
      timestamp: new Date(),
      data: swapDetails,
    })
  }

  /**
   * Notify a user that their swap request was declined
   * @param {string} userId - The user who made the request
   * @param {object} declineDetails - Decline details
   */
  notifySwapDeclined(userId, declineDetails) {
    console.log(`Notifying user ${userId} that their swap request was declined`)
    this.io.to(`user:${userId}`).emit('swap:request-declined', {
      type: 'swap_declined',
      timestamp: new Date(),
      data: declineDetails,
    })
  }

  /**
   * Notify a user that their swap request was cancelled
   * @param {string} userId - The user to notify
   * @param {object} cancelDetails - Cancel details
   */
  notifySwapCancelled(userId, cancelDetails) {
    console.log(`Notifying user ${userId} that a swap was cancelled`)
    this.io.to(`user:${userId}`).emit('swap:request-cancelled', {
      type: 'swap_cancelled',
      timestamp: new Date(),
      data: cancelDetails,
    })
  }

  /**
   * Broadcast a notification to multiple users
   * @param {array} userIds - Array of user IDs to notify
   * @param {string} eventType - Type of event
   * @param {object} data - Event data
   */
  broadcastNotification(userIds, eventType, data) {
    userIds.forEach((userId) => {
      this.io.to(`user:${userId}`).emit(eventType, {
        timestamp: new Date(),
        data,
      })
    })
  }

  /**
   * Check if a user is online
   * @param {string} userId - The user ID to check
   * @returns {boolean} - True if user is online
   */
  isUserOnline(userId) {
    return this.userSockets.has(userId)
  }

  /**
   * Get all connected users
   * @returns {array} - Array of connected user IDs
   */
  getConnectedUsers() {
    return Array.from(this.userSockets.keys())
  }

  /**
   * Close socket manager
   */
  close() {
    this.io.close()
  }
}

export default SocketManager
