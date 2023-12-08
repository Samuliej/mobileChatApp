// In useGetCurrentUser.js
import { useState, useEffect } from 'react'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
      setUser(response.data)
      setLoading(false)
    } catch (e) {
      setError(e)
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