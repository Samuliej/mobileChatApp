import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'


/**
 * Custom hook for fetching and managing a user's posts.
 * It handles loading state, error state, and provides a function to refresh the posts.
 *
 * @param {string} userId - The ID of the user whose posts are to be fetched.
 * @returns {object} An object containing:
 *                  - loading: A boolean indicating if the posts are currently being fetched.
 *                  - userPosts: An array of posts belonging to the specified user.
 *                  - error: A string describing the error if one occurred during fetching.
 *                  - refreshUserPosts: A function to re-fetch the user's posts.
 *
 * @example
 * const { loading, userPosts, error, refreshUserPosts } = useUserPosts('userId');
 */
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