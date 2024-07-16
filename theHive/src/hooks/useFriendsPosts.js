import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'


/**
 * Custom hook for fetching and managing a user's friends' posts.
 * It fetches the posts of a user's friends from an API, sorts them by creation date, and handles loading and error states.
 *
 * @param {string} userId - The ID of the user whose friends' posts are to be fetched.
 * @returns {object} An object containing:
 *                  - loading: A boolean indicating if the posts are currently being fetched.
 *                  - friendPosts: An array of posts fetched from the user's friends.
 *                  - error: A string describing the error if one occurred during fetching.
 *
 * @example
 * const { loading, friendPosts, error } = useFriendsPosts(userId);
 */
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