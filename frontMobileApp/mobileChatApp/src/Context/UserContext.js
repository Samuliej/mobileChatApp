// In UserContext.js
import { createContext } from 'react'
import useGetCurrentUser from '../hooks/useGetCurrentUser'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { user, fetchUser, setUser } = useGetCurrentUser()

  const updateUser = async (token) => {
    if (token) {
      await fetchUser(token)
    } else {
      setUser(null)
    }
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}