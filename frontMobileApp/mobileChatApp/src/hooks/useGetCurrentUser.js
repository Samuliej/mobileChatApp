import { useState, useEffect } from 'react'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * `useGetCurrentUser` is a custom hook that manages the state of the current user.
 * It provides the following state variables and functions:
 *
 * - `user`: The current user object. It's `null` by default and gets updated with the user data fetched from the server.
 * - `loading`: A boolean that indicates whether the user data is currently being fetched from the server.
 * - `error`: Any error that occurred while fetching the user data.
 * - `fetchUser`: A function that fetches the user data from the server. It takes a token as a parameter, sends a GET request to '/api/me' with the token in the Authorization header, and updates the `user` state with the response data.
 * - `setUser`: A function that updates the `user` state. It's provided by the `useState` hook.
 *
 * The `useEffect` hook calls `fetchUser` when the component mounts, but only if there's a token in `AsyncStorage`.
 */
const useGetCurrentUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUser = async (token) => {
    setLoading(true)
    try {
      const response = await api.get('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('user')
      console.log(response.data)
      setUser(response.data)
      setLoading(false)
      return user
    } catch (e) {
      setError(e)
      setUser(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('userToken')
      if (token) {
        await fetchUser(token)
      }
    }

    fetchTokenAndUser()
  }, [])

  return { user, loading, error, fetchUser, setUser }
}

export default useGetCurrentUser