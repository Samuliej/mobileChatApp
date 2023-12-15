import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const fetchUser = async (token) => {
    // Fetch the user data using the token
    // This is just a placeholder, replace it with your actual fetch logic
    const response = await api.get('/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.data)
    const data = response.data
    return data
  }

  const updateUser = async (token) => {
    console.log('updateUser called')
    if (token) {
      const fetchedUser = await fetchUser(token)
      setUser(fetchedUser)
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeUser = async () => {
      const token = await AsyncStorage.getItem('userToken')
      if (token) {
        await updateUser(token)
      }
    }

    initializeUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}