import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

const useFriendsPosts = (userId) => {
  const [loading, setLoading] = useState(true)
  const [friendPosts, setFriendPosts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFriendsPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        const userToken = await AsyncStorage.getItem('userToken')
        const config = {
          headers: { Authorization: `Bearer ${userToken}` }
        }

        const response = await api.get(`/api/posts/user/${userId}`, config)
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setFriendPosts(sortedPosts)
        setLoading(false)
      } catch (error) {
        setError('Error fetching friends posts')
      }
    }

    fetchFriendsPosts()
  }, [userId])

  return { loading, friendPosts, error }
}

export default useFriendsPosts