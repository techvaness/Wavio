import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { getToken } from '../api/client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setConnected(false)
      }
      return
    }

    // Already connected
    if (socketRef.current?.connected) return

    const socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (err) => console.error('Socket error:', err.message))

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [user])

  function getSocket() {
    return socketRef.current
  }

  function emit(event, data) {
    socketRef.current?.emit(event, data)
  }

  function on(event, handler) {
    socketRef.current?.on(event, handler)
  }

  function off(event, handler) {
    socketRef.current?.off(event, handler)
  }

  return (
    <SocketContext.Provider value={{ connected, getSocket, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
