import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

/**
 * Provides a React context for user management, including authentication status, user data, and loading state.
 *
 * This context facilitates the management of user data throughout the application, including fetching user data,
 * updating user fields, and handling user authentication state. It uses AsyncStorage for token storage and
 * an external API for data fetching and updating.
 *
 * @module UserContext
 */
export const UserContext = createContext()


/**
 * `UserProvider` is a component that uses the `UserContext.Provider` to pass down user data and actions to its children.
 * It initializes and updates user data based on authentication status and provides functions for updating user data.
 *
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the user context.
 * @returns {React.ReactElement} The Provider component with user data and actions passed down.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const updateUserFields = async (name, phone, city, newProfilePicture) => {
    setLoading(true)
    const token = await AsyncStorage.getItem('userToken')
    const formData = new FormData()
    formData.append('name', name)
    if (newProfilePicture) {
      formData.append('profilePicture', {
        uri: newProfilePicture.uri,
        type: newProfilePicture.type,
        name: newProfilePicture.name,
      })
    }
    formData.append('phone', phone)
    formData.append('city', city)

    try {
      const response = await api.put(`/api/users/${user._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      })
      const updatedUser = response.data
      setUser(updatedUser)
      setLoading(false)
    } catch (error) {
      console.log('something went wrong updating the user')
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
    <UserContext.Provider value={{ user, isSignedIn, loading, updateUser, updateUserPendingRequests, updateUserFields }}>
      {children}
    </UserContext.Provider>
  )
}