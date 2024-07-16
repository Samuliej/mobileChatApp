import { createContext, useEffect, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import io from 'socket.io-client'
import { HTTP_URL } from '@env'

/**
 * Provides a React context for managing WebSocket connections using socket.io.
 *
 * This context allows components within the provider to access the WebSocket connection
 * without needing to open a new connection. The connection is established based on the
 * current user context and is intended to be kept alive throughout the app's usage.
 *
 * @module SocketContext
 */

export const SocketContext = createContext()

/**
 * `SocketProvider` is a component that uses the `SocketContext.Provider` to pass down the WebSocket connection to its children.
 * It establishes a WebSocket connection using socket.io-client when a user is present in the `UserContext`.
 *
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the WebSocket connection.
 * @returns {React.ReactElement} The Provider component with the WebSocket connection passed down.
 */
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const userContext = useContext(UserContext)

  useEffect(() => {
    let newSocket = null
    if (userContext.user) {
      newSocket = io.connect(HTTP_URL, {
        query: { userId: userContext.user._id }
      })
      console.log('Connected to socket at context')
      setSocket(newSocket)
    }

    if (!userContext) {
      console.log('No user, closing socket')
      return newSocket.close()
    }
  }, [userContext])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}