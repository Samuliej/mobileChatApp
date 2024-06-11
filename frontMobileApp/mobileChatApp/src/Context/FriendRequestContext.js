import { createContext, useState } from 'react'

/*

  Context for friend requests to be able to update the fields from higher component levels of the app.

*/

export const FriendRequestContext = createContext()

export const FriendRequestProvider = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState([])

  return (
    <FriendRequestContext.Provider value={{ friendRequests, setFriendRequests }}>
      {children}
    </FriendRequestContext.Provider>
  )
}