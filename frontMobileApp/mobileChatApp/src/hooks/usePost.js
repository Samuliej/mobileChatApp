import { useState, useEffect } from 'react'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const usePost = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createPost = async (content, image, author) => {
    setLoading(true)
    setError(null)

    console.log('author', author.user)

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

  const commentPost = async (postId, user, author) => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')
    try {
      const res = await api.post(`/api/posts/${postId}/comments`, {user, author}, {
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