import { useState } from 'react'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'


/**
 * Custom hook for creating, commenting on, and liking posts.
 * It manages the loading state and error handling for each operation.
 *
 * @returns {object} An object containing:
 *                  - loading: A boolean indicating if an operation is in progress.
 *                  - error: An error message if an error occurred during the last operation.
 *                  - createPost: A function to create a new post with given content, image, and author.
 *                  - commentPost: A function to comment on a post with given post ID and content.
 *                  - likePost: A function to like a post with a given post ID.
 *
 * @example
 * const { loading, error, createPost, commentPost, likePost } = usePost();
 * createPost('Hello World', imageObject, authorObject);
 */
const usePost = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function that creates the post to upload
  const createPost = async (content, image, author) => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')

    const formData = new FormData()
    formData.append('content', content)
    formData.append('author', author.user._id)

    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      })
    }

    try {
      const res = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`
        }
      })
      setLoading(false)
      return res.data
    } catch (e) {
      setError('Error creating post')
      setLoading(false)
      return null
    }
  }

  // Function for commenting on a post
  const commentPost = async (postId, content) => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')
    try {
      const res = await api.post(`/api/posts/${postId}/comments`, {postId, content}, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      setLoading(false)
      return res.data
    } catch (e) {
      setError('Error commenting post')
      setLoading(false)
      return null
    }
  }


  // Function for liking a post
  const likePost = async (postId) => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')

    try {
      const res = await api.put(`api/likePost/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      setLoading(false)
      return res.data
    } catch (e) {
      setError('Error liking post')
      setLoading(false)
      return null
    }
  }

  return {
    loading,
    error,
    createPost,
    commentPost,
    likePost,
  }
}

export default usePost