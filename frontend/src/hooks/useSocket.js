import { useEffect, useRef, useState, useCallback } from 'react'
import io from 'socket.io-client'

export const useSocket = () => {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found, cannot connect to WebSocket')
      return
    }

    // Connect to backend server
    // Prefer VITE_WS_URL if provided; otherwise derive from VITE_API_URL.
    // Do NOT fall back to any hardcoded production URL — require env vars to be set.
    const rawWs = import.meta.env.VITE_WS_URL
    let wsUrl = null
    if (rawWs) {
      wsUrl = rawWs.replace(/\/$/, '')
    } else {
      const rawApi = import.meta.env.VITE_API_URL
      if (rawApi) {
        wsUrl = rawApi.replace(/\/$/, '').replace(/\/api$/, '')
      } else {
        console.error(
          'VITE_WS_URL and VITE_API_URL are not set. WebSocket URL not configured; socket will not connect. Please set VITE_WS_URL or VITE_API_URL in your frontend environment.',
        )
        return
      }
    }
    
    try {
      // Create socket connection with JWT authentication
      const socket = io(wsUrl, {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      })

      socketRef.current = socket

      // Connection established
      socket.on('connect', () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
      })

      // Connection lost
      socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected')
        setIsConnected(false)
      })

      // Connection error
      socket.on('connect_error', (error) => {
        console.error('🔴 Connection error:', error)
        setIsConnected(false)
      })

      // Listen for swap request received
      socket.on('swap:request-received', (notification) => {
        console.log('📬 Swap request received:', notification)
        setNotifications((prev) => [notification.data, ...prev])
      })

      // Listen for swap accepted
      socket.on('swap:request-accepted', (notification) => {
        console.log('✅ Swap accepted:', notification)
        setNotifications((prev) => [notification.data, ...prev])
        // Trigger refresh for events list
        setRefreshTrigger((prev) => prev + 1)
      })

      // Listen for swap declined
      socket.on('swap:request-declined', (notification) => {
        console.log('❌ Swap declined:', notification)
        setNotifications((prev) => [notification.data, ...prev])
        // Trigger refresh for events list
        setRefreshTrigger((prev) => prev + 1)
      })

      // Listen for swap cancelled
      socket.on('swap:request-cancelled', (notification) => {
        console.log('🚫 Swap cancelled:', notification)
        setNotifications((prev) => [notification.data, ...prev])
        // Trigger refresh for events list
        setRefreshTrigger((prev) => prev + 1)
      })

      return () => {
        socket.disconnect()
      }
    } catch (error) {
      console.error('Failed to initialize socket:', error)
    }
  }, [])

  const clearNotifications = () => setNotifications([])

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.requestId !== id))
  }

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    refreshTrigger,
    clearNotifications,
    clearNotification,
  }
}
