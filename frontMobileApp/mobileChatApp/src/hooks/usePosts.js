import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

const usePosts = (userId) => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)

  console.log('userId', userId)

  useEffect(() => {
    refreshPosts()
  }, [])

  const refreshPosts = async () => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    }

    try {
      const [friendsResponse, userResponse] = await Promise.all([
        api.get(`/api/posts/friends/${userId}`, config),
        api.get(`/api/posts/user/${userId}`, config)
      ])

      setPosts([...friendsResponse.data, ...userResponse.data])
      setLoading(false)
    } catch (e) {
      setError('Error fetching posts')
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('fetchPosts')
      setLoading(true)
      try {
        const token = await AsyncStorage.getItem('userToken')
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }

        // Fetch users own and friends' posts
        const [friendsResponse, userResponse] = await Promise.all([
          api.get(`/api/posts/friends/${userId}`, config),
          api.get(`/api/posts/user/${userId}`, config)
        ])

        console.log('friendsResponse', friendsResponse)
        console.log('userResponse', userResponse)
        setPosts([...friendsResponse.data, ...userResponse.data])
      } catch (error) {
        setError(error)
        console.log('error', error)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [userId])

  return { loading, posts, error, refreshPosts }
}

export default usePosts