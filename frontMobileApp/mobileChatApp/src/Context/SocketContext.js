import { createContext, useEffect, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import io from 'socket.io-client'
import { HTTP_URL } from '@env'


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