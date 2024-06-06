import { createContext, useEffect, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import io from 'socket.io-client'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const user = useContext(UserContext)

  useEffect(() => {
    let newSocket = null
    if (user) {
      console.log('user at context', user)
      newSocket = io.connect(`${process.env.HTTP_URL}:3001`)
      console.log('Connected to socket at context')
      setSocket(newSocket)
    }

    return () => newSocket.close()
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}