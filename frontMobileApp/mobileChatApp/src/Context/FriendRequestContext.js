import { createContext, useState } from 'react'

export const FriendRequestContext = createContext()

export const FriendRequestProvider = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState([])

  return (
    <FriendRequestContext.Provider value={{ friendRequests, setFriendRequests }}>
      {children}
    </FriendRequestContext.Provider>
  )
}