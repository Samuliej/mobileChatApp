import React, { createContext, useState } from 'react'
import api from '../api'
import useGetCurrentUser from '../hooks/useGetCurrentUser'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const { user, fetchUser, setUser } = useGetCurrentUser()

  const signIn = async (username, password) => {
    const res = await api.post('/api/login', { username, password })
    setToken(res.data.token)
    // Fetch the user data after signing in
    await fetchUser(res.data.token)
  }

  const updateUser = async () => {
    // Fetch the updated user data
    await fetchUser(token)
  }

  return (
    <UserContext.Provider value={{ token, user, signIn, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

/*import { createContext } from 'react'
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
}*/