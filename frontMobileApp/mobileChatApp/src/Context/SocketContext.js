import { createContext, useEffect, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import io from 'socket.io-client'
import { HTTP_URL } from '@env'

/*

  The user is connected to a websocket the whole time during using the app.
  We're passing socket as a context so it can be used at multiple places without
  needing to open a new socket.

*/

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const userContext = useContext(UserContext)

  useEffect(() => {
    let newSocket = null
    if (userContext.user) {
      newSocket = io.connect(`${HTTP_URL}:3001`, {
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