import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

/**
 * Custom hook for fetching and managing posts for a user.
 * It fetches both the user's own posts and their friends' posts, sorts them by creation date, and handles loading and error states.
 *
 * @param {string} userId - The ID of the user whose posts are to be fetched.
 * @returns {object} An object containing:
 *                  - loading: A boolean indicating if the posts are currently being fetched.
 *                  - posts: An array of posts fetched for the user and their friends.
 *                  - error: An error message if an error occurred during fetching.
 *                  - refreshPosts: A function to manually refresh the posts.
 *
 * @example
 * const { loading, posts, error, refreshPosts } = usePosts(userId);
 */
const usePosts = (userId) => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    refreshPosts()
  }, [])

  // Function to refresh the posts
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
      const combinedPosts = [...friendsResponse.data, ...userResponse.data]
      const sortedPosts = combinedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setPosts(sortedPosts)
      setLoading(false)
    } catch (e) {
      setError('Error fetching posts')
      setLoading(false)
    }
  }

  // Feetch the posts in a useEffect hook
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

        const combinedPosts = [...friendsResponse.data, ...userResponse.data]
        const sortedPosts = combinedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setPosts(sortedPosts)
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