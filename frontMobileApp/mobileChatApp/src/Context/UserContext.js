import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

/*

  User Context for easier user management and updating

*/

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const fetchUser = async (token) => {
    // Fetch the user data using the token
    const response = await api.get('/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = response.data
    return data
  }

  const updateUserFields = async (fields) => {
    const { name, phone, city } = fields
    const token = await AsyncStorage.getItem('userToken')
    console.log('user before updating fields', user)
    try {
      const response = await api.put(`/api/users/${user._id}`, {name, phone, city}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const updatedUser = response.data
      console.log('updatedUser', updatedUser)
      setUser(updatedUser)
    } catch (error) {
      console.log(error)
    }
  }

  // Updates the user when there are changes to the user in the DB
  const updateUser = async (token) => {
    if (token) {
      const fetchedUser = await fetchUser(token)
      setUser(fetchedUser)
      setIsSignedIn(true)
    } else {
      setUser(null)
      setIsSignedIn(false)
    }
  }

  const updateUserPendingRequests = (newRequests) => {
    setUser({
      ...user,
      pendingFriendRequests: newRequests,
    })
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
    <UserContext.Provider value={{ user, isSignedIn, updateUser, updateUserPendingRequests, updateUserFields }}>
      {children}
    </UserContext.Provider>
  )
}