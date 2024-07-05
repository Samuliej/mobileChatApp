import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

const useUserPosts = (userId) => {
  const [loading, setLoading] = useState(true)
  const [userPosts, setUserPosts] = useState([])
  const [error, setError] = useState(null)

  const fetchUserPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const userToken = await AsyncStorage.getItem('userToken')
      const config = {
        headers: { Authorization: `Bearer ${userToken}` }
      }

      const response = await api.get(`/api/posts/user/${userId}`, config)
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setUserPosts(sortedPosts)
      setLoading(false)
    } catch (error) {
      setError('Error fetching user posts')
      setLoading(false)
    }
  }

  const refreshUserPosts = () => {
    fetchUserPosts()
  }

  useEffect(() => {
    fetchUserPosts()
  }, [userId])

  return { loading, userPosts, error, refreshUserPosts }
}

export default useUserPosts